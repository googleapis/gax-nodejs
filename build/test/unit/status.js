"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mocha_1 = require("mocha");
const status_1 = require("../../src/status");
(0, mocha_1.describe)('status.ts', () => {
    (0, mocha_1.it)('rpcCodeFromHttpStatusCode', () => {
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(200), status_1.Status.OK);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(206), status_1.Status.OK);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(300), status_1.Status.UNKNOWN);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(307), status_1.Status.UNKNOWN);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(400), status_1.Status.INVALID_ARGUMENT);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(401), status_1.Status.UNAUTHENTICATED);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(403), status_1.Status.PERMISSION_DENIED);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(404), status_1.Status.NOT_FOUND);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(409), status_1.Status.ABORTED);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(416), status_1.Status.OUT_OF_RANGE);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(429), status_1.Status.RESOURCE_EXHAUSTED);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(499), status_1.Status.CANCELLED);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(451), status_1.Status.FAILED_PRECONDITION);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(411), status_1.Status.FAILED_PRECONDITION);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(501), status_1.Status.UNIMPLEMENTED);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(503), status_1.Status.UNAVAILABLE);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(504), status_1.Status.DEADLINE_EXCEEDED);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(505), status_1.Status.INTERNAL);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(510), status_1.Status.INTERNAL);
        assert.deepStrictEqual((0, status_1.rpcCodeFromHttpStatusCode)(100), status_1.Status.UNKNOWN);
    });
});
//# sourceMappingURL=status.js.map