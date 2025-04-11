import { addLitUser } from '@/services/lit/addUser';
import {
  createSiweMessageWithRecaps,
  generateAuthSig,
  LitAbility,
  LitAccessControlConditionResource,
  LitActionResource,
  LitPKPResource,
} from '@lit-protocol/auth-helpers';
import { LitNetwork } from '@lit-protocol/constants';
import {
  decryptToString,
  disconnectWeb3,
  encryptString,
  LitNodeClient,
} from '@lit-protocol/lit-node-client';
import React, { createContext, useContext, useState } from 'react';

interface LitContextType {
  client: LitNodeClient | null;
  isConnected: boolean;
  litConnect: () => Promise<LitNodeClient | false>;
  litDisconnect: () => void;
  litEncryptString: (
    text: string,
    accessControlConditions: any,
    client: LitNodeClient,
  ) => Promise<{ ciphertext: string; dataToEncryptHash: string }>;
  litDecryptString: (
    ciphertext: string,
    dataToEncryptHash: string,
    accessControlConditions: any,
    client: LitNodeClient,
    ethersWallet: any,
  ) => Promise<string>;
  getSessionSigs: (
    accessControlConditions: any,
    dataToEncryptHash: string,
    ethersWallet: any,
  ) => Promise<any>;
}

const LitContext = createContext<LitContextType>({
  client: null,
  isConnected: false,
  litConnect: async () => false,
  litDisconnect: () => {},
  litEncryptString: async () => ({ ciphertext: '', dataToEncryptHash: '' }),
  litDecryptString: async () => '  ',
  getSessionSigs: async () => ({}),
});

export const LitProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [client, setClient] = useState<LitNodeClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const litConnect = async () => {
    try {
      const isDev = process.env.NEXT_PUBLIC_ENV === 'dev';
      if (!isConnected) {
        const litNodeClient = new LitNodeClient({
          litNetwork: isDev ? LitNetwork.DatilTest : LitNetwork.Datil,
          debug: false,
        });
        await litNodeClient.connect();

        if (window.ethereum) {
          const accounts = await window.ethereum.request({
            method: 'eth_accounts',
          });
          if (accounts[0]) {
            const response = await addLitUser([accounts[0]]);
            if (response.status === 200) {
              console.log('User added to Lit');
            } else {
              console.error('Error adding user to Lit');
            }
          }
        }

        setIsConnected(true);
        setClient(litNodeClient);
        return litNodeClient;
      }
      return false;
    } catch (error) {
      console.error('Lit error while connecting:', error);
      return false;
    }
  };

  const getSessionSigs = async (
    accessControlConditions: any,
    dataToEncryptHash: string,
    ethersWallet: any,
  ) => {
    if (!client || !isConnected) throw new Error('not connected to Lit');

    return await client.getSessionSigs({
      chain: 'ethereum',
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      resourceAbilityRequests: [
        {
          resource: new LitPKPResource('*'),
          ability: LitAbility.PKPSigning,
        },
        {
          resource: new LitActionResource('*'),
          ability: LitAbility.LitActionExecution,
        },
        {
          resource: new LitAccessControlConditionResource(
            await LitAccessControlConditionResource.generateResourceString(
              accessControlConditions,
              dataToEncryptHash,
            ),
          ),
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        if (!uri || !expiration || !resourceAbilityRequests || !ethersWallet) {
          throw new Error('Missing required parameters for SIWE message');
        }

        const address = await ethersWallet.getAddress();

        const toSign = await createSiweMessageWithRecaps({
          domain: 'localhost',
          uri: uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: address,
          nonce: await client.getLatestBlockhash(),
          litNodeClient: client,
          statement: 'Sign in with Ethereum to use Lit Protocol',
          version: '1',
          chainId: 1,
        });

        return await generateAuthSig({
          signer: ethersWallet,
          toSign,
        });
      },
    });
  };

  const litEncryptString = async (
    text: string,
    accessControlConditions: any,
    client: LitNodeClient,
  ): Promise<{ ciphertext: string; dataToEncryptHash: string }> => {
    if (!client) throw new Error('not connected to Lit');
    const { ciphertext, dataToEncryptHash } = await encryptString(
      {
        accessControlConditions,
        dataToEncrypt: text,
      },
      client,
    );

    return { ciphertext, dataToEncryptHash };
  };

  const litDisconnect = () => {
    if (client && isConnected) {
      disconnectWeb3();
      client.disconnect();
      setIsConnected(false);
    }
  };

  const litDecryptString = async (
    ciphertext: string,
    dataToEncryptHash: string,
    accessControlConditions: any,
    client: LitNodeClient,
    ethersWallet: any,
  ): Promise<string> => {
    if (!client) throw new Error('not connected to Lit');

    const sessionSigs = await client.getSessionSigs({
      chain: 'ethereum',
      expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
      resourceAbilityRequests: [
        {
          resource: new LitPKPResource('*'),
          ability: LitAbility.PKPSigning,
        },
        {
          resource: new LitActionResource('*'),
          ability: LitAbility.LitActionExecution,
        },
        {
          resource: new LitAccessControlConditionResource(
            await LitAccessControlConditionResource.generateResourceString(
              accessControlConditions,
              dataToEncryptHash,
            ),
          ),
          ability: LitAbility.AccessControlConditionDecryption,
        },
      ],
      authNeededCallback: async ({
        uri,
        expiration,
        resourceAbilityRequests,
      }) => {
        if (!uri || !expiration || !resourceAbilityRequests || !ethersWallet) {
          throw new Error('Missing required parameters for SIWE message');
        }

        const address = await ethersWallet.getAddress();

        const toSign = await createSiweMessageWithRecaps({
          uri: uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: address,
          nonce: await client.getLatestBlockhash(),
          litNodeClient: client,
        });

        return await generateAuthSig({
          signer: ethersWallet,
          toSign,
        });
      },
    });

    const decryptedString = await decryptToString(
      {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        sessionSigs,
        chain: 'ethereum',
      },
      client,
    );

    return decryptedString;
  };

  return (
    <LitContext.Provider
      value={{
        client,
        isConnected,
        litConnect,
        litDisconnect,
        litEncryptString,
        litDecryptString,
        getSessionSigs,
      }}
    >
      {children}
    </LitContext.Provider>
  );
};

export const useLitContext = () => useContext(LitContext);
