import { useAccount } from 'wagmi';
import { useMemo } from 'react';

const useDid = () => {
  const { chainId, address, isConnected } = useAccount();

  const did = useMemo(() => {
    if (!isConnected || !address) return '';

    const normalizedAddress = address?.startsWith('0x')
      ? address.toLowerCase()
      : `0x${address}`.toLowerCase();
    const currentChainId = chainId || 1;

    return `did:pkh:eip155:${currentChainId}:${normalizedAddress}`;
  }, [isConnected, address, chainId]);

  return {
    did,
  };
};

export default useDid;
