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

import * as assert from 'assert';
import * as sinon from 'sinon';
import * as through2 from 'through2';
import {describe, it} from 'mocha';

import {GaxCallStream, GRPCCall} from '../../src/apitypes';
import {createApiCall} from '../../src/createApiCall';
import * as gax from '../../src/gax';
import {StreamDescriptor} from '../../src/streamingCalls/streamDescriptor';
import * as streaming from '../../src/streamingCalls/streaming';
import {APICallback} from '../../src/apitypes';
import internal = require('stream');

function createApiCallStreaming(
  func: Promise<GRPCCall> | sinon.SinonSpy<Array<{}>, internal.Transform>,
  type: streaming.StreamType
) {
  const settings = new gax.CallSettings();
  return createApiCall(
    //@ts-ignore
    Promise.resolve(func),
    settings,
    new StreamDescriptor(type)
  ) as GaxCallStream;
}

describe('streaming', () => {
  it('handles server streaming', done => {
    const spy = sinon.spy((...args: Array<{}>) => {
      assert.strictEqual(args.length, 3);
      const s = through2.obj();
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
      const s = through2.obj();
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
      const s = through2.obj();
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
      const s = through2.obj();
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
    s.on('metadata', data => {
      receivedMetadata = data;
    });
    s.on('status', data => {
      receivedStatus = data;
    });
    s.on('response', data => {
      receivedResponse = data;
    });
    s.on('finish', () => {
      assert.deepStrictEqual(receivedMetadata, responseMetadata);
      assert.deepStrictEqual(receivedStatus, status);
      assert.deepStrictEqual(receivedResponse, expectedResponse);
      done();
    });
    assert.strictEqual(s.readable, true);
    assert.strictEqual(s.writable, true);
    setTimeout(() => {
      s.end(s);
    }, 50);
  });

  it('cancels in the middle', done => {
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
      const s = through2.obj();
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
    const s = apiCall({}, undefined);
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
  });
});
