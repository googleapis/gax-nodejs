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
/* eslint-disable @typescript-eslint/ban-ts-comment */
const assert = require("assert");
const mocha_1 = require("mocha");
const sinon = require("sinon");
const google_gax_1 = require("google-gax");
const showcase_echo_client_1 = require("showcase-echo-client");
const echoProtoJson = require("showcase-echo-client/build/protos/protos.json");
const statusProtoJson = require("google-gax/build/protos/status.json");
const authStub = {
    getClient: async () => {
        return {
            getRequestHeaders: async () => {
                return {
                    Authorization: 'Bearer zzzz',
                };
            },
        };
    },
};
const opts = {
    auth: authStub,
};
(0, mocha_1.describe)('loadProto', () => {
    (0, mocha_1.it)('should create a root object', () => {
        // @ts-ignore incomplete options
        const gaxGrpc = new google_gax_1.fallback.GrpcClient(opts);
        const protos = gaxGrpc.loadProto(echoProtoJson);
        assert(protos instanceof google_gax_1.protobuf.Root);
        assert(protos.lookupService('Echo') instanceof google_gax_1.protobuf.Service);
        assert(protos.lookupType('EchoRequest') instanceof google_gax_1.protobuf.Type);
    });
    (0, mocha_1.it)('should be able to load no files', () => {
        // @ts-ignore incomplete options
        const gaxGrpc = new google_gax_1.fallback.GrpcClient(opts);
        const protos = gaxGrpc.loadProto({});
        assert(protos instanceof google_gax_1.protobuf.Root);
        assert(protos.nested === undefined);
        assert.strictEqual(protos.nested, undefined);
    });
});
(0, mocha_1.describe)('createStub', () => {
    let gaxGrpc, protos, echoService, stubOptions, stubExtraOptions;
    (0, mocha_1.beforeEach)(() => {
        // @ts-ignore incomplete options
        gaxGrpc = new google_gax_1.fallback.GrpcClient(opts);
        protos = gaxGrpc.loadProto(echoProtoJson);
        echoService = protos.lookupService('Echo');
        stubOptions = {
            servicePath: 'foo.example.com',
            port: 443,
        };
        stubExtraOptions = {
            servicePath: 'foo.example.com',
            port: 443,
            other_dummy_options: 'test',
        };
    });
    (0, mocha_1.it)('should create a stub', async () => {
        const echoStub = await gaxGrpc.createStub(echoService, stubOptions);
        // The stub should consist of service methods
        assert(echoStub.echo instanceof Function);
        assert(echoStub.pagedExpand instanceof Function);
        assert(echoStub.wait instanceof Function);
        // There should be 8 methods for the echo service
        assert.strictEqual(Object.keys(echoStub).length, 8);
        // Each of the service methods should take 4 arguments (so that it works
        // with createApiCall)
        assert.strictEqual(echoStub.echo.length, 4);
    });
    (0, mocha_1.it)('should support optional parameters', async () => {
        const echoStub = await gaxGrpc.createStub(echoService, stubExtraOptions);
        // The stub should consist of methods
        assert(echoStub.echo instanceof Function);
        assert(echoStub.collect instanceof Function);
        assert(echoStub.chat instanceof Function);
        // There should be 8 methods for the echo service
        assert.strictEqual(Object.keys(echoStub).length, 8);
        // Each of the service methods should take 4 arguments (so that it works
        // with createApiCall)
        assert.strictEqual(echoStub.echo.length, 4);
    });
});
(0, mocha_1.describe)('grpc-fallback', () => {
    let gaxGrpc, protos, echoService, stubOptions;
    const createdAbortControllers = [];
    // eslint-disable-next-line no-undef
    const savedAbortController = window.AbortController;
    const authStub = {
        getClient: async () => {
            return {
                getRequestHeaders: async () => {
                    return {
                        Authorization: 'Bearer zzzz',
                    };
                },
            };
        },
    };
    const opts = {
        auth: authStub,
        protocol: 'http',
        port: 1337,
    };
    (0, mocha_1.before)(() => {
        stubOptions = {
            servicePath: 'foo.example.com',
            port: 443,
        };
        // @ts-ignore incomplete options
        gaxGrpc = new google_gax_1.fallback.GrpcClient(opts);
        protos = gaxGrpc.loadProto(echoProtoJson);
        echoService = protos.lookupService('Echo');
        stubOptions = {
            servicePath: 'foo.example.com',
            port: 443,
        };
        const AbortController = function () {
            // @ts-ignore
            this.abort = function () {
                // @ts-ignore
                this.abortCalled = true;
            };
            // @ts-ignore
            createdAbortControllers.push(this);
        };
        // @ts-ignore
        // eslint-disable-next-line no-undef
        window.AbortController = AbortController;
    });
    (0, mocha_1.beforeEach)(() => {
        createdAbortControllers.splice(0);
    });
    (0, mocha_1.afterEach)(() => {
        sinon.restore();
    });
    (0, mocha_1.after)(() => {
        // @ts-ignore
        // eslint-disable-next-line no-undef
        window.AbortController = savedAbortController;
    });
    (0, mocha_1.it)('should make a request', async () => {
        const client = new showcase_echo_client_1.EchoClient(opts);
        const requestObject = { content: 'test-content' };
        const responseType = protos.lookupType('EchoResponse');
        const response = responseType.create(requestObject); // request === response for EchoService
        const fakeFetch = sinon.fake.resolves({
            ok: true,
            arrayBuffer: () => {
                return Promise.resolve(responseType.encode(response).finish());
            },
        });
        // eslint-disable-next-line no-undef
        sinon.replace(window, 'fetch', fakeFetch);
        const [result] = await client.echo(requestObject);
        assert.strictEqual(requestObject.content, result.content);
    });
    (0, mocha_1.it)('should be able to cancel an API call using AbortController', async () => {
        const fakeFetch = sinon.fake.resolves({});
        // eslint-disable-next-line no-undef
        sinon.replace(window, 'fetch', fakeFetch);
        const echoStub = await gaxGrpc.createStub(echoService, stubOptions);
        const request = { content: 'content' + new Date().toString() };
        const call = echoStub.echo(request, {}, {}, () => { });
        call.cancel();
        // @ts-ignore
        assert.strictEqual(createdAbortControllers[0].abortCalled, true);
    });
    (0, mocha_1.it)('should be able to add extra headers to the request', async () => {
        const client = new showcase_echo_client_1.EchoClient(opts);
        const requestObject = { content: 'test-content' };
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const options = {};
        options.otherArgs = {};
        options.otherArgs.headers = {};
        options.otherArgs.headers['x-goog-request-params'] =
            google_gax_1.fallback.routingHeader.fromParams({
                abc: 'def',
            });
        const responseType = protos.lookupType('EchoResponse');
        const response = responseType.create(requestObject);
        // eslint-disable-next-line no-undef
        const savedFetch = window.fetch;
        // @ts-ignore
        // eslint-disable-next-line no-undef
        window.fetch = (url, options) => {
            // @ts-ignore
            assert.strictEqual(options.headers['x-goog-request-params'], 'abc=def');
            return Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(responseType.encode(response).finish());
                },
            });
        };
        const [result] = await client.echo(requestObject, options);
        assert.strictEqual(requestObject.content, result.content);
        // eslint-disable-next-line no-undef
        window.fetch = savedFetch;
    });
    (0, mocha_1.it)('should handle an error', done => {
        const requestObject = { content: 'test-content' };
        // example of an actual google.rpc.Status error message returned by Language
        // API
        const expectedError = Object.assign(new Error('Error message'), {
            code: 3,
            statusDetails: [],
        });
        const fakeFetch = sinon.fake.resolves({
            ok: false,
            arrayBuffer: () => {
                const root = google_gax_1.protobuf.Root.fromJSON(statusProtoJson);
                const statusType = root.lookupType('google.rpc.Status');
                const statusMessage = statusType.fromObject(expectedError);
                return Promise.resolve(statusType.encode(statusMessage).finish());
            },
        });
        // eslint-disable-next-line no-undef
        sinon.replace(window, 'fetch', fakeFetch);
        gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
            echoStub.echo(requestObject, {}, {}, (err) => {
                assert(err instanceof Error);
                assert.strictEqual(err.message, '3 INVALID_ARGUMENT: Error message');
                assert.strictEqual(JSON.stringify(err), JSON.stringify(expectedError));
                done();
            });
        });
    });
});
//# sourceMappingURL=test.grpc-fallback.js.map