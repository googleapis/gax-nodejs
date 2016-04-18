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

'use strict';

var apiCallable = require('../lib/api_callable');
var gax = require('../lib/gax');
var assert = require('chai').assert;
var sinon = require('sinon');

var FAKE_STATUS_CODE_1 = 1;
var FAKE_STATUS_CODE_2 = 2;

function fail(argument, metadata, options, callback) {
  var error = new Error();
  error.code = FAKE_STATUS_CODE_1;
  callback(error);
}

describe('createApiCall', function() {
  it('calls api call', function(done) {
    var settings = new gax.CallSettings();
    var deadline_arg;
    function func(argument, metadata, options, callback) {
      deadline_arg = options.deadline;
      callback(null, 42);
    }
    var apiCall = apiCallable.createApiCall(func, settings);
    apiCall(null, null, {}, function(err, resp) {
      assert.equal(resp, 42);
      assert(deadline_arg, 'deadline is not set');
      done();
    });
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
  var deadline_arg = null;

  function func(request, metadata, options, callback) {
    deadline_arg = options.deadline;
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
    apiCall({}, null, {})
      .on('data', function(data) {
            assert(deadline_arg, 'deadline is not set');
            assert.equal(data, counter);
            counter++;
          })
      .on('end', function() {
            assert.equal(counter, pageSize * pagesToStream);
            done();
          });
  });

  it('returns an object if callback is specified', function(done) {
    var apiCall = apiCallable.createApiCall(func, settings);
    apiCall({}, null, {}, function(err, resp) {
      assert(!err);
      assert(deadline_arg, 'deadline is not set');
      assert.deepEqual(resp, {'nums': [0, 1, 2], 'nextPageToken': 3});
      done();
    });
  });

  it('retries on failure', function(done) {
    var callCount = 0;
    function failingFunc(request, metadata, options, callback) {
      callCount++;
      if (callCount % 2 == 0) {
        fail(request, metadata, options, callback);
      } else {
        func(request, metadata, options, callback);
      }
    }
    var apiCall = apiCallable.createApiCall(failingFunc, settings);
    var dataCount = 0;
    apiCall({}, null, {})
      .on('data', function(data) {
            assert.equal(data, dataCount);
            dataCount++;
          })
      .on('end', function() {
            assert.equal(dataCount, pageSize * pagesToStream);
            assert.isAbove(callCount, pagesToStream);
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
    function func(argument, metadata, options, callback) {
      deadlineArg = options.deadline;
      toAttempt--;
      if (toAttempt > 0) {
        fail(argument, metadata, options, callback);
        return;
      }
      callback(null, 1729);
    }
    var apiCall = apiCallable.createApiCall(func, settings);
    apiCall(null, null, {}, function(err, resp) {
      assert.equal(resp, 1729);
      assert.equal(toAttempt, 0);
      assert(deadlineArg);
      done();
    });
  });

  it('doesn\'t retry if no codes', function(done) {
    var retryOptions = new gax.RetryOptions(
        [], new gax.BackoffSettings(1, 2, 3, 4, 5, 6, 7));
    var settings = new gax.CallSettings({timeout: 0, retry: retryOptions});
    var spy = sinon.spy(fail);
    var apiCall = apiCallable.createApiCall(spy, settings);
    apiCall(null, null, {}, function(err, resp) {
      assert(err);
      assert(err.cause);
      assert.equal(err.cause.code, FAKE_STATUS_CODE_1);
      assert.equal(spy.callCount, 1);
      done();
    });
  });

  it('aborts retries', function(done) {
    var apiCall = apiCallable.createApiCall(fail, settings);
    apiCall(null, null, {}, function(err, resp) {
      assert(err);
      assert(err.cause);
      assert.equal(err.cause.code, FAKE_STATUS_CODE_1);
      done();
    });
  });

  it.skip('times out', function(done) {
    var toAttempt = 3;
    var spy = sinon.spy(fail);
    var apiCall = apiCallable.createApiCall(spy, settings);
    apiCall(null, null, {}, function(err, resp) {
      assert(err);
      assert(err.cause);
      assert.equal(err.cause.code, FAKE_STATUS_CODE_1);
      assert.equal(spy.callCount, toAttempt);
      done();
    });
  });

  it('aborts on unexpected exception', function(done) {
    function func(argument, metadata, options, callback) {
      var error = new Error();
      error.code = FAKE_STATUS_CODE_2;
      callback(error);
    }
    var spy = sinon.spy(func);
    var apiCall = apiCallable.createApiCall(spy, settings);
    apiCall(null, null, {}, function(err, resp) {
      assert(err);
      assert(err.cause);
      assert.equal(err.cause.code, FAKE_STATUS_CODE_2);
      assert.equal(spy.callCount, 1);
      done();
    });
  });

  it('does not retry even when no responses', function(done) {
    function func(argument, metadata, options, callback) {
      callback(null, null);
    }
    var apiCall = apiCallable.createApiCall(func, settings);
    apiCall(null, null, {}, function(err, resp) {
      assert(!err);
      assert.equal(resp, null);
      done();
    });
  });

  it.skip('retries with exponential backoff', function(done) {
    var startTime = new Date();
    var spy = sinon.spy(fail);

    var backoff = new gax.BackoffSettings(3, 2, 24, 5, 2, 80, 2500);
    var retryOptions = new gax.RetryOptions([FAKE_STATUS_CODE_1], backoff);
    var apiCall = apiCallable.createApiCall(
        spy, new gax.CallSettings({timeout: 0, retry: retryOptions}));

    apiCall(null, null, {}, function(err, resp) {
      assert(err);
      assert(err.cause);
      assert.equal(err.cause.code, FAKE_STATUS_CODE_1);
      var now = new Date();
      assert.isAtLeast(now.getTime() - startTime.getTime(),
                       backoff.totalTimeoutMillis);
      var callsLowerBound = backoff.totalTimeoutMillis / (
          backoff.maxRetryDelayMillis + backoff.maxRpcTimeoutMillis);
      var callsUpperBound = (backoff.totalTimeoutMillis /
          backoff.initialRetryDelayMillis);
      assert.isAbove(spy.callCount, callsLowerBound);
      assert.isBelow(spy.callCount, callsUpperBound);
      done();
    });
  });
});
