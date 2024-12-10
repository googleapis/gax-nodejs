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
import * as protos from '../../../protos/iam_service.js';
import assert from 'assert';
import * as sinon from 'sinon';
import {SinonStub} from 'sinon';
import {describe, it} from 'mocha';
import {IamClient} from '../../src/iamService.js';
import protobuf from 'protobufjs';
import {GrpcClient} from '../../src/grpc.js';

function generateSampleMessage<T extends object>(instance: T) {
  const filledObject = (
    instance.constructor as typeof protobuf.Message
  ).toObject(instance as protobuf.Message<T>, {defaults: true});
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

describe('IAM service', () => {
  describe('getIamPolicy', () => {
    it('invokes getIamPolicy without error', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.GetIamPolicyRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedResponse = generateSampleMessage(
        new protos.google.iam.v1.Policy()
      );
      client.innerApiCalls.getIamPolicy = stubSimpleCall(expectedResponse);
      const response = await client.getIamPolicy(request, expectedOptions);
      assert.deepStrictEqual(response, [expectedResponse]);
      assert(
        (client.innerApiCalls.getIamPolicy as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions, undefined)
      );
    });
    it('invokes getIamPolicy without error using callback', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.GetIamPolicyRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedResponse = generateSampleMessage(
        new protos.google.iam.v1.Policy()
      );
      client.innerApiCalls.getIamPolicy =
        stubSimpleCallWithCallback(expectedResponse);
      const promise = new Promise((resolve, reject) => {
        client.getIamPolicy(
          request,
          expectedOptions,
          (err?: Error | null, result?: protos.google.iam.v1.Policy | null) => {
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
        (client.innerApiCalls.getIamPolicy as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions /* callback function above */)
      );
    });
    it('invokes getIamPolicy with error', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.GetIamPolicyRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedError = new Error('expected');
      client.innerApiCalls.getIamPolicy = stubSimpleCall(
        undefined,
        expectedError
      );
      await assert.rejects(async () => {
        await client.getIamPolicy(request, expectedOptions);
      }, expectedError);
      assert(
        (client.innerApiCalls.getIamPolicy as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions, undefined)
      );
    });
  });
  describe('setIamPolicy', () => {
    it('invokes setIamPolicy without error', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.SetIamPolicyRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedResponse = generateSampleMessage(
        new protos.google.iam.v1.Policy()
      );
      client.innerApiCalls.setIamPolicy = stubSimpleCall(expectedResponse);
      const response = await client.setIamPolicy(request, expectedOptions);
      assert.deepStrictEqual(response, [expectedResponse]);
      assert(
        (client.innerApiCalls.setIamPolicy as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions, undefined)
      );
    });
    it('invokes setIamPolicy without error using callback', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.SetIamPolicyRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedResponse = generateSampleMessage(
        new protos.google.iam.v1.Policy()
      );
      client.innerApiCalls.setIamPolicy =
        stubSimpleCallWithCallback(expectedResponse);
      const promise = new Promise((resolve, reject) => {
        client.setIamPolicy(
          request,
          expectedOptions,
          (err?: Error | null, result?: protos.google.iam.v1.Policy | null) => {
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
        (client.innerApiCalls.setIamPolicy as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions /* callback function above */)
      );
    });
    it('invokes setIamPolicy with error', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.SetIamPolicyRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedError = new Error('expected');
      client.innerApiCalls.setIamPolicy = stubSimpleCall(
        undefined,
        expectedError
      );
      await assert.rejects(async () => {
        await client.setIamPolicy(request, expectedOptions);
      }, expectedError);
      assert(
        (client.innerApiCalls.setIamPolicy as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions, undefined)
      );
    });
  });
  describe('testIamPermissions', () => {
    it('invokes testIamPermissions without error', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.TestIamPermissionsRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedResponse = generateSampleMessage(
        new protos.google.iam.v1.TestIamPermissionsResponse()
      );
      client.innerApiCalls.testIamPermissions =
        stubSimpleCall(expectedResponse);
      const response = await client.testIamPermissions(
        request,
        expectedOptions
      );
      assert.deepStrictEqual(response, [expectedResponse]);
      assert(
        (client.innerApiCalls.testIamPermissions as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions, undefined)
      );
    });
    it('invokes testIamPermissions without error using callback', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.TestIamPermissionsRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedResponse = generateSampleMessage(
        new protos.google.iam.v1.TestIamPermissionsResponse()
      );
      client.innerApiCalls.testIamPermissions =
        stubSimpleCallWithCallback(expectedResponse);
      const promise = new Promise((resolve, reject) => {
        client.testIamPermissions(
          request,
          expectedOptions,
          (
            err?: Error | null,
            result?: protos.google.iam.v1.TestIamPermissionsResponse | null
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
        (client.innerApiCalls.testIamPermissions as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions /* callback function above */)
      );
    });
    it('invokes testIamPermissions with error', async () => {
      const grpcClient = new GrpcClient();
      const client = new IamClient(grpcClient, {
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      client.initialize();
      const request = generateSampleMessage(
        new protos.google.iam.v1.TestIamPermissionsRequest()
      );
      request.resource = '';
      const expectedHeaderRequestParams = 'resource=';
      const expectedOptions = {
        otherArgs: {
          headers: {
            'x-goog-request-params': expectedHeaderRequestParams,
          },
        },
      };
      const expectedError = new Error('expected');
      client.innerApiCalls.testIamPermissions = stubSimpleCall(
        undefined,
        expectedError
      );
      await assert.rejects(async () => {
        await client.testIamPermissions(request, expectedOptions);
      }, expectedError);
      assert(
        (client.innerApiCalls.testIamPermissions as SinonStub)
          .getCall(0)
          .calledWith(request, expectedOptions, undefined)
      );
    });
  });
});
