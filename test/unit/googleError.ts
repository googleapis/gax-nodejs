/**
 * Copyright 2021 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import * as assert from 'assert';
import {describe, it} from 'mocha';
import * as fs from 'fs';
import * as util from 'util';
import * as protobuf from 'protobufjs';
import * as path from 'path';
import {GoogleErrorDecoder} from '../../src/googleError';

interface MyObj {
  type: string;
  value: protobuf.Message<{}>;
}

describe('gRPC-google error decoding', () => {
  it('decodes multiple errors', async () => {
    // example of when there are multiple errors available to be decoded
    const bufferArr = [] as Buffer[];
    let decodedErrorArr = [] as protobuf.Message<{}>[];
    const expectedErrorArr = [] as protobuf.Message<{}>[];
    const decoder = new GoogleErrorDecoder();
    const readFile = util.promisify(fs.readFile);

    const fixtureName = path.resolve(
      __dirname,
      '..',
      'fixtures',
      'multipleErrors.json'
    );
    const protos_path = path.resolve(
      __dirname,
      '..',
      '..',
      'protos',
      'google',
      'rpc'
    );

    const data = await readFile(fixtureName, 'utf8');
    const root = protobuf.loadSync([
      path.join(protos_path, 'error_details.proto'),
      path.join(protos_path, 'status.proto'),
    ]);
    const objs = JSON.parse(data) as MyObj[];
    for (const obj of objs) {
      const MessageType = root.lookupType(obj.type);
      expectedErrorArr.push(obj.value);
      const buffer = MessageType.encode(obj.value).finish() as Buffer;
      const any = {
        type_url: 'type.googleapis.com/' + obj.type,
        value: buffer,
      };
      const status = {code: 3, message: 'test', details: [any]};
      const Status = root.lookupType('google.rpc.Status');
      const status_buffer = Status.encode(status).finish() as Buffer;
      bufferArr.push(status_buffer);
    }
    decodedErrorArr = decoder.decodeRpcStatusDetails(bufferArr);
    assert.strictEqual(
      JSON.stringify(expectedErrorArr),
      JSON.stringify(decodedErrorArr)
    );
  });

  it('does not decode when no error exists', () => {
    // example of when there's no grpc-error available to be decoded
    const emptyArr: Buffer[] = [];
    const decoder = new GoogleErrorDecoder();

    const decodedError = decoder.decodeRpcStatusDetails(emptyArr);

    // nested error messages have different types so we can't use deepStrictEqual here
    assert.strictEqual(JSON.stringify(decodedError), JSON.stringify([]));
  });

  it('does not decode when unknown type is encoded in type_url', () => {
    // example of when error details' type_url doesn't match "type.googleapis.com"
    const decoder = new GoogleErrorDecoder();
    const any = {type_url: 'noMatch', value: new Uint8Array()};

    try {
      decoder.decodeProtobufAny(any);
    } catch (err) {
      assert.strictEqual(
        0,
        err
          .toString()
          .indexOf('Error: Unknown type encoded in google.protobuf.any:')
      );
    }
  });

  it('does not decode when error type does not exist under "type.googleapis.com" ', () => {
    // example of when error details' type_url = "type.googleapis.com/{errType}" and errType is invalid
    const decoder = new GoogleErrorDecoder();
    const any = {
      type_url: 'type.googleapis.com/noMatch',
      value: new Uint8Array(),
    };

    try {
      decoder.decodeProtobufAny(any);
    } catch (err) {
      assert.strictEqual(0, err.toString().indexOf('Error: no such type'));
    }
  });
});
