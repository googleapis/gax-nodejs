import {hasBrowserCrypto} from '../featureDetection';
import {NodeCrypto} from './node/crypto';
import {BrowserCrypto} from './browser/crypto';

export interface Crypto {
  sha1digestHex(str: string): Promise<string>;
}

export function createCrypto(): Crypto {
  if (hasBrowserCrypto()) {
    return new BrowserCrypto();
  }
  return new NodeCrypto();
}

/**
 * Converts an ArrayBuffer to a hexadecimal string.
 * @param arrayBuffer The ArrayBuffer to convert to hexadecimal string.
 * @return The hexadecimal encoding of the ArrayBuffer.
 */
export function fromArrayBufferToHex(arrayBuffer: ArrayBuffer): string {
  // Convert buffer to byte array.
  const byteArray = Array.from(new Uint8Array(arrayBuffer));
  // Convert bytes to hex string.
  return byteArray
    .map(byte => {
      return byte.toString(16).padStart(2, '0');
    })
    .join('');
}
