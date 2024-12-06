import { AkashaBeam } from '@akashaorg/typings/lib/sdk/graphql-types-new';
import { SlateDescendant } from '@akashaorg/typings/lib/ui';

/**
 * Utility to encode slate content to base64
 */
export const encodeSlateToBase64 = (slateContent: SlateDescendant[]) => {
  const stringified = JSON.stringify(slateContent);
  const binary = toBinary(stringified);
  const encoded = window.btoa(binary);
  return encoded;
};

function toBinary(data: string) {
  const codeUnits = new Uint16Array(data.length);
  for (let i = 0; i < codeUnits.length; i++) {
    codeUnits[i] = data.charCodeAt(i);
  }
  return String.fromCharCode(...new Uint8Array(codeUnits.buffer));
}

function fromBinary(binary: string) {
  let result = binary;

  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  result = String.fromCharCode(...new Uint16Array(bytes.buffer));

  return result;
}

/**
 * Utility to decode base64 slate content
 */
export const decodeb64SlateContent = (base64Content: string) => {
  try {
    const stringContent = window.atob(base64Content);
    const stringified = fromBinary(stringContent);
    const result = JSON.parse(stringified);
    return result;
  } catch (err) {
    if (err instanceof Error) {
      console.error(`Error parsing content: ${err.message}`);
    } else {
      console.error(`Error parsing content: ${err}`);
    }
  }
};

export const extractOnlyBeams = (data: any): AkashaBeam[] | null => {
  if (!data || !Array.isArray(data.edges)) {
    return []; // Return empty array if edges are not defined or not an array
  }

  if (data.akashaBeamList) {
    return data.akashaBeamList.edges.map(
      (edge: any) => edge.node,
    ) as AkashaBeam[];
  }

  return null;
};
