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
const fs = require("fs");
const util = require("util");
const protobuf = require("protobufjs");
const path = require("path");
const googleError_1 = require("../../src/googleError");
const grpc_js_1 = require("@grpc/grpc-js");
const status_1 = require("../../src/status");
(0, mocha_1.describe)('gRPC-google error decoding', () => {
    const fixtureName = path.resolve(__dirname, '..', 'fixtures', 'multipleErrors.json');
    const protos_path = path.resolve(__dirname, '..', '..', 'protos', 'google', 'rpc');
    const root = protobuf.loadSync([
        path.join(protos_path, 'error_details.proto'),
        path.join(protos_path, 'status.proto'),
    ]);
    (0, mocha_1.it)('decodes multiple errors', async () => {
        var _a;
        // example of when there are multiple errors available to be decoded
        const expectedErrorArr = [];
        const decoder = new googleError_1.GoogleErrorDecoder();
        const readFile = util.promisify(fs.readFile);
        const data = await readFile(fixtureName, 'utf8');
        const objs = JSON.parse(data);
        const details = [];
        for (const obj of objs) {
            const MessageType = root.lookupType(obj.type);
            expectedErrorArr.push(obj.value);
            const buffer = MessageType.encode(obj.value).finish();
            const anyObj = {
                type_url: 'type.googleapis.com/' + obj.type,
                value: buffer,
            };
            details.push(anyObj);
        }
        const status = { code: 3, message: 'test', details: details };
        const Status = root.lookupType('google.rpc.Status');
        const statusBuffer = Status.encode(status).finish();
        const gRPCStatusDetailsObj = decoder.decodeGRPCStatusDetails(new Array(statusBuffer));
        assert.strictEqual(JSON.stringify(expectedErrorArr), JSON.stringify(gRPCStatusDetailsObj.details));
        assert.deepStrictEqual(JSON.stringify(gRPCStatusDetailsObj.errorInfo), JSON.stringify((_a = objs.find(item => item.type === 'google.rpc.ErrorInfo')) === null || _a === void 0 ? void 0 : _a.value));
    });
    (0, mocha_1.it)('does not decode when no error exists', () => {
        // example of when there's no grpc-error available to be decoded
        const emptyArr = [];
        const decoder = new googleError_1.GoogleErrorDecoder();
        const gRPCStatusDetailsObj = decoder.decodeGRPCStatusDetails(emptyArr);
        // nested error messages have different types so we can't use deepStrictEqual here
        assert.strictEqual(JSON.stringify(gRPCStatusDetailsObj.details), JSON.stringify([]));
        assert.strictEqual(gRPCStatusDetailsObj.errorInfo, undefined);
    });
    (0, mocha_1.it)('DecodeRpcStatus does not fail when unknown type is encoded', () => {
        const any = { type_url: 'noMatch', value: new Uint8Array() };
        const status = { code: 3, message: 'test', details: [any] };
        const Status = root.lookupType('google.rpc.Status');
        const status_buffer = Status.encode(status).finish();
        const decoder = new googleError_1.GoogleErrorDecoder();
        const decodedError = decoder.decodeRpcStatus(status_buffer);
        assert.strictEqual(JSON.stringify(decodedError), '{"code":3,"message":"test","statusDetails":[]}');
    });
    (0, mocha_1.it)('DecodeRpcStatusDetails does not fail when unknown type is encoded', () => {
        const any = { type_url: 'noMatch', value: new Uint8Array() };
        const status = { code: 3, message: 'test', details: [any] };
        const Status = root.lookupType('google.rpc.Status');
        const status_buffer = Status.encode(status).finish();
        const decoder = new googleError_1.GoogleErrorDecoder();
        const gRPCStatusDetailsObj = decoder.decodeGRPCStatusDetails([
            status_buffer,
        ]);
        assert.strictEqual(JSON.stringify(gRPCStatusDetailsObj.details), JSON.stringify([]));
    });
    (0, mocha_1.it)('does not decode when unknown type is encoded in type_url', () => {
        // example of when error details' type_url doesn't match "type.googleapis.com"
        const decoder = new googleError_1.GoogleErrorDecoder();
        const any = { type_url: 'noMatch', value: new Uint8Array() };
        try {
            decoder.decodeProtobufAny(any);
        }
        catch (err) {
            assert(err instanceof Error);
            assert.strictEqual(0, err
                .toString()
                .indexOf('Error: Unknown type encoded in google.protobuf.any:'));
        }
    });
    (0, mocha_1.it)('does not decode when error type does not exist under "type.googleapis.com" ', () => {
        // example of when error details' type_url = "type.googleapis.com/{errType}" and errType is invalid
        const decoder = new googleError_1.GoogleErrorDecoder();
        const any = {
            type_url: 'type.googleapis.com/noMatch',
            value: new Uint8Array(),
        };
        try {
            decoder.decodeProtobufAny(any);
        }
        catch (err) {
            assert(err instanceof Error);
            assert.strictEqual(0, err.toString().indexOf('Error: no such type'));
        }
    });
});
(0, mocha_1.describe)('parse grpc status details with ErrorInfo from grpc metadata', () => {
    const errorInfoObj = {
        reason: 'SERVICE_DISABLED',
        domain: 'googleapis.com',
        metadata: {
            consumer: 'projects/455411330361',
            service: 'translate.googleapis.com',
        },
    };
    (0, mocha_1.it)('metadata contains key grpc-status-details-bin with ErrorInfo', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const errorProtoJson = require('../../protos/status.json');
        const root = protobuf.Root.fromJSON(errorProtoJson);
        const errorInfoType = root.lookupType('ErrorInfo');
        const buffer = errorInfoType.encode(errorInfoObj).finish();
        const any = {
            type_url: 'type.googleapis.com/google.rpc.ErrorInfo',
            value: buffer,
        };
        const status = { code: 3, message: 'test', details: [any] };
        const Status = root.lookupType('google.rpc.Status');
        const status_buffer = Status.encode(status).finish();
        const metadata = new grpc_js_1.Metadata();
        metadata.set('grpc-status-details-bin', status_buffer);
        const grpcError = Object.assign(new googleError_1.GoogleError('mock error with ErrorInfo'), {
            code: 7,
            metadata: metadata,
        });
        const decodedError = googleError_1.GoogleError.parseGRPCStatusDetails(grpcError);
        assert(decodedError instanceof googleError_1.GoogleError);
        assert.strictEqual(decodedError.domain, errorInfoObj.domain);
        assert.strictEqual(decodedError.reason, errorInfoObj.reason);
        assert.strictEqual(JSON.stringify(decodedError.errorInfoMetadata), JSON.stringify(errorInfoObj.metadata));
    });
    (0, mocha_1.it)('metadata contains key grpc-status-details-bin with ErrorInfo and other unknow type', async () => {
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        const errorProtoJson = require('../../protos/status.json');
        const root = protobuf.Root.fromJSON(errorProtoJson);
        const errorInfoType = root.lookupType('ErrorInfo');
        const buffer = errorInfoType.encode(errorInfoObj).finish();
        const anyObj = {
            type_url: 'type.googleapis.com/google.rpc.ErrorInfo',
            value: buffer,
        };
        const unknownObj = {
            type_url: 'unknown_type',
            value: Buffer.from(''),
        };
        const status = { code: 3, message: 'test', details: [anyObj, unknownObj] };
        const Status = root.lookupType('google.rpc.Status');
        const status_buffer = Status.encode(status).finish();
        const metadata = new grpc_js_1.Metadata();
        metadata.set('grpc-status-details-bin', status_buffer);
        const grpcError = Object.assign(new googleError_1.GoogleError('mock error with ErrorInfo'), {
            code: 7,
            metadata: metadata,
        });
        const decodedError = googleError_1.GoogleError.parseGRPCStatusDetails(grpcError);
        assert(decodedError instanceof googleError_1.GoogleError);
        assert.strictEqual(JSON.stringify(decodedError.statusDetails), JSON.stringify([errorInfoObj]));
        assert.strictEqual(decodedError.domain, errorInfoObj.domain);
        assert.strictEqual(decodedError.reason, errorInfoObj.reason);
        assert.strictEqual(JSON.stringify(decodedError.errorInfoMetadata), JSON.stringify(errorInfoObj.metadata));
    });
    (0, mocha_1.it)('metadata has no key grpc-status-details-bin', async () => {
        const metadata = new grpc_js_1.Metadata();
        metadata.set('grpc-server-stats-bin', Buffer.from('AAKENLPQKNSALSDFJ'));
        const grpcError = Object.assign(new googleError_1.GoogleError('mock error with metadata'), {
            code: 7,
            metadata: metadata,
        });
        const decodedError = googleError_1.GoogleError.parseGRPCStatusDetails(grpcError);
        assert(decodedError instanceof googleError_1.GoogleError);
        assert.strictEqual(decodedError, grpcError);
    });
    (0, mocha_1.it)('no grpc metadata', async () => {
        const grpcError = Object.assign(new googleError_1.GoogleError('mock error without metadata'), {
            code: 7,
        });
        const decodedError = googleError_1.GoogleError.parseGRPCStatusDetails(grpcError);
        assert(decodedError instanceof googleError_1.GoogleError);
        assert.strictEqual(decodedError, grpcError);
    });
});
(0, mocha_1.describe)('map http status code to gRPC status code', () => {
    (0, mocha_1.it)('error with http status code', () => {
        const json = {
            error: {
                code: 403,
                message: 'Cloud Translation API has not been used in project 123 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/translate.googleapis.com/overview?project=455411330361 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.',
                status: 'PERMISSION_DENIED',
            },
        };
        const error = googleError_1.GoogleError.parseHttpError(json);
        assert.deepStrictEqual(error.code, (0, status_1.rpcCodeFromHttpStatusCode)(403));
    });
    (0, mocha_1.it)('error without http status code', () => {
        const json = {
            error: {
                message: 'Cloud Translation API has not been used in project 123 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/translate.googleapis.com/overview?project=455411330361 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.',
                status: 'PERMISSION_DENIED',
            },
        };
        const error = googleError_1.GoogleError.parseHttpError(json);
        assert.deepStrictEqual(error.code, undefined);
    });
});
(0, mocha_1.describe)('http error decoding', () => {
    const errorInfo = {
        '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
        reason: 'SERVICE_DISABLED',
        domain: 'googleapis.com',
        metadata: {
            service: 'translate.googleapis.com',
            consumer: 'projects/123',
        },
    };
    const help = {
        '@type': 'type.googleapis.com/google.rpc.Help',
        links: [
            {
                description: 'Google developers console API activation',
                url: 'https://console.developers.google.com/apis/api/translate.googleapis.com/overview?project=455411330361',
            },
        ],
    };
    const json = {
        error: {
            code: 403,
            message: 'Cloud Translation API has not been used in project 123 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/translate.googleapis.com/overview?project=455411330361 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.',
            status: 'PERMISSION_DENIED',
            details: [help, errorInfo],
        },
    };
    (0, mocha_1.it)('should promote ErrorInfo if exist in http error', () => {
        var _a;
        const error = googleError_1.GoogleError.parseHttpError(json);
        assert.deepStrictEqual(error.code, (0, status_1.rpcCodeFromHttpStatusCode)(403));
        assert.deepStrictEqual((_a = error.statusDetails) === null || _a === void 0 ? void 0 : _a.length, json['error']['details'].length);
        assert.deepStrictEqual(error.message, json['error']['message']);
        assert.deepStrictEqual(error.reason, errorInfo.reason);
        assert.deepStrictEqual(error.domain, errorInfo.domain);
        assert.deepStrictEqual(JSON.stringify(error.errorInfoMetadata), JSON.stringify(errorInfo.metadata));
    });
    (0, mocha_1.it)('should support http error in array', () => {
        var _a;
        const error = googleError_1.GoogleError.parseHttpError([json]);
        assert.deepStrictEqual(error.code, (0, status_1.rpcCodeFromHttpStatusCode)(403));
        assert.deepStrictEqual((_a = error.statusDetails) === null || _a === void 0 ? void 0 : _a.length, json['error']['details'].length);
        assert.deepStrictEqual(error.message, json['error']['message']);
        assert.deepStrictEqual(error.reason, errorInfo.reason);
        assert.deepStrictEqual(error.domain, errorInfo.domain);
        assert.deepStrictEqual(JSON.stringify(error.errorInfoMetadata), JSON.stringify(errorInfo.metadata));
    });
});
//# sourceMappingURL=googleError.js.map