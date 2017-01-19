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
var expect = require('chai').expect;
var sinon = require('sinon');
var utils = require('./utils');

var fail = utils.fail;
var createApiCall = utils.createApiCall;
var FAKE_STATUS_CODE_1 = utils.FAKE_STATUS_CODE_1;
var FAKE_STATUS_CODE_2 = utils.FAKE_STATUS_CODE_1 + 1;

describe('createApiCall', function() {
  it('calls api call', function(done) {
    var deadlineArg;
    function func(argument, metadata, options, callback) {
      deadlineArg = options.deadline;
      callback(null, argument);
    }
    var apiCall = createApiCall(func);
    apiCall(42, null, function(err, resp) {
      expect(resp).to.eq(42);
      expect(deadlineArg).to.be.ok;
      done();
    });
  });

  it('is customized by call options', function(done) {
    function func(argument, metadata, options, callback) {
      callback(null, options.deadline.getTime());
    }
    var apiCall = createApiCall(func, {settings: {timeout: 100}});
    apiCall(null, {timeout: 200}, function(err, resp) {
      var now = new Date();
      var originalDeadline = now.getTime() + 100;
      var expectedDeadline = now.getTime() + 200;
      expect(resp).above(originalDeadline);
      expect(resp).most(expectedDeadline);
      done();
    });
  });
});

describe('Promise', function() {
  it('calls api call', function(done) {
    var deadlineArg;
    function func(argument, metadata, options, callback) {
      deadlineArg = options.deadline;
      callback(null, 42);
    }
    var apiCall = createApiCall(func);
    apiCall(null).then(function(response) {
      expect(response).to.be.an('array');
      expect(response[0]).to.eq(42);
      expect(deadlineArg).to.be.ok;
      done();
    }).catch(done);
  });

  it('emits error on failure', function(done) {
    var apiCall = createApiCall(fail);
    apiCall(null, null).then(function(response) {
      done(new Error('should not reach'));
    }).catch(function(err) {
      expect(err).to.be.an.instanceOf(Error);
      done();
    });
  });

  it('has cancel method', function(done) {
    function func(argument, metadata, options, callback) {
      setTimeout(function() { callback(null, 42); }, 0);
    }
    var apiCall = createApiCall(func, {cancel: done});
    var promise = apiCall(null);
    promise.then(function(response) {
      done(new Error('should not reach'));
    }).catch(function(err) {
      done();
    });
    promise.cancel();
  });

  it('cancels retrying call', function(done) {
    var retryOptions = utils.createRetryOptions(0, 0, 0, 0, 0, 0, 100);

    var callCount = 0;
    function func(argument, metadata, options, callback) {
      callCount++;
      var err = null;
      var response = null;
      if (callCount <= 3) {
        err = new Error();
        err.code = FAKE_STATUS_CODE_1;
      } else {
        response = 42;
      }
      var timeoutId = setTimeout(function() { callback(err, response); }, 10);
      return function cancelFunc() {
        clearTimeout(timeoutId);
        callback(new Error('canceled'));
      };
    }
    var apiCall = createApiCall(
        func, {settings: {retry: retryOptions}, returnCancelFunc: true});
    var promise = apiCall(null);
    promise.then(function(response) {
      done(new Error('should not reach'));
    }).catch(function(err) {
      expect(callCount).to.be.below(4);
      done();
    }).catch(done);
    setTimeout(function() {
      promise.cancel();
    }, 15);
  });

  it('does not return promise when callback is supplied', function(done) {
    function func(argument, metadata, options, callback) {
      callback(null, 42);
    }
    var apiCall = createApiCall(func);
    expect(apiCall(null, null, function(err, response) {
      expect(err).to.be.null;
      expect(response).to.eq(42);
      done();
    })).to.be.undefined;
  });

  it('uses a provided promise module.', function(done) {
    var called = false;
    function MockPromise(resolver) {
      called = true;
      return new Promise(resolver);
    }

    function func(argument, metadata, options, callback) {
      callback(null, 42);
    }
    var apiCall = createApiCall(func);
    apiCall(null, {promise: MockPromise}).then(function(response) {
      expect(response).to.be.an('array');
      expect(response[0]).to.eq(42);
      expect(called).to.be.true;
      done();
    }).catch(done);
  });
});

