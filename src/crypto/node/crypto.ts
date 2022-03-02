import * as crypto from 'crypto';
import {Crypto} from '../crypto';

export class NodeCrypto implements Crypto {
  async sha1digestHex(str: string): Promise<string> {
    return Promise.resolve(
      crypto.createHash('sha256').update(str).digest('hex')
    );
  }
}
