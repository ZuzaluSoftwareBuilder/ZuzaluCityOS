export function shortenAddress(address: string, chars = 4): string {
  try {
    // const parsed = getAddress(address)
    return `${address.substring(0, chars + 2)}...${address.slice(-chars)}`;
  } catch (error) {
    throw Error(`Invalid 'address' parameter '${address}'.`);
  }
}

export function convertDateToEpoch(dateString: any) {
  const date = new Date(dateString);
  const epoch = date.getTime();
  const epochInSeconds = Math.floor(epoch / 1000);

  return epochInSeconds;
}

export function covertNameToUrlName(name: string) {
  return name.toLowerCase().replace(/ /g, '-');
}

export function formatUserName(name?: string) {
  if (!name) return '';
  if (name.length > 20) {
    return `${name.slice(0, 6)}...${name.slice(-6)}`;
  }
  return name;
}

export function capitalizeFirstLetter(str: string): string {
  if (!str) return str;
  return str.charAt(0).toLocaleUpperCase() + str.slice(1).toLocaleLowerCase();
}

export const getEllipsedAddress = (
  str: `0x${string}` | undefined,
  n: number = 6,
): string => {
  if (str) {
    return `${str.slice(0, n)}...${str.slice(str.length - (n - 2))}`;
  }
  return 'Undefined Address';
};

const bytes32Regex = /^0x[0-9a-fA-F]{64}$/;
export function isBytes32(value: string): boolean {
  return bytes32Regex.test(value);
}
