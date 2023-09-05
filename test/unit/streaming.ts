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
import * as sinon from 'sinon';
import {afterEach, describe, it} from 'mocha';
import {PassThrough} from 'stream';

import {GaxCallStream, GRPCCall, RequestType} from '../../src/apitypes';
import {createApiCall} from '../../src/createApiCall';
import {StreamingApiCaller} from '../../src/streamingCalls/streamingApiCaller';
import * as gax from '../../src/gax';
import {StreamDescriptor} from '../../src/streamingCalls/streamDescriptor';
import * as streaming from '../../src/streamingCalls/streaming';
import {APICallback} from '../../src/apitypes';
import * as warnings from '../../src/warnings';
import internal = require('stream');
import {StreamArrayParser} from '../../src/streamArrayParser';
import path = require('path');
import protobuf = require('protobufjs');
import {GoogleError} from '../../src';
import {Metadata} from '@grpc/grpc-js';

function createApiCallStreaming(
  func:
    | Promise<GRPCCall>
    | sinon.SinonSpy<Array<{}>, internal.Transform | StreamArrayParser>,
  type: streaming.StreamType,
  rest?: boolean,
  gaxStreamingRetries?: boolean
) {
  const settings = new gax.CallSettings();
  return createApiCall(
    //@ts-ignore
    Promise.resolve(func),
    settings,
    new StreamDescriptor(type, rest, gaxStreamingRetries)
  ) as GaxCallStream;
}

function createApiCallStreamingWithNewLogic(
  func:
    | Promise<GRPCCall>
    | sinon.SinonSpy<Array<{}>, internal.Transform | StreamArrayParser>,
  type: streaming.StreamType,
  rest?: boolean
) {
  const settings = new gax.CallSettings();
  return createApiCall(
    //@ts-ignore
    Promise.resolve(func),
    settings,
    new StreamDescriptor(type, rest, true)
  ) as GaxCallStream;
}

