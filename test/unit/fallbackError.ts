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
import {FallbackErrorDecoder} from '../../src/fallbackError';

describe('gRPC-fallback error decoding', () => {
  it('decodes error', () => {
    // example of an actual google.rpc.Status error message returned by Language API
    const fixtureName = path.resolve(__dirname, '..', 'fixtures', 'error.bin');
    const errorBin = fs.readFileSync(fixtureName);
    const expectedError = {
      code: 3,
      message: 'One of content, or gcs_content_uri must be set.',
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
    };
    const decoder = new FallbackErrorDecoder();
    const decodedError = decoder.decodeRpcStatus(errorBin);

    // nested error messages have different types so we can't use deepStrictEqual here
    assert.strictEqual(
      JSON.stringify(decodedError),
      JSON.stringify(expectedError)
    );
  });
});
