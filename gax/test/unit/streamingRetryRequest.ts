// Copyright 2023 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
/* eslint-disable @typescript-eslint/ban-ts-comment */

import * as assert from 'assert';
import * as sinon from 'sinon';
import {describe, it} from 'mocha';
import {PassThrough} from 'stream';

import {CancellableStream, GaxCallStream, GRPCCall} from '../../src/apitypes';
import {createApiCall} from '../../src/createApiCall';
import * as gax from '../../src/gax';
import {StreamDescriptor} from '../../src/streamingCalls/streamDescriptor';
import * as streaming from '../../src/streamingCalls/streaming';
import internal = require('stream');
import {StreamArrayParser} from '../../src/streamArrayParser';
import {streamingRetryRequest} from '../../src/streamingRetryRequest';

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

describe('retry-request', () => {
  describe('streams', () => {
    it('works with defaults in a stream', done => {
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
        streaming.StreamType.SERVER_STREAMING,
        false,
        true
      );

      const retryStream = streamingRetryRequest({
        request: () => {
          const stream = apiCall(
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
          ) as CancellableStream;
          return stream;
        },
      })
        .on('end', done())
        .on('data', (data: any) => {
          console.log(data);
        });
      assert.strictEqual(retryStream._readableState.objectMode, true);
    });

    it('throws request error', done => {
      try {
        const opts = {};
        streamingRetryRequest(opts);
      } catch (err) {
        assert(err instanceof Error);
        assert.match(err.message, /A request library must be provided/);
        done();
      }
    });
  });
});
