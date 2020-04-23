// Copyright 2020 Google LLC
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
//
// ** This file is automatically generated by gapic-generator-typescript. **
// ** https://github.com/googleapis/gapic-generator-typescript **
// ** All changes to this file may be overwritten. **
import * as protos from '../../protos/operations';
import * as assert from 'assert';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {describe, it} from 'mocha';
import {OperationsClientBuilder} from '../../src/operationsClient';
import * as protobuf from 'protobufjs';
import {GrpcClient} from '../../src/grpc';
import {PassThrough} from 'stream';
import {ResultTuple} from '../../src/apitypes';

function generateSampleMessage<T extends object>(instance: T) {
  const filledObject = (instance.constructor as typeof protobuf.Message).toObject(
    instance as protobuf.Message<T>,
    {defaults: true}
  );
  return (instance.constructor as typeof protobuf.Message).fromObject(
    filledObject
  ) as T;
}

function stubSimpleCall<ResponseType>(response?: ResponseType, error?: Error) {
  return error
    ? sinon.stub().rejects(error)
    : sinon.stub().resolves([response]);
}

function stubSimpleCallWithCallback<ResponseType>(
  response?: ResponseType,
  error?: Error
) {
  return error
    ? sinon.stub().callsArgWith(2, error)
    : sinon.stub().callsArgWith(2, null, response);
}
function stubPageStreamingCall<ResponseType>(
  responses?: ResponseType[],
  error?: Error
) {
  const pagingStub = sinon.stub();
  if (responses) {
    for (let i = 0; i < responses.length; ++i) {
      pagingStub.onCall(i).callsArgWith(2, null, responses[i]);
    }
  }
  const transformStub = error
    ? sinon.stub().callsArgWith(2, error)
    : pagingStub;
  const mockStream = new PassThrough({
    objectMode: true,
    transform: transformStub,
  });
  // trigger as many responses as needed
  if (responses) {
    for (let i = 0; i < responses.length; ++i) {
      setImmediate(() => {
        mockStream.write({});
      });
    }
    setImmediate(() => {
      mockStream.end();
    });
  } else {
    setImmediate(() => {
      mockStream.write({});
    });
    setImmediate(() => {
      mockStream.end();
    });
  }
  return sinon.stub().returns(mockStream);
}

function stubAsyncIterationCall<ResponseType>(
  responses?: ResponseType[],
  error?: Error
) {
  let counter = 0;
  const asyncIterable = {
    [Symbol.asyncIterator]() {
      return {
        async next() {
          if (error) {
            return Promise.reject(error);
          }
          if (counter >= responses!.length) {
            return Promise.resolve({done: true, value: undefined});
          }
          return Promise.resolve({done: false, value: responses![counter++]});
        },
      };
    },
  };
  return sinon.stub().returns(asyncIterable);
}

