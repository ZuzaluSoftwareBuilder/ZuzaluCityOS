//import type { CeramicApi } from "@ceramicnetwork/common";
import type { ComposeClient } from '@composedb/client';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';
import { DID } from 'dids';
import { DIDSession } from 'did-session';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import { CeramicClient } from '@ceramicnetwork/http-client';
import { getAccount } from '@wagmi/core';
import { config } from '@/context/WalletContext';

const DID_SEED_KEY = 'ceramic:did_seed';

/**
 * Checks localStorage for a stored DID Session. If one is found we authenticate it, otherwise we create a new one.
 * @returns Promise<DID-Session> - The User's authenticated sesion.
 */
export const authenticateCeramic = async (
  ceramic: CeramicClient,
  compose: ComposeClient,
) => {
  try {
    await authenticateEthPKH(ceramic, compose);
    localStorage.setItem('logged_in', 'true');
  } catch (error) {
    console.error('Ceramic authentication failed:', error);
    localStorage.removeItem('ceramic:eth_did');
    localStorage.removeItem('display did');
    localStorage.removeItem('logged_in');
    throw error;
  }
};

const authenticateKeyDID = async (
  ceramic: CeramicClient,
  compose: ComposeClient,
) => {
  let seed_array: Uint8Array;
  if (localStorage.getItem(DID_SEED_KEY) === null) {
    // for production you will want a better place than localStorage for your sessions.
    let seed = crypto.getRandomValues(new Uint8Array(32));
    let seed_json = JSON.stringify(seed, (key, value) => {
      if (value instanceof Uint8Array) {
        return Array.from(value);
      }
      return value;
    });
    localStorage.setItem(DID_SEED_KEY, seed_json);
    seed_array = seed;
  } else {
    let seed_json_value = localStorage.getItem(DID_SEED_KEY);
    let seed_object = JSON.parse(seed_json_value as string);
    seed_array = new Uint8Array(seed_object);
  }
  const provider = new Ed25519Provider(seed_array);
  const did = new DID({ provider, resolver: getResolver() });
  await did.authenticate();
  ceramic.did = did;
  compose.setDID(did);
  return;
};

const authenticateEthPKH = async (
  ceramic: CeramicClient,
  compose: ComposeClient,
) => {
  return new Promise((resolve, reject) => {
    setTimeout(async () => {
      try {
        const sessionStr = localStorage.getItem('ceramic:eth_did');
        let session;
        if (sessionStr) {
          try {
            session = await DIDSession.fromSession(sessionStr);
          } catch (e) {
            console.error('Failed to restore DIDSession from localStorage:', e);
            localStorage.removeItem('ceramic:eth_did');
          }
        }
        if (!session || (session.hasSession && session.isExpired)) {
          const account = getAccount(config);
          if (!account || !account.address) {
            reject(new Error('No wallet account found'));
            return;
          }

          const ethProvider = await account.connector?.getProvider();
          if (!ethProvider) {
            reject(new Error('No injected Ethereum provider found.'));
            return;
          }
          try {
            const accountId = await getAccountId(ethProvider, account.address!);
            const authMethod = await EthereumWebAuth.getAuthMethod(
              ethProvider,
              accountId,
            );
            
            try {
              session = await DIDSession.authorize(authMethod, {
                resources: compose.resources,
              });
              localStorage.setItem('ceramic:eth_did', session.serialize());
            } catch (error) {
              console.error('DIDSession.authorize failed:', error);
              reject(error);
              return;
            }
          } catch (error) {
            console.error('Failed during authentication setup:', error);
            reject(error);
            return;
          }
        }

        if (session && session.did) {
          compose.setDID(session.did);
          ceramic.did = session.did;
          localStorage.setItem('display did', session.did.toString());
          resolve(true);
        } else {
          reject(new Error('Failed to create valid DID session'));
        }
      } catch (error) {
        console.error('Authentication error in ceramicAuth:', error);
        reject(error);
      }
    }, 2000);
  });
};
