import { getWalletClient } from '@wagmi/core';
import { Address, encodeFunctionData, type TransactionReceipt } from 'viem';
import { sendTransaction } from 'viem/actions';
import { client, config } from '@/context/WalletContext';
import { RESOLVER_CONTRACT_SCROLL_TRUSTFUL } from '@/app/spaces/[spaceid]/trustful/constants/constants';

export async function createSessionSC({
  from,
  sessionTitle,
  duration,
  msgValue,
}: {
  from: Address;
  sessionTitle: string;
  duration: bigint;
  msgValue: bigint;
}): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(config);
  let gasLimit;

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: 'uint256', name: 'duration', type: 'uint256' },
          { internalType: 'string', name: 'sessionTitle', type: 'string' },
        ],
        name: 'createSession',
        outputs: [
          { internalType: 'bytes32', name: 'sessionId', type: 'bytes32' },
        ],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    args: [duration, sessionTitle],
  });

  try {
    gasLimit = client.estimateGas({
      account: from as Address,
      to: RESOLVER_CONTRACT_SCROLL_TRUSTFUL as Address,
      data: data,
      value: msgValue,
    });
  } catch (error) {
    return Error('Error estimating gas.');
  }

  try {
    const transactionHash = await sendTransaction(walletClient, {
      account: from as Address,
      to: RESOLVER_CONTRACT_SCROLL_TRUSTFUL as Address,
      gasLimit: gasLimit,
      data: data,
      value: msgValue,
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
