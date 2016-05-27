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

/*jshint expr: true*/

'use strict';

var apiCallable = require('../lib/api_callable');
var gax = require('../lib/gax');
var expect = require('chai').expect;
var sinon = require('sinon');

var FAKE_STATUS_CODE_1 = 1;
var FAKE_STATUS_CODE_2 = 2;

function fail(argument, callback, metadata, options) {
  var error = new Error();
  error.code = FAKE_STATUS_CODE_1;
  callback(error);
}

describe('createApiCall', function() {
  it('calls api call', function(done) {
    var settings = new gax.CallSettings();
    var deadlineArg;
    function func(argument, callback, metadata, options) {
      deadlineArg = options.deadline;
      callback(null, 42);
    }
    var apiCall = apiCallable.createApiCall(func, settings);
    apiCall(null, function(err, resp) {
      expect(resp).to.eq(42);
      expect(deadlineArg).to.be.ok;
      done();
    }, null, {});
  });
});

describe('page streaming', function() {
  var pageSize = 3;
  var pagesToStream = 5;
  var pageDescriptor = new gax.PageDescriptor(
      'pageToken', 'nextPageToken', 'nums');
  var retryOptions = new gax.RetryOptions(
      [FAKE_STATUS_CODE_1], new gax.BackoffSettings(0, 0, 0, 0, 0, 0, 100));
  var settings = new gax.CallSettings({retry: retryOptions,
                                       pageDescriptor: pageDescriptor});
  var deadlineArg = null;

  function func(request, callback, metadata, options) {
    deadlineArg = options.deadline;
    var pageToken = request.pageToken || 0;
    if (pageToken >= pageSize * pagesToStream) {
      callback(null, {'nums': []});
    } else {
      var nums = new Array(pageSize);
      for (var i = 0; i < pageSize; i++) {
        nums[i] = pageToken + i;
      }
      callback(null, {'nums': nums, 'nextPageToken': pageToken + pageSize});
    }
  }

  it('returns page-streamable', function(done) {
    var apiCall = apiCallable.createApiCall(func, settings);
    var counter = 0;
    apiCall({}, null, null, {})
      .on('data', function(data) {
            expect(deadlineArg).to.be.ok;
            expect(data).to.eq(counter);
            counter++;
          })
      .on('end', function() {
            expect(counter).to.eq(pageSize * pagesToStream);
            done();
          });
  });

  it('stops if in the middle', function(done) {
    var apiCall = apiCallable.createApiCall(func, settings);
    var counter = 0;
    var stream = apiCall({}, null, null, {});
    stream.on('data', function(data) {
      expect(deadlineArg).to.be.ok;
      expect(data).to.eq(counter);
      counter++;
      if (counter == 4) {
        stream.end();
      }
    }).on('end', function() {
      expect(counter).to.eq(4);
      done();
    });
  });

  it('iterate over pages', function(done) {
    var mySettings = settings.merge(
        new gax.CallOptions({pageToken: gax.FIRST_PAGE}));
    var apiCall = apiCallable.createApiCall(func, mySettings);
    var counter = 0;
    apiCall({}, null, null, {})
      .on('data', function(data) {
        expect(deadlineArg).to.be.ok;
        expect(data).to.be.an('object');
        expect(data.nums).to.be.an('array');
        counter++;
        if (counter <= pagesToStream) {
          expect(data).to.have.any.keys(['nextPageToken']);
        } else {
          expect(data).to.not.have.any.keys(['nextPageToken']);
        }
      }).on('end', function() {
        expect(counter).to.eq(pagesToStream + 1);
        done();
      });
  });

  it('stops in the middle of per-page iteration, and resumes it later',
     function(done) {
    function takeSingleResponse(pageToken) {
      return new Promise(function(resolve, reject) {
        var mySettings = settings.merge(
            new gax.CallOptions({pageToken: pageToken}));
        var apiCall = apiCallable.createApiCall(func, mySettings);
        var stream = apiCall({}, null, null, {});
        stream.on('data', function(resp) {
          stream.end();
          resolve(resp);
        }).on('error', function(err) {
          reject(err);
        });
      });
    }
    takeSingleResponse(gax.FIRST_PAGE).then(function(resp) {
      expect(deadlineArg).to.be.ok;
      expect(resp).to.be.an('object');
      var expected = [];
      for (var i = 0; i < pageSize; i++) {
        expected.push(i);
      }
      expect(resp).to.eql({'nums': expected, 'nextPageToken': pageSize});
      return takeSingleResponse(resp.nextPageToken);
    }).then(function(resp) {
      expect(resp).to.be.an('object');
      var expected = [];
      for (var i = 0; i < pageSize; i++) {
        expected.push(i + pageSize);
      }
      expect(resp).to.eql({'nums': expected, 'nextPageToken': pageSize * 2});
      done();
    })['catch'](done);
  });

  it('retries on failure', function(done) {
    var callCount = 0;
    function failingFunc(request, callback, metadata, options) {
      callCount++;
      if (callCount % 2 === 0) {
        fail(request, callback, metadata, options);
      } else {
        func(request, callback, metadata, options);
      }
    }
    var apiCall = apiCallable.createApiCall(failingFunc, settings);
    var dataCount = 0;
    apiCall({}, null, null, {})
      .on('data', function(data) {
            expect(data).to.eq(dataCount);
            dataCount++;
          })
      .on('end', function() {
            expect(dataCount).to.eq(pageSize * pagesToStream);
            expect(callCount).to.be.above(pagesToStream);
            done();
          });
  });
});

