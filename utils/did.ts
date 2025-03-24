export const getWalletAddressFromDid = (did?: string) => {
  if (!did) return '';
  return did.includes(':') ? did.split(':')[4] : did
}