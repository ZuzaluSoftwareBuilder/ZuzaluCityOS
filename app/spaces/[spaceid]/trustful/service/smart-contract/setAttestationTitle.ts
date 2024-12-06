import { getWalletClient } from '@wagmi/core';
import { Address, encodeFunctionData, type TransactionReceipt } from 'viem';
import { sendTransaction } from 'viem/actions';

import { client, config } from '@/context/WalletContext';
import { RESOLVER_CONTRACT_SCROLL_TRUSTFUL } from '@/app/spaces/[spaceid]/trustful/constants/constants';

export async function setAttestationTitle({
  from,
  title,
  isValid,
  value,
}: {
  from: Address;
  title: string;
  isValid: boolean;
  value: bigint;
}): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(config);
  let gasLimit;

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: 'string', name: 'title', type: 'string' },
          { internalType: 'bool', name: 'isValid', type: 'bool' },
        ],
        name: 'setAttestationTitle',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    args: [title, isValid],
  });

  try {
    gasLimit = client.estimateGas({
      account: from as Address,
      to: RESOLVER_CONTRACT_SCROLL_TRUSTFUL as Address,
      data: data,
      value: value,
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
      value: value,
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
