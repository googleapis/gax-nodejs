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

/* eslint-disable @typescript-eslint/ban-ts-ignore */
/* eslint-disable no-undef */

import * as assert from 'assert';
import {describe, it, beforeEach, afterEach, before, after} from 'mocha';
import * as path from 'path';
import * as fs from 'fs';
import * as nodeFetch from 'node-fetch';
import * as abortController from 'abort-controller';
import * as protobuf from 'protobufjs';
import * as sinon from 'sinon';
import {echoProtoJson} from '../fixtures/echoProtoJson';
import {GrpcClient} from '../../src/fallback';
import {GoogleError} from '../../src';

// @ts-ignore
const hasAbortController = typeof AbortController !== 'undefined';

const authClient = {
  async getRequestHeaders() {
    return {Authorization: 'Bearer SOME_TOKEN'};
  },
};

const authStub = {
  async getClient() {
    return authClient;
  },
};

const opts = {
  auth: authStub,
};

describe('loadProto', () => {
  it('should create a root object', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new GrpcClient(opts);
    const protos = gaxGrpc.loadProto(echoProtoJson);

    assert(protos instanceof protobuf.Root);
    assert(protos.lookupService('Echo') instanceof protobuf.Service);
    assert(protos.lookupType('EchoRequest') instanceof protobuf.Type);
  });

  it('should create a root object using loadProtoJSON', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new GrpcClient(opts);
    const protos = gaxGrpc.loadProtoJSON(echoProtoJson);

    assert(protos instanceof protobuf.Root);
    assert(protos.lookupService('Echo') instanceof protobuf.Service);
    assert(protos.lookupType('EchoRequest') instanceof protobuf.Type);
  });

  it('should cache root object using loadProtoJSON', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new GrpcClient(opts);
    const protos1 = gaxGrpc.loadProtoJSON(echoProtoJson);
    const protos2 = gaxGrpc.loadProtoJSON(echoProtoJson);

    assert.strictEqual(protos1, protos2);
  });

  it('should not cache root object using loadProtoJSON when asked', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new GrpcClient(opts);
    const protos1 = gaxGrpc.loadProtoJSON(echoProtoJson, /*ignoreCache:*/ true);
    const protos2 = gaxGrpc.loadProtoJSON(echoProtoJson, /*ignoreCache:*/ true);

    assert.notStrictEqual(protos1, protos2);
  });

  it('should be able to load no files', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new GrpcClient(opts);
    const protos = gaxGrpc.loadProto({});
    assert(protos instanceof protobuf.Root);

    assert(protos.nested === undefined);
    assert.strictEqual(protos.nested, undefined);
  });
});

