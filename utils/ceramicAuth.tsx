//import type { CeramicApi } from "@ceramicnetwork/common";
import {
  StorageKey_CeramicEthDid,
  StorageKey_DisplayDid,
  StorageKey_LoggedIn,
} from '@/constant/StorageKey';
import { config } from '@/context/WalletContext';
import { CeramicClient } from '@ceramicnetwork/http-client';
import type { ComposeClient } from '@composedb/client';
import { EthereumWebAuth, getAccountId } from '@didtools/pkh-ethereum';
import { getAccount } from '@wagmi/core';
import { DIDSession } from 'did-session';
import { DID } from 'dids';
import { Ed25519Provider } from 'key-did-provider-ed25519';
import { getResolver } from 'key-did-resolver';

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
    localStorage.setItem(StorageKey_LoggedIn, 'true');
  } catch (error) {
    console.error('Ceramic authentication failed:', error);
    localStorage.removeItem(StorageKey_CeramicEthDid);
    localStorage.removeItem(StorageKey_DisplayDid);
    localStorage.removeItem(StorageKey_LoggedIn);
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
  try {
    const sessionStr = localStorage.getItem(StorageKey_CeramicEthDid);
    let session;
    if (sessionStr) {
      try {
        session = await DIDSession.fromSession(sessionStr);
      } catch (e) {
        console.error('Failed to restore DIDSession from localStorage:', e);
        localStorage.removeItem(StorageKey_CeramicEthDid);
      }
    }
    if (!session || (session.hasSession && session.isExpired)) {
      const account = getAccount(config as any);
      if (!account || !account.address) {
        throw new Error('No wallet account found');
      }

      const ethProvider = await account.connector?.getProvider();
      if (!ethProvider) {
        throw new Error('No injected Ethereum provider found.');
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
          localStorage.setItem(StorageKey_CeramicEthDid, session.serialize());
        } catch (error) {
          console.error('DIDSession.authorize failed:', error);
          throw error;
        }
      } catch (error) {
        console.error('Failed during authentication setup:', error);
        throw error;
      }
    }

    if (
      session &&
      session.did &&
      !(session.did as any)._parentId.includes('did:pkh:eip155:534351')
    ) {
      compose.setDID(session.did);
      ceramic.did = session.did;
      localStorage.setItem(StorageKey_DisplayDid, session.did.toString());
      return true;
    } else {
      throw new Error('Failed to create valid DID session');
    }
  } catch (error) {
    console.error('Authentication error in ceramicAuth:', error);
    throw error;
  }
};
