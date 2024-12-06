import { getWalletClient } from '@wagmi/core';
import { Address, encodeFunctionData, type TransactionReceipt } from 'viem';
import { sendTransaction } from 'viem/actions';

import { client, config } from '@/context/WalletContext';
import { RESOLVER_CONTRACT_SCROLL_TRUSTFUL } from '@/app/spaces/[spaceid]/trustful/constants/constants';

export async function revokeRole({
  from,
  role,
  account,
  msgValue,
}: {
  from: Address;
  role: Address;
  account: Address;
  msgValue: bigint;
}): Promise<TransactionReceipt | Error> {
  const walletClient = await getWalletClient(config);
  let gasLimit;

  const data = encodeFunctionData({
    abi: [
      {
        inputs: [
          { internalType: 'bytes32', name: 'role', type: 'bytes32' },
          { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'revokeRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    args: [role, account],
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