describe('streaming', () => {
  afterEach(() => {
    sinon.restore();
  });

  it('handles server streaming', done => {
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      s.push({resources: [1, 2]});
      s.push({resources: [3, 4, 5]});
      s.push(null);
      setImmediate(() => {
        s.emit('metadata');
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING
    );
    const s = apiCall({}, undefined);
    const callback = sinon.spy(data => {
      if (callback.callCount === 1) {
        assert.deepStrictEqual(data, {resources: [1, 2]});
      } else {
        assert.deepStrictEqual(data, {resources: [3, 4, 5]});
      }
    });
    assert.strictEqual(s.readable, true);
    assert.strictEqual(s.writable, false);
    s.on('data', callback);
    s.on('end', () => {
      assert.strictEqual(callback.callCount, 2);
      done();
    });
  });

  it('handles client streaming', done => {
    function func(metadata: {}, options: {}, callback: APICallback) {
      assert.strictEqual(arguments.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      const written: Array<{}> = [];
      s.on('end', () => {
        callback(null, written);
      });
      s.on('error', callback);
      s.on('data', data => {
        written.push(data);
      });
      return s;
    }

    const apiCall = createApiCallStreaming(
      //@ts-ignore
      func,
      streaming.StreamType.CLIENT_STREAMING
    );
    const s = apiCall({}, undefined, (err, response) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(response, ['foo', 'bar']);
      done();
    });
    assert.strictEqual(s.readable, false);
    assert.strictEqual(s.writable, true);
    s.write('foo');
    s.write('bar');
    s.end();
  });

  it('handles bidi streaming', done => {
    function func() {
      assert.strictEqual(arguments.length, 2);
      const s = new PassThrough({
        objectMode: true,
      });
      setImmediate(() => {
        s.emit('metadata');
      });
      return s;
    }

    const apiCall = createApiCallStreaming(
      //@ts-ignore
      func,
      streaming.StreamType.BIDI_STREAMING
    );
    const s = apiCall({}, undefined);
    const arg = {foo: 'bar'};
    const callback = sinon.spy(data => {
      assert.strictEqual(data, arg);
    });
    s.on('data', callback);
    s.on('end', () => {
      assert.strictEqual(callback.callCount, 2);
      done();
    });
    assert.strictEqual(s.readable, true);
    assert.strictEqual(s.writable, true);
    s.write(arg);
    s.write(arg);
    s.end();
  });

  it('forwards metadata and status', done => {
    const responseMetadata = {metadata: true};
    const status = {code: 0, metadata: responseMetadata};
    const expectedResponse = {
      code: 200,
      message: 'OK',
      details: '',
      metadata: responseMetadata,
    };
    function func() {
      const s = new PassThrough({
        objectMode: true,
      });
      setTimeout(() => {
        s.emit('metadata', responseMetadata);
      }, 10);
      s.on('finish', () => {
        s.emit('status', status);
      });
      return s;
    }
    const apiCall = createApiCallStreaming(
      //@ts-ignore
      func,
      streaming.StreamType.BIDI_STREAMING
    );
    const s = apiCall({}, undefined);
    let receivedMetadata: {};
    let receivedStatus: {};
    let receivedResponse: {};
    let finished = false;

    function check() {
      if (
        typeof receivedMetadata !== 'undefined' &&
        typeof receivedStatus !== 'undefined' &&
        typeof receivedResponse !== 'undefined' &&
        finished
      ) {
        assert.deepStrictEqual(receivedMetadata, responseMetadata);
        assert.deepStrictEqual(receivedStatus, status);
        assert.deepStrictEqual(receivedResponse, expectedResponse);
        done();
      }
    }

    // Note: in Node v15 the order of events has changed: 'status' comes after 'finish'.
    // It might be a Node bug; we'll just make sure the code works.
    s.on('metadata', data => {
      receivedMetadata = data;
      check();
    });
    s.on('status', data => {
      receivedStatus = data;
      check();
    });
    s.on('response', data => {
      receivedResponse = data;
      check();
    });
    s.on('finish', () => {
      finished = true;
      check();
    });
    assert.strictEqual(s.readable, true);
    assert.strictEqual(s.writable, true);
    setTimeout(() => {
      s.end(s);
    }, 50);
  });
  it('cancels in the middle', done => {
    const warnStub = sinon.stub(warnings, 'warn');

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function schedulePush(s: any, c: number) {
      const intervalId = setInterval(() => {
        s.push(c);
        c++;
      }, 10);
      s.on('finish', () => {
        clearInterval(intervalId);
      });
    }
    const cancelError = new Error('cancelled');
    function func() {
      const s = new PassThrough({
        objectMode: true,
      });
      schedulePush(s, 0);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (s as any).cancel = () => {
        s.end();
        s.emit('error', cancelError);
      };
      setImmediate(() => {
        s.emit('metadata');
      });
      return s;
    }
    const apiCall = createApiCallStreaming(
      //@ts-ignore
      func,
      streaming.StreamType.SERVER_STREAMING
    );
    const s = apiCall(
      {},
      {
        retry: gax.createRetryOptions([5], {
          initialRetryDelayMillis: 100,
          retryDelayMultiplier: 1.2,
          maxRetryDelayMillis: 1000,
          rpcTimeoutMultiplier: 1.5,
          maxRpcTimeoutMillis: 3000,
          maxRetries: 0,
        }),
      }
    );
    let counter = 0;
    const expectedCount = 5;
    s.on('data', data => {
      assert.strictEqual(data, counter);
      counter++;
      if (counter === expectedCount) {
        s.cancel();
      } else if (counter > expectedCount) {
        done(new Error('should not reach'));
      }
    });
    s.on('error', err => {
      assert.strictEqual(err, cancelError);
      done();
    });
    assert.strictEqual(warnStub.callCount, 1);
    assert(
      warnStub.calledWith(
        'legacy_streaming_retry_behavior',
        'Legacy streaming retry behavior will not honor settings passed at call time or via client configuration. Please set gaxStreamingRetries to true to utilize passed retry settings. gaxStreamingRetries behavior will be set to true by default in future releases.',
        'DeprecationWarning'
      )
    );
  });

  it('emit response when stream received metadata event', done => {
    const responseMetadata = {metadata: true};
    const expectedStatus = {code: 0, metadata: responseMetadata};
    const expectedResponse = {
      code: 200,
      message: 'OK',
      details: '',
      metadata: responseMetadata,
    };
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      s.push(null);
      setImmediate(() => {
        s.emit('metadata', responseMetadata);
      });
      s.on('end', () => {
        setTimeout(() => {
          s.emit('status', expectedStatus);
        }, 10);
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING
    );
    const s = apiCall({}, undefined);
    let receivedMetadata: {};
    let receivedStatus: {};
    let receivedResponse: {};
    let ended = false;

    function check() {
      if (
        typeof receivedMetadata !== 'undefined' &&
        typeof receivedStatus !== 'undefined' &&
        typeof receivedResponse !== 'undefined' &&
        ended
      ) {
        assert.deepStrictEqual(receivedMetadata, responseMetadata);
        assert.deepStrictEqual(receivedStatus, expectedStatus);
        assert.deepStrictEqual(receivedResponse, expectedResponse);
        done();
      }
    }

    const dataCallback = sinon.spy(data => {
      assert.deepStrictEqual(data, undefined);
    });
    const responseCallback = sinon.spy();
    assert.strictEqual(s.readable, true);
    assert.strictEqual(s.writable, false);
    s.on('data', dataCallback);
    s.on('metadata', data => {
      receivedMetadata = data;
      check();
    });
    s.on('response', data => {
      receivedResponse = data;
      responseCallback();
      check();
    });
    s.on('status', data => {
      receivedStatus = data;
      check();
    });
    s.on('end', () => {
      ended = true;
      check();
      assert.strictEqual(dataCallback.callCount, 0);
      assert.strictEqual(responseCallback.callCount, 1);
    });
  });

  it('emit response when stream received no metadata event', done => {
    const responseMetadata = {metadata: true};
    const expectedStatus = {code: 0, metadata: responseMetadata};
    const expectedResponse = {
      code: 200,
      message: 'OK',
      details: '',
    };
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      s.push(null);
      s.on('end', () => {
        setTimeout(() => {
          s.emit('status', expectedStatus);
        }, 10);
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING
    );
    const s = apiCall({}, undefined);
    let receivedStatus: {};
    let receivedResponse: {};
    let ended = false;

    function check() {
      if (
        typeof receivedStatus !== 'undefined' &&
        typeof receivedResponse !== 'undefined' &&
        ended
      ) {
        assert.deepStrictEqual(receivedStatus, expectedStatus);
        assert.deepStrictEqual(receivedResponse, expectedResponse);
        done();
      }
    }

    const dataCallback = sinon.spy(data => {
      assert.deepStrictEqual(data, undefined);
    });
    const responseCallback = sinon.spy();
    assert.strictEqual(s.readable, true);
    assert.strictEqual(s.writable, false);
    s.on('data', dataCallback);
    s.on('response', data => {
      receivedResponse = data;
      responseCallback();
      check();
    });
    s.on('status', data => {
      receivedStatus = data;
      check();
    });
    s.on('end', () => {
      ended = true;
      check();
      assert.strictEqual(dataCallback.callCount, 0);
      assert.strictEqual(responseCallback.callCount, 1);
    });
  });

  it('emit parsed GoogleError', done => {
    const warnStub = sinon.stub(warnings, 'warn');

    const errorInfoObj = {
      reason: 'SERVICE_DISABLED',
      domain: 'googleapis.com',
      metadata: {
        consumer: 'projects/455411330361',
        service: 'translate.googleapis.com',
      },
    };
    const errorProtoJson = require('../../protos/status.json');
    const root = protobuf.Root.fromJSON(errorProtoJson);
    const errorInfoType = root.lookupType('ErrorInfo');
    const buffer = errorInfoType.encode(errorInfoObj).finish() as Buffer;
    const any = {
      type_url: 'type.googleapis.com/google.rpc.ErrorInfo',
      value: buffer,
    };
    const status = {code: 3, message: 'test', details: [any]};
    const Status = root.lookupType('google.rpc.Status');
    const status_buffer = Status.encode(status).finish() as Buffer;
    const metadata = new Metadata();
    metadata.set('grpc-status-details-bin', status_buffer);
    const error = Object.assign(new GoogleError('test error'), {
      code: 5,
      details: 'Failed to read',
      metadata: metadata,
    });

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      s.push(null);
      setImmediate(() => {
        s.emit('error', error);
      });
      setImmediate(() => {
        s.emit('end');
      });
      return s;
    });
    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING
    );

    const s = apiCall(
      {},
      {
        retry: gax.createRetryOptions([5], {
          initialRetryDelayMillis: 100,
          retryDelayMultiplier: 1.2,
          maxRetryDelayMillis: 1000,
          rpcTimeoutMultiplier: 1.5,
          maxRpcTimeoutMillis: 3000,
          maxRetries: 0,
        }),
      }
    );

    s.on('error', err => {
      s.pause();
      s.destroy();
      assert(err instanceof GoogleError);
      assert.deepStrictEqual(err.message, 'test error');
      assert.strictEqual(err.domain, errorInfoObj.domain);
      assert.strictEqual(err.reason, errorInfoObj.reason);
      assert.strictEqual(
        JSON.stringify(err.errorInfoMetadata),
        JSON.stringify(errorInfoObj.metadata)
      );
      done();
    });
    s.on('end', () => {
      done();
    });
    assert.strictEqual(warnStub.callCount, 1);
    assert(
      warnStub.calledWith(
        'legacy_streaming_retry_behavior',
        'Legacy streaming retry behavior will not honor settings passed at call time or via client configuration. Please set gaxStreamingRetries to true to utilize passed retry settings. gaxStreamingRetries behavior will be set to true by default in future releases.',
        'DeprecationWarning'
      )
    );
  });

  it('emit error and retry once', done => {
    const firstError = Object.assign(new GoogleError('UNAVAILABLE'), {
      code: 14,
      details: 'UNAVAILABLE',
    });
    let counter = 0;
    const expectedStatus = {code: 0};
    const receivedData: string[] = [];

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      setImmediate(() => {
        s.push('Hello');
        s.push('World');
        switch (counter) {
          case 0:
            s.emit('error', firstError);
            counter++;
            break;
          case 1:
            s.push('testing');
            s.push('retries');
            s.emit('status', expectedStatus);
            counter++;
            assert.deepStrictEqual(
              receivedData.join(' '),
              'Hello World testing retries'
            );
            done();
            break;
          default:
            break;
        }
      });
      return s;
    });

    const apiCall = createApiCallStreamingWithNewLogic(
      spy,
      streaming.StreamType.SERVER_STREAMING
    );

    const s = apiCall(
      {},
      {
        retry: gax.createRetryOptions([14], {
          initialRetryDelayMillis: 100,
          retryDelayMultiplier: 1.2,
          maxRetryDelayMillis: 1000,
          rpcTimeoutMultiplier: 1.5,
          maxRpcTimeoutMillis: 3000,
          maxRetries: 1,
        }),
      }
    );
    let errorCount = 0;
    s.on('data', data => {
      receivedData.push(data);
    });
    s.on('error', err => {
      assert(err instanceof GoogleError);
      switch (errorCount) {
        case 0:
          assert.deepStrictEqual(err.message, 'UNAVAILABLE');
          assert.strictEqual(err.code, 14);
          break;
        default:
          break;
      }
      errorCount++;
    });
  });

  it('emit error and retry once with shouldRetryFn', done => {
    const firstError = Object.assign(new GoogleError('UNAVAILABLE'), {
      code: 14,
      details: 'UNAVAILABLE',
    });
    let counter = 0;
    const expectedStatus = {code: 0};
    const receivedData: string[] = [];

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      setImmediate(() => {
        s.push('Hello');
        s.push('World');
        switch (counter) {
          case 0:
            s.emit('error', firstError);
            counter++;
            break;
          case 1:
            s.push('testing');
            s.push('retries');
            s.emit('status', expectedStatus);
            counter++;
            assert.deepStrictEqual(
              receivedData.join(' '),
              'Hello World testing retries'
            );
            done();
            break;
          default:
            break;
        }
      });
      return s;
    });

    const apiCall = createApiCallStreamingWithNewLogic(
      spy,
      streaming.StreamType.SERVER_STREAMING
    );

    function retryCodesOrShouldRetryFn(error: GoogleError) {
      return [14].includes(error.code!);
    }

    const s = apiCall(
      {},
      {
        retry: gax.createRetryOptions(retryCodesOrShouldRetryFn, {
          initialRetryDelayMillis: 100,
          retryDelayMultiplier: 1.2,
          maxRetryDelayMillis: 1000,
          rpcTimeoutMultiplier: 1.5,
          maxRpcTimeoutMillis: 3000,
          maxRetries: 1,
        }),
      }
    );
    let errorCount = 0;
    s.on('data', data => {
      receivedData.push(data);
    });
    s.on('error', err => {
      assert(err instanceof GoogleError);
      switch (errorCount) {
        case 0:
          assert.deepStrictEqual(err.message, 'UNAVAILABLE');
          assert.strictEqual(err.code, 14);
          break;
        default:
          break;
      }
      errorCount++;
    });
  });
});

