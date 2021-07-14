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
    const fixtureName = path.resolve(__dirname, '..', 'fixtures','badRequest.bin');
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
        console.log(decodedError);
    // nested error messages have different types so we can't use deepStrictEqual here
    assert.strictEqual(
      JSON.stringify(decodedError),
      JSON.stringify(expectedError)
    );
  });

  /*it('decodes error and status code', () => {
    // example of an actual google.rpc.Status error message returned by Language API
    const fixtureName = path.resolve(__dirname, '..', 'fixtures', 'error.bin');
    const errorBin = fs.readFileSync(fixtureName);
    const expectedError = Object.assign(
      new Error(
        '3 INVALID_ARGUMENT: One of content, or gcs_content_uri must be set.'
      ),
      {
        code: 3,
        details: [
          {
            fieldViolations: [
              {
                field: 'document.content',
                description: 'Must have some text content to annotate.',
              },
            ],
          },
        ],
      }
    );
    const decoder = new FallbackErrorDecoder();
    const decodedError = decoder.decodeErrorFromBuffer(errorBin);
    assert(decodedError instanceof Error);
    // nested error messages have different types so we can't use deepStrictEqual here
    assert.strictEqual(
      JSON.stringify(decodedError),
      JSON.stringify(expectedError)
    );
  });*/
});
