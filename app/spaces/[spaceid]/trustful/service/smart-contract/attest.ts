import { getWalletClient } from '@wagmi/core';
import { Address, encodeFunctionData, type TransactionReceipt } from 'viem';
import { sendTransaction } from 'viem/actions';

import { client, config } from '@/context/WalletContext';
import { EAS_CONTRACT_SCROLL } from '../../constants/constants';

export interface AttestationRequestData {
  recipient: Address;
  expirationTime: bigint;
  revocable: boolean;
  refUID: Address;
  data: Address;
  value: bigint;
}

export interface AttestationRequest {
  schema: Address;
  data: AttestationRequestData;
}

export async function submitAttest(
  from: Address,
  schemaUID: Address,
  attestationRequestData: AttestationRequestData,
): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(config);
  // let gasLimit;

  const AttestationRequest: AttestationRequest = {
    schema: schemaUID,
    data: attestationRequestData,
  };

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          {
            components: [
              { internalType: 'bytes32', name: 'schema', type: 'bytes32' },
              {
                components: [
                  {
                    internalType: 'address',
                    name: 'recipient',
                    type: 'address',
                  },
                  {
                    internalType: 'uint64',
                    name: 'expirationTime',
                    type: 'uint64',
                  },
                  { internalType: 'bool', name: 'revocable', type: 'bool' },
                  { internalType: 'bytes32', name: 'refUID', type: 'bytes32' },
                  { internalType: 'bytes', name: 'data', type: 'bytes' },
                  { internalType: 'uint256', name: 'value', type: 'uint256' },
                ],
                internalType: 'struct AttestationRequestData',
                name: 'data',
                type: 'tuple',
              },
            ],
            internalType: 'struct AttestationRequest',
            name: 'request',
            type: 'tuple',
          },
        ],
        name: 'attest',
        outputs: [{ internalType: 'bytes32', name: '', type: 'bytes32' }],
        stateMutability: 'payable',
        type: 'function',
      },
    ],
    args: [AttestationRequest],
  });

  // try {
  //   gasLimit = await client.estimateGas({
  //     account: from as Address,
  //     to: EAS_CONTRACT_SCROLL as Address,
  //     data: data,
  //     value: attestationRequestData.value,
  //   });
  // } catch (error) {
  //   return Error('Error estimating gas.');
  // }

  try {
    const transactionHash = await sendTransaction(walletClient, {
      account: from as `0x${string}`,
      to: EAS_CONTRACT_SCROLL as `0x${string}`,
      // gasLimit: gasLimit,
      data: data,
      value: attestationRequestData.value,
      chain: walletClient.chain,
    });

    const transactionReceipt: TransactionReceipt =
      await client.waitForTransactionReceipt({
        hash: transactionHash,
      });

    return transactionReceipt;
  } catch (error) {
    return Error('Error sending transaction.');
  }
}
