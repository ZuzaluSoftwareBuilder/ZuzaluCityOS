import { readContract } from 'viem/actions';

import { client } from '@/context/WalletContext';
import { RESOLVER_CONTRACT_SCROLL_TRUSTFUL } from '../../constants/constants';

// export interface Action {
//   NONE: 0;
//   ASSIGN_MANAGER: 1;
//   ASSIGN_VILLAGER: 2;
//   ATTEST: 3;
//   REPLY: 4;
// }

export async function allowedSchemas(
  uid: `0x${string}`,
  roleId: `0x${string}`,
): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        inputs: [{ internalType: 'bytes32', name: 'uid', type: 'bytes32' }],
        name: 'allowedSchemas',
        outputs: [
          { internalType: 'enum IResolver.Action', name: '', type: 'uint8' },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    args: [uid, roleId],
  };

  try {
    const response = await client.readContract({
      address: RESOLVER_CONTRACT_SCROLL_TRUSTFUL as `0x${string}`,
      functionName: 'allowedSchemas',
      abi: data.abi,
      args: [uid, roleId],
    });

    if (response === typeof Boolean) return Error('Response should be boolean');

    return response as boolean;
  } catch (error) {
    return Error('Error when reading the contract');
  }
}
