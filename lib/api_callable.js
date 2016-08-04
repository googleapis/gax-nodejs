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

var assert = require('chai').assert;
var gax = require('./gax');
var EventEmitter = require('./event_emitter').EventEmitter;
var BundleEventEmitter = require('./event_emitter').BundleEventEmitter;
var through2 = require('through2');
var setTimeout = require('timers').setTimeout;

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
 * @return {EventEmitter|Stream}
 */

/**
 * Updates aFunc so that it gets called with the timeout as its final arg.
 *
 * This converts a function, aFunc, into another function with updated deadline.
 *
 * @private
 *
 * @param {APIFunc} aFunc - a function to be updated
 * @param {number} timeout - to be added to the original function as it final
 *   positional arg.
 * @param {Object} otherArgs - the additional arguments to be passed to aFunc.
 * @return {function()} the function with other arguments and the timeout.
 */
function addTimeoutArg(aFunc, timeout, otherArgs) {
  // TODO: this assumes the other arguments consist of metadata and options,
  // which is specific to gRPC calls. Remove the hidden dependency on gRPC.
  return function timeoutFunc(argument, callback) {
    var now = new Date();
    var options = otherArgs.options || {};
    options.deadline = new Date(now.getTime() + timeout);
    return aFunc(argument, otherArgs.metadata, options, callback);
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
 * @return {function()} A function that will retry.
 */
function retryable(aFunc, retry, otherArgs) {
  var delayMult = retry.backoffSettings.retryDelayMultiplier;
  var maxDelay = retry.backoffSettings.maxRetryDelayMillis;
  var timeoutMult = retry.backoffSettings.rpcTimeoutMultiplier;
  var maxTimeout = retry.backoffSettings.maxRpcTimeoutMillis;

  var delay = retry.backoffSettings.initialRetryDelayMillis;
  var timeout = retry.backoffSettings.initialRpcTimeoutMillis;
  var error = new Error('Retry total timeout exceeded before any' +
      'response was received');
  var now = new Date();
  var deadline = now.getTime() + retry.backoffSettings.totalTimeoutMillis;

  /**
   * Equivalent to ``aFunc``, but retries upon transient failure.
   *
   * Retrying is done through an exponential backoff algorithm configured
   * by the options in ``retry``.
   * @param {Object} argument The request object.
   * @param {Function} callback The callback.
   * @return {EventEmitter} The event emitter to handle retrying API call.
   */
  return function retryingFunc(argument, callback) {
    var eventEmitter = new EventEmitter();

    /** Repeat the API call as long as necessary. */
    function repeat() {
      // Canceled or cancel scheduled.
      if (eventEmitter._state !== EventEmitter.States.STARTED) {
        return;
      }

      if (now.getTime() >= deadline) {
        callback(error);
        return;
      }

      var toCall = addTimeoutArg(aFunc, timeout, otherArgs);
      eventEmitter._setEventHandler(toCall(argument, function(err, response) {
        if (!err) {
          callback(null, response);
          return;
        }
        if (retry.retryCodes.indexOf(err.code) < 0) {
          error = new Error('Exception occurred in retry method that was ' +
              'not classified as transient');
          error.cause = err;
          callback(error);
        } else {
          error = new Error('Retry total timeout exceeded with exception');
          error.cause = err;
          var toSleep = Math.random() * delay;
          setTimeout(function() {
            now = new Date();
            delay = Math.min(delay * delayMult, maxDelay);
            timeout = Math.min(timeout * timeoutMult, maxTimeout,
                                          deadline - now.getTime());
            repeat();
          }, toSleep);
        }
      }));
    }
    repeat();
    return eventEmitter;
  };
}

/**
 * Creates an API caller for normal methods.
 *
 * @private
 *
 * @return {Object} a caller to handle individual APIs.
 */
function normalApiCall() {
  return {
    init: function(callback) {
      return new EventEmitter(callback);
    },
    call: function(apiCall, argument, settings, emitter) {
      emitter._setEventHandler(apiCall(argument, emitter._callback));
    }
  };
}

/**
 * Creates an API caller that returns a stream to performs page-streaming.
 *
 * @private
 *
 * @param {PageDescriptor} pageDescriptor - indicates the structure
 *   of page streaming to be performed.
 * @return {Object} A caller which creates a stream and handles the streaming.
 */
function pageStreamable(pageDescriptor) {
  return {
    init: function createStream(callback) {
      var stream = through2.obj();
      if (callback) {
        stream.on('data', function(data) {
          callback(null, data);
        });
        stream.on('error', callback);
      }
      return stream;
    },
    call: function pageStreaming(apiCall, argument, settings, stream) {
      if (!settings.flattenPages && settings.pageToken !== gax.FIRST_PAGE) {
        argument[pageDescriptor.requestPageTokenField] = settings.pageToken;
      }

      /** Execute apiCall as long as necessary or to the end of the stream. */
      function streaming() {
        apiCall(argument, function(err, response) {
          if (err) {
            stream.emit('error', err);
            stream.end();
            return;
          }
          if (!stream.writable) {
            return;
          }
          if (settings.flattenPages) {
            var resources = response[pageDescriptor.resourceField];
            for (var i in resources) {
              if (!stream.writable) {
                break;
              }
              stream.write(resources[i]);
            }
          } else {
            stream.write(response);
          }
          if (!stream.writable) {
            return;
          }
          var nextPageToken = response[pageDescriptor.responsePageTokenField];
          if (!nextPageToken) {
            stream.end();
            return;
          }
          argument[pageDescriptor.requestPageTokenField] = nextPageToken;
          setTimeout(streaming, 0);
        });
      }
      setTimeout(streaming, 0);
    }
  };
}

/**
 * Creates an API caller that bundles requests.
 *
 * @private
 *
 * @param {BundleExecutor} bundler - bundles requests and schedules the events.
 * @return {Object} A caller which bundles requests.
 */
function bundleable(bundler) {
  return {
    init: function(callback) {
      return new BundleEventEmitter(bundler, callback);
    },
    call: function(apiCall, request, settings, emitter) {
      if (settings.bundler) {
        settings.bundler.schedule(apiCall, request, emitter);
      } else {
        emitter._start();
        emitter._setEventHandler(apiCall(request, emitter._callback));
      }
    }
  };
}

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
 * @return {APICall} func - a bound method on a request stub used
 *   to make an rpc call.
 * @throws - if `settings` has incompatible values, e.g, if bundling
 *   and page_streaming are both configured.
 */
exports.createApiCall = function createApiCall(funcWithAuth, settings) {
  var apiCaller;
  if (settings.pageDescriptor) {
    assert(!settings.bundler, 'The API call has incompatible settings: ' +
        'bundling and page streaming');
    apiCaller = pageStreamable(settings.pageDescriptor);
  } else if (settings.bundler) {
    apiCaller = bundleable(settings.bundler);
  } else {
    apiCaller = normalApiCall();
  }

  return function apiCallInner(request, callOptions, callback) {
    var thisSettings = settings.merge(callOptions);
    var result = apiCaller.init(callback);
    funcWithAuth.then(function(func) {
      if (thisSettings.retry && thisSettings.retry.retryCodes) {
        return retryable(func, thisSettings.retry, thisSettings.otherArgs);
      }
      return addTimeoutArg(func, thisSettings.timeout, thisSettings.otherArgs);
    }).then(function(apiCall) {
      apiCaller.call(apiCall, request, thisSettings, result);
    }).catch(function(err) {
      // setTimeout is necessary to raise an error outside of the promise.
      // Otherwise the error won't be thrown to the outer environment but
      // used for rejecting the promise itself.
      setTimeout(function() {
        result.emit('error', err);
      }, 0);
    });
    return result;
  };
};
