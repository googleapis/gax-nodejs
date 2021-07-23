/**
 * Copyright 2020 Google LLC
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
import * as path from 'path';
import {GoogleErrorDecoder} from '../../src/googleError';

describe('gRPC-google error decoding', () => {
  it('decodes error', () => {
    // example of an actual google.rpc.Status error message returned by Language API
    const fixtureName = path.resolve(
      __dirname,
      '..',
      'fixtures',
      'badRequest.bin'
    );
    const errorBin = fs.readFileSync(fixtureName);
    const expectedError = {
      fieldViolations: [
        {
          field: 'document.language',
          description: 'The document language is not valid',
        },
      ],
    };
    const decoder = new GoogleErrorDecoder();

    const decodedError = decoder.decodeRpcStatusDetails([errorBin])[0];

    // nested error messages have different types so we can't use deepStrictEqual here
    assert.strictEqual(
      JSON.stringify(decodedError),
      JSON.stringify(expectedError)
    );
  });

  it('decodes multiple errors', () => {
    // example of when there are multiple errors available to be decoded
    const pathArr: string[] = [
      'badRequest.bin',
      'quotaFailure.bin',
      'preconditionFailure.bin',
      'resourceInfo.bin',
    ];
    let decodedErrorArr = [];
    const badRequest = {
      fieldViolations: [
        {
          field: 'document.language',
          description: 'The document language is not valid',
        },
      ],
    };
    const quotaFailure = {
      violations: [
        {
          subject: 'test',
          description: 'test',
        },
      ],
    };
    const preconditionFailure = {
      violations: [
        {
          type: 'test',
          subject: 'test',
          description: 'test',
        },
      ],
    };
    const resourceInfo = {
      resourceType: 'test',
      resourceName: 'test',
      owner: 'test',
      description: 'test',
    };
    const decoder = new GoogleErrorDecoder();

    for (let i = 0; i < pathArr.length; i++) {
      const fixtureName = path.resolve(__dirname, '..', 'fixtures', pathArr[i]);
      decodedErrorArr.push(fs.readFileSync(fixtureName));
    }
    decodedErrorArr = decoder.decodeRpcStatusDetails(decodedErrorArr);

    // nested error messages have different types so we can't use deepStrictEqual here
    assert.strictEqual(
      JSON.stringify(decodedErrorArr),
      JSON.stringify([
        badRequest,
        quotaFailure,
        preconditionFailure,
        resourceInfo,
      ])
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
