import { client } from '@/context/WalletContext';
import { RESOLVER_CONTRACT_SCROLL_TRUSTFUL } from '@/app/spaces/[spaceid]/trustful/constants/constants';
import { Address } from 'viem';

export async function hasRole(
  role: Address,
  account: Address,
): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        inputs: [
          { internalType: 'bytes32', name: 'role', type: 'bytes32' },
          { internalType: 'address', name: 'account', type: 'address' },
        ],
        name: 'hasRole',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  };

  try {
    const response = await client.readContract({
      address: RESOLVER_CONTRACT_SCROLL_TRUSTFUL as `0x${string}`,
      functionName: 'hasRole',
      abi: data.abi,
      args: [role, account],
    });

    return response as boolean;
  } catch (error) {
    return Error('Error when reading the contract');
  }
}
