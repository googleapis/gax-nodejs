import {hasBrowserCrypto} from '../../featureDetection';
import {Crypto, fromArrayBufferToHex} from '../crypto';

export class BrowserCrypto implements Crypto {
  constructor() {
    if (!hasBrowserCrypto()) {
      throw new Error(
        "SubtleCrypto not found. Make sure it's an https:// website."
      );
    }
  }

  async sha1digestHex(str: string): Promise<string> {
    // SubtleCrypto digest() method is async, so we must make
    // this method async as well.

    // To calculate SHA256 digest using SubtleCrypto, we first
    // need to convert an input string to an ArrayBuffer:
    // eslint-disable-next-line node/no-unsupported-features/node-builtins
    const inputBuffer = new TextEncoder().encode(str);

    // Result is ArrayBuffer as well.
    const outputBuffer = await window.crypto.subtle.digest(
      'SHA-256',
      inputBuffer
    );
    return fromArrayBufferToHex(outputBuffer);
  }
}