describe('createStub', () => {
  let gaxGrpc: GrpcClient,
    protos,
    echoService: protobuf.Service,
    stubOptions: {},
    stubExtraOptions: {};

  beforeEach(() => {
    // @ts-ignore incomplete options
    gaxGrpc = new GrpcClient(opts);
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

  it('should create a stub', async () => {
    const echoStub = await gaxGrpc.createStub(echoService, stubOptions);

    // The stub should consist of service methods
    assert.strictEqual(typeof echoStub.echo, 'function');
    assert.strictEqual(typeof echoStub.pagedExpand, 'function');
    assert.strictEqual(typeof echoStub.wait, 'function');
    assert.strictEqual(typeof echoStub.close, 'function');

    // There should be 7 methods for the echo service + 1 close method.
    assert.strictEqual(Object.keys(echoStub).length, 8);

    // Each of the service methods should take 4 arguments (so that it works with createApiCall)
    assert.strictEqual(echoStub.echo.length, 4);
  });

  it('should support optional parameters', async () => {
    const echoStub = await gaxGrpc.createStub(echoService, stubExtraOptions);

    // The stub should consist of methods
    assert.strictEqual(typeof echoStub.echo, 'function');
    assert.strictEqual(typeof echoStub.collect, 'function');
    assert.strictEqual(typeof echoStub.chat, 'function');
    assert.strictEqual(typeof echoStub.close, 'function');

    // There should be 7 methods for the echo service + 1 close method.
    assert.strictEqual(Object.keys(echoStub).length, 8);

    // Each of the service methods should take 4 arguments (so that it works with createApiCall)
    assert.strictEqual(echoStub.echo.length, 4);
  });
});

describe('grpc-fallback', () => {
  let gaxGrpc: GrpcClient,
    protos: protobuf.NamespaceBase,
    echoService: protobuf.Service,
    stubOptions: {};
  const createdAbortControllers: string[] = [];
  // @ts-ignore
  const savedAbortController = hasAbortController
    ? AbortController
    : abortController.AbortController;

  before(() => {
    stubOptions = {
      servicePath: 'foo.example.com',
      port: 443,
    };

    // @ts-ignore incomplete options
    gaxGrpc = new GrpcClient(opts);
    protos = gaxGrpc.loadProto(echoProtoJson);
    echoService = protos.lookupService('Echo');
    stubOptions = {
      servicePath: 'foo.example.com',
      port: 443,
    };

    const FakeAbortController = function () {
      // @ts-ignore
      this.abort = function () {
        // @ts-ignore
        this.abortCalled = true;
      };
      // @ts-ignore
      createdAbortControllers.push(this);
    };

    if (hasAbortController) {
      // @ts-ignore
      AbortController = FakeAbortController;
    } else {
      // @ts-ignore
      abortController.AbortController = FakeAbortController;
    }
  });

  beforeEach(() => {
    createdAbortControllers.splice(0);
  });

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    if (hasAbortController) {
      // @ts-ignore
      AbortController = savedAbortController;
    } else {
      // @ts-ignore
      abortController.AbortController = savedAbortController;
    }
  });

  it('should send grpc-web version in the header', () => {
    const gapicConfig = {
      interfaces: {
        'google.showcase.v1beta1.Echo': {
          retry_codes: {
            idempotent: ['DEADLINE_EXCEEDED', 'UNAVAILABLE'],
            non_idempotent: [],
          },
          retry_params: {
            default: {
              initial_retry_delay_millis: 100,
              retry_delay_multiplier: 1.3,
              max_retry_delay_millis: 60000,
              initial_rpc_timeout_millis: 20000,
              rpc_timeout_multiplier: 1.0,
              max_rpc_timeout_millis: 20000,
              total_timeout_millis: 600000,
            },
          },
          methods: {
            Echo: {
              timeout_millis: 60000,
              retry_codes_name: 'idempotent',
              retry_params_name: 'default',
            },
          },
        },
      },
    };

    const settings = gaxGrpc.constructSettings(
      'google.showcase.v1beta1.Echo',
      gapicConfig,
      {},
      {}
    );
    const metadataBuilder = settings.echo.otherArgs.metadataBuilder;
    const headers = metadataBuilder();
    assert(headers['x-goog-api-client'][0].match('grpc-web/'));
  });

  it('should make a request', done => {
    const requestObject = {content: 'test-content'};
    const responseType = protos.lookupType('EchoResponse');
    const response = responseType.create(requestObject); // request === response for EchoService
    //@ts-ignore
    sinon.stub(nodeFetch, 'Promise').returns(
      Promise.resolve({
        ok: true,
        arrayBuffer: () => {
          return Promise.resolve(responseType.encode(response).finish());
        },
      })
    );

    gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
      echoStub.echo(requestObject, {}, {}, (err?: Error, result?: {}) => {
        assert.strictEqual(err, null);
        assert.strictEqual(
          requestObject.content,
          (result as {content: string}).content
        );
        done();
      });
    });
  });

  it('should handle an error', done => {
    const requestObject = {content: 'test-content'};
    // example of an actual google.rpc.Status error message returned by Language API
    const fixtureName = path.resolve(__dirname, '..', 'fixtures', 'error.bin');
    const errorBin = fs.readFileSync(fixtureName);
    const expectedMessage =
      '3 INVALID_ARGUMENT: One of content, or gcs_content_uri must be set.';
    const expectedError = {
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
    };
    //@ts-ignore
    sinon.stub(nodeFetch, 'Promise').returns(
      Promise.resolve({
        ok: false,
        arrayBuffer: () => {
          return Promise.resolve(errorBin);
        },
      })
    );
    gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
      echoStub.echo(requestObject, {}, {}, (err?: Error) => {
        assert(err instanceof GoogleError);
        assert.strictEqual(err.message, expectedMessage);
        assert.strictEqual(err.code, expectedError.code);
        assert.strictEqual(
          JSON.stringify(err.statusDetails),
          JSON.stringify(expectedError.details)
        );
        done();
      });
    });
  });

  it('should promote ErrorInfo if exist in fallback-rest error', done => {
    const requestObject = {content: 'test-content'};
    // example of an actual google.rpc.Status error message returned by Translate API
    const errorInfo = {
      '@type': 'type.googleapis.com/google.rpc.ErrorInfo',
      reason: 'SERVICE_DISABLED',
      domain: 'googleapis.com',
      metadata: {
        service: 'translate.googleapis.com',
        consumer: 'projects/123',
      },
    };
    const serverError = {
      error: {
        code: 403,
        message:
          'Cloud Translation API has not been used in project 123 before or it is disabled. Enable it by visiting https://console.developers.google.com/apis/api/translate.googleapis.com/overview?project=455411330361 then retry. If you enabled this API recently, wait a few minutes for the action to propagate to our systems and retry.',
        status: 'PERMISSION_DENIED',
        details: [
          {
            '@type': 'type.googleapis.com/google.rpc.Help',
            links: [
              {
                description: 'Google developers console API activation',
                url: 'https://console.developers.google.com/apis/api/translate.googleapis.com/overview?project=455411330361',
              },
            ],
          },
          errorInfo,
        ],
      },
    };
    const opts = {
      auth: authStub,
      fallback: 'rest',
    };
    // @ts-ignore incomplete options
    gaxGrpc = new GrpcClient(opts);
    //@ts-ignore
    sinon.stub(nodeFetch, 'Promise').returns(
      Promise.resolve({
        ok: false,
        arrayBuffer: () => {
          return Promise.resolve(Buffer.from(JSON.stringify(serverError)));
        },
      })
    );
    gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
      echoStub.echo(requestObject, {}, {}, (err?: Error) => {
        assert(err instanceof GoogleError);
        assert.strictEqual(
          JSON.stringify(err.statusDetails),
          JSON.stringify(serverError['error']['details'])
        );
        assert.strictEqual(err.code, 7);
        assert.strictEqual(err.message, serverError['error']['message']);
        assert.strictEqual(err.reason, errorInfo.reason);
        assert.strictEqual(err.domain, errorInfo.domain);
        assert.strictEqual(
          JSON.stringify(err.errorInfoMetadata),
          JSON.stringify(errorInfo.metadata)
        );
        done();
      });
    });
  });

  it('should be able to cancel an API call using AbortController', async () => {
    // @ts-ignore
    sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({}));

    const echoStub = await gaxGrpc.createStub(echoService, stubOptions);
    const request = {content: 'content' + new Date().toString()};
    const call = echoStub.echo(request, {}, {}, () => {});

    call.cancel();

    // @ts-ignore
    assert.strictEqual(createdAbortControllers[0].abortCalled, true);
  });

  it('should have close method', done => {
    // @ts-ignore
    sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({}));
    gaxGrpc.createStub(echoService, stubOptions).then(stub => {
      stub.close({}, {}, {}, () => {});
      done();
    });
  });
});
