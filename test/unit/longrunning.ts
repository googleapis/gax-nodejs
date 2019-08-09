/* Copyright 2019 Google LLC
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

import {expect} from 'chai';
import {status} from '@grpc/grpc-js';
import * as sinon from 'sinon';

import {LongrunningDescriptor} from '../../src';
import {GaxCallPromise} from '../../src/apitypes';
import * as gax from '../../src/gax';
import {GoogleError} from '../../src/googleError';
import * as longrunning from '../../src/longRunningCalls/longrunning';
import {OperationsClient} from '../../src/operationsClient';

import * as utils from './utils';

// tslint:disable-next-line no-any
const FAKE_STATUS_CODE_1 = (utils as any).FAKE_STATUS_CODE_1;

const RESPONSE_VAL = 'response';
const RESPONSE = {
  typyeUrl: 'mock.proto.message',
  value: Buffer.from(RESPONSE_VAL),
};
const METADATA_VAL = 'metadata';
const METADATA = {
  typeUrl: 'mock.proto.Message',
  value: Buffer.from(METADATA_VAL),
};
const OPERATION_NAME = 'operation_name';
const SUCCESSFUL_OP = {
  result: 'response',
  name: OPERATION_NAME,
  metadata: METADATA,
  done: true,
  error: null,
  response: RESPONSE,
};
const PENDING_OP = {
  result: null,
  name: OPERATION_NAME,
  metadata: METADATA,
  done: false,
  error: null,
  response: null,
};
const ERROR = {
  code: FAKE_STATUS_CODE_1,
  message: 'operation error',
};
const ERROR_OP = {
  result: 'error',
  name: OPERATION_NAME,
  metadata: METADATA,
  done: true,
  error: ERROR,
  response: null,
};
const BAD_OP = {
  name: OPERATION_NAME,
  metadata: METADATA,
  done: true,
};
const mockDecoder = val => {
  return val.toString();
};

function createApiCall(func, client?) {
  const descriptor = new LongrunningDescriptor(
    client,
    mockDecoder,
    mockDecoder
  );
  return utils.createApiCall(func, {descriptor}) as GaxCallPromise;
}

interface SpyableOperationsClient extends OperationsClient {
  getOperation: sinon.SinonSpy & longrunning.Operation;
  cancelOperation: sinon.SinonSpy;
  cancelGetOperationSpy: sinon.SinonSpy;
}

describe('longrunning', () => {
  function mockOperationsClient(opts?): SpyableOperationsClient {
    opts = opts || {};
    let remainingCalls = opts.expectedCalls ? opts.expectedCalls : null;
    const cancelGetOperationSpy = sinon.spy();
    const getOperationSpy = sinon.spy(() => {
      let resolver;
      const promise = new Promise(resolve => {
        resolver = resolve;
      });
      // tslint:disable-next-line no-any
      (promise as any).cancel = cancelGetOperationSpy;

      if (remainingCalls && remainingCalls > 1) {
        resolver([PENDING_OP]);
        --remainingCalls;
      } else if (!opts.dontResolve) {
        resolver([opts.finalOperation || SUCCESSFUL_OP]);
      }
      return promise;
    });
    const cancelOperationSpy = sinon.spy(() => {
      return Promise.resolve();
    });
    return {
      getOperation: getOperationSpy,
      cancelOperation: cancelOperationSpy,
      cancelGetOperationSpy,
      // tslint:disable-next-line no-any
    } as any;
  }

  describe('createApiCall', () => {
    it('longrunning call resolves to the correct datatypes', done => {
      const func = (argument, metadata, options, callback) => {
        callback(null, PENDING_OP);
      };
      const defaultInitialRetryDelayMillis = 100;
      const defaultRetryDelayMultiplier = 1.3;
      const defaultMaxRetryDelayMillis = 60000;
      const defaultTotalTimeoutMillis = null;
      const apiCall = createApiCall(func);
      apiCall({})
        .then(responses => {
          const operation = responses[0] as longrunning.Operation;
          const rawResponse = responses[1];
          expect(operation).to.be.an('object');
          expect(operation).to.have.property('backoffSettings');
          expect(operation.backoffSettings.initialRetryDelayMillis).to.eq(
            defaultInitialRetryDelayMillis
          );
          expect(operation.backoffSettings.retryDelayMultiplier).to.eq(
            defaultRetryDelayMultiplier
          );
          expect(operation.backoffSettings.maxRetryDelayMillis).to.eq(
            defaultMaxRetryDelayMillis
          );
          expect(operation.backoffSettings.totalTimeoutMillis).to.eq(
            defaultTotalTimeoutMillis
          );
          expect(operation).to.have.property('longrunningDescriptor');
          expect(operation.name).to.deep.eq(OPERATION_NAME);
          // tslint:disable-next-line no-unused-expression
          expect(operation.done).to.be.false;
          expect(operation.latestResponse).to.deep.eq(PENDING_OP);
          // tslint:disable-next-line no-unused-expression
          expect(operation.result).to.be.null;
          expect(operation.metadata).to.deep.eq(METADATA_VAL);
          expect(rawResponse).to.deep.eq(PENDING_OP);
          done();
        })
        .catch(done);
    });
  });

  describe('operation', () => {
    it('returns an Operation with correct values', done => {
      const client = mockOperationsClient();
      const desc = new LongrunningDescriptor(
        client as OperationsClient,
        mockDecoder,
        mockDecoder
      );
      const initialRetryDelayMillis = 1;
      const retryDelayMultiplier = 2;
      const maxRetryDelayMillis = 3;
      const totalTimeoutMillis = 4;
      const unusedRpcValue = 0;
      const backoff = gax.createBackoffSettings(
        initialRetryDelayMillis,
        retryDelayMultiplier,
        maxRetryDelayMillis,
        unusedRpcValue,
        unusedRpcValue,
        unusedRpcValue,
        totalTimeoutMillis
      );
      const operation = longrunning.operation(
        (SUCCESSFUL_OP as {}) as longrunning.Operation,
        desc,
        backoff
      );
      expect(operation).to.be.an('object');
      expect(operation).to.have.property('backoffSettings');
      expect(operation.backoffSettings.initialRetryDelayMillis).to.eq(
        initialRetryDelayMillis
      );
      expect(operation.backoffSettings.retryDelayMultiplier).to.eq(
        retryDelayMultiplier
      );
      expect(operation.backoffSettings.maxRetryDelayMillis).to.eq(
        maxRetryDelayMillis
      );
      expect(operation.backoffSettings.totalTimeoutMillis).to.eq(
        totalTimeoutMillis
      );
      expect(operation).to.have.property('longrunningDescriptor');
      expect(operation.name).to.deep.eq(OPERATION_NAME);
      // tslint:disable-next-line no-unused-expression
      expect(operation.done).to.be.true;
      expect(operation.response).to.deep.eq(RESPONSE);
      expect(operation.result).to.deep.eq(RESPONSE_VAL);
      expect(operation.metadata).to.deep.eq(METADATA_VAL);
      expect(operation.latestResponse).to.deep.eq(SUCCESSFUL_OP);
      done();
    });
  });

  describe('Operation', () => {
    describe('getOperation', () => {
      it('does not make an api call if cached op is finished', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, SUCCESSFUL_OP);
        };
        const client = mockOperationsClient();
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            operation.getOperation((err, result, metadata, rawResponse) => {
              if (err) {
                done(err);
              }
              expect(result).to.deep.eq(RESPONSE_VAL);
              expect(metadata).to.deep.eq(METADATA_VAL);
              expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
              expect(client.getOperation.callCount).to.eq(0);
              done();
            });
          })
          .catch(done);
      });

      it('makes an api call to get the updated operation', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const client = mockOperationsClient();
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            operation.getOperation((err, result, metadata, rawResponse) => {
              if (err) {
                done(err);
              }
              expect(result).to.deep.eq(RESPONSE_VAL);
              expect(metadata).to.deep.eq(METADATA_VAL);
              expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
              expect(client.getOperation.callCount).to.eq(1);
              done();
            });
          })
          .catch(error => {
            done(error);
          });
      });

      it('does not return a promise when given a callback.', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const client = mockOperationsClient();
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            expect(
              operation.getOperation((err, result, metadata, rawResponse) => {
                if (err) {
                  done(err);
                }
                expect(result).to.deep.eq(RESPONSE_VAL);
                expect(metadata).to.deep.eq(METADATA_VAL);
                expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
                expect(client.getOperation.callCount).to.eq(1);
                done();
              })
              // tslint:disable-next-line no-unused-expression
            ).to.be.undefined;
          })
          .catch(error => {
            done(error);
          });
      });

      it('returns a promise that resolves to the correct data', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const client = mockOperationsClient();
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            return operation.getOperation();
          })
          .then(responses => {
            const result = responses[0];
            const metadata = responses[1];
            const rawResponse = responses[2];

            expect(result).to.deep.eq(RESPONSE_VAL);
            expect(metadata).to.deep.eq(METADATA_VAL);
            expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
            expect(client.getOperation.callCount).to.eq(1);
            done();
          })
          .catch(error => {
            done(error);
          });
      });

      it('returns a promise that rejects an operation error.', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, ERROR_OP);
        };
        const client = mockOperationsClient();
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            return operation.getOperation();
          })
          .then(() => {
            done(new Error('Should not get here.'));
          })
          .catch(error => {
            expect(error).to.be.an('error');
            done();
          });
      });

      it('uses provided promise constructor.', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };

        let called = false;
        function MockPromise(executor) {
          const promise = new Promise(executor);
          called = true;
          return promise;
        }

        const client = mockOperationsClient();
        const apiCall = createApiCall(func, client);
        // @ts-ignore incomplete options
        apiCall({}, {promise: MockPromise}).then(responses => {
          const operation = responses[0];
          operation.getOperation();
          // tslint:disable-next-line no-unused-expression
          expect(called).to.be.true;
          done();
        });
      });
    });

    describe('promise', () => {
      it('resolves to the correct data', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const expectedCalls = 3;
        const client = mockOperationsClient({expectedCalls});
        const apiCall = createApiCall(func, client);

        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            return operation.promise();
          })
          .then(responses => {
            const [result, metadata, rawResponse] = responses as Array<{}>;
            expect(result).to.deep.eq(RESPONSE_VAL);
            expect(metadata).to.deep.eq(METADATA_VAL);
            expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
            expect(client.getOperation.callCount).to.eq(expectedCalls);
            done();
          })
          .catch(err => {
            done(err);
          });
      });

      it('resolves error', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const expectedCalls = 3;
        const client = mockOperationsClient({
          expectedCalls,
          finalOperation: ERROR_OP,
        });
        const apiCall = createApiCall(func, client);

        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            return operation.promise();
          })
          .then(() => {
            done(new Error('should not get here'));
          })
          .catch(err => {
            expect(client.getOperation.callCount).to.eq(expectedCalls);
            expect(err.code).to.eq(FAKE_STATUS_CODE_1);
            expect(err.message).to.deep.eq('operation error');
            done();
          });
      });

      it('does not hang on invalid API response', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const client = mockOperationsClient({finalOperation: BAD_OP});
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            const promise = operation.promise();
            return promise;
          })
          .then(() => {
            done(new Error('Should not get here.'));
          })
          .catch(error => {
            expect(error).to.be.an('error');
            done();
          });
      });

      it('uses provided promise constructor', done => {
        const client = mockOperationsClient();
        const desc = new LongrunningDescriptor(
          client,
          mockDecoder,
          mockDecoder
        );
        const initialRetryDelayMillis = 1;
        const retryDelayMultiplier = 2;
        const maxRetryDelayMillis = 3;
        const totalTimeoutMillis = 4;
        const unusedRpcValue = 0;
        const backoff = gax.createBackoffSettings(
          initialRetryDelayMillis,
          retryDelayMultiplier,
          maxRetryDelayMillis,
          unusedRpcValue,
          unusedRpcValue,
          unusedRpcValue,
          totalTimeoutMillis
        );
        let called = false;
        function MockPromise(executor) {
          const promise = new Promise(executor);
          called = true;
          return promise;
        }
        const operation = longrunning.operation(
          (SUCCESSFUL_OP as {}) as longrunning.Operation,
          desc,
          backoff,
          {
            promise: (MockPromise as {}) as PromiseConstructor,
          }
        );
        operation.promise();
        // tslint:disable-next-line no-unused-expression
        expect(called).to.be.true;
        done();
      });
    });

    describe('cancel', () => {
      it('cancels the Operation and the current api call', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const client = mockOperationsClient({
          dontResolve: true,
        });
        const apiCall = createApiCall(func, client);

        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            const p = operation.promise();
            operation.cancel().then(() => {
              // tslint:disable-next-line no-unused-expression
              expect(client.cancelOperation.called).to.be.true;
              // tslint:disable-next-line no-unused-expression no-any
              expect((client as any).cancelGetOperationSpy.called).to.be.true;
              done();
            });
            return p;
          })
          .then(() => {
            done(new Error('should not get here'));
          })
          .catch(err => {
            done(err);
          });
      });
    });

    describe('polling', () => {
      it('succesful operation emits complete', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const expectedCalls = 3;
        const client = mockOperationsClient({
          expectedCalls,
        });
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            operation.on('complete', (result, metadata, rawResponse) => {
              expect(result).to.deep.eq(RESPONSE_VAL);
              expect(metadata).to.deep.eq(METADATA_VAL);
              expect(rawResponse).to.deep.eq(SUCCESSFUL_OP);
              expect(client.getOperation.callCount).to.eq(expectedCalls);
              done();
            });
            operation.on('error', () => {
              done('should not get here');
            });
          })
          .catch(err => {
            done(err);
          });
      });

      it('operation error emits an error', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const expectedCalls = 3;
        const client = mockOperationsClient({
          expectedCalls,
          finalOperation: ERROR_OP,
        });
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            operation.on('complete', () => {
              done(new Error('Should not get here.'));
            });
            operation.on('error', err => {
              expect(client.getOperation.callCount).to.eq(expectedCalls);
              expect(err.code).to.eq(FAKE_STATUS_CODE_1);
              expect(err.message).to.deep.eq('operation error');
              done();
            });
          })
          .catch(err => {
            done(err);
          });
      });

      it('emits progress on updated operations.', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const updatedMetadataVal = 'updated';
        const updatedMetadata = {
          typeUrl: 'mock.proto.Message',
          value: Buffer.from(updatedMetadataVal),
        };
        const updatedOp = {
          result: null,
          name: OPERATION_NAME,
          metadata: updatedMetadata,
          done: false,
          error: null,
          response: null,
        };

        const expectedCalls = 3;
        const client = mockOperationsClient({
          expectedCalls,
          finalOperation: updatedOp,
        });
        const apiCall = createApiCall(func, client);
        apiCall({})
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            operation.on('complete', () => {
              done(new Error('Should not get here.'));
            });
            operation.on('progress', (metadata, rawResponse) => {
              expect(client.getOperation.callCount).to.eq(expectedCalls);
              expect(metadata).to.deep.eq(updatedMetadataVal);
              expect(rawResponse).to.deep.eq(updatedOp);
              expect(operation.metadata).to.deep.eq(metadata);
              expect(operation.metadata).to.deep.eq(updatedMetadataVal);
              // Shows that progress only happens on updated operations since
              // this will produce a test error if done is called multiple
              // times, and the same pending operation was polled thrice.
              operation.removeAllListeners();
              done();
            });
          })
          .catch(err => {
            done(err);
          });
      });

      it('times out when polling', done => {
        const func = (argument, metadata, options, callback) => {
          callback(null, PENDING_OP);
        };
        const client = mockOperationsClient({
          finalOperation: PENDING_OP,
        });
        const apiCall = createApiCall(func, client);
        // @ts-ignore incomplete options
        apiCall(
          {},
          {
            longrunning: gax.createBackoffSettings(1, 1, 1, 0, 0, 0, 1),
          }
        )
          .then(responses => {
            const operation = responses[0] as longrunning.Operation;
            operation.on('complete', () => {
              done(new Error('Should not get here.'));
            });
            operation.on('error', err => {
              expect(err).to.be.instanceOf(GoogleError);
              expect(err!.code).to.equal(status.DEADLINE_EXCEEDED);
              expect(err!.message).to.deep.eq(
                'Total timeout exceeded before ' + 'any response was received'
              );
              done();
            });
          })
          .catch(err => {
            done(err);
          });
      });
    });
  });
});