describe('retryable', function() {
  var retryOptions = new gax.RetryOptions(
      [FAKE_STATUS_CODE_1], new gax.BackoffSettings(0, 0, 0, 0, 0, 0, 100));
  var settings = new gax.CallSettings({timeout: 0, retry: retryOptions});

  it('retries the API call', function(done) {
    var toAttempt = 3;
    var deadlineArg;
    function func(argument, callback, metadata, options) {
      deadlineArg = options.deadline;
      toAttempt--;
      if (toAttempt > 0) {
        fail(argument, callback, metadata, options);
        return;
      }
      callback(null, 1729);
    }
    var apiCall = apiCallable.createApiCall(func, settings);
    apiCall(null, function(err, resp) {
      expect(resp).to.eq(1729);
      expect(toAttempt).to.eq(0);
      expect(deadlineArg).to.be.ok;
      done();
    }, null, {});
  });

  it('doesn\'t retry if no codes', function(done) {
    var retryOptions = new gax.RetryOptions(
        [], new gax.BackoffSettings(1, 2, 3, 4, 5, 6, 7));
    var settings = new gax.CallSettings({timeout: 0, retry: retryOptions});
    var spy = sinon.spy(fail);
    var apiCall = apiCallable.createApiCall(spy, settings);
    apiCall(null, function(err, resp) {
      expect(err).to.be.ok;
      expect(err.cause).to.be.an('error');
      expect(err.cause.code).to.eq(FAKE_STATUS_CODE_1);
      expect(spy.callCount).to.eq(1);
      done();
    }, null, {});
  });

  it('aborts retries', function(done) {
    var apiCall = apiCallable.createApiCall(fail, settings);
    apiCall(null, function(err, resp) {
      expect(err).to.be.ok;
      expect(err).to.be.an('error');
      expect(err.cause.code).to.eq(FAKE_STATUS_CODE_1);
      done();
    }, null, {});
  });

  it.skip('times out', function(done) {
    var toAttempt = 3;
    var spy = sinon.spy(fail);
    var apiCall = apiCallable.createApiCall(spy, settings);
    apiCall(null, function(err, resp) {
      expect(err).to.be.ok;
      expect(err.cause).to.be.an('error');
      expect(err.cause.code).to.eq(FAKE_STATUS_CODE_1);
      expect(spy.callCount).to.eq(toAttempt);
      done();
    }, null, {});
  });

  it('aborts on unexpected exception', function(done) {
    function func(argument, callback, metadata, options) {
      var error = new Error();
      error.code = FAKE_STATUS_CODE_2;
      callback(error);
    }
    var spy = sinon.spy(func);
    var apiCall = apiCallable.createApiCall(spy, settings);
    apiCall(null, function(err, resp) {
      expect(err).to.be.ok;
      expect(err.cause).to.be.an('error');
      expect(err.cause.code).to.eq(FAKE_STATUS_CODE_2);
      expect(spy.callCount).to.eq(1);
      done();
    }, null, {});
  });

  it('does not retry even when no responses', function(done) {
    function func(argument, callback, metadata, options) {
      callback(null, null);
    }
    var apiCall = apiCallable.createApiCall(func, settings);
    apiCall(null, function(err, resp) {
      expect(err).to.be.null;
      expect(resp).to.be.null;
      done();
    }, null, {});
  });

  it.skip('retries with exponential backoff', function(done) {
    var startTime = new Date();
    var spy = sinon.spy(fail);

    var backoff = new gax.BackoffSettings(3, 2, 24, 5, 2, 80, 2500);
    var retryOptions = new gax.RetryOptions([FAKE_STATUS_CODE_1], backoff);
    var apiCall = apiCallable.createApiCall(
        spy, new gax.CallSettings({timeout: 0, retry: retryOptions}));

    apiCall(null, function(err, resp) {
      expect(err).to.be.ok;
      expect(err.cause).to.be.an('error');
      expect(err.cause.code).to.eq(FAKE_STATUS_CODE_1);
      var now = new Date();
      expect(now.getTime() - startTime.getTime()).to.be.at.least(
          backoff.totalTimeoutMillis);
      var callsLowerBound = backoff.totalTimeoutMillis / (
          backoff.maxRetryDelayMillis + backoff.maxRpcTimeoutMillis);
      var callsUpperBound = (backoff.totalTimeoutMillis /
          backoff.initialRetryDelayMillis);
      expect(spy.callCount).to.be.above(callsLowerBound);
      expect(spy.callCount).to.be.below(callsUpperBound);
      done();
    }, null, {});
  });
});
