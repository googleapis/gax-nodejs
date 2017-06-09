/* Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
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

/* jshint expr: true*/

'use strict';

var gax = require('../lib/gax');
var longrunning = require('../lib/longrunning');
var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('./utils');

var FAKE_STATUS_CODE_1 = utils.FAKE_STATUS_CODE_1;

function createBuffer(str) {
  var buffer;
  try {
    buffer = Buffer.from(str);
  } catch (_) {
    buffer = new Buffer(str);
  }
  return buffer;
}

var RESPONSE_VAL = 'response';
var RESPONSE = {
  typyeUrl: 'mock.proto.message',
  value: createBuffer(RESPONSE_VAL)
};
var METADATA_VAL = 'metadata';
var METADATA = {
  typeUrl: 'mock.proto.Message',
  value: createBuffer(METADATA_VAL)
};
var OPERATION_NAME = 'operation_name';
var SUCCESSFUL_OP = {
  result: 'response',
  name: OPERATION_NAME,
  metadata: METADATA,
  done: true,
  error: null,
  response: RESPONSE
};
var PENDING_OP = {
  result: null,
  name: OPERATION_NAME,
  metadata: METADATA,
  done: false,
  error: null,
  response: null
};
var ERROR = {
  code: FAKE_STATUS_CODE_1,
  message: 'operation error'
};
var ERROR_OP = {
  result: 'error',
  name: OPERATION_NAME,
  metadata: METADATA,
  done: true,
  error: ERROR,
  response: null
};
var mockDecoder = function(val) { return val.toString(); };

function createApiCall(func, client) {
  var descriptor = new longrunning.LongrunningDescriptor(
        client, mockDecoder, mockDecoder);
  return utils.createApiCall(func, {descriptor: descriptor});
}

