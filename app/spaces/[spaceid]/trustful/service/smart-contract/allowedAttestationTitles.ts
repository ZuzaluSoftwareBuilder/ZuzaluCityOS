import { client } from '@/context/WalletContext';
import { RESOLVER_CONTRACT_SCROLL_TRUSTFUL } from '../../constants/constants';

export interface ConnetedWalletConfiguration {
  walletClient: any;
  chain: number;
}

export async function allowedAttestationTitles(
  attestationTitle: string,
): Promise<boolean | Error> {
  const data = {
    abi: [
      {
        inputs: [{ internalType: 'string', name: 'title', type: 'string' }],
        name: 'allowedAttestationTitles',
        outputs: [{ internalType: 'bool', name: '', type: 'bool' }],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    args: [attestationTitle],
  };

  try {
    const response = await client.readContract({
      address: RESOLVER_CONTRACT_SCROLL_TRUSTFUL as `0x${string}`,
      functionName: 'allowedAttestationTitles',
      abi: data.abi,
      args: [attestationTitle],
    });

    if (response === typeof Boolean) return Error('Response should be boolean');

    return response as boolean;
  } catch (error) {
    return Error('Error when reading the contract');
  }
}
