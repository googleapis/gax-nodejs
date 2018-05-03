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

const util = require('./utils');
const {PageDescriptor} = require('../src/paged_iteration');
import {expect} from 'chai';
import * as pumpify from 'pumpify';
import * as sinon from 'sinon';
import * as streamEvents from 'stream-events';
import * as through2 from 'through2';

describe('paged iteration', function() {
  var pageSize = 3;
  var pagesToStream = 5;
  var descriptor = new PageDescriptor('pageToken', 'nextPageToken', 'nums');
  var retryOptions = util.createRetryOptions(0, 0, 0, 0, 0, 0, 100);
  var createOptions = {
    settings: {retry: retryOptions},
    descriptor: descriptor,
  };

  function func(request, metadata, options, callback) {
    var pageToken = request.pageToken || 0;
    if (pageToken >= pageSize * pagesToStream) {
      callback(null, {nums: []});
    } else {
      var nums = new Array(pageSize);
      for (var i = 0; i < pageSize; i++) {
        nums[i] = pageToken + i;
      }
      callback(null, {nums: nums, nextPageToken: pageToken + pageSize});
    }
  }

  it('returns an Array of results', function(done) {
    var apiCall = util.createApiCall(func, createOptions);
    var expected: any[] = [];
    for (var i = 0; i < pageSize * pagesToStream; ++i) {
      expected.push(i);
    }
    apiCall({}, null)
      .then(function(results) {
        expect(results).to.be.an('array');
        expect(results[0]).to.deep.equal(expected);
        done();
      })
      .catch(done);
  });

  it('calls callback with an Array', function(done) {
    var apiCall = util.createApiCall(func, createOptions);
    var expected: any[] = [];
    for (var i = 0; i < pageSize * pagesToStream; ++i) {
      expected.push(i);
    }
    apiCall({}, null, function(err, results) {
      expect(err).to.be.null;
      expect(results).to.deep.equal(expected);
      done();
    });
  });

  it('returns a response when autoPaginate is false', function(done) {
    var apiCall = util.createApiCall(func, createOptions);
    var expected = 0;
    var req = {};
    apiCall(req, {autoPaginate: false})
      .then(function(response) {
        expect(response).to.be.an('array');
        expect(response[0]).to.be.an('array');
        expect(response[0].length).to.eq(pageSize);
        for (var i = 0; i < pageSize; ++i) {
          expect(response[0][i]).to.eq(expected);
          expected++;
        }
        expect(response[1]).to.be.an('object');
        expect(response[1]).to.have.property('pageToken');
        expect(response[2]).to.be.an('object');
        expect(response[2]).to.have.property('nums');
        return apiCall(response[1], {autoPaginate: false});
      })
      .then(function(response) {
        expect(response).to.be.an('array');
        expect(response[0]).to.be.an('array');
        expect(response[0].length).to.eq(pageSize);
        for (var i = 0; i < pageSize; ++i) {
          expect(response[0][i]).to.eq(expected);
          expected++;
        }
        done();
      })
      .catch(done);
  });

  it('sets additional arguments to the callback', function(done) {
    var counter = 0;
    var apiCall = util.createApiCall(func, createOptions);
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

  it('retries on failure', function(done) {
    var callCount = 0;
    function failingFunc(request, metadata, options, callback) {
      callCount++;
      if (callCount % 2 === 0) {
        util.fail(request, metadata, options, callback);
      } else {
        func(request, metadata, options, callback);
      }
    }
    var apiCall = util.createApiCall(failingFunc, createOptions);
    apiCall({}, null)
      .then(function(resources) {
        expect(resources).to.be.an('array');
        expect(resources[0].length).to.eq(pageSize * pagesToStream);
        done();
      })
      .catch(done);
  });

  it('caps the results by maxResults', function() {
    var spy = sinon.spy(func);
    var apiCall = util.createApiCall(spy, createOptions);
    return apiCall({}, {maxResults: pageSize * 2 + 2}).then(function(response) {
      expect(response).to.be.an('array');
      expect(response[0]).to.be.an('array');
      expect(response[0].length).to.eq(pageSize * 2 + 2);
      var expected = 0;
      for (var i = 0; i < response[0].length; ++i) {
        expect(response[0][i]).to.eq(expected);
        expected++;
      }
      expect(spy.callCount).to.eq(3);
    });
  });

  describe('stream conversion', function() {
    var spy;
    var apiCall;
    beforeEach(function() {
      spy = sinon.spy(func);
      apiCall = util.createApiCall(spy, createOptions);
    });

    function streamChecker(stream, onEnd, done, start) {
      var counter = start;
      stream
        .on('data', function(data) {
          expect(data).to.eq(counter);
          counter++;
        })
        .on('end', function() {
          onEnd();
          done();
        })
        .on('error', function(err) {
          done(err);
        });
    }

    it('returns a stream', function(done) {
      streamChecker(
        descriptor.createStream(apiCall, {}, null),
        function() {
          expect(spy.callCount).to.eq(pagesToStream + 1);
        },
        done,
        0
      );
    });

    it('stops in the middle', function(done) {
      var stream = descriptor.createStream(apiCall, {}, null);
      stream.on('data', function(data) {
        if (data === pageSize + 1) {
          stream.end();
        }
      });
      streamChecker(
        stream,
        function() {
          expect(spy.callCount).to.eq(2);
        },
        done,
        0
      );
    });

    it('ignores autoPaginate options, but respects others', function(done) {
      // Specifies autoPaginate: false, which will be ignored, and pageToken: pageSize
      // which will be used so that the stream will start from the specified token.
      var options = {pageToken: pageSize, autoPaginate: false};
      streamChecker(
        descriptor.createStream(apiCall, {}, options),
        function() {
          expect(spy.callCount).to.eq(pagesToStream);
        },
        done,
        pageSize
      );
    });

    it('caps the elements by maxResults', function(done) {
      var onData = sinon.spy();
      var stream = descriptor.createStream(
        apiCall,
        {},
        {maxResults: pageSize * 2 + 2}
      );
      stream.on('data', onData);
      streamChecker(
        stream,
        function() {
          expect(spy.callCount).to.eq(3);
          expect(onData.callCount).to.eq(pageSize * 2 + 2);
        },
        done,
        0
      );
    });

    it('does not call API eagerly', function(done) {
      var stream = descriptor.createStream(apiCall, {}, null);
      setTimeout(function() {
        expect(spy.callCount).to.eq(0);
        streamChecker(
          stream,
          function() {
            expect(spy.callCount).to.eq(pagesToStream + 1);
          },
          done,
          0
        );
      }, 50);
    });

    it('does not start calls when it is already started', function(done) {
      var stream = descriptor.createStream(apiCall, {}, null);
      stream.on('end', function() {
        expect(spy.callCount).to.eq(pagesToStream + 1);
        done();
      });
      stream.resume();
      setImmediate(function() {
        stream.pause();
        stream.resume();
      });
    });

    it('cooperates with google-cloud-node usage', function(done) {
      var stream;
      var output = streamEvents((pumpify as any).obj()) as pumpify;
      output.once('reading', function() {
        stream = descriptor.createStream(apiCall, {}, null);
        output.setPipeline(stream, through2.obj());
      });
      var count = 0;
      output
        .on('data', function() {
          count++;
          if (count === pageSize + 1) {
            output.end();
          }
        })
        .on('end', function() {
          expect(count).to.eq(pageSize + 1);
          expect(spy.callCount).to.eq(2);
          done();
        })
        .on('error', done);
    });
  });
});
