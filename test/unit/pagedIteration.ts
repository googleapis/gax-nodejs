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
/* eslint-disable no-prototype-builtins */

import * as assert from 'assert';
import * as pumpify from 'pumpify';
import * as sinon from 'sinon';
import * as streamEvents from 'stream-events';
import * as through2 from 'through2';
import {PageDescriptor} from '../../src/paginationCalls/pageDescriptor';
import {APICallback, GaxCall} from '../../src/apitypes';
import {describe, it, beforeEach} from 'mocha';

import * as util from './utils';
import {Stream} from 'stream';
import * as gax from '../../src/gax';

describe('paged iteration', () => {
  const pageSize = 3;
  const pagesToStream = 5;
  const descriptor = new PageDescriptor('pageToken', 'nextPageToken', 'nums');
  const retryOptions = util.createRetryOptions(0, 0, 0, 0, 0, 0, 100);
  const createOptions = {
    settings: {retry: retryOptions},
    descriptor,
  };

  function func(
    request: {pageToken?: number},
    metadata: {},
    options: {},
    callback: APICallback
  ) {
    const pageToken = request.pageToken || 0;
    if (pageToken >= pageSize * pagesToStream) {
      callback(null, {nums: []});
    } else {
      const nums = new Array(pageSize);
      for (let i = 0; i < pageSize; i++) {
        nums[i] = pageToken + i;
      }
      callback(null, {nums, nextPageToken: pageToken + pageSize});
    }
  }

  it('returns an Array of results', done => {
    const apiCall = util.createApiCall(func, createOptions);
    const expected: Array<{}> = [];
    for (let i = 0; i < pageSize * pagesToStream; ++i) {
      expected.push(i);
    }
    apiCall({}, undefined)
      .then(results => {
        assert.ok(Array.isArray(results));
        assert.deepStrictEqual(results[0], expected);
        done();
      })
      .catch(done);
  });

  it('calls callback with an Array', done => {
    const apiCall = util.createApiCall(func, createOptions);
    const expected: Array<{}> = [];
    for (let i = 0; i < pageSize * pagesToStream; ++i) {
      expected.push(i);
    }
    apiCall({}, undefined, (err, results) => {
      assert.strictEqual(err, null);
      assert.deepStrictEqual(results, expected);
      done();
    });
  });

  it('returns a response when autoPaginate is false', done => {
    const apiCall = util.createApiCall(func, createOptions);
    let expected = 0;
    const req = {};
    apiCall(req, {autoPaginate: false})
      .then(response => {
        assert.ok(Array.isArray(response));
        assert(Array.isArray(response[0]));
        // @ts-ignore response type
        assert.strictEqual(response[0].length, pageSize);
        for (let i = 0; i < pageSize; ++i) {
          // @ts-ignore response type
          assert.strictEqual(response[0][i], expected);
          expected++;
        }
        assert(response[1] instanceof Object);
        assert(response[1]!.hasOwnProperty('pageToken'));
        assert(response[2] instanceof Object);
        assert(response[2]!.hasOwnProperty('nums'));
        // @ts-ignore response type
        return apiCall(response[1], {autoPaginate: false});
      })
      .then(response => {
        assert.ok(Array.isArray(response));
        assert(Array.isArray(response[0]));
        assert.strictEqual((response[0] as Array<{}>).length, pageSize);
        for (let i = 0; i < pageSize; ++i) {
          assert.strictEqual((response[0] as Array<{}>)[i], expected);
          expected++;
        }
        done();
      })
      .catch(done);
  });

  it('sets additional arguments to the callback', done => {
    let counter = 0;
    const apiCall = util.createApiCall(func, createOptions);
    function callback(
      err: {},
      resources: {},
      next: {},
      rawResponse: {nums: {}}
    ) {
      if (err) {
        done(err);
        return;
      }
      counter++;
      assert(Array.isArray(resources));
      assert(rawResponse instanceof Object);
      // eslint-disable-next-line no-prototype-builtins
      assert(rawResponse.hasOwnProperty('nums'));
      assert.strictEqual(rawResponse.nums, resources);
      if (next) {
        apiCall(
          next,
          {autoPaginate: false},
          (callback as unknown) as APICallback
        );
      } else {
        assert.strictEqual(counter, pagesToStream + 1);
        done();
      }
    }
    apiCall({}, {autoPaginate: false}, (callback as unknown) as APICallback);
  });

  it('retries on failure', done => {
    let callCount = 0;
    function failingFunc(
      request: {},
      metadata: {},
      options: {},
      callback: APICallback
    ) {
      callCount++;
      if (callCount % 2 === 0) {
        util.fail(request, metadata, options, callback);
      } else {
        func(request, metadata, options, callback);
      }
    }
    const apiCall = util.createApiCall(failingFunc, createOptions);
    apiCall({}, undefined)
      .then(resources => {
        assert(Array.isArray(resources));
        // @ts-ignore response type
        assert.strictEqual(resources[0].length, pageSize * pagesToStream);
        done();
      })
      .catch(done);
  });

  it('caps the results by maxResults', () => {
    const spy = sinon.spy(func);
    const apiCall = util.createApiCall(spy, createOptions);
    return apiCall({}, {maxResults: pageSize * 2 + 2}).then(response => {
      assert.ok(Array.isArray(response));
      assert(Array.isArray(response[0]));
      // @ts-ignore response type
      assert.strictEqual(response[0].length, pageSize * 2 + 2);
      let expected = 0;
      // @ts-ignore response type
      for (let i = 0; i < response[0].length; ++i) {
        // @ts-ignore response type
        assert.strictEqual(response[0][i], expected);
        expected++;
      }
      assert.strictEqual(spy.callCount, 3);
    });
  });

  describe('use async iterator', () => {
    const spy = sinon.spy(func);
    let apiCall: GaxCall;
    beforeEach(() => {
      apiCall = util.createApiCall(spy, createOptions);
    });

    async function iterableChecker(iterable: AsyncIterable<{} | undefined>) {
      let counter = 0;
      const resources = [];
      for await (const resource of iterable) {
        counter++;
        resources.push(resource);
        if (counter === 10) {
          break;
        }
      }
      return resources;
    }

    it('returns an iterable, count to 10', async () => {
      const settings = new gax.CallSettings(
        (createOptions && createOptions.settings) || {}
      );
      const resources = await iterableChecker(
        descriptor.asyncIterate(apiCall, {}, settings)
      );
      assert.strictEqual(resources.length, 10);
    });
  });

  describe('stream conversion', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let spy: any;
    let apiCall: GaxCall;
    beforeEach(() => {
      spy = sinon.spy(func);
      apiCall = util.createApiCall(spy, createOptions);
    });

    function streamChecker(
      stream: Stream,
      onEnd: Function,
      done: (...args: string[]) => void,
      start: number
    ) {
      let counter = start;
      stream
        .on('data', data => {
          assert.strictEqual(data, counter);
          counter++;
        })
        .on('end', () => {
          onEnd();
          done();
        })
        .on('error', done);
    }

    it('returns a stream', done => {
      streamChecker(
        // @ts-ignore incomplete options
        descriptor.createStream(apiCall, {}, {}),
        () => {
          assert.strictEqual(spy.callCount, pagesToStream + 1);
        },
        done,
        0
      );
    });

    it('stops in the middle', done => {
      // @ts-ignore incomplete options
      const stream = descriptor.createStream(apiCall, {}, null);
      stream.on('data', data => {
        if (Number(data) === pageSize + 1) {
          stream.end();
        }
      });
      streamChecker(
        stream,
        () => {
          assert.strictEqual(spy.callCount, 2);
        },
        done,
        0
      );
    });

    it('ignores autoPaginate options, but respects others', done => {
      // Specifies autoPaginate: false, which will be ignored, and pageToken:
      // pageSize which will be used so that the stream will start from the
      // specified token.
      const options = {pageToken: pageSize, autoPaginate: false};
      streamChecker(
        // @ts-ignore incomplete options
        descriptor.createStream(apiCall, {}, options),
        () => {
          assert.strictEqual(spy.callCount, pagesToStream);
        },
        done,
        pageSize
      );
    });

    it('caps the elements by maxResults', done => {
      const onData = sinon.spy();
      const stream =
        // @ts-ignore incomplete options
        descriptor.createStream(apiCall, {}, {maxResults: pageSize * 2 + 2});
      stream.on('data', onData);
      streamChecker(
        stream,
        () => {
          assert.strictEqual(spy.callCount, 3);
          assert.strictEqual(onData.callCount, pageSize * 2 + 2);
        },
        done,
        0
      );
    });

    it('does not call API eagerly', done => {
      // @ts-ignore incomplete options
      const stream = descriptor.createStream(apiCall, {}, null);
      setTimeout(() => {
        assert.strictEqual(spy.callCount, 0);
        streamChecker(
          stream,
          () => {
            assert.strictEqual(spy.callCount, pagesToStream + 1);
          },
          done,
          0
        );
      }, 50);
    });

    it('does not start calls when it is already started', done => {
      // @ts-ignore incomplete options
      const stream = descriptor.createStream(apiCall, {}, null);
      stream.on('end', () => {
        assert.strictEqual(spy.callCount, pagesToStream + 1);
        done();
      });
      stream.resume();
      setImmediate(() => {
        stream.pause();
        stream.resume();
      });
    });

    it('cooperates with google-cloud-node usage', done => {
      let stream;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const output = streamEvents((pumpify as any).obj()) as pumpify;
      output.once('reading', () => {
        // @ts-ignore incomplete options
        stream = descriptor.createStream(apiCall, {}, null);
        output.setPipeline(stream, through2.obj());
      });
      let count = 0;
      output
        .on('data', () => {
          count++;
          if (count === pageSize + 1) {
            output.end();
          }
        })
        .on('end', () => {
          assert.strictEqual(count, pageSize + 1);
          assert.strictEqual(spy.callCount, 2);
          done();
        })
        .on('error', done);
    });
  });
});
