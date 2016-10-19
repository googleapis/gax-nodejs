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

var apiCallable = require('../lib/api_callable');
var bundling = require('../lib/bundling');
var gax = require('../lib/gax');
var expect = require('chai').expect;
var sinon = require('sinon');

var FAKE_STATUS_CODE_1 = 1;
var FAKE_STATUS_CODE_2 = 2;

function fail(argument, metadata, options, callback) {
  var error = new Error();
  error.code = FAKE_STATUS_CODE_1;
  callback(error);
}

function createApiCall(func, settings, canceller) {
  return apiCallable.createApiCall(Promise.resolve(
    function(argument, metadata, options, callback) {
      if (canceller && canceller.returnCancelFunc) {
        return {
          cancel: func(argument, metadata, options, callback)
        };
      }
      func(argument, metadata, options, callback);
      return canceller || {
        cancel: function() { callback(new Error('canceled')); }
      };
    }), settings);
}

describe('createApiCall', function() {
  it('calls api call', function(done) {
    var settings = new gax.CallSettings();
    var deadlineArg;
    function func(argument, metadata, options, callback) {
      deadlineArg = options.deadline;
      callback(null, argument);
    }
    var apiCall = createApiCall(func, settings);
    apiCall(42, null, function(err, resp) {
      expect(resp).to.eq(42);
      expect(deadlineArg).to.be.ok;
      done();
    });
  });

  it('is customized by call options', function(done) {
    var settings = new gax.CallSettings({timeout: 100});
    function func(argument, metadata, options, callback) {
      callback(null, options.deadline.getTime());
    }
    var apiCall = createApiCall(func, settings);
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
    var apiCall = createApiCall(func, new gax.CallSettings());
    apiCall(null).then(function(response) {
      expect(response).to.eq(42);
      expect(deadlineArg).to.be.ok;
      done();
    }).catch(done);
  });

  it('emits error on failure', function(done) {
    var apiCall = createApiCall(fail, new gax.CallSettings());
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
    var apiCall = createApiCall(func, new gax.CallSettings(), {cancel: done});
    var promise = apiCall(null);
    promise.then(function(response) {
      done(new Error('should not reach'));
    }).catch(function(err) {
      done();
    });
    promise.cancel();
  });

  it('cancels retrying call', function(done) {
    var retryOptions = gax.createRetryOptions(
        [FAKE_STATUS_CODE_1], gax.createBackoffSettings(0, 0, 0, 0, 0, 0, 100));
    var settings = new gax.CallSettings({timeout: 0, retry: retryOptions});

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
    var apiCall = createApiCall(func, settings, {returnCancelFunc: true});
    var promise = apiCall(null);
    promise.then(function(response) {
      done(new Error('should not reach'));
    }).catch(function(err) {
      expect(callCount).to.be.below(4);
      done();
    }).catch(done);
    setTimeout(promise.cancel.bind(promise), 15);
  });
});

