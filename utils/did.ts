export const getWalletAddressFromDid = (did?: string) => {
  if (!did) return '';
  return did.includes(':') ? did.split(':')[4] : did;
};

export const getDidByAddress = (address: string, chainId: number | string) => {
  if (!address) return '';
  const normalizedAddress = address.startsWith('0x')
    ? address.toLowerCase()
    : `0x${address}`.toLowerCase();
  const currentChainId = Number(chainId) || 1;
  return `did:pkh:eip155:${currentChainId}:${normalizedAddress}`;
};
