import * as assert from 'assert';
import { async } from 'walkdir';
import {expect} from 'chai';
import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as through2 from 'through2';
import {GrpcClient} from '../src/browser';
import * as util from 'util';
import * as EchoClient from './fixtures/echo_client';


function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}

function mockSimpleGrpcMethod(expectedRequest, response, error?) {
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

function mockServerStreamingGrpcMethod(expectedRequest, response, error?) {
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

function mockBidiStreamingGrpcMethod(expectedRequest, response, error?) {
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

function mockLongRunningGrpcMethod(expectedRequest, response, error?) {
    return request => {
      assert.deepStrictEqual(request, expectedRequest);
      const mockOperation = {
        promise() {
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

describe('Run unit tests of echo client', () => {
    interface GoogleError extends Error {
        code: number;
    }
    const FAKE_STATUS_CODE = 1;
    const error = new Error() as GoogleError;
    error.code = FAKE_STATUS_CODE;
    const authStub = {
        getRequestHeaders() {
            return {Authorization: 'Bearer SOME_TOKEN'};
        },
    };

    describe('echo', () => {
        it('invokes echo without error', done => {
          const client = new EchoClient({
            auth: authStub,
            credentials: {client_email: 'bogus', private_key: 'bogus'},
            projectId: 'bogus',
          });
  
          // Mock request
          const request = {};
  
          // Mock response
          const content = 'content951530617';
          const expectedResponse = {
            content,
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
          const client = new EchoClient({
            auth: authStub,
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
          const client = new EchoClient({
            auth: authStub,
            credentials: {client_email: 'bogus', private_key: 'bogus'},
            projectId: 'bogus',
          });
  
          // Mock request
          const request = {};
  
          // Mock response
          const content = 'content951530617';
          const expectedResponse = {
            content,
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
          const client = new EchoClient({
            auth: authStub,
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
          const client = new EchoClient({
            auth: authStub,
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
            nextPageToken,
            responses,
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
          const client = new EchoClient({
            auth: authStub,
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
          const client = new EchoClient({
            auth: authStub,
            credentials: {client_email: 'bogus', private_key: 'bogus'},
            projectId: 'bogus',
          });
  
          // Mock request
          const request = {};
  
          // Mock response
          const content = 'content951530617';
          const expectedResponse = {
            content,
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
          const client = new EchoClient({
            auth: authStub,
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
          const client = new EchoClient({
            auth: authStub,
            credentials: {client_email: 'bogus', private_key: 'bogus'},
            projectId: 'bogus',
          });
  
          // Mock request
          const request = {};
  
          // Mock response
          const content = 'content951530617';
          const expectedResponse = {
            content,
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
          const client = new EchoClient({
            auth: authStub,
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
          const client = new EchoClient({
            auth: authStub,
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

describe('Run tests against gRPC server', () => {
    const authStub = {
        getRequestHeaders() {
        return {Authorization: 'Bearer SOME_TOKEN'};
        },
      };
    
    const opts = {
          auth: authStub,
    };

    const client = new EchoClient(opts);

    before(async function () {
        this.timeout(30000);
        console.log('before block started');
        const request = {
            content: 'test',
        };
        
        await sleep(5000);
        const MAX_RETRIES = 20;
        const TIMEOUT = 1000;

        // for (let retryCount = 0; retryCount < MAX_RETRIES; ++retryCount) {
        //     console.log('attempt #', retryCount);
        //     try {
        //         await client.echo(request);
        //     }
        //     catch (err) {
        //         console.log('Still waiting for server...');
        //         console.log(err);
        //         await sleep(TIMEOUT);
        //         continue;
        //     }
        //     console.log('Server is up and running');
        //     break;
        // }
    });

    it('should be able to call simple RPC methods', async function() {
        const request = {
            content: 'test',
        };
        const [response] = await client.echo(request);
        assert.deepStrictEqual(request.content, response.content);
    });

    it('should throw an error when calling server-side streaming calls', async function() {
        const words = ['nobody', 'ever', 'reads', 'test', 'input'];
        const request = {
          content: words.join(' '),
        };
    
        expect( function() {
          client.expand(request);
        }).to.throw();
    });

    it('should be able to call paging calls', async function() {
        const words = ['nobody', 'ever', 'reads', 'test', 'input'];
        const request = {
          content: words.join(' '),
          pageSize: 2,
        };
        const [response] = await client.pagedExpand(request);
        const result = response.map(r => r.content);
        assert.deepStrictEqual(words, result);
    });

    it('should throw an error when calling client-side streaming calls', async function() {
        const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  
        expect( function() {
          client.collect();
        }).to.throw();
    });

    it('should throw an error when calling bi-direction streaming calls', async function() {
        const words = [
            'nobody',
            'ever',
            'reads',
            'test',
            'input',
            'especially',
            'this',
            'one',
          ];
        
          expect( function() {
            client.chat();
          }).to.throw();
    });

    it('should be able to call long-running calls', async function() {
        // LRO is being tested here, which takes at least 5000ms to finish running
        this.timeout(60000);
        const request = {
            ttl: {
              seconds: 5,
              nanos: 0,
            },
            success: {
              content: 'done',
            },
          };
          const [operation] = await client.wait(request);
          const [response] = await operation.promise();
          assert.deepStrictEqual(response.content, request.success.content);
    });

    after(async () => {

    });

});




