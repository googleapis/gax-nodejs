"use strict";
// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
Object.defineProperty(exports, "__esModule", { value: true });
const protos = require("../../protos/locations");
const assert = require("assert");
const sinon = require("sinon");
const mocha_1 = require("mocha");
const locationService_1 = require("../../src/locationService");
const grpc_1 = require("../../src/grpc");
function generateSampleMessage(instance) {
    const filledObject = instance.constructor.toObject(instance, { defaults: true });
    return instance.constructor.fromObject(filledObject);
}
function stubSimpleCall(response, error) {
    return error
        ? sinon.stub().rejects(error)
        : sinon.stub().resolves([response]);
}
function stubSimpleCallWithCallback(response, error) {
    return error
        ? sinon.stub().callsArgWith(2, error)
        : sinon.stub().callsArgWith(2, null, response);
}
function stubAsyncIterationCall(responses, error) {
    let counter = 0;
    const asyncIterable = {
        [Symbol.asyncIterator]() {
            return {
                async next() {
                    if (error) {
                        return Promise.reject(error);
                    }
                    if (counter >= responses.length) {
                        return Promise.resolve({ done: true, value: undefined });
                    }
                    return Promise.resolve({ done: false, value: responses[counter++] });
                },
            };
        },
    };
    return sinon.stub().returns(asyncIterable);
}
(0, mocha_1.describe)('LocationsClient', () => {
    (0, mocha_1.describe)('getLocation', () => {
        (0, mocha_1.it)('invokes getLocation without error', async () => {
            const grpcClient = new grpc_1.GrpcClient();
            const client = new locationService_1.LocationsClient(grpcClient, {
                credentials: { client_email: 'bogus', private_key: 'bogus' },
                projectId: 'bogus',
            });
            client.initialize();
            const request = generateSampleMessage(new protos.google.cloud.location.GetLocationRequest());
            request.name = '';
            const expectedHeaderRequestParams = 'name=';
            const expectedOptions = {
                otherArgs: {
                    headers: {
                        'x-goog-request-params': expectedHeaderRequestParams,
                    },
                },
            };
            const expectedResponse = generateSampleMessage(new protos.google.cloud.location.Location());
            client.innerApiCalls.getLocation = stubSimpleCall(expectedResponse);
            const response = await client.getLocation(request, expectedOptions);
            assert.deepStrictEqual(response, [expectedResponse]);
            assert(client.innerApiCalls.getLocation
                .getCall(0)
                .calledWith(request, expectedOptions, undefined));
        });
        (0, mocha_1.it)('invokes getLocation without error using callback', async () => {
            const grpcClient = new grpc_1.GrpcClient();
            const client = new locationService_1.LocationsClient(grpcClient, {
                credentials: { client_email: 'bogus', private_key: 'bogus' },
                projectId: 'bogus',
            });
            client.initialize();
            const request = generateSampleMessage(new protos.google.cloud.location.GetLocationRequest());
            request.name = '';
            const expectedHeaderRequestParams = 'name=';
            const expectedOptions = {
                otherArgs: {
                    headers: {
                        'x-goog-request-params': expectedHeaderRequestParams,
                    },
                },
            };
            const expectedResponse = generateSampleMessage(new protos.google.cloud.location.Location());
            client.innerApiCalls.getLocation =
                stubSimpleCallWithCallback(expectedResponse);
            const promise = new Promise((resolve, reject) => {
                client.getLocation(request, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            const response = await promise;
            assert.deepStrictEqual(response, expectedResponse);
            assert(client.innerApiCalls.getLocation
                .getCall(0)
                .calledWith(request, expectedOptions /*, callback defined above */));
        });
        (0, mocha_1.it)('invokes getLocation with error', async () => {
            const grpcClient = new grpc_1.GrpcClient();
            const client = new locationService_1.LocationsClient(grpcClient, {
                projectId: 'bogus',
            });
            client.initialize();
            const request = generateSampleMessage(new protos.google.cloud.location.GetLocationRequest());
            request.name = '';
            const expectedHeaderRequestParams = 'name=';
            const expectedOptions = {
                otherArgs: {
                    headers: {
                        'x-goog-request-params': expectedHeaderRequestParams,
                    },
                },
            };
            const expectedError = new Error('expected');
            client.innerApiCalls.getLocation = stubSimpleCall(undefined, expectedError);
            await assert.rejects(client.getLocation(request, expectedOptions), expectedError);
            assert(client.innerApiCalls.getLocation
                .getCall(0)
                .calledWith(request, expectedOptions, undefined));
        });
    });
    (0, mocha_1.describe)('listLocations', () => {
        (0, mocha_1.it)('invokes listLocations without error', async () => {
            const grpcClient = new grpc_1.GrpcClient();
            const client = new locationService_1.LocationsClient(grpcClient, {
                credentials: { client_email: 'bogus', private_key: 'bogus' },
                projectId: 'bogus',
            });
            client.initialize();
            const request = generateSampleMessage(new protos.google.cloud.location.ListLocationsRequest());
            request.name = '';
            const expectedHeaderRequestParams = 'name=';
            const expectedOptions = {
                otherArgs: {
                    headers: {
                        'x-goog-request-params': expectedHeaderRequestParams,
                    },
                },
            };
            const expectedResponse = [
                generateSampleMessage(new protos.google.cloud.location.Location()),
                generateSampleMessage(new protos.google.cloud.location.Location()),
                generateSampleMessage(new protos.google.cloud.location.Location()),
            ];
            client.innerApiCalls.listLocations = stubSimpleCall(expectedResponse);
            const [response] = await client.listLocations(request, expectedOptions);
            assert.deepStrictEqual(response, expectedResponse);
            assert(client.innerApiCalls.listLocations
                .getCall(0)
                .calledWith(request, expectedOptions, undefined));
        });
        (0, mocha_1.it)('invokes listLocations without error using callback', async () => {
            const grpcClient = new grpc_1.GrpcClient();
            const client = new locationService_1.LocationsClient(grpcClient, {
                credentials: { client_email: 'bogus', private_key: 'bogus' },
                projectId: 'bogus',
            });
            client.initialize();
            const request = generateSampleMessage(new protos.google.cloud.location.ListLocationsRequest());
            request.name = '';
            const expectedHeaderRequestParams = 'name=';
            const expectedOptions = {
                otherArgs: {
                    headers: {
                        'x-goog-request-params': expectedHeaderRequestParams,
                    },
                },
            };
            const expectedResponse = [
                generateSampleMessage(new protos.google.cloud.location.Location()),
                generateSampleMessage(new protos.google.cloud.location.Location()),
                generateSampleMessage(new protos.google.cloud.location.Location()),
            ];
            client.innerApiCalls.listLocations =
                stubSimpleCallWithCallback(expectedResponse);
            const promise = new Promise((resolve, reject) => {
                client.listLocations(request, (err, result) => {
                    if (err) {
                        reject(err);
                    }
                    else {
                        resolve(result);
                    }
                });
            });
            const response = await promise;
            assert.deepStrictEqual(response, expectedResponse);
            assert(client.innerApiCalls.listLocations
                .getCall(0)
                .calledWith(request, expectedOptions /*, callback defined above */));
        });
        (0, mocha_1.it)('invokes listLocations with error', async () => {
            const grpcClient = new grpc_1.GrpcClient();
            const client = new locationService_1.LocationsClient(grpcClient, {
                credentials: { client_email: 'bogus', private_key: 'bogus' },
                projectId: 'bogus',
            });
            client.initialize();
            const request = generateSampleMessage(new protos.google.cloud.location.ListLocationsRequest());
            request.name = '';
            const expectedHeaderRequestParams = 'name=';
            const expectedOptions = {
                otherArgs: {
                    headers: {
                        'x-goog-request-params': expectedHeaderRequestParams,
                    },
                },
            };
            const expectedError = new Error('expected');
            client.innerApiCalls.listLocations = stubSimpleCall(undefined, expectedError);
            await assert.rejects(client.listLocations(request, expectedOptions), expectedError);
            assert(client.innerApiCalls.listLocations
                .getCall(0)
                .calledWith(request, expectedOptions, undefined));
        });
        (0, mocha_1.it)('uses async iteration with listLocations without error', async () => {
            const grpcClient = new grpc_1.GrpcClient();
            const client = new locationService_1.LocationsClient(grpcClient, {
                credentials: { client_email: 'bogus', private_key: 'bogus' },
                projectId: 'bogus',
            });
            client.initialize();
            const request = generateSampleMessage(new protos.google.cloud.location.ListLocationsRequest());
            request.name = '';
            const expectedHeaderRequestParams = 'name=';
            const expectedResponse = [
                generateSampleMessage(new protos.google.cloud.location.Location()),
                generateSampleMessage(new protos.google.cloud.location.Location()),
                generateSampleMessage(new protos.google.cloud.location.Location()),
            ];
            client.descriptors.page.listLocations.asyncIterate =
                stubAsyncIterationCall(expectedResponse);
            const responses = [];
            const iterable = client.listLocationsAsync(request);
            for await (const resource of iterable) {
                responses.push(resource);
            }
            assert.deepStrictEqual(responses, expectedResponse);
            assert.deepStrictEqual(client.descriptors.page.listLocations.asyncIterate.getCall(0).args[1], request);
            assert.strictEqual(client.descriptors.page.listLocations.asyncIterate.getCall(0).args[2].otherArgs.headers['x-goog-request-params'], expectedHeaderRequestParams);
        });
        (0, mocha_1.it)('uses async iteration with listLocations with error', async () => {
            const grpcClient = new grpc_1.GrpcClient();
            const client = new locationService_1.LocationsClient(grpcClient, {
                credentials: { client_email: 'bogus', private_key: 'bogus' },
                projectId: 'bogus',
            });
            client.initialize();
            const request = generateSampleMessage(new protos.google.cloud.location.ListLocationsRequest());
            request.name = '';
            const expectedHeaderRequestParams = 'name=';
            const expectedError = new Error('expected');
            client.descriptors.page.listLocations.asyncIterate =
                stubAsyncIterationCall(undefined, expectedError);
            const iterable = client.listLocationsAsync(request);
            await assert.rejects(async () => {
                const responses = [];
                for await (const resource of iterable) {
                    responses.push(resource);
                }
            });
            assert.deepStrictEqual(client.descriptors.page.listLocations.asyncIterate.getCall(0).args[1], request);
            assert.strictEqual(client.descriptors.page.listLocations.asyncIterate.getCall(0).args[2].otherArgs.headers['x-goog-request-params'], expectedHeaderRequestParams);
        });
    });
});
//# sourceMappingURL=locationService.js.map