describe('handles server streaming retries in gax when gaxStreamingRetries is enabled', () => {
  afterEach(() => {
    sinon.restore();
  });
  it('allows custom CallOptions.retry settings with shouldRetryFn instead of retryCodes and new retry behavior', done => {
    sinon
      .stub(streaming.StreamProxy.prototype, 'forwardEventsNewImplementation')
      .callsFake((stream): any => {
        assert(stream instanceof internal.Stream);
        done();
      });
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      true //gaxStreamingRetries
    );

    apiCall(
      {},
      {
        retry: gax.createRetryOptions(
          () => {
            return true;
          },
          {
            initialRetryDelayMillis: 100,
            retryDelayMultiplier: 1.2,
            maxRetryDelayMillis: 1000,
            rpcTimeoutMultiplier: 1.5,
            maxRpcTimeoutMillis: 3000,
            totalTimeoutMillis: 4500,
          }
        ),
      }
    );
  });
  it('allows custom CallOptions.retry settings with retryCodes and new retry behavior', done => {
    sinon
      .stub(streaming.StreamProxy.prototype, 'forwardEventsNewImplementation')
      .callsFake((stream): any => {
        assert(stream instanceof internal.Stream);
        done();
      });
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      true //gaxStreamingRetries
    );

    apiCall(
      {},
      {
        retry: gax.createRetryOptions([1, 2, 3], {
          initialRetryDelayMillis: 100,
          retryDelayMultiplier: 1.2,
          maxRetryDelayMillis: 1000,
          rpcTimeoutMultiplier: 1.5,
          maxRpcTimeoutMillis: 3000,
          totalTimeoutMillis: 4500,
        }),
      }
    );
  });
  it('allows the user to pass a custom resumption strategy', done => {
    sinon
      .stub(streaming.StreamProxy.prototype, 'forwardEventsNewImplementation')
      .callsFake((stream, retry): any => {
        console.log('hello i am here', retry);
        assert(stream instanceof internal.Stream);
        assert(retry.getResumptionRequestFn instanceof Function);
        done();
      });
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      true //gaxStreamingRetries
    );

    // "resumption" strategy is to just return the original request
    const getResumptionRequestFn = (originalRequest: RequestType) => {
      return originalRequest;
    };

    apiCall(
      {},
      {
        retry: gax.createRetryOptions(
          [1, 2, 3],
          {
            initialRetryDelayMillis: 100,
            retryDelayMultiplier: 1.2,
            maxRetryDelayMillis: 1000,
            rpcTimeoutMultiplier: 1.5,
            maxRpcTimeoutMillis: 3000,
            totalTimeoutMillis: 4500,
          },
          getResumptionRequestFn
        ),
      }
    );
  });

  it('throws an error when both retryRequestoptions and retryOptions are passed at call time when new retry behavior is enabled', done => {
    //if this is reached, it means the settings merge in createAPICall did not fail properly
    sinon
      .stub(StreamingApiCaller.prototype, 'call')
      .callsFake((apiCall, argument, settings, stream) => {
        throw new Error("This shouldn't be happening");
      });

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      true // ensure we're doing the new retries
    );

    const passedRetryRequestOptions = {
      objectMode: false,
      retries: 1,
      maxRetryDelay: 70,
      retryDelayMultiplier: 3,
      totalTimeout: 650,
      noResponseRetries: 3,
      currentRetryAttempt: 0,
      shouldRetryFn: function alwaysRetry() {
        return true;
      },
    };
    // make the call with both options passed at call time
    try {
      apiCall(
        {},
        {
          retryRequestOptions: passedRetryRequestOptions,
          retry: gax.createRetryOptions([1], {
            initialRetryDelayMillis: 300,
            retryDelayMultiplier: 1.2,
            maxRetryDelayMillis: 1000,
            rpcTimeoutMultiplier: 1.5,
            maxRpcTimeoutMillis: 3000,
            totalTimeoutMillis: 4500,
          }),
        }
      );
    } catch (err) {
      assert(err instanceof Error);
      assert.strictEqual(
        err.toString(),
        'Error: Only one of retry or retryRequestOptions may be set'
      );
      done();
    }
  });
  it('throws a warning and converts retryRequestOptions for new retry behavior', done => {
    const warnStub = sinon.stub(warnings, 'warn');
    sinon
      .stub(StreamingApiCaller.prototype, 'call')
      .callsFake((apiCall, argument, settings, stream) => {
        try {
          assert(settings.retry);
          assert(typeof settings.retryRequestOptions === 'undefined');
          assert.strictEqual(
            settings.retry?.backoffSettings.maxRetryDelayMillis,
            70000
          );
          assert.strictEqual(
            settings.retry?.backoffSettings.retryDelayMultiplier,
            3
          );
          // totalTimeout is undefined because maxRetries is passed
          assert(
            typeof settings.retry?.backoffSettings.totalTimeoutMillis ===
              'undefined'
          );

          assert.strictEqual(settings.retry?.backoffSettings.maxRetries, 1);
          assert(
            typeof settings.retry.retryCodesOrShouldRetryFn === 'function'
          );
          assert(settings.retry !== new gax.CallSettings().retry);
          done();
        } catch (err) {
          done(err);
        }
      });

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      true // gaxStreamingRetries
    );
    const passedRetryRequestOptions = {
      objectMode: false,
      retries: 1,
      maxRetryDelay: 70,
      retryDelayMultiplier: 3,
      totalTimeout: 650,
      noResponseRetries: 3,
      currentRetryAttempt: 0,
      shouldRetryFn: function alwaysRetry() {
        return true;
      },
    };
    apiCall(
      {},
      {
        retryRequestOptions: passedRetryRequestOptions,
      }
    );

    assert.strictEqual(warnStub.callCount, 4);
    assert(
      warnStub.calledWith(
        'retry_request_options',
        'retryRequestOptions will be deprecated in a future release. Please use retryOptions to pass retry options at call time',
        'DeprecationWarning'
      )
    );
    assert(
      warnStub.calledWith(
        'retry_request_options',
        'noResponseRetries override is not supported. Please specify retry codes or a function to determine retry eligibility.',
        'UnsupportedParameterWarning'
      )
    );
    assert(
      warnStub.calledWith(
        'retry_request_options',
        'currentRetryAttempt override is not supported. Retry attempts are tracked internally.',
        'UnsupportedParameterWarning'
      )
    );
    assert(
      warnStub.calledWith(
        'retry_request_options',
        'objectMode override is not supported. It is set to true internally by default in gax.',
        'UnsupportedParameterWarning'
      )
    );
  });
  it('throws a warning and converts retryRequestOptions for new retry behavior - no maxRetries', done => {
    const warnStub = sinon.stub(warnings, 'warn');
    sinon
      .stub(StreamingApiCaller.prototype, 'call')
      .callsFake((apiCall, argument, settings, stream) => {
        try {
          assert(settings.retry);
          assert(typeof settings.retryRequestOptions === 'undefined');
          assert.strictEqual(
            settings.retry?.backoffSettings.maxRetryDelayMillis,
            70000
          );
          assert.strictEqual(
            settings.retry?.backoffSettings.retryDelayMultiplier,
            3
          );
          assert.strictEqual(
            settings.retry?.backoffSettings.totalTimeoutMillis,
            650000
          );
          assert(
            typeof settings.retry?.backoffSettings.maxRetries === 'undefined'
          );
          assert(
            typeof settings.retry.retryCodesOrShouldRetryFn === 'function'
          );
          assert(settings.retry !== new gax.CallSettings().retry);
          done();
        } catch (err) {
          done(err);
        }
      });

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      true // gaxStreamingRetries
    );
    const passedRetryRequestOptions = {
      objectMode: false,
      maxRetryDelay: 70,
      retryDelayMultiplier: 3,
      totalTimeout: 650,
      noResponseRetries: 3,
      currentRetryAttempt: 0,
      shouldRetryFn: function alwaysRetry() {
        return true;
      },
    };
    apiCall(
      {},
      {
        retryRequestOptions: passedRetryRequestOptions,
      }
    );

    assert.strictEqual(warnStub.callCount, 4);
    assert(
      warnStub.calledWith(
        'retry_request_options',
        'retryRequestOptions will be deprecated in a future release. Please use retryOptions to pass retry options at call time',
        'DeprecationWarning'
      )
    );
    assert(
      warnStub.calledWith(
        'retry_request_options',
        'objectMode override is not supported. It is set to true internally by default in gax.',
        'UnsupportedParameterWarning'
      )
    );
    assert(
      warnStub.calledWith(
        'retry_request_options',
        'noResponseRetries override is not supported. Please specify retry codes or a function to determine retry eligibility.',
        'UnsupportedParameterWarning'
      )
    );
    assert(
      warnStub.calledWith(
        'retry_request_options',
        'currentRetryAttempt override is not supported. Retry attempts are tracked internally.',
        'UnsupportedParameterWarning'
      )
    );
  });
});
describe('warns/errors about server streaming retry behavior when gaxStreamingRetries is disabled', () => {
  afterEach(() => {
    // restore 'call' stubs and 'warn' stubs
    sinon.restore();
  });

  // NO RETRY BEHAVIOR ENABLED
  it('throws a warning when retryRequestOptions are passed', done => {
    const warnStub = sinon.stub(warnings, 'warn');

    // this exists to help resolve createApiCall
    sinon
      .stub(StreamingApiCaller.prototype, 'call')
      .callsFake((apiCall, argument, settings, stream) => {
        done();
      });

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      false // ensure we are NOT opted into the new retry behavior
    );
    const passedRetryRequestOptions = {
      objectMode: false,
      retries: 1,
      maxRetryDelay: 70,
      retryDelayMultiplier: 3,
      totalTimeout: 650,
      noResponseRetries: 3,
      currentRetryAttempt: 0,
      shouldRetryFn: function alwaysRetry() {
        return true;
      },
    };
    // make the call with both options passed at call time
    apiCall(
      {},
      {
        retryRequestOptions: passedRetryRequestOptions,
      }
    );
    assert.strictEqual(warnStub.callCount, 1);
    assert(
      warnStub.calledWith(
        'legacy_streaming_retry_request_behavior',
        'Legacy streaming retry behavior will not honor retryRequestOptions passed at call time. Please set gaxStreamingRetries to true to utilize passed retry settings. gaxStreamingRetries behavior will convert retryRequestOptions to retry parameters by default in future releases.',
        'DeprecationWarning'
      )
    );
  });
  it('throws a warning when retry options are passed', done => {
    const warnStub = sinon.stub(warnings, 'warn');
    // this exists to help resolve createApiCall
    sinon
      .stub(StreamingApiCaller.prototype, 'call')
      .callsFake((apiCall, argument, settings, stream) => {
        done();
      });

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      false // ensure we are NOT opted into the new retry behavior
    );

    // make the call with both options passed at call time
    apiCall(
      {},
      {
        retry: gax.createRetryOptions([1], {
          initialRetryDelayMillis: 300,
          retryDelayMultiplier: 1.2,
          maxRetryDelayMillis: 1000,
          rpcTimeoutMultiplier: 1.5,
          maxRpcTimeoutMillis: 3000,
          totalTimeoutMillis: 4500,
        }),
      }
    );
    assert.strictEqual(warnStub.callCount, 1);
    assert(
      warnStub.calledWith(
        'legacy_streaming_retry_behavior',
        'Legacy streaming retry behavior will not honor settings passed at call time or via client configuration. Please set gaxStreamingRetries to true to utilize passed retry settings. gaxStreamingRetries behavior will be set to true by default in future releases.',
        'DeprecationWarning'
      )
    );
  });
  it('throws no warnings when when no retry options are passed', done => {
    const warnStub = sinon.stub(warnings, 'warn');
    // this exists to help resolve createApiCall
    sinon
      .stub(StreamingApiCaller.prototype, 'call')
      .callsFake((apiCall, argument, settings, stream) => {
        done();
      });

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      false // ensure we are NOT opted into the new retry behavior
    );

    // make the call with neither retry option passed at call time
    apiCall({}, {});
    assert.strictEqual(warnStub.callCount, 0);
  });
  it('throws two warnings when when retry and retryRequestoptions are passed', done => {
    const warnStub = sinon.stub(warnings, 'warn');
    // this exists to help resolve createApiCall
    sinon
      .stub(StreamingApiCaller.prototype, 'call')
      .callsFake((apiCall, argument, settings, stream) => {
        done();
      });

    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new PassThrough({
        objectMode: true,
      });
      return s;
    });

    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      false,
      false // ensure we are NOT opted into the new retry behavior
    );
    const passedRetryRequestOptions = {
      objectMode: false,
      retries: 1,
      maxRetryDelay: 70,
      retryDelayMultiplier: 3,
      totalTimeout: 650,
      noResponseRetries: 3,
      currentRetryAttempt: 0,
      shouldRetryFn: function alwaysRetry() {
        return true;
      },
    };
    // make the call with both retry options passed at call time
    apiCall(
      {},
      {
        retryRequestOptions: passedRetryRequestOptions,
        retry: gax.createRetryOptions([1], {
          initialRetryDelayMillis: 300,
          retryDelayMultiplier: 1.2,
          maxRetryDelayMillis: 1000,
          rpcTimeoutMultiplier: 1.5,
          maxRpcTimeoutMillis: 3000,
          totalTimeoutMillis: 4500,
        }),
      }
    );
    assert.strictEqual(warnStub.callCount, 2);
  });
});

