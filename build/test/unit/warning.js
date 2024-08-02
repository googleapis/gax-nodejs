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
const sinon = require("sinon");
const mocha_1 = require("mocha");
const warnings_1 = require("../../src/warnings");
(0, mocha_1.describe)('warnings', () => {
    (0, mocha_1.it)('should warn the given code once with the first message', done => {
        const stub = sinon.stub(process, 'emitWarning');
        (0, warnings_1.warn)('code1', 'message1-1');
        (0, warnings_1.warn)('code1', 'message1-2');
        (0, warnings_1.warn)('code1', 'message1-3');
        assert(stub.calledOnceWith('message1-1'));
        stub.restore();
        done();
    });
    (0, mocha_1.it)('should warn each code once', done => {
        const stub = sinon.stub(process, 'emitWarning');
        (0, warnings_1.warn)('codeA', 'messageA-1');
        (0, warnings_1.warn)('codeB', 'messageB-1');
        (0, warnings_1.warn)('codeA', 'messageA-2');
        (0, warnings_1.warn)('codeB', 'messageB-2');
        (0, warnings_1.warn)('codeC', 'messageC-1');
        (0, warnings_1.warn)('codeA', 'messageA-3');
        assert.strictEqual(stub.callCount, 3);
        stub.restore();
        done();
    });
    (0, mocha_1.it)('should include warning type if type is provided', done => {
        const stub = sinon.stub(process, 'emitWarning');
        (0, warnings_1.warn)('codeD', 'messageD-1', 'WarningType1');
        assert(stub.calledWith('messageD-1', {
            type: 'WarningType1',
        }));
        stub.restore();
        done();
    });
});
//# sourceMappingURL=warning.js.map