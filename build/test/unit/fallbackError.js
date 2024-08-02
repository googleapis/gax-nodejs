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
const fs = require("fs");
const path = require("path");
const protobuf = require("protobufjs");
const googleError_1 = require("../../src/googleError");
(0, mocha_1.describe)('gRPC-fallback error decoding', () => {
    (0, mocha_1.it)('decodes error', () => {
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
        const decoder = new googleError_1.GoogleErrorDecoder();
        const decodedError = decoder.decodeRpcStatus(errorBin);
        assert.strictEqual(decodedError.code, expectedError.code);
        assert.strictEqual(decodedError.message, expectedError.message);
        assert.strictEqual(JSON.stringify(decodedError.statusDetails), JSON.stringify(expectedError.details));
    });
    (0, mocha_1.it)('decodes error and status code', () => {
        // example of an actual google.rpc.Status error message returned by Language API
        const fixtureName = path.resolve(__dirname, '..', 'fixtures', 'error.bin');
        const errorBin = fs.readFileSync(fixtureName);
        const expectedError = Object.assign(new Error('3 INVALID_ARGUMENT: One of content, or gcs_content_uri must be set.'), {
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
        });
        const decoder = new googleError_1.GoogleErrorDecoder();
        const decodedError = decoder.decodeErrorFromBuffer(errorBin);
        assert(decodedError instanceof googleError_1.GoogleError);
        assert.strictEqual(decodedError.code, expectedError.code);
        assert.strictEqual(decodedError.message, expectedError.message);
        assert.strictEqual(JSON.stringify(decodedError.statusDetails), JSON.stringify(expectedError.details));
    });
    (0, mocha_1.it)('decodes error with ErrorInfo', () => {
        const protos_path = path.resolve(__dirname, '..', '..', 'protos', 'google', 'rpc');
        const root = protobuf.loadSync([
            path.join(protos_path, 'error_details.proto'),
            path.join(protos_path, 'status.proto'),
        ]);
        const errorInfo = {
            reason: 'SERVICE_DISABLED',
            domain: 'googleapis.com',
            metadata: {
                consumer: 'projects/455411330361',
                service: 'translate.googleapis.com',
            },
        };
        const MessageType = root.lookupType('google.rpc.ErrorInfo');
        const errorInfoBuffer = MessageType.encode(errorInfo).finish();
        const expectedError = Object.assign(new Error('7 PERMISSION_DENIED: mock error.'), {
            code: 7,
            details: [errorInfo],
            reason: errorInfo.reason,
            domain: errorInfo.domain,
            errorInfoMetadata: errorInfo.metadata,
        });
        const status = Object.assign(new Error('mock error.'), {
            code: 7,
            status: 'PERMISSION_DENIED',
            details: new Array({
                type_url: 'type.googleapis.com/google.rpc.ErrorInfo',
                value: errorInfoBuffer,
            }),
        });
        const Status = root.lookupType('google.rpc.Status');
        const statusBuffer = Status.encode(status).finish();
        const decoder = new googleError_1.GoogleErrorDecoder();
        const decodedError = decoder.decodeErrorFromBuffer(statusBuffer);
        assert(decodedError instanceof googleError_1.GoogleError);
        assert.strictEqual(decodedError.code, expectedError.code);
        assert.strictEqual(decodedError.message, expectedError.message);
        assert.strictEqual(JSON.stringify(decodedError.statusDetails), JSON.stringify(expectedError.details));
    });
});
//# sourceMappingURL=fallbackError.js.map