import {
  createSiweMessageWithRecaps,
  LitAbility,
  LitAccessControlConditionResource,
} from '@lit-protocol/auth-helpers';
import * as LitJsSdk from '@lit-protocol/lit-node-client';
import akashaSdk from '../akasha/akasha';
import { AccessControlCondition } from './types';

export class ZulandLit {
  private litNodeClient: LitJsSdk.LitNodeClient;
  chain: string;
  private sessionsSigs: any;

  constructor(chain?: string) {
    this.chain = chain ?? 'sepolia';
    this.litNodeClient = new LitJsSdk.LitNodeClient({
      litNetwork: 'datil-dev',
      debug: process.env.NEXT_PUBLIC_ENV !== 'production',
    });
  }

  async connect() {
    await this.litNodeClient.connect();
    await this.generateAkashaSessionSignature();
  }

  async disconnect() {
    await this.litNodeClient.disconnect();
  }

  async encryptString(
    text: string,
    accessControlConditions: AccessControlCondition[],
  ) {
    if (!this.litNodeClient) {
      throw new Error('No LitNodeClient found. Please connect first');
    }

    const { ciphertext, dataToEncryptHash } = await LitJsSdk.encryptString(
      {
        accessControlConditions: accessControlConditions,
        dataToEncrypt: text,
      },
      this.litNodeClient,
    );
    return { ciphertext, dataToEncryptHash };
  }

  async decryptString(
    ciphertext: string,
    dataToEncryptHash: string,
    accessControlConditions: AccessControlCondition[],
  ) {
    if (!this.litNodeClient) {
      throw new Error('No LitNodeClient found. Please connect first');
    }
    const sessionSignatures = this.sessionsSigs;
    if (!sessionSignatures) {
      throw new Error('No session signatures found. Please connect first');
    }

    const decryptedText = await LitJsSdk.decryptToString(
      {
        ciphertext,
        dataToEncryptHash,
        chain: this.chain,
        accessControlConditions: accessControlConditions,
        sessionSigs: sessionSignatures,
        // authSig: authSig, // use this instead of sessionSigs if you have an authSig
      },
      this.litNodeClient,
    );

    return decryptedText;
  }

  async executeLitActionCode(litActionCode: string, jsParams: any) {
    await this.litNodeClient.connect();
    // const sessionSignatures = await generateSessionSignature();
    const sessionSignatures = await this.generateAkashaSessionSignature();
    const response = await this.litNodeClient.executeJs({
      sessionSigs: sessionSignatures,
      code: litActionCode,
      jsParams: jsParams,
    });
    return response;
  }

  async generateAkashaSessionSignature() {
    const { getLatestBlockhash } = this.litNodeClient;
    if (!this.sessionsSigs) {
      // Create a session key and sign it using the authNeededCallback defined above
      this.sessionsSigs = await this.litNodeClient.getSessionSigs({
        expiration: new Date(Date.now() + 1000 * 60 * 60 * 24).toISOString(),
        chain: this.chain,
        resourceAbilityRequests: [
          // {
          //   resource: new LitActionResource('*'),
          //   ability: LitAbility.LitActionExecution,
          // },
          {
            resource: new LitAccessControlConditionResource(`*`),
            ability: LitAbility.AccessControlConditionDecryption,
          },
        ],
        authNeededCallback: async ({
          uri,
          expiration,
          resourceAbilityRequests,
        }) => {
          const userAddress = akashaSdk.services.common.web3.state.address;
          if (!userAddress) {
            throw new Error('No wallet connected');
          }
          if (!uri) {
            throw new Error('No uri provided');
          }
          if (!expiration) {
            throw new Error('No expiration provided');
          }
          if (!resourceAbilityRequests) {
            throw new Error('No resourceAbilityRequests provided');
          }
          // Prepare the SIWE message for signing
          const toSign = await createSiweMessageWithRecaps({
            uri: uri,
            expiration: expiration,
            resources: resourceAbilityRequests,
            walletAddress: userAddress,
            nonce: await getLatestBlockhash(),
            litNodeClient: this.litNodeClient,
          });
          const signature =
            await akashaSdk.services.common.web3.signMessage(toSign);

          // Create an AuthSig using the derived signature, the message, and wallet address
          return {
            sig: signature,
            derivedVia: 'web3.eth.personal.sign',
            signedMessage: toSign,
            address: userAddress,
          };
        },
      });
    }

    return this.sessionsSigs;
  }
}
