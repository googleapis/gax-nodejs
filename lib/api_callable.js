/*
 * Copyright 2016, Google Inc.
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

/**
 * Provides function wrappers that implement page streaming and retrying.
 */

'use strict';

var setTimeout = require('timers').setTimeout;
var util = require('util');

/**
 * @callback APICallback
 * @param {?Error} error
 * @param {?Object} response
 */

/**
 * @callback APIFunc
 * @param {Object} argument
 * @param {grpc.Metadata} metadata
 * @param {Object} options
 * @param {APICallback} callback
 */

/**
 * @callback APICall
 * @param {Object} argument
 * @param {CallOptions} callOptions
 * @param {APICallback} callback
 * @return {Promise|Stream|undefined}
 */

/**
 * Canceller manages callback, API calls, and cancellation
 * of the API calls.
 * @param {APICallback=} callback
 *   The callback to be called asynchronously when the API call
 *   finishes.
 * @constructor
 * @property {APICallback} callback
 *   The callback function to be called.
 * @private
 */
function Canceller(callback) {
  this.callback = callback;
  this.cancelFunc = null;
  this.completed = false;
}

/**
 * Cancels the ongoing promise.
 */
Canceller.prototype.cancel = function() {
  if (this.completed) {
    return;
  }
  this.completed = true;
  if (this.cancelFunc) {
    this.cancelFunc();
  } else {
    this.callback(new Error('cancelled'));
  }
};

/**
 * Call calls the specified function. Result will be used to fulfill
 * the promise.
 *
 * @param {function(Object, APICallback=)} aFunc
 *   A function for an API call.
 * @param {Object} argument
 *   A request object.
 */
Canceller.prototype.call = function(aFunc, argument) {
  if (this.completed) {
    return;
  }
  var self = this;
  var canceller = aFunc(argument, function() {
    self.completed = true;
    var args = Array.prototype.slice.call(arguments, 0);
    args.unshift(self.callback);
    setImmediate.apply(null, args);
  });
  this.cancelFunc = function() {
    canceller.cancel();
  };
};

/**
 * PromiseCanceller is Canceller, but it holds a promise when
 * the API call finishes.
 * @param {Function} PromiseCtor - A constructor for a promise that implements
 * the ES6 specification of promise.
 * @constructor
 * @private
 */
function PromiseCanceller(PromiseCtor) {
  var self = this;
  this.promise = new PromiseCtor(function(resolve, reject) {
    Canceller.call(self, function(err) {
      if (err) {
        reject(err);
      } else {
        resolve(Array.prototype.slice.call(arguments, 1));
      }
    });
  });
  this.promise.cancel = function() {
    self.cancel();
  };
}

util.inherits(PromiseCanceller, Canceller);

/**
 * Updates aFunc so that it gets called with the timeout as its final arg.
 *
 * This converts a function, aFunc, into another function with updated deadline.
 *
 * @private
 *
 * @param {APIFunc} aFunc - a function to be updated.
 * @param {number} timeout - to be added to the original function as it final
 *   positional arg.
 * @param {Object} otherArgs - the additional arguments to be passed to aFunc.
 * @param {Object=} abTests - the A/B testing key/value pairs.
 * @return {function(Object, APICallback)}
 *  the function with other arguments and the timeout.
 */
function addTimeoutArg(aFunc, timeout, otherArgs, abTests) {
  // TODO: this assumes the other arguments consist of metadata and options,
  // which is specific to gRPC calls. Remove the hidden dependency on gRPC.
  return function timeoutFunc(argument, callback) {
    var now = new Date();
    var options = otherArgs.options || {};
    options.deadline = new Date(now.getTime() + timeout);
    var metadata = otherArgs.metadataBuilder
      ? otherArgs.metadataBuilder(abTests, otherArgs.headers || {})
      : null;
    return aFunc(argument, metadata, options, callback);
  };
}

/**
 * Creates a function equivalent to aFunc, but that retries on certain
 * exceptions.
 *
 * @private
 *
 * @param {APIFunc} aFunc - A function.
 * @param {RetryOptions} retry - Configures the exceptions upon which the
 *   function eshould retry, and the parameters to the exponential backoff retry
 *   algorithm.
 * @param {Object} otherArgs - the additional arguments to be passed to aFunc.
 * @return {function(Object, APICallback)} A function that will retry.
 */
