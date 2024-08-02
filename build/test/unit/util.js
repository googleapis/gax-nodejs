"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mocha_1 = require("mocha");
const util_1 = require("../../src/util");
(0, mocha_1.describe)('util.ts', () => {
    (0, mocha_1.it)('camelToSnakeCase', () => {
        assert.strictEqual((0, util_1.camelToSnakeCase)('test'), 'test');
        assert.strictEqual((0, util_1.camelToSnakeCase)('test123'), 'test123');
        assert.strictEqual((0, util_1.camelToSnakeCase)('testAbc'), 'test_abc');
        assert.strictEqual((0, util_1.camelToSnakeCase)('testAbcDef'), 'test_abc_def');
        assert.strictEqual((0, util_1.camelToSnakeCase)('IPProtocol'), 'I_p_protocol');
        assert.strictEqual((0, util_1.camelToSnakeCase)('iPProtocol'), 'i_p_protocol');
        assert.strictEqual((0, util_1.camelToSnakeCase)('a.1'), 'a.1');
        assert.strictEqual((0, util_1.camelToSnakeCase)('abc.1Foo'), 'abc.1_foo');
        assert.strictEqual((0, util_1.camelToSnakeCase)('abc.foo'), 'abc.foo');
        assert.strictEqual((0, util_1.camelToSnakeCase)('a.1B'), 'a.1_b');
        assert.strictEqual((0, util_1.camelToSnakeCase)('somethingABCDEValue`'), 'something_a_b_c_d_e_value');
    });
    (0, mocha_1.it)('snakeToCamelCase', () => {
        assert.strictEqual((0, util_1.toCamelCase)('test'), 'test');
        assert.strictEqual((0, util_1.toCamelCase)('test123'), 'test123');
        assert.strictEqual((0, util_1.toCamelCase)('test_abc'), 'testAbc');
        assert.strictEqual((0, util_1.toCamelCase)('test_abc_def'), 'testAbcDef');
        assert.strictEqual((0, util_1.toCamelCase)('I_p_protocol'), 'IPProtocol');
        assert.strictEqual((0, util_1.toCamelCase)('a.1'), 'a.1');
        assert.strictEqual((0, util_1.toCamelCase)('abc.1_foo'), 'abc.1Foo');
        assert.strictEqual((0, util_1.toCamelCase)('abc.foo'), 'abc.foo');
        assert.strictEqual((0, util_1.toCamelCase)('a.1_b'), 'a.1B');
        assert.strictEqual((0, util_1.toCamelCase)('something_abcde_value'), 'somethingAbcdeValue');
    });
    (0, mocha_1.it)('toLowerCamelCase', () => {
        assert.strictEqual((0, util_1.toLowerCamelCase)('test'), 'test');
        assert.strictEqual((0, util_1.toLowerCamelCase)('test123'), 'test123');
        assert.strictEqual((0, util_1.toLowerCamelCase)('test_abc'), 'testAbc');
        assert.strictEqual((0, util_1.toLowerCamelCase)('test_abc_def'), 'testAbcDef');
        assert.strictEqual((0, util_1.toLowerCamelCase)('I_p_protocol'), 'iPProtocol');
        assert.strictEqual((0, util_1.toLowerCamelCase)('a.1'), 'a.1');
        assert.strictEqual((0, util_1.toLowerCamelCase)('abc.1_foo'), 'abc.1Foo');
        assert.strictEqual((0, util_1.toLowerCamelCase)('abc.foo'), 'abc.foo');
        assert.strictEqual((0, util_1.toLowerCamelCase)('a.1_b'), 'a.1B');
        assert.strictEqual((0, util_1.toLowerCamelCase)('something_abcde_value'), 'somethingAbcdeValue');
        assert.strictEqual((0, util_1.toLowerCamelCase)('PascalCaseString'), 'pascalCaseString');
        assert.strictEqual((0, util_1.toLowerCamelCase)('PascalCASEString'), 'pascalCaseString');
    });
});
//# sourceMappingURL=util.js.map