describe('retryable', function() {
  var retryOptions = utils.createRetryOptions(0, 0, 0, 0, 0, 0, 100);
  var settings = {settings: {timeout: 0, retry: retryOptions}};

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
    var apiCall = createApiCall(func, settings);
    apiCall(null, null, function(err, resp) {
      expect(resp).to.eq(1729);
      expect(toAttempt).to.eq(0);
      expect(deadlineArg).to.be.ok;
      done();
    });
  });

  it('retries the API call with promise', function(done) {
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
    var apiCall = createApiCall(func, settings);
    apiCall(null, null).then(function(resp) {
      expect(resp).to.be.an('array');
      expect(resp[0]).to.eq(1729);
      expect(toAttempt).to.eq(0);
      expect(deadlineArg).to.be.ok;
      done();
    }).catch(done);
  });

  it('cancels in the middle of retries', function(done) {
    var callCount = 0;
    var promise;
    function func(argument, metadata, options, callback) {
      callCount++;
      if (callCount <= 2) {
        fail(argument, metadata, options, callback);
        return;
      }
      setTimeout(function() {
        promise.cancel();
      }, 0);
      setTimeout(function() {
        callback(null, null, 1729);
      }, 10);
    }
    var apiCall = createApiCall(func, settings);
    promise = apiCall(null, null);
    promise.then(function(resp) {
      done(new Error('should not reach'));
    }).catch(function(err) {
      expect(err).to.be.an.instanceOf(Error);
      done();
    });
  });

  it('doesn\'t retry if no codes', function(done) {
    var retryOptions = gax.createRetryOptions(
        [], gax.createBackoffSettings(1, 2, 3, 4, 5, 6, 7));
    var settings = {settings: {timeout: 0, retry: retryOptions}};
    var spy = sinon.spy(fail);
    var apiCall = createApiCall(spy, settings);
    apiCall(null, null, function(err, resp) {
      expect(err).to.be.an('error');
      expect(err.code).to.eq(FAKE_STATUS_CODE_1);
      expect(err.note).to.be.ok;
      expect(spy.callCount).to.eq(1);
      done();
    });
  });

  it('aborts retries', function(done) {
    var apiCall = createApiCall(fail, settings);
    apiCall(null, null, function(err, resp) {
      expect(err).to.be.an('error');
      done();
    });
  });

  it.skip('times out', function(done) {
    var toAttempt = 3;
    var spy = sinon.spy(fail);
    var apiCall = createApiCall(spy, settings);
    apiCall(null, null, function(err, resp) {
      expect(err).to.be.an('error');
      expect(err.code).to.eq(FAKE_STATUS_CODE_1);
      expect(err.note).to.be.ok;
      expect(spy.callCount).to.eq(toAttempt);
      done();
    });
  });

  // maxRetries is unsupported, and intended for internal use only.
  it('errors on maxRetries', function(done) {
    var toAttempt = 5;
    var backoff = gax.createMaxRetriesBackoffSettings(
        0, 0, 0, 0, 0, 0, toAttempt);
    var maxRetriesRetryOptions = utils.createRetryOptions(backoff);

    var maxRetrySettings = {
      settings: {timeout: 0, retry: maxRetriesRetryOptions}};
    var spy = sinon.spy(fail);
    var apiCall = createApiCall(spy, maxRetrySettings);
    apiCall(null, null, function(err, resp) {
      expect(err).to.be.an('error');
      expect(spy.callCount).to.eq(toAttempt);
      done();
    });
  });

  // maxRetries is unsupported, and intended for internal use only.
  it('errors when totalTimeoutMillis and maxRetries set', function(done) {
    var maxRetries = 5;
    var backoff = gax.createMaxRetriesBackoffSettings(
        0, 0, 0, 0, 0, 0, maxRetries);
    var maxRetriesRetryOptions = utils.createRetryOptions(backoff);
    maxRetriesRetryOptions.backoffSettings.totalTimeoutMillis = 100;
    var maxRetrySettings = {
      settings: {timeout: 0, retry: maxRetriesRetryOptions}};
    var spy = sinon.spy(fail);
    var apiCall = createApiCall(spy, maxRetrySettings);
    apiCall(null, null, function(err, resp) {
      expect(err).to.be.an('error');
      expect(spy.callCount).to.eq(0);
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
    var apiCall = createApiCall(spy, settings);
    apiCall(null, null, function(err, resp) {
      expect(err).to.be.an('error');
      expect(err.code).to.eq(FAKE_STATUS_CODE_2);
      expect(err.note).to.be.ok;
      expect(spy.callCount).to.eq(1);
      done();
    });
  });

  it('does not retry even when no responses', function(done) {
    function func(argument, metadata, options, callback) {
      callback(null, null);
    }
    var apiCall = createApiCall(func, settings);
    apiCall(null, null, function(err, resp) {
      expect(err).to.be.null;
      expect(resp).to.be.null;
      done();
    });
  });

  it.skip('retries with exponential backoff', function(done) {
    var startTime = new Date();
    var spy = sinon.spy(fail);

    var backoff = gax.createBackoffSettings(3, 2, 24, 5, 2, 80, 2500);
    var retryOptions = new gax.RetryOptions([FAKE_STATUS_CODE_1], backoff);
    var apiCall = createApiCall(
        spy, {settings: {timeout: 0, retry: retryOptions}});

    apiCall(null, null, function(err, resp) {
      expect(err).to.be.an('error');
      expect(err.code).to.eq(FAKE_STATUS_CODE_1);
      expect(err.note).to.be.ok;
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
    });
  });
});
