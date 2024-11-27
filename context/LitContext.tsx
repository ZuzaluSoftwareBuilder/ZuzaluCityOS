import React, { createContext, useContext, useState } from 'react';
import {
  LitNodeClient,
  encryptString,
  decryptToString,
  disconnectWeb3,
  checkAndSignAuthMessage,
} from '@lit-protocol/lit-node-client';
import { LitNetwork } from '@lit-protocol/constants';
import {
  createSiweMessage,
  generateAuthSig,
  LitAbility,
  LitAccessControlConditionResource,
} from '@lit-protocol/auth-helpers';

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
          litNetwork: isDev ? LitNetwork.DatilDev : LitNetwork.Datil,
          debug: true,
        });
        await litNodeClient.connect();
        setIsConnected(true);
        setClient(litNodeClient);
        return litNodeClient;
      } else {
        console.log('already connected', { client: !!client, isConnected });
        return false;
      }
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
      expiration: new Date(Date.now() + 1000 * 60 * 60).toISOString(),
      resourceAbilityRequests: [
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
        const toSign = await createSiweMessage({
          uri,
          expiration,
          resources: resourceAbilityRequests,
          walletAddress: ethersWallet.address,
          nonce: await client.getLatestBlockhash(),
          litNodeClient: client,
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
  ): Promise<string> => {
    if (!client) throw new Error('not connected to Lit');

    const authSig = await checkAndSignAuthMessage({
      chain: 'ethereum',
      nonce: await client.getLatestBlockhash(),
    });
    const decryptedString = await decryptToString(
      {
        accessControlConditions,
        ciphertext,
        dataToEncryptHash,
        authSig,
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
