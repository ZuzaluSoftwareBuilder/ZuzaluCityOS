import getSDK from '@akashaorg/core-sdk';
import { type Image } from '@akashaorg/typings/lib/ui';

/**
 * @internal
 */
export interface IConfig {
  quality?: number;
  maxWidth: number;
  maxHeight: number;
  autoRotate?: boolean;
  mimeType?: string;
}

/**
 *  Utility to build gateway links to ipfs content
 */
export const getMediaUrl = (hash?: string) => {
  const sdk = getSDK();
  let ipfsLinks:
    | {
        originLink: string;
        fallbackLink: string;
        pathLink: string;
      }
    | undefined;

  let _hash = hash;

  if (typeof hash === 'string' && hash.startsWith('ipfs://')) {
    _hash = hash.substring(7);
  }

  if (typeof hash === 'string' && hash.startsWith('/ipfs/')) {
    _hash = hash.substring(6);
  }

  if (_hash) {
    ipfsLinks = sdk.services.common.ipfs.buildIpfsLinks(_hash);
  }

  return ipfsLinks;
};

interface ISaveMediaFile {
  name: string;
  content: File | Buffer | ArrayBuffer | string;
  isUrl: boolean;
}

/**
 * Utility to save media file
 */
export const saveMediaFile = async ({
  name,
  content,
  isUrl,
}: ISaveMediaFile) => {
  const sdk = getSDK();
  try {
    return await sdk.api.profile.saveMediaFile({
      isUrl,
      content,
      name,
    });
  } catch (ex) {
    console.error('saveMediaFile', ex);
    return null;
  }
};

/**
 * Utility to transform source
 */
export const transformSource = (image?: Image): Image => {
  if (!image || typeof image?.src !== 'string' || image?.src.length === 0)
    return {
      height: 0,
      width: 0,
      src: '',
    };

  const defaultUrl = getMediaUrl(image.src);

  return {
    height: image.height,
    width: image.width,
    src: defaultUrl?.originLink || defaultUrl?.fallbackLink || '',
  };
};
