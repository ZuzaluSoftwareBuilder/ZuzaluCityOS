import getSDK from '@akashaorg/core-sdk';

const akashaSdk = getSDK();

export function standardDateFormat(date: string, time: boolean = true) {
  return time
    ? new Date(date).toLocaleString()
    : new Date(date).toLocaleDateString();
}

export default akashaSdk;
