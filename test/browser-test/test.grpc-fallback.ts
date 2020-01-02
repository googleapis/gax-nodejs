/**
 * Copyright 2019 Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import * as assert from 'assert';
import {describe, it} from 'mocha';
import * as protobuf from 'protobufjs';
import * as fallback from '../../src/fallback';
import * as sinon from 'sinon';
import {echoProtoJson} from '../fixtures/echoProtoJson';
import {expect} from 'chai';
//@ts-ignore
import * as EchoClient from '../fixtures/google-gax-packaging-test-app/src/v1beta1/echo_client';

const statusJsonProto = require('../../protos/status.json');

const authStub = {
  getRequestHeaders() {
    return {Authorization: 'Bearer SOME_TOKEN'};
  },
};

const opts = {
  auth: authStub,
};

describe('loadProto', () => {
  it('should create a root object', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new fallback.GrpcClient(opts);
    const protos = gaxGrpc.loadProto(echoProtoJson);

    assert(protos instanceof protobuf.Root);
    assert(protos.lookupService('Echo') instanceof protobuf.Service);
    assert(protos.lookupType('EchoRequest') instanceof protobuf.Type);
  });

  it('should be able to load no files', () => {
    // @ts-ignore incomplete options
    const gaxGrpc = new fallback.GrpcClient(opts);
    const protos = gaxGrpc.loadProto({});
    assert(protos instanceof protobuf.Root);

    assert(protos.nested === undefined);
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
    // tslint:disable-next-line no-any
    const echoStub: any = await gaxGrpc.createStub(echoService, stubOptions);

    assert(echoStub instanceof protobuf.rpc.Service);

    // The stub should consist of service methods
    expect(echoStub.echo).to.be.a('Function');
    expect(echoStub.pagedExpand).to.be.a('Function');
    expect(echoStub.wait).to.be.a('Function');

    // There should be 6 methods for the echo service (and 4 other methods in the object)
    assert.strictEqual(Object.keys(echoStub).length, 10);

    // Each of the service methods should take 4 arguments (so that it works with createApiCall)
    assert.strictEqual(echoStub.echo.length, 4);
  });

  it('should support optional parameters', async () => {
    // tslint:disable-next-line no-any
    const echoStub: any = await gaxGrpc.createStub(
      echoService,
      stubExtraOptions
    );

    assert(echoStub instanceof protobuf.rpc.Service);

    // The stub should consist of methods
    expect(echoStub.echo).to.be.a('Function');
    expect(echoStub.collect).to.be.a('Function');
    expect(echoStub.chat).to.be.a('Function');

    // There should be 6 methods for the echo service (and 4 other members in the object)
    assert.strictEqual(Object.keys(echoStub).length, 10);

    // Each of the service methods should take 4 arguments (so that it works with createApiCall)
    assert.strictEqual(echoStub.echo.length, 4);
  });
});

describe('grpc-fallback', () => {
  let gaxGrpc: fallback.GrpcClient,
    protos: protobuf.NamespaceBase,
    echoService: protobuf.Service,
    stubOptions: {};
  const createdAbortControllers: string[] = [];
  // @ts-ignore
  const savedAbortController = window.AbortController;

  const authStub = {
    getRequestHeaders() {
      return {Authorization: 'Bearer SOME_TOKEN'};
    },
  };

  const opts = {
    auth: authStub,
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

    //tslint:disable-next-line variable-name
    const AbortController = function() {
      // @ts-ignore
      this.abort = function() {
        // @ts-ignore
        this.abortCalled = true;
      };
      // @ts-ignore
      createdAbortControllers.push(this);
    };

    // @ts-ignore
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
    window.AbortController = savedAbortController;
  });

  it('should make a request', async () => {
    const client = new EchoClient(opts);
    const requestObject = {content: 'test-content'};
    const responseType = protos.lookupType('EchoResponse');
    const response = responseType.create(requestObject); // request === response for EchoService
    const fakeFetch = sinon.fake.resolves({
      ok: true,
      arrayBuffer: () => {
        return Promise.resolve(responseType.encode(response).finish());
      },
    });
    sinon.replace(window, 'fetch', fakeFetch);
    const [result] = await client.echo(requestObject);
    assert.strictEqual(requestObject.content, result.content);
  });

  it('should be able to cancel an API call using AbortController', async () => {
    const fakeFetch = sinon.fake.resolves({});
    sinon.replace(window, 'fetch', fakeFetch);

    const echoStub = await gaxGrpc.createStub(echoService, stubOptions);
    const request = {content: 'content' + new Date().toString()};
    const call = echoStub.echo(request, {}, {}, (err: {}, result: {}) => {});

    call.cancel();

    // @ts-ignore
    assert.strictEqual(createdAbortControllers[0].abortCalled, true);
  });

  it('should be able to add extra headers to the request', async () => {
    const client = new EchoClient(opts);
    const requestObject = {content: 'test-content'};
    // tslint:disable-next-line no-any
    const options: any = {};
    options.otherArgs = {};
    options.otherArgs.headers = {};
    options.otherArgs.headers[
      'x-goog-request-params'
    ] = fallback.routingHeader.fromParams({
      abc: 'def',
    });
    const responseType = protos.lookupType('EchoResponse');
    const response = responseType.create(requestObject);
    const savedFetch = window.fetch;
    // @ts-ignore
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
    window.fetch = savedFetch;
  });

  it('should handle an error', done => {
    const requestObject = {content: 'test-content'};
    // example of an actual google.rpc.Status error message returned by Language API
    const expectedError = {
      code: 3,
      message: 'Error message',
      details: [],
    };

    const fakeFetch = sinon.fake.resolves({
      ok: false,
      arrayBuffer: () => {
        const root = protobuf.Root.fromJSON(statusJsonProto);
        const statusType = root.lookupType('google.rpc.Status');
        const statusMessage = statusType.fromObject(expectedError);
        return Promise.resolve(statusType.encode(statusMessage).finish());
      },
    });
    sinon.replace(window, 'fetch', fakeFetch);

    gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
      echoStub.echo(requestObject, {}, {}, (err: Error, result: {}) => {
        assert.strictEqual(err.message, JSON.stringify(expectedError));
        done();
      });
    });
  });
});
