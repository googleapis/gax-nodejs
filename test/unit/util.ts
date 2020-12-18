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
import {snakeToCamelCase, camelToSnakeCase} from '../../src/util';

describe('util.ts', () => {
  it('camelToSnakeCase', () => {
    assert.strictEqual(camelToSnakeCase('test'), 'test');
    assert.strictEqual(camelToSnakeCase('test123'), 'test123');
    assert.strictEqual(camelToSnakeCase('testAbc'), 'test_abc');
    assert.strictEqual(camelToSnakeCase('testAbcDef'), 'test_abc_def');
  });

  it('snakeToCamelCase', () => {
    assert.strictEqual(snakeToCamelCase('test'), 'test');
    assert.strictEqual(snakeToCamelCase('test123'), 'test123');
    assert.strictEqual(snakeToCamelCase('test_abc'), 'testAbc');
    assert.strictEqual(snakeToCamelCase('test_abc_def'), 'testAbcDef');
  });
});
