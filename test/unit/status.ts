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
import {rpcCodeFromHttpStatusCode} from '../../src/status';

describe('status.ts', () => {
  it('rpcCodeFromHttpStatusCode', () => {
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(200), 0);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(206), 0);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(300), 2);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(307), 2);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(400), 3);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(401), 16);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(403), 7);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(404), 5);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(409), 10);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(416), 11);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(429), 8);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(499), 1);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(451), 9);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(411), 9);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(501), 12);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(503), 14);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(504), 4);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(505), 13);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(510), 13);
    assert.deepStrictEqual(rpcCodeFromHttpStatusCode(100), 2);
  });
});