describe('REST streaming apiCall return StreamArrayParser', () => {
  const protos_path = path.resolve(__dirname, '..', 'fixtures', 'user.proto');
  const root = protobuf.loadSync(protos_path);
  const UserService = root.lookupService('UserService');
  UserService.resolveAll();
  const streamMethod = UserService.methods['RunQuery'];
  it('forwards data, end event', done => {
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new StreamArrayParser(streamMethod);
      s.push({resources: [1, 2]});
      s.push({resources: [3, 4, 5]});
      s.push(null);
      return s;
    });
    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      true
    );
    const s = apiCall({}, undefined);
    assert.strictEqual(s.readable, true);
    assert.strictEqual(s.writable, false);
    const actualResults: Array<{resources: Array<number>}> = [];
    s.on('data', data => {
      actualResults.push(data);
    });
    s.on('end', () => {
      assert.strictEqual(
        JSON.stringify(actualResults),
        JSON.stringify([{resources: [1, 2]}, {resources: [3, 4, 5]}])
      );
      done();
    });
  });

  it('forwards error event', done => {
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = new StreamArrayParser(streamMethod);
      s.push({resources: [1, 2]});
      s.push(null);
      s.emit('error', new Error('test error'));
      return s;
    });
    const apiCall = createApiCallStreaming(
      spy,
      streaming.StreamType.SERVER_STREAMING,
      true
    );
    const s = apiCall({}, undefined);
    assert.strictEqual(s.readable, true);
    assert.strictEqual(s.writable, false);
    s.on('error', err => {
      assert(err instanceof Error);
      assert.deepStrictEqual(err.message, 'test error');
      done();
    });
    s.on('end', () => {
      done();
    });
  });
});