function retryable(aFunc, retry, otherArgs) {
  var delayMult = retry.backoffSettings.retryDelayMultiplier;
  var maxDelay = retry.backoffSettings.maxRetryDelayMillis;
  var timeoutMult = retry.backoffSettings.rpcTimeoutMultiplier;
  var maxTimeout = retry.backoffSettings.maxRpcTimeoutMillis;

  var delay = retry.backoffSettings.initialRetryDelayMillis;
  var timeout = retry.backoffSettings.initialRpcTimeoutMillis;

  /**
   * Equivalent to ``aFunc``, but retries upon transient failure.
   *
   * Retrying is done through an exponential backoff algorithm configured
   * by the options in ``retry``.
   * @param {Object} argument The request object.
   * @param {APICallback} callback The callback.
   * @return {function()} cancel function.
   */
  return function retryingFunc(argument, callback) {
    var canceller;
    var timeoutId;
    var now = new Date();
    var deadline;
    if (retry.backoffSettings.totalTimeoutMillis) {
      deadline = now.getTime() + retry.backoffSettings.totalTimeoutMillis;
    }
    var retries = 0;
    var maxRetries = retry.backoffSettings.maxRetries;
    // TODO: define A/B testing values for retry behaviors.

    /** Repeat the API call as long as necessary. */
    function repeat() {
      timeoutId = null;
      if (deadline && now.getTime() >= deadline) {
        callback(
          new Error(
            'Retry total timeout exceeded before any' + 'response was received'
          )
        );
        return;
      }

      if (retries && retries >= maxRetries) {
        callback(
          new Error(
            'Exceeded maximum number of retries before any ' +
              'response was received'
          )
        );
        return;
      }

      retries++;
      var toCall = addTimeoutArg(aFunc, timeout, otherArgs);
      canceller = toCall(argument, function(err) {
        if (!err) {
          var args = Array.prototype.slice.call(arguments, 1);
          args.unshift(null);
          callback.apply(null, args);
          return;
        }
        canceller = null;
        if (retry.retryCodes.indexOf(err.code) < 0) {
          err.note =
            'Exception occurred in retry method that was ' +
            'not classified as transient';
          callback(err);
        } else {
          var toSleep = Math.random() * delay;
          timeoutId = setTimeout(function() {
            now = new Date();
            delay = Math.min(delay * delayMult, maxDelay);
            timeout = Math.min(
              timeout * timeoutMult,
              maxTimeout,
              deadline - now.getTime()
            );
            repeat();
          }, toSleep);
        }
      });
    }

    if (maxRetries && deadline) {
      callback(
        new Error(
          'Cannot set both totalTimeoutMillis and maxRetries ' +
            'in backoffSettings.'
        )
      );
    } else {
      repeat();
    }

    return {
      cancel: function() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (canceller) {
          canceller.cancel();
        } else {
          callback(new Error('cancelled'));
        }
      },
    };
  };
}

/**
 * Creates an API caller for normal methods.
 *
 * @private
 * @constructor
 */
function NormalApiCaller() {}

NormalApiCaller.prototype.init = function(settings, callback) {
  if (callback) {
    return new Canceller(callback);
  }
  return new PromiseCanceller(settings.promise);
};

NormalApiCaller.prototype.wrap = function(func) {
  return func;
};

NormalApiCaller.prototype.call = function(
  apiCall,
  argument,
  settings,
  canceller
) {
  canceller.call(apiCall, argument);
};

NormalApiCaller.prototype.fail = function(canceller, err) {
  canceller.callback(err);
};

NormalApiCaller.prototype.result = function(canceller) {
  if (canceller.promise) {
    return canceller.promise;
  }
};

exports.NormalApiCaller = NormalApiCaller;

/**
 * Converts an rpc call into an API call governed by the settings.
 *
 * In typical usage, `func` will be a promsie to a callable used to make an rpc
 * request. This will mostly likely be a bound method from a request stub used
 * to make an rpc call. It is not a direct function but a Promise instance,
 * because of its asynchronism (typically, obtaining the auth information).
 *
 * The result is a function which manages the API call with the given settings
 * and the options on the invocation.
 *
 * @param {Promise.<APIFunc>} funcWithAuth - is a promise to be used to make
 *   a bare rpc call. This is a Promise instead of a bare function because
 *   the rpc call will be involeved with asynchronous authentications.
 * @param {CallSettings} settings - provides the settings for this call
 * @param {Object=} optDescriptor - optionally specify the descriptor for
 *   the method call.
 * @return {APICall} func - a bound method on a request stub used
 *   to make an rpc call.
 */
exports.createApiCall = function createApiCall(
  funcWithAuth,
  settings,
  optDescriptor
) {
  var apiCaller = optDescriptor
    ? optDescriptor.apiCaller(settings)
    : new NormalApiCaller();

  return function apiCallInner(request, callOptions, callback) {
    var thisSettings = settings.merge(callOptions);

    var status = apiCaller.init(thisSettings, callback);
    funcWithAuth
      .then(function(func) {
        func = apiCaller.wrap(func);
        var retry = thisSettings.retry;
        if (retry && retry.retryCodes && retry.retryCodes.length > 0) {
          return retryable(func, thisSettings.retry, thisSettings.otherArgs);
        }
        return addTimeoutArg(
          func,
          thisSettings.timeout,
          thisSettings.otherArgs
        );
      })
      .then(function(apiCall) {
        apiCaller.call(apiCall, request, thisSettings, status);
      })
      .catch(function(err) {
        apiCaller.fail(status, err);
      });
    return apiCaller.result(status);
  };
};