describe('longrunning', function() {
  function mockOperationsClient(opts) {
    opts = opts || {};
    var remainingCalls = opts.expectedCalls ? opts.expectedCalls : null;
    var cancelGetOperationSpy = sinon.spy();
    var getOperationSpy = sinon.spy(function() {
      var resolver;
      var promise = new Promise(function(resolve, reject) {
        resolver = resolve;
      });
      promise.cancel = cancelGetOperationSpy;

      if (remainingCalls && remainingCalls > 1) {
        resolver([PENDING_OP]);
        --remainingCalls;
      } else if (!opts.dontResolve) {
        resolver([opts.finalOperation || SUCCESSFUL_OP]);
      }
      return promise;
    });
    var cancelOperationSpy = sinon.spy(function(request) {
      return Promise.resolve();
    });
    return {
      getOperation: getOperationSpy,
      cancelOperation: cancelOperationSpy,
      cancelGetOperationSpy: cancelGetOperationSpy
    };
  }

  describe('createApiCall', function() {
    it('longrunning call resolves to the correct datatypes', function(done) {
      var func = function(argument, metadata, options, callback) {
        callback(null, PENDING_OP);
      };
      var defaultInitialRetryDelayMillis = 100;
      var defaultRetryDelayMultiplier = 1.3;
      var defaultMaxRetryDelayMillis = 60000;
      var defaultTotalTimeoutMillis = null;
      var apiCall = createApiCall(func);
      apiCall().then(function(responses) {
        var operation = responses[0];
        var rawResponse = responses[1];
        expect(operation).to.be.an('object');
        expect(operation).to.have.property('backoffSettings');
        expect(operation.backoffSettings.initialRetryDelayMillis)
          .to.eq(defaultInitialRetryDelayMillis);
        expect(operation.backoffSettings.retryDelayMultiplier)
          .to.eq(defaultRetryDelayMultiplier);
        expect(operation.backoffSettings.maxRetryDelayMillis)
          .to.eq(defaultMaxRetryDelayMillis);
        expect(operation.backoffSettings.totalTimeoutMillis)
          .to.eq(defaultTotalTimeoutMillis);
        expect(operation).to.have.property('longrunningDescriptor');
        expect(operation.latestResponse).to.deep.eq(PENDING_OP);
        expect(operation.result).to.be.null;
        expect(operation.metadata).to.deep.eq(METADATA_VAL);
        expect(rawResponse).to.deep.eq(PENDING_OP);
        done();
      }).catch(function(error) {
        done(error);
      });
    });
  });

  describe('operation', function() {
    it('returns an Operation with correct values', function(done) {
      var client = mockOperationsClient();
      var desc = new longrunning.LongrunningDescriptor(
        client, mockDecoder, mockDecoder);
      var initialRetryDelayMillis = 1;
      var retryDelayMultiplier = 2;
      var maxRetryDelayMillis = 3;
      var totalTimeoutMillis = 4;
      var unusedRpcValue = 0;
      var backoff = gax.createBackoffSettings(
        initialRetryDelayMillis,
        retryDelayMultiplier,
        maxRetryDelayMillis,
        unusedRpcValue,
        unusedRpcValue,
        unusedRpcValue,
        totalTimeoutMillis);
      var operation = longrunning.operation(SUCCESSFUL_OP, desc, backoff);
      expect(operation).to.be.an('object');
      expect(operation).to.have.property('backoffSettings');
      expect(operation.backoffSettings.initialRetryDelayMillis)
        .to.eq(initialRetryDelayMillis);
      expect(operation.backoffSettings.retryDelayMultiplier)
        .to.eq(retryDelayMultiplier);
      expect(operation.backoffSettings.maxRetryDelayMillis)
        .to.eq(maxRetryDelayMillis);
      expect(operation.backoffSettings.totalTimeoutMillis)
        .to.eq(totalTimeoutMillis);
      expect(operation).to.have.property('longrunningDescriptor');
      expect(operation.result).to.deep.eq(RESPONSE_VAL);
      expect(operation.metadata).to.deep.eq(METADATA_VAL);
      expect(operation.latestResponse).to.deep.eq(SUCCESSFUL_OP);
      done();
    });
  });

  describe('Operation', function() {
    describe('getOperation', function() {
      it('does not make an api call if cached op is finished', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, SUCCESSFUL_OP);
        };
        var client = mockOperationsClient();
        var apiCall = createApiCall(func, client);
        apiCall().then(function(responses) {
          var operation = responses[0];
          operation.getOperation(function(err, result, metadata, rawResponse) {
            if (err) {
              done(err);
            }
            expect(result).to.deep.eq(RESPONSE_VAL);
            expect(metadata).to.deep.eq(METADATA_VAL);
            expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
            expect(client.getOperation.callCount).to.eq(0);
            done();
          });
        }).catch(function(error) {
          done(error);
        });
      });

      it('makes an api call to get the updated operation', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var client = mockOperationsClient();
        var apiCall = createApiCall(func, client);
        apiCall().then(function(responses) {
          var operation = responses[0];
          operation.getOperation(function(err, result, metadata, rawResponse) {
            if (err) {
              done(err);
            }
            expect(result).to.deep.eq(RESPONSE_VAL);
            expect(metadata).to.deep.eq(METADATA_VAL);
            expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
            expect(client.getOperation.callCount).to.eq(1);
            done();
          });
        }).catch(function(error) {
          done(error);
        });
      });

      it('does not return a promise when given a callback.', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var client = mockOperationsClient();
        var apiCall = createApiCall(func, client);
        apiCall().then(function(responses) {
          var operation = responses[0];
          expect(operation.getOperation(
            function(err, result, metadata, rawResponse) {
              if (err) {
                done(err);
              }
              expect(result).to.deep.eq(RESPONSE_VAL);
              expect(metadata).to.deep.eq(METADATA_VAL);
              expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
              expect(client.getOperation.callCount).to.eq(1);
              done();
            })).to.be.undefined;
        }).catch(function(error) {
          done(error);
        });
      });

      it('returns a promise that resolves to the correct data', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var client = mockOperationsClient();
        var apiCall = createApiCall(func, client);
        apiCall().then(function(responses) {
          var operation = responses[0];
          return operation.getOperation();
        }).then(function(responses) {
          var result = responses[0];
          var metadata = responses[1];
          var rawResponse = responses[2];

          expect(result).to.deep.eq(RESPONSE_VAL);
          expect(metadata).to.deep.eq(METADATA_VAL);
          expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
          expect(client.getOperation.callCount).to.eq(1);
          done();
        }).catch(function(error) {
          done(error);
        });
      });

      it('returns a promise that rejects an operation error.', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, ERROR_OP);
        };
        var client = mockOperationsClient();
        var apiCall = createApiCall(func, client);
        apiCall().then(function(responses) {
          var operation = responses[0];
          return operation.getOperation();
        }).then(function(responses) {
          done(new Error('Should not get here.'));
        }).catch(function(error) {
          expect(error).to.be.an('error');
          done();
        });
      });

      it('uses provided promise constructor.', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };

        var called = false;
        function MockPromise(executor) {
          var promise = new Promise(executor);
          called = true;
          return promise;
        }

        var client = mockOperationsClient();
        var apiCall = createApiCall(func, client);
        apiCall(null, {promise: MockPromise}).then(function(responses) {
          var operation = responses[0];
          operation.getOperation();
          expect(called).to.be.true;
          done();
        });
      });
    });

    describe('promise', function() {
      it('resolves to the correct data', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var expectedCalls = 3;
        var client = mockOperationsClient({expectedCalls: expectedCalls});
        var apiCall = createApiCall(func, client);

        apiCall().then(function(responses) {
          var operation = responses[0];
          return operation.promise();
        }).then(function(responses) {
          var result = responses[0];
          var metadata = responses[1];
          var rawResponse = responses[2];
          expect(result).to.deep.eq(RESPONSE_VAL);
          expect(metadata).to.deep.eq(METADATA_VAL);
          expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
          expect(client.getOperation.callCount).to.eq(expectedCalls);
          done();
        }).catch(function(err) {
          done(err);
        });
      });

      it('resolves error', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var expectedCalls = 3;
        var client = mockOperationsClient({
          expectedCalls: expectedCalls,
          finalOperation: ERROR_OP
        });
        var apiCall = createApiCall(func, client);

        apiCall().then(function(responses) {
          var operation = responses[0];
          return operation.promise();
        }).then(function(responses) {
          done(new Error('should not get here'));
        }).catch(function(err) {
          expect(client.getOperation.callCount).to.eq(expectedCalls);
          expect(err.code).to.eq(FAKE_STATUS_CODE_1);
          expect(err.message).to.deep.eq('operation error');
          done();
        });
      });

      it('uses provided promise constructor', function(done) {
        var client = mockOperationsClient();
        var desc = new longrunning.LongrunningDescriptor(
          client, mockDecoder, mockDecoder);
        var initialRetryDelayMillis = 1;
        var retryDelayMultiplier = 2;
        var maxRetryDelayMillis = 3;
        var totalTimeoutMillis = 4;
        var unusedRpcValue = 0;
        var backoff = gax.createBackoffSettings(
          initialRetryDelayMillis,
          retryDelayMultiplier,
          maxRetryDelayMillis,
          unusedRpcValue,
          unusedRpcValue,
          unusedRpcValue,
          totalTimeoutMillis);
        var called = false;
        function MockPromise(executor) {
          var promise = new Promise(executor);
          called = true;
          return promise;
        }
        var operation = longrunning.operation(
          SUCCESSFUL_OP, desc, backoff, {promise: MockPromise});
        operation.promise();
        expect(called).to.be.true;
        done();
      });
    });

    describe('cancel', function() {
      it('cancels the Operation and the current api call', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var client = mockOperationsClient({
          dontResolve: true
        });
        var apiCall = createApiCall(func, client);

        apiCall().then(function(responses) {
          var operation = responses[0];
          var p = operation.promise();
          operation.cancel().then(function() {
            expect(client.cancelOperation.called).to.be.true;
            expect(client.cancelGetOperationSpy.called).to.be.true;
            done();
          });
          return p;
        }).then(function(responses) {
          done(new Error('should not get here'));
        }).catch(function(err) {
          done(err);
        });
      });
    });

    describe('polling', function() {
      it('succesful operation emits complete', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var expectedCalls = 3;
        var client = mockOperationsClient({
          expectedCalls: expectedCalls
        });
        var apiCall = createApiCall(func, client);
        apiCall().then(function(responses) {
          var operation = responses[0];
          operation.on('complete', function(result, metadata, rawResponse) {
            expect(result).to.deep.eq(RESPONSE_VAL);
            expect(metadata).to.deep.eq(METADATA_VAL);
            expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
            expect(client.getOperation.callCount).to.eq(expectedCalls);
            done();
          });
          operation.on('error', function(err) {
            done('should not get here');
          });
        }).catch(function(err) {
          done(err);
        });
      });

      it('operation error emits an error', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var expectedCalls = 3;
        var client = mockOperationsClient({
          expectedCalls: expectedCalls,
          finalOperation: ERROR_OP
        });
        var apiCall = createApiCall(func, client);
        apiCall().then(function(responses) {
          var operation = responses[0];
          operation.on('complete', function(result, metadata, rawResponse) {
            done(new Error('Should not get here.'));
          });
          operation.on('error', function(err) {
            expect(client.getOperation.callCount).to.eq(expectedCalls);
            expect(err.code).to.eq(FAKE_STATUS_CODE_1);
            expect(err.message).to.deep.eq('operation error');
            done();
          });
        }).catch(function(err) {
          done(err);
        });
      });

      it('emits progress on updated operations.', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var updatedMetadataVal = 'updated';
        var updatedMetadata = {
          typeUrl: 'mock.proto.Message',
          value: createBuffer(updatedMetadataVal)
        };
        var updatedOp = {
          result: null,
          name: OPERATION_NAME,
          metadata: updatedMetadata,
          done: false,
          error: null,
          response: null
        };

        var expectedCalls = 3;
        var client = mockOperationsClient({
          expectedCalls: expectedCalls,
          finalOperation: updatedOp
        });
        var apiCall = createApiCall(func, client);
        apiCall().then(function(responses) {
          var operation = responses[0];
          operation.on('complete', function() {
            done(new Error('Should not get here.'));
          });
          operation.on('progress', function(metadata, rawResponse) {
            expect(client.getOperation.callCount).to.eq(expectedCalls);
            expect(metadata).to.deep.eq(updatedMetadataVal);
            expect(rawResponse).to.deep.eq(updatedOp);
            expect(operation.metadata).to.deep.eq(metadata);
            expect(operation.metadata).to.deep.eq(updatedMetadataVal);
            // Shows that progress only happens on updated operations since this
            // will produce a test error if done is called multiple times,
            // and the same pending operation was polled thrice.
            done();
          });
        }).catch(function(err) {
          done(err);
        });
      });

      it('times out when polling', function(done) {
        var func = function(argument, metadata, options, callback) {
          callback(null, PENDING_OP);
        };
        var client = mockOperationsClient({
          finalOperation: PENDING_OP
        });
        var apiCall = createApiCall(func, client);
        apiCall(null, {
          longrunning: gax.createBackoffSettings(1, 1, 1, 0, 0, 0, 1)
        }).then(function(responses) {
          var operation = responses[0];
          operation.on('complete', function(result, metadata, rawResponse) {
            done(new Error('Should not get here.'));
          });
          operation.on('error', function(err) {
            expect(err.message).to.deep.eq('Total timeout exceeded before ' +
                'any response was received');
            done();
          });
        }).catch(function(err) {
          done(err);
        });
      });
    });
  });
});