describe('operation client', () => {
  describe('getOperation ', () => {
    it('invokes getOperation without error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.GetOperationRequest()
      );
      const expectedResponse = generateSampleMessage(
        new protos.google.longrunning.Operation()
      );
      client.innerApiCalls.getOperation = stubSimpleCall(expectedResponse);
      const response = await client.getOperation(request);
      assert.deepStrictEqual(response, [expectedResponse]);
      assert(
        (client.innerApiCalls.getOperation as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });

    it('invokes getOperation without error using callback', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.GetOperationRequest()
      );
      const expectedResponse = generateSampleMessage(
        new protos.google.longrunning.Operation()
      );
      client.innerApiCalls.getOperation = stubSimpleCallWithCallback(
        expectedResponse
      );
      const promise = new Promise((resolve, reject) => {
        client.getOperation(
          request,
          undefined,
          (
            err?: Error | null,
            result?: protos.google.longrunning.Operation | null
          ) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      const response = await promise;
      assert.deepStrictEqual(response, expectedResponse);
      assert(
        (client.innerApiCalls.getOperation as SinonStub)
          .getCall(0)
          .calledWith(request /* callback function above */)
      );
    });

    it('invokes getOperation with error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );
      const request = generateSampleMessage(
        new protos.google.longrunning.GetOperationRequest()
      );
      const expectedError = new Error('expected');
      client.innerApiCalls.getOperation = stubSimpleCall(
        undefined,
        expectedError
      );
      await assert.rejects(async () => {
        await client.getOperation(request);
      }, expectedError);
      assert(
        (client.innerApiCalls.getOperation as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });
  });
  describe('getOperationInternal ', () => {
    it('invokes getOperationInternal without error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.GetOperationRequest()
      );
      const expectedResponse: ResultTuple = [
        new protos.google.longrunning.Operation(),
        null,
        new protos.google.longrunning.Operation(),
      ];
      client.innerApiCalls.getOperation = stubSimpleCall(expectedResponse);
      const response = await client.getOperationInternal(request);
      assert.deepStrictEqual(response, [expectedResponse]);
      assert(
        (client.innerApiCalls.getOperation as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });

    it('invokes getOperation without error using callback', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.GetOperationRequest()
      );
      const expectedResponse: ResultTuple = [
        new protos.google.longrunning.Operation(),
        null,
        new protos.google.longrunning.Operation(),
      ];
      client.innerApiCalls.getOperation = stubSimpleCallWithCallback(
        expectedResponse
      );
      const promise = new Promise((resolve, reject) => {
        client.getOperationInternal(
          request,
          undefined,
          (
            err?: Error | null,
            result?: protos.google.longrunning.Operation | null
          ) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      const response = await promise;
      assert.deepStrictEqual(response, expectedResponse);
      assert(
        (client.innerApiCalls.getOperation as SinonStub)
          .getCall(0)
          .calledWith(request /* callback function above */)
      );
    });

    it('invokes getOperationInternal with error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );
      const request = generateSampleMessage(
        new protos.google.longrunning.GetOperationRequest()
      );
      const expectedError = new Error('expected');
      client.innerApiCalls.getOperation = stubSimpleCall(
        undefined,
        expectedError
      );
      await assert.rejects(async () => {
        await client.getOperationInternal(request);
      }, expectedError);
      assert(
        (client.innerApiCalls.getOperation as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });
  });
  describe('listOperations ', () => {
    it('invokes listOperations without error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.ListOperationsRequest()
      );
      const expectedResponse = generateSampleMessage(
        new protos.google.longrunning.ListOperationsResponse()
      );
      client.innerApiCalls.listOperations = stubSimpleCall(expectedResponse);
      const response = await client.listOperations(request);
      assert.deepStrictEqual(response, [expectedResponse]);
      assert(
        (client.innerApiCalls.listOperations as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });

    it('invokes listOperations without error using callback', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.ListOperationsRequest()
      );
      const expectedResponse = generateSampleMessage(
        new protos.google.longrunning.ListOperationsResponse()
      );
      client.innerApiCalls.listOperations = stubSimpleCallWithCallback(
        expectedResponse
      );
      const promise = new Promise((resolve, reject) => {
        client.listOperations(
          request,
          undefined,
          (
            err?: Error | null,
            result?: protos.google.longrunning.ListOperationsResponse | null
          ) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      const response = await promise;
      assert.deepStrictEqual(response, expectedResponse);
      assert(
        (client.innerApiCalls.listOperations as SinonStub)
          .getCall(0)
          .calledWith(request /* callback function above */)
      );
    });

    it('invokes listOperations with error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );
      const request = generateSampleMessage(
        new protos.google.longrunning.ListOperationsRequest()
      );
      const expectedError = new Error('expected');
      client.innerApiCalls.listOperations = stubSimpleCall(
        undefined,
        expectedError
      );
      await assert.rejects(async () => {
        await client.listOperations(request);
      }, expectedError);
      assert(
        (client.innerApiCalls.listOperations as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });

    it('invokes listOperationsStream without error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.ListOperationsRequest()
      );
      const expectedResponse = [
        generateSampleMessage(new protos.google.longrunning.Operation()),
        generateSampleMessage(new protos.google.longrunning.Operation()),
        generateSampleMessage(new protos.google.longrunning.Operation()),
      ];
      client.descriptor.listOperations.createStream = stubPageStreamingCall(
        expectedResponse
      );
      const stream = client.listOperationsStream(request);
      const promise = new Promise((resolve, reject) => {
        const responses: protos.google.longrunning.Operation[] = [];
        stream.on('data', (response: protos.google.longrunning.Operation) => {
          responses.push(response);
        });
        stream.on('end', () => {
          resolve(responses);
        });
        stream.on('error', (err: Error) => {
          reject(err);
        });
      });
      const responses = await promise;
      assert.deepStrictEqual(responses, expectedResponse);
      assert(
        (client.descriptor.listOperations.createStream as SinonStub)
          .getCall(0)
          .calledWith(client.innerApiCalls.listOperations, request)
      );
    });

    it('invokes listOperationsStream with error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.ListOperationsRequest()
      );
      const expectedError = new Error('expected');
      client.descriptor.listOperations.createStream = stubPageStreamingCall(
        undefined,
        expectedError
      );
      const stream = client.listOperationsStream(request);
      const promise = new Promise((resolve, reject) => {
        const responses: protos.google.longrunning.Operation[] = [];
        stream.on('data', (response: protos.google.longrunning.Operation) => {
          responses.push(response);
        });
        stream.on('end', () => {
          resolve(responses);
        });
        stream.on('error', (err: Error) => {
          reject(err);
        });
      });
      await assert.rejects(async () => {
        await promise;
      }, expectedError);
      assert(
        (client.descriptor.listOperations.createStream as SinonStub)
          .getCall(0)
          .calledWith(client.innerApiCalls.listOperations, request)
      );
    });

    it('uses async iteration with listOperation without error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.ListOperationsRequest()
      );
      const expectedResponse = [
        generateSampleMessage(
          new protos.google.longrunning.ListOperationsResponse()
        ),
        generateSampleMessage(
          new protos.google.longrunning.ListOperationsResponse()
        ),
        generateSampleMessage(
          new protos.google.longrunning.ListOperationsResponse()
        ),
      ];
      client.descriptor.listOperations.asyncIterate = stubAsyncIterationCall(
        expectedResponse
      );
      const responses: protos.google.longrunning.ListOperationsResponse[] = [];
      const iterable = client.listOperationsAsync(request);
      for await (const resource of iterable) {
        responses.push(resource!);
      }
      assert.deepStrictEqual(responses, expectedResponse);
      assert.deepStrictEqual(
        (client.descriptor.listOperations.asyncIterate as SinonStub).getCall(0)
          .args[1],
        request
      );
    });

    it('uses async iteration with listOperation with error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );
      const request = generateSampleMessage(
        new protos.google.longrunning.ListOperationsRequest()
      );
      const expectedError = new Error('expected');
      client.descriptor.listOperations.asyncIterate = stubAsyncIterationCall(
        undefined,
        expectedError
      );
      const iterable = client.listOperationsAsync(request);
      await assert.rejects(async () => {
        const responses: protos.google.longrunning.ListOperationsResponse[] = [];
        for await (const resource of iterable) {
          responses.push(resource!);
        }
      });
      assert.deepStrictEqual(
        (client.descriptor.listOperations.asyncIterate as SinonStub).args[0][1],
        request
      );
    });
  });
  describe('cancelOperation ', () => {
    it('invokes cancelOperation without error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.CancelOperationRequest()
      );
      const expectedResponse = generateSampleMessage(
        new protos.google.protobuf.Empty()
      );
      client.innerApiCalls.cancelOperation = stubSimpleCall(expectedResponse);
      const response = await client.cancelOperation(request);
      assert.deepStrictEqual(response, [expectedResponse]);
      assert(
        (client.innerApiCalls.cancelOperation as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });

    it('invokes cancelOperation without error using callback', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.CancelOperationRequest()
      );
      const expectedResponse = generateSampleMessage(
        new protos.google.protobuf.Empty()
      );
      client.innerApiCalls.cancelOperation = stubSimpleCallWithCallback(
        expectedResponse
      );
      const promise = new Promise((resolve, reject) => {
        client.cancelOperation(
          request,
          undefined,
          (
            err?: Error | null,
            result?: protos.google.protobuf.Empty | null
          ) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      const response = await promise;
      assert.deepStrictEqual(response, expectedResponse);
      assert(
        (client.innerApiCalls.cancelOperation as SinonStub)
          .getCall(0)
          .calledWith(request /* callback function above */)
      );
    });

    it('invokes cancelOperation with error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );
      const request = generateSampleMessage(
        new protos.google.longrunning.CancelOperationRequest()
      );
      const expectedError = new Error('expected');
      client.innerApiCalls.cancelOperation = stubSimpleCall(
        undefined,
        expectedError
      );
      await assert.rejects(async () => {
        await client.cancelOperation(request);
      }, expectedError);
      assert(
        (client.innerApiCalls.cancelOperation as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });
  });
  describe('deleteOperation ', () => {
    it('invokes deleteOperation without error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.DeleteOperationRequest()
      );
      const expectedResponse = generateSampleMessage(
        new protos.google.protobuf.Empty()
      );
      client.innerApiCalls.deleteOperation = stubSimpleCall(expectedResponse);
      const response = await client.deleteOperation(request);
      assert.deepStrictEqual(response, [expectedResponse]);
      assert(
        (client.innerApiCalls.deleteOperation as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });

    it('invokes deleteOperation without error using callback', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );

      const request = generateSampleMessage(
        new protos.google.longrunning.DeleteOperationRequest()
      );
      const expectedResponse = generateSampleMessage(
        new protos.google.protobuf.Empty()
      );
      client.innerApiCalls.deleteOperation = stubSimpleCallWithCallback(
        expectedResponse
      );
      const promise = new Promise((resolve, reject) => {
        client.deleteOperation(
          request,
          undefined,
          (
            err?: Error | null,
            result?: protos.google.protobuf.Empty | null
          ) => {
            if (err) {
              reject(err);
            } else {
              resolve(result);
            }
          }
        );
      });
      const response = await promise;
      assert.deepStrictEqual(response, expectedResponse);
      assert(
        (client.innerApiCalls.deleteOperation as SinonStub)
          .getCall(0)
          .calledWith(request /* callback function above */)
      );
    });

    it('invokes deleteOperation with error', async () => {
      const grpcClient = new GrpcClient();
      const clientOptions = {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      };
      const client = new OperationsClientBuilder(grpcClient).operationsClient(
        clientOptions
      );
      const request = generateSampleMessage(
        new protos.google.longrunning.DeleteOperationRequest()
      );
      const expectedError = new Error('expected');
      client.innerApiCalls.deleteOperation = stubSimpleCall(
        undefined,
        expectedError
      );
      await assert.rejects(async () => {
        await client.deleteOperation(request);
      }, expectedError);
      assert(
        (client.innerApiCalls.deleteOperation as SinonStub)
          .getCall(0)
          .calledWith(request)
      );
    });
  });
});
