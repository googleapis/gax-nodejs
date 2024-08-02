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
const index = require("../../src/index");
const fallback = require("../../src/fallback");
const assert = require("assert");
const mocha_1 = require("mocha");
const version = require('../../../package.json').version;
// The following export tests validate the Gax interface that is used by client libraries.
// Removing any of the following exports will break client libraries.
(0, mocha_1.describe)('exports', () => {
    (0, mocha_1.describe)('index', () => {
        (0, mocha_1.it)('exports GrpcClient', () => {
            assert(typeof index.GrpcClient === 'function');
        });
        (0, mocha_1.it)('exports createApiCall', () => {
            assert(typeof index.createApiCall === 'function');
        });
        (0, mocha_1.it)('exports PathTemplate', () => {
            assert(typeof index.PathTemplate === 'function');
        });
        (0, mocha_1.it)('exports PageDescriptor', () => {
            assert(typeof index.PageDescriptor === 'function');
        });
        (0, mocha_1.it)('exports StreamDescriptor', () => {
            assert(typeof index.StreamDescriptor === 'function');
        });
        (0, mocha_1.it)('exports BundleDescriptor', () => {
            assert(typeof index.BundleDescriptor === 'function');
        });
        (0, mocha_1.it)('exports LongrunningDescriptor', () => {
            assert(typeof index.LongrunningDescriptor === 'function');
        });
        (0, mocha_1.it)('exports lro', () => {
            assert(typeof index.lro === 'function');
        });
        (0, mocha_1.it)('exports version', () => {
            assert(typeof index.version === 'string');
            assert.strictEqual(index.version, version);
        });
        (0, mocha_1.it)('exports fallback', () => {
            assert(typeof index.fallback === 'object');
        });
        (0, mocha_1.it)('exports protobuf', () => {
            assert(typeof index.protobuf === 'object');
        });
        (0, mocha_1.it)('exports protobufMinimal', () => {
            assert(typeof index.protobufMinimal === 'object');
        });
    });
    (0, mocha_1.describe)('fallback', () => {
        (0, mocha_1.it)('exports GrpcClient', () => {
            assert(typeof fallback.GrpcClient === 'function');
        });
        (0, mocha_1.it)('exports createApiCall', () => {
            assert(typeof fallback.createApiCall === 'function');
        });
        (0, mocha_1.it)('exports PathTemplate', () => {
            assert(typeof fallback.PathTemplate === 'function');
        });
        (0, mocha_1.it)('exports PageDescriptor', () => {
            assert(typeof fallback.PageDescriptor === 'function');
        });
        (0, mocha_1.it)('exports StreamDescriptor', () => {
            assert(typeof fallback.StreamDescriptor === 'function');
        });
        (0, mocha_1.it)('exports BundleDescriptor', () => {
            assert(typeof fallback.BundleDescriptor === 'function');
        });
        (0, mocha_1.it)('exports LongrunningDescriptor', () => {
            assert(typeof fallback.LongrunningDescriptor === 'function');
        });
        (0, mocha_1.it)('exports lro', () => {
            assert(typeof fallback.lro === 'function');
        });
        (0, mocha_1.it)('exports version', () => {
            assert(typeof fallback.version === 'string');
            assert.strictEqual(fallback.version, version + '-fallback');
        });
        (0, mocha_1.it)('exports protobuf', () => {
            assert(typeof fallback.protobuf === 'object');
        });
        (0, mocha_1.it)('exports protobufMinimal', () => {
            assert(typeof fallback.protobufMinimal === 'object');
        });
    });
});
//# sourceMappingURL=exports.js.map