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

/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as assert from 'assert';
import {after, afterEach, before, beforeEach, describe, it} from 'mocha';
import * as sinon from 'sinon';
import {protobuf, GoogleAuth, fallback} from 'google-gax';
import {EchoClient} from 'showcase-echo-client';
import echoProtoJson = require('showcase-echo-client/build/protos/protos.json');

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
  auth: authStub as unknown as GoogleAuth,
};

describe('loadProto', () => {
  it('should create a root object', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new fallback.GrpcClient(opts);
    const protos = gaxGrpc.loadProto(echoProtoJson);

    assert.ok(protos instanceof protobuf.Root);

    // assert(typeof protos.lookupService('Echo') === protobuf.Service.prototype);
    assert.ok(protos.lookupType('EchoRequest') instanceof protobuf.Type);
  });

  it('should be able to load no files', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new fallback.GrpcClient(opts);
    const protos = gaxGrpc.loadProto({});
    assert.ok(protos instanceof protobuf.Root);

    assert.ok(protos.nested === undefined);
    assert.strictEqual(protos.nested, undefined);
  });
});

describe('createStub', () => {
  let gaxGrpc: fallback.GrpcClient,
    protos,
    echoService: protobuf.Service,
    stubOptions: {},
    stubExtraOptions: {};

  beforeEach(() => {
    // @ts-ignore incomplete options
    gaxGrpc = new fallback.GrpcClient(opts);
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
    assert.ok(echoStub.echo instanceof Function);
    assert.ok(echoStub.pagedExpand instanceof Function);
    assert.ok(echoStub.wait instanceof Function);

    // There should be 11 methods for the echo service
    assert.strictEqual(Object.keys(echoStub).length, 11);

    // Each of the service methods should take 4 arguments (so that it works
    // with createApiCall)
    assert.strictEqual(echoStub.echo.length, 4);
  });

  it('should support optional parameters', async () => {
    const echoStub = await gaxGrpc.createStub(echoService, stubExtraOptions);

    // The stub should consist of methods
    assert.ok(echoStub.echo instanceof Function);
    assert.ok(echoStub.collect instanceof Function);
    assert.ok(echoStub.chat instanceof Function);

    // There should be 11 methods for the echo service
    assert.strictEqual(Object.keys(echoStub).length, 11);

    // Each of the service methods should take 4 arguments (so that it works
    // with createApiCall)
    assert.strictEqual(echoStub.echo.length, 4);
  });
});

describe('grpc-fallback', () => {
  let gaxGrpc: fallback.GrpcClient,
    protos: protobuf.NamespaceBase,
    echoService: protobuf.Service,
    stubOptions: {};
  const createdAbortControllers: string[] = [];
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
    auth: authStub as unknown as GoogleAuth,
    protocol: 'http',
    port: 1337,
  };

  before(() => {
    stubOptions = {
      servicePath: 'foo.example.com',
      port: 443,
    };

    // @ts-ignore incomplete options
    gaxGrpc = new fallback.GrpcClient(opts);
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

  beforeEach(() => {
    createdAbortControllers.splice(0);
  });

  afterEach(() => {
    sinon.restore();
  });

  after(() => {
    // @ts-ignore
    // eslint-disable-next-line no-undef
    window.AbortController = savedAbortController;
  });

  it('should make a request', async () => {
    const client = new EchoClient(opts);
    const requestObject = {content: 'test-content'};
    const response = requestObject; // response == request for Echo
    const fakeFetch = sinon.fake.resolves({
      ok: true,
      arrayBuffer: () => {
        return Promise.resolve(
          new TextEncoder().encode(JSON.stringify(response))
        );
      },
    });
    // eslint-disable-next-line no-undef
    sinon.replace(window, 'fetch', fakeFetch);
    const [result] = await client.echo(requestObject);
    assert.strictEqual(requestObject.content, result.content);
  });

  it('should be able to cancel an API call using AbortController', async () => {
    const fakeFetch = sinon.fake.resolves({});
    // eslint-disable-next-line no-undef
    sinon.replace(window, 'fetch', fakeFetch);

    const echoStub = await gaxGrpc.createStub(echoService, stubOptions);
    const request = {content: 'content' + new Date().toString()};
    const call = echoStub.echo(request, {}, {}, () => {});

    call.cancel();

    // @ts-ignore
    assert.strictEqual(createdAbortControllers[0].abortCalled, true);
  });

  it('should be able to add extra headers to the request', async () => {
    const client = new EchoClient(opts);
    const requestObject = {content: 'test-content'};
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const options: any = {};
    options.otherArgs = {};
    options.otherArgs.headers = {};
    options.otherArgs.headers['x-test-header'] = 'value';
    const response = requestObject;
    // eslint-disable-next-line no-undef
    const savedFetch = window.fetch;
    // @ts-ignore
    // eslint-disable-next-line no-undef
    window.fetch = (url, options) => {
      // @ts-ignore
      assert.strictEqual(options.headers['x-test-header'], 'value');
      return Promise.resolve({
        ok: true,
        arrayBuffer: () => {
          return Promise.resolve(
            new TextEncoder().encode(JSON.stringify(response))
          );
        },
      });
    };
    const [result] = await client.echo(requestObject, options);
    assert.strictEqual(requestObject.content, result.content);
    // eslint-disable-next-line no-undef
    window.fetch = savedFetch;
  });

  it('should handle an error', done => {
    const requestObject = {content: 'test-content'};
    const expectedError = Object.assign(new Error('Error message'), {
      code: 400,
      statusDetails: [],
    });

    const fakeFetch = sinon.fake.resolves({
      ok: false,
      arrayBuffer: () => {
        return Promise.resolve(
          new TextEncoder().encode(JSON.stringify(expectedError))
        );
      },
    });
    // eslint-disable-next-line no-undef
    sinon.replace(window, 'fetch', fakeFetch);

    gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
      echoStub.echo(requestObject, {}, {}, (err?: Error) => {
        assert.ok(err instanceof Error);
        done();
      });
    });
  });
});
