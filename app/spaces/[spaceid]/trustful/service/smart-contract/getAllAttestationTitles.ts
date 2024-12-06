import { client } from '@/context/WalletContext';
import { RESOLVER_CONTRACT_SCROLL_TRUSTFUL } from '@/app/spaces/[spaceid]/trustful/constants/constants';

export async function getAllAttestationTitles(): Promise<string[] | Error> {
  const data = {
    abi: [
      {
        inputs: [],
        name: 'getAllAttestationTitles',
        outputs: [{ internalType: 'string[]', name: '', type: 'string[]' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
  };

  try {
    const response = await client.readContract({
      address: RESOLVER_CONTRACT_SCROLL_TRUSTFUL as `0x${string}`,
      functionName: 'getAllAttestationTitles',
      abi: data.abi,
      args: [],
    });

    return response as string[];
  } catch (error) {
    return Error('Error when reading the contract');
  }
}
