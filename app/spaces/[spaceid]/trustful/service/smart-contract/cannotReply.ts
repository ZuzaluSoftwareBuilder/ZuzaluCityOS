import { client } from '@/context/WalletContext';
import { RESOLVER_CONTRACT_SCROLL_TRUSTFUL } from '../../constants/constants';

export async function cannotReply(
  uid: `0x${string}`,
): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        inputs: [{ internalType: 'bytes32', name: 'uid', type: 'bytes32' }],
        name: 'cannotReply',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  };

  try {
    const response = await client.readContract({
      address: RESOLVER_CONTRACT_SCROLL_TRUSTFUL as `0x${string}`,
      functionName: 'cannotReply',
      abi: data.abi,
      args: [uid],
    });

    if (typeof response !== "boolean") return Error('Response should be boolean');

    return response as boolean;
  } catch (error) {
    return Error('Error when reading the contract');
  }
}
