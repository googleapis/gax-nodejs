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

'use strict';

const assert = require('assert');
const {describe, it} = require('mocha');
const through2 = require('through2');

const showcaseModule = require('../src');

const FAKE_STATUS_CODE = 1;
const error = new Error();
error.code = FAKE_STATUS_CODE;

describe('EchoClient', () => {
  describe('echo', () => {
    it('invokes echo without error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock response
      const content = 'content951530617';
      const expectedResponse = {
        content: content,
      };

      // Mock Grpc layer
      client._innerApiCalls.echo = mockSimpleGrpcMethod(
        request,
        expectedResponse
      );

      client.echo(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
    });

    it('invokes echo with error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock Grpc layer
      client._innerApiCalls.echo = mockSimpleGrpcMethod(request, null, error);

      client.echo(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('expand', () => {
    it('invokes expand without error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock response
      const content = 'content951530617';
      const expectedResponse = {
        content: content,
      };

      // Mock Grpc layer
      client._innerApiCalls.expand = mockServerStreamingGrpcMethod(
        request,
        expectedResponse
      );

      const stream = client.expand(request);
      stream.on('data', response => {
        assert.deepStrictEqual(response, expectedResponse);
        done();
      });
      stream.on('error', err => {
        done(err);
      });

      stream.write();
    });

    it('invokes expand with error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock Grpc layer
      client._innerApiCalls.expand = mockServerStreamingGrpcMethod(
        request,
        null,
        error
      );

      const stream = client.expand(request);
      stream.on('data', () => {
        assert.fail();
      });
      stream.on('error', err => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        done();
      });

      stream.write();
    });
  });

  describe('pagedExpand', () => {
    it('invokes pagedExpand without error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock response
      const nextPageToken = '';
      const responsesElement = {};
      const responses = [responsesElement];
      const expectedResponse = {
        nextPageToken: nextPageToken,
        responses: responses,
      };

      // Mock Grpc layer
      client._innerApiCalls.pagedExpand = (
        actualRequest,
        options,
        callback
      ) => {
        assert.deepStrictEqual(actualRequest, request);
        callback(null, expectedResponse.responses);
      };

      client.pagedExpand(request, (err, response) => {
        assert.ifError(err);
        assert.deepStrictEqual(response, expectedResponse.responses);
        done();
      });
    });

    it('invokes pagedExpand with error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock Grpc layer
      client._innerApiCalls.pagedExpand = mockSimpleGrpcMethod(
        request,
        null,
        error
      );

      client.pagedExpand(request, (err, response) => {
        assert(err instanceof Error);
        assert.strictEqual(err.code, FAKE_STATUS_CODE);
        assert(typeof response === 'undefined');
        done();
      });
    });
  });

  describe('chat', () => {
    it('invokes chat without error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock response
      const content = 'content951530617';
      const expectedResponse = {
        content: content,
      };

      // Mock Grpc layer
      client._innerApiCalls.chat = mockBidiStreamingGrpcMethod(
        request,
        expectedResponse
      );

      const stream = client
        .chat()
        .on('data', response => {
          assert.deepStrictEqual(response, expectedResponse);
          done();
        })
        .on('error', err => {
          done(err);
        });

      stream.write(request);
    });

    it('invokes chat with error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock Grpc layer
      client._innerApiCalls.chat = mockBidiStreamingGrpcMethod(
        request,
        null,
        error
      );

      const stream = client
        .chat()
        .on('data', () => {
          assert.fail();
        })
        .on('error', err => {
          assert(err instanceof Error);
          assert.strictEqual(err.code, FAKE_STATUS_CODE);
          done();
        });

      stream.write(request);
    });
  });

  describe('wait', function() {
    it('invokes wait without error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock response
      const content = 'content951530617';
      const expectedResponse = {
        content: content,
      };

      // Mock Grpc layer
      client._innerApiCalls.wait = mockLongRunningGrpcMethod(
        request,
        expectedResponse
      );

      client
        .wait(request)
        .then(responses => {
          const operation = responses[0];
          return operation.promise();
        })
        .then(responses => {
          assert.deepStrictEqual(responses[0], expectedResponse);
          done();
        })
        .catch(err => {
          done(err);
        });
    });

    it('invokes wait with error', done => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });

      // Mock request
      const request = {};

      // Mock Grpc layer
      client._innerApiCalls.wait = mockLongRunningGrpcMethod(
        request,
        null,
        error
      );

      client
        .wait(request)
        .then(responses => {
          const operation = responses[0];
          return operation.promise();
        })
        .then(() => {
          assert.fail();
        })
        .catch(err => {
          assert(err instanceof Error);
          assert.strictEqual(err.code, FAKE_STATUS_CODE);
          done();
        });
    });

    it('has longrunning decoder functions', () => {
      const client = new showcaseModule.v1beta1.EchoClient({
        credentials: {client_email: 'bogus', private_key: 'bogus'},
        projectId: 'bogus',
      });
      assert(
        client._descriptors.longrunning.wait.responseDecoder instanceof Function
      );
      assert(
        client._descriptors.longrunning.wait.metadataDecoder instanceof Function
      );
    });
  });
});

function mockSimpleGrpcMethod(expectedRequest, response, error) {
  return function(actualRequest, options, callback) {
    assert.deepStrictEqual(actualRequest, expectedRequest);
    if (error) {
      callback(error);
    } else if (response) {
      callback(null, response);
    } else {
      callback(null);
    }
  };
}

function mockServerStreamingGrpcMethod(expectedRequest, response, error) {
  return actualRequest => {
    assert.deepStrictEqual(actualRequest, expectedRequest);
    const mockStream = through2.obj((chunk, enc, callback) => {
      if (error) {
        callback(error);
      } else {
        callback(null, response);
      }
    });
    return mockStream;
  };
}

function mockBidiStreamingGrpcMethod(expectedRequest, response, error) {
  return () => {
    const mockStream = through2.obj((chunk, enc, callback) => {
      assert.deepStrictEqual(chunk, expectedRequest);
      if (error) {
        callback(error);
      } else {
        callback(null, response);
      }
    });
    return mockStream;
  };
}

function mockLongRunningGrpcMethod(expectedRequest, response, error) {
  return request => {
    assert.deepStrictEqual(request, expectedRequest);
    const mockOperation = {
      promise: function() {
        return new Promise((resolve, reject) => {
          if (error) {
            reject(error);
          } else {
            resolve([response]);
          }
        });
      },
    };
    return Promise.resolve([mockOperation]);
  };
}
