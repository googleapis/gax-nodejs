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
const routingHeader_1 = require("../../src/routingHeader");
const mocha_1 = require("mocha");
(0, mocha_1.describe)('fromParams', () => {
    (0, mocha_1.it)('constructs the routing header', () => {
        const routingHeader = (0, routingHeader_1.fromParams)({ name: 'foo', 'book.read': true });
        assert.strictEqual(routingHeader, 'name=foo&book.read=true');
    });
    (0, mocha_1.it)('encodes non-ASCII characters', () => {
        const routingHeader = (0, routingHeader_1.fromParams)({ screaming: '😱', cyrillic: 'тест' });
        assert.strictEqual(routingHeader, 'screaming=%F0%9F%98%B1&cyrillic=%D1%82%D0%B5%D1%81%D1%82');
    });
});
//# sourceMappingURL=routingHeader.js.map