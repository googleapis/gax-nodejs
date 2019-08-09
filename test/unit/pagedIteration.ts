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
import * as pumpify from 'pumpify';
import * as sinon from 'sinon';
import * as streamEvents from 'stream-events';
import * as through2 from 'through2';
import {PageDescriptor} from '../../src/paginationCalls/pageDescriptor';

import * as util from './utils';

describe('paged iteration', () => {
  const pageSize = 3;
  const pagesToStream = 5;
  const descriptor = new PageDescriptor('pageToken', 'nextPageToken', 'nums');
  const retryOptions = util.createRetryOptions(0, 0, 0, 0, 0, 0, 100);
  const createOptions = {
    settings: {retry: retryOptions},
    descriptor,
  };

  function func(request, metadata, options, callback) {
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
        expect(results).to.be.an('array');
        expect(results[0]).to.deep.equal(expected);
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
      // tslint:disable-next-line no-unused-expression
      expect(err).to.be.null;
      expect(results).to.deep.equal(expected);
      done();
    });
  });

  it('returns a response when autoPaginate is false', done => {
    const apiCall = util.createApiCall(func, createOptions);
    let expected = 0;
    const req = {};
    apiCall(req, {autoPaginate: false})
      .then(response => {
        expect(response).to.be.an('array');
        expect(response[0]).to.be.an('array');
        // @ts-ignore response type
        expect(response[0].length).to.eq(pageSize);
        for (let i = 0; i < pageSize; ++i) {
          // @ts-ignore response type
          expect(response[0][i]).to.eq(expected);
          expected++;
        }
        expect(response[1]).to.be.an('object');
        expect(response[1]).to.have.property('pageToken');
        expect(response[2]).to.be.an('object');
        expect(response[2]).to.have.property('nums');
        // @ts-ignore response type
        return apiCall(response[1], {autoPaginate: false});
      })
      .then(response => {
        expect(response).to.be.an('array');
        expect(response[0]).to.be.an('array');
        expect(response[0].length).to.eq(pageSize);
        for (let i = 0; i < pageSize; ++i) {
          expect(response[0][i]).to.eq(expected);
          expected++;
        }
        done();
      })
      .catch(done);
  });

  it('sets additional arguments to the callback', done => {
    let counter = 0;
    const apiCall = util.createApiCall(func, createOptions);
    function callback(err, resources, next, rawResponse) {
      if (err) {
        done(err);
        return;
      }
      counter++;
      expect(resources).to.be.an('array');
      expect(rawResponse).to.be.an('object');
      expect(rawResponse).to.have.property('nums');
      expect(rawResponse.nums).to.eq(resources);
      if (next) {
        apiCall(next, {autoPaginate: false}, callback);
      } else {
        expect(counter).to.eq(pagesToStream + 1);
        done();
      }
    }
    apiCall({}, {autoPaginate: false}, callback);
  });

  it('retries on failure', done => {
    let callCount = 0;
    function failingFunc(request, metadata, options, callback) {
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
        expect(resources).to.be.an('array');
        // @ts-ignore response type
        expect(resources[0].length).to.eq(pageSize * pagesToStream);
        done();
      })
      .catch(done);
  });

  it('caps the results by maxResults', () => {
    const spy = sinon.spy(func);
    const apiCall = util.createApiCall(spy, createOptions);
    return apiCall({}, {maxResults: pageSize * 2 + 2}).then(response => {
      expect(response).to.be.an('array');
      expect(response[0]).to.be.an('array');
      // @ts-ignore response type
      expect(response[0].length).to.eq(pageSize * 2 + 2);
      let expected = 0;
      // @ts-ignore response type
      for (let i = 0; i < response[0].length; ++i) {
        // @ts-ignore response type
        expect(response[0][i]).to.eq(expected);
        expected++;
      }
      expect(spy.callCount).to.eq(3);
    });
  });

  describe('stream conversion', () => {
    let spy;
    let apiCall;
    beforeEach(() => {
      spy = sinon.spy(func);
      apiCall = util.createApiCall(spy, createOptions);
    });

    function streamChecker(stream, onEnd, done, start) {
      let counter = start;
      stream
        .on('data', data => {
          expect(data).to.eq(counter);
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
          expect(spy.callCount).to.eq(pagesToStream + 1);
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
          expect(spy.callCount).to.eq(2);
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
          expect(spy.callCount).to.eq(pagesToStream);
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
          expect(spy.callCount).to.eq(3);
          expect(onData.callCount).to.eq(pageSize * 2 + 2);
        },
        done,
        0
      );
    });

    it('does not call API eagerly', done => {
      // @ts-ignore incomplete options
      const stream = descriptor.createStream(apiCall, {}, null);
      setTimeout(() => {
        expect(spy.callCount).to.eq(0);
        streamChecker(
          stream,
          () => {
            expect(spy.callCount).to.eq(pagesToStream + 1);
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
        expect(spy.callCount).to.eq(pagesToStream + 1);
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
      // tslint:disable-next-line no-any
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
          expect(count).to.eq(pageSize + 1);
          expect(spy.callCount).to.eq(2);
          done();
        })
        .on('error', done);
    });
  });
});
