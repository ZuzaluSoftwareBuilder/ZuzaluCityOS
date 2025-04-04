import getSDK from '@akashaorg/core-sdk';

declare global {
  interface Window {
    nodeCrypto: any;
  }
}

let akashaSdk: ReturnType<typeof getSDK> | null = null;

export function standardDateFormat(date: string, time: boolean = true) {
  return time
    ? new Date(date).toLocaleString()
    : new Date(date).toLocaleDateString();
}

export async function getAkashaSDK() {
  if (typeof window === 'undefined') {
    console.warn('Attempted to use AKASHA SDK in server environment');
    return null;
  }

  if (akashaSdk) return akashaSdk;

  try {
    window.global = window;
    window.process = window.process || { env: {} };
    if (!window.nodeCrypto) {
      window.nodeCrypto = require('crypto-browserify');
    }

    const { default: getSDK } = await import('@akashaorg/core-sdk');
    akashaSdk = getSDK();
    return akashaSdk;
  } catch (error) {
    console.error('Failed to initialize AKASHA SDK:', error);
    return null;
  }
}

// 创建变量存储对象
const akashaSDKProxy = {
  get api() {
    console.warn('use getAkashaSDK().api instead');
    return akashaSdk?.api || {};
  },
  get services() {
    console.warn('use getAkashaSDK().services instead');
    return akashaSdk?.services || {};
  },
};

// 导出变量
export default akashaSDKProxy;
