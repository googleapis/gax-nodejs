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
import {
  toCamelCase as snakeToCamelCase,
  camelToSnakeCase,
} from '../../src/util';

describe('util.ts', () => {
  it('camelToSnakeCase', () => {
    assert.strictEqual(camelToSnakeCase('test'), 'test');
    assert.strictEqual(camelToSnakeCase('test123'), 'test123');
    assert.strictEqual(camelToSnakeCase('testAbc'), 'test_abc');
    assert.strictEqual(camelToSnakeCase('testAbcDef'), 'test_abc_def');
    assert.strictEqual(camelToSnakeCase('IPProtocol'), 'I_p_protocol');
    assert.strictEqual(camelToSnakeCase('iPProtocol'), 'i_p_protocol');
    assert.strictEqual(camelToSnakeCase('a.1'), 'a.1');
    assert.strictEqual(camelToSnakeCase('abc.1Foo'), 'abc.1_foo');
    assert.strictEqual(camelToSnakeCase('abc.foo'), 'abc.foo');
    assert.strictEqual(camelToSnakeCase('a.1B'), 'a.1_b');
    assert.strictEqual(
      camelToSnakeCase('somethingABCDEValue`'),
      'something_a_b_c_d_e_value'
    );
  });

  it('snakeToCamelCase', () => {
    assert.strictEqual(snakeToCamelCase('test'), 'test');
    assert.strictEqual(snakeToCamelCase('test123'), 'test123');
    assert.strictEqual(snakeToCamelCase('test_abc'), 'testAbc');
    assert.strictEqual(snakeToCamelCase('test_abc_def'), 'testAbcDef');
    assert.strictEqual(snakeToCamelCase('I_p_protocol'), 'IPProtocol');
    assert.strictEqual(snakeToCamelCase('a.1'), 'a.1');
    assert.strictEqual(snakeToCamelCase('abc.1_foo'), 'abc.1Foo');
    assert.strictEqual(snakeToCamelCase('abc.foo'), 'abc.foo');
    assert.strictEqual(snakeToCamelCase('a.1_b'), 'a.1B');
    assert.strictEqual(
      snakeToCamelCase('something_abcde_value'),
      'somethingAbcdeValue'
    );
  });
});