describe('page streaming', function() {
  var pageSize = 3;
  var pagesToStream = 5;
  var pageDescriptor = new gax.PageDescriptor(
      'pageToken', 'nextPageToken', 'nums');
  var retryOptions = gax.createRetryOptions(
      [FAKE_STATUS_CODE_1], gax.createBackoffSettings(0, 0, 0, 0, 0, 0, 100));
  var settings = new gax.CallSettings({retry: retryOptions,
                                       pageDescriptor: pageDescriptor});
  var deadlineArg = null;

  function func(request, metadata, options, callback) {
    deadlineArg = options.deadline;
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

  it('returns page-streamable', function(done) {
    var apiCall = createApiCall(func, settings);
    var counter = 0;
    apiCall({}, null)
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

  it('stops in the middle', function(done) {
    var spy = sinon.spy(func);
    var apiCall = createApiCall(spy, settings);
    var counter = 0;
    var stream = apiCall({}, null);
    stream.on('data', function(data) {
      expect(deadlineArg).to.be.ok;
      expect(data).to.eq(counter);
      counter++;
      if (counter === pageSize + 1) {
        stream.end();
      }
    }).on('end', function() {
      expect(counter).to.eq(pageSize + 1);
      expect(spy.callCount).to.eq(2);
      done();
    });
  });

  it('fetches the page', function(done) {
    var apiCall = createApiCall(func, settings);
    apiCall({}, {flattenPages: false}, function(err, data) {
      expect(err).to.be.null;
      expect(deadlineArg).to.be.ok;
      expect(data).to.be.an('object');
      expect(data.nums).to.be.an('array');
      done();
    });
  });

  it('switches to callback mode if callback is supplied', function(done) {
    var apiCall = createApiCall(func, settings);
    apiCall({}, null, function(err, data) {
      expect(err).to.be.null;
      expect(deadlineArg).to.be.ok;
      expect(data).to.be.an('object');
      expect(data.nums).to.be.an('array');
      done();
    });
  });

  it('fetches the next page through the third callback', function(done) {
    var counter = 0;
    var apiCall = createApiCall(func, settings);
    function callback(err, response, nextPageToken) {
      if (err) {
        done(err);
        return;
      }
      counter++;
      expect(response).to.be.an('object');
      expect(response.nums).to.be.an('array');
      if (nextPageToken) {
        apiCall({}, {pageToken: nextPageToken}, callback);
      } else {
        expect(counter).to.eq(pagesToStream + 1);
        done();
      }
    }
    apiCall({}, null, callback);
  });

  it('retries on failure', function(done) {
    var callCount = 0;
    function failingFunc(request, metadata, options, callback) {
      callCount++;
      if (callCount % 2 === 0) {
        fail(request, metadata, options, callback);
      } else {
        func(request, metadata, options, callback);
      }
    }
    var apiCall = createApiCall(failingFunc, settings);
    var dataCount = 0;
    apiCall({}, null)
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
  var retryOptions = gax.createRetryOptions(
      [FAKE_STATUS_CODE_1], gax.createBackoffSettings(0, 0, 0, 0, 0, 0, 100));
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
      expect(resp).to.eq(1729);
      expect(toAttempt).to.eq(0);
      expect(deadlineArg).to.be.ok;
      done();
    }).catch(function(err) { done(err); });
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
      setTimeout(promise.cancel.bind(promise), 0);
      setTimeout(callback.bind(null, null, 1729), 10);
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
    var settings = new gax.CallSettings({timeout: 0, retry: retryOptions});
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
      expect(err.code).to.eq(FAKE_STATUS_CODE_1);
      expect(err.note).to.be.ok;
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
        spy, new gax.CallSettings({timeout: 0, retry: retryOptions}));

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

describe('bundleable', function() {
  function byteLength(obj) {
    return JSON.stringify(obj).length;
  }
  function func(argument, metadata, options, callback) {
    callback(null, argument);
  }
  function createRequest(field1, field2) {
    return {field1: field1, field2: field2};
  }
  var bundleOptions = new gax.BundleOptions({elementCountThreshold: 6});
  var bundleDescriptor = new gax.BundleDescriptor(
      'field1', ['field2'], 'field1', byteLength);
  var settings = new gax.CallSettings({bundler: new bundling.BundleExecutor(
      bundleOptions, bundleDescriptor)});

  it('bundles requests', function(done) {
    var spy = sinon.spy(func);
    var callback = sinon.spy(function(obj) {
      expect(obj.field1).to.deep.equal([1, 2, 3]);
      if (callback.callCount === 2) {
        expect(spy.callCount).to.eq(1);
        done();
      }
    });
    var apiCall = createApiCall(spy, settings);
    apiCall(createRequest([1, 2, 3], 'id'), null, function(err, obj) {
      if (err) {
        done(err);
      } else {
        callback(obj);
      }
    });
    apiCall(createRequest([1, 2, 3], 'id'), null).then(callback).catch(done);
  });

  it('suppresses bundling behavior by call options', function(done) {
    var spy = sinon.spy(func);
    var callbackCount = 0;
    function bundledCallback(obj) {
      callbackCount++;
      expect(obj.field1).to.deep.equal([1, 2, 3]);
      if (callbackCount === 3) {
        expect(spy.callCount).to.eq(2);
        done();
      }
    }
    function unbundledCallback(obj) {
      callbackCount++;
      expect(callbackCount).to.eq(1);
      expect(obj.field1).to.deep.equal([1, 2, 3]);
    }
    var apiCall = createApiCall(spy, settings);
    apiCall(createRequest([1, 2, 3], 'id'), null)
        .then(bundledCallback)
        .catch(done);
    apiCall(createRequest([1, 2, 3], 'id'), {isBundling: false})
        .then(unbundledCallback);
    apiCall(createRequest([1, 2, 3], 'id'), null)
        .then(bundledCallback)
        .catch(done);
  });
});
