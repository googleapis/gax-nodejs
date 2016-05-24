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
var through2 = require('through2');
var setTimeout = require('timers').setTimeout;

/**
 * @callback Callback
 * @param {?Error} err - an error, if something goes wrong for the API.
 * @param {?Object} response - the response object for the API call.
 */

/**
 * The actual interface of an API call - this interface follows the
 * actual interface for gRPC.
 * @callback APICall
 * @param {Object} argument - the request object.
 * @param {Callback} callback - the callback function to be called
 *   when the API call finishes.
 * @param {grpc.Metadata} metadata - the gRPC metadata (like header
 *   information).
 * @param {Object} options - the additional options such as deadline.
 */

/**
 * The result of createApiCall. Similar to APICall but some parameters
 * can be customizable through callOptions.
 * @callback APICallable
 * @param {Object} argument - the request object.
 * @param {Callback} callback - the callback function to be called
 *   when the API call finishes.
 * @param {grpc.Metadata} metadata - the gRPC metadata object (lik header
 *   information).
 * @param {CallOptions} callOptions - the CallOptions to customize the
 *   parameter of the API calls.
 */

/**
 * Updates aFunc so that it gets called with the timeout as its final arg.
 *
 * This converts a function, aFunc, into another function with updated deadline.
 *
 * @param {APICall} aFunc - a function to be updated
 * @param {CallSettings} callSettings - the current call settings.
 * @returns {APICallable} the original function updated to the timeout arg
 */
function addTimeoutArg(aFunc, callSettings) {
  return function timeoutFunc(argument, callback, metadata, callOptions) {
    var now = new Date();
    var timeout = callSettings.merge(callOptions).timeout;
    var options = {'deadline': new Date(now.getTime() + timeout)};
    aFunc(argument, callback, metadata, options);
  };
}

/**
 * Creates a function equivalent to aFunc, but that retries on certain
 * exceptions.
 *
 * @param {APICall} aFunc - A function.
 * @param {RetryOptions} retry - Configures the exceptions upon which the
 *   function eshould retry, and the parameters to the exponential backoff retry
 *   algorithm.
 * @returns {APICallable} A function that will retry on exception.
 */
function retryable(aFunc, callSettings) {
  var delayMult;
  var maxDelay;
  var timeoutMult;
  var maxTimeout;
  var delay;
  var now;
  var deadline;
  var retryCodes;
  var error = new Error('Retry total timeout exceeded before any' +
      'response was received');

  function retryingFunc(argument, callback, metadata, callOptions) {
    if (now.getTime() >= deadline) {
      callback(error);
      return;
    }
    var toCall = addTimeoutArg(aFunc, callSettings);
    toCall(argument, function(err, response) {
      if (!err) {
        callback(null, response);
        return;
      }
      if (retryCodes.indexOf(err.code) < 0) {
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
                     var settings = callSettings.merge(callOptions);
                     var timeout = Math.min(settings.timeout * timeoutMult,
                                            maxTimeout,
                                            deadline - now.getTime());
                     callOptions.timeout = timeout;
                     retryingFunc(argument, callback, metadata, callOptions);
                   }, toSleep);
      }
    }, metadata, callOptions);
  }

  return function retryCallable(argument, callback, metadata, callOptions) {
    var settings = callSettings.merge(callOptions);
    var apiCall;
    if (settings.retry) {
      var retry = settings.retry;
      delayMult = retry.backoffSettings.retryDelayMultiplier;
      maxDelay = retry.backoffSettings.maxRetryDelayMillis;
      timeoutMult = retry.backoffSettings.rpcTimeoutMultiplier;
      maxTimeout = retry.backoffSettings.maxRpcTimeoutMillis;
      delay = retry.backoffSettings.initialRetryDelayMillis;

      retryCodes = retry.retryCodes;
      // Recreate the callOptions parameter to allow updating timeout parameter.
      callOptions = new gax.CallOptions(callOptions || {});
      callOptions.timeout = retry.backoffSettings.initialRpcTimeoutMillis;
      now = new Date();
      deadline = now.getTime() + retry.backoffSettings.totalTimeoutMillis;
      apiCall = retryingFunc;
    } else {
      apiCall = addTimeoutArg(aFunc, settings);
    }
    apiCall(argument, callback, metadata, callOptions);
  };
}

/**
 * Creates a function that returns a stream to performs page-streaming.
 * @param {APICallable} a_func - an API call that is page streaming.
 * @param {string} requestPageTokenField - The field of the page token in the
 *   request.
 * @param {string} responsePageTokenField - The field of the next page token in
 *   the response.
 * @param {string} resourceField - The field to be streamed.
 * @returns {APICallable} A function for the page streaming. By default, it
 *   returns a stream over the specified field, but if callback function
 *   is specified at the end, it invokes the callback function with the response
 *   object and returns null.
 */
function pageStreamable(aFunc,
                        requestPageTokenField,
                        responsePageTokenField,
                        resourceField) {
  return function pageStreaming(argument, callback, metadata, callOptions) {
    if (callback) {
      aFunc(argument, callback, metadata, callOptions);
      return null;
    }

    var streamFinished = false;
    var stream = through2.obj(function(chunk, enc, callback) {
      var resources = chunk[resourceField];
      for (var i in resources) {
        this.push(resources[i]);
      }
      callback();
    });
    stream.on('finish', function() {
      streamFinished = true;
    });

    function streaming() {
      aFunc(argument, function(err, response) {
        if (err) {
          stream.emit('error', err);
          stream.end();
          return;
        }
        stream.write(response);
        if (streamFinished) {
          return;
        }
        var nextPageToken = response[responsePageTokenField];
        if (!nextPageToken) {
          stream.end();
          return;
        }
        argument[requestPageTokenField] = nextPageToken;
        streaming();
      }, metadata, callOptions);
    }
    streaming();
    return stream;
  };
}

/**
 * Converts an rpc call into an API call governed by the settings.
 *
 * In typical usage, ``func`` will be a callable used to make an rpc request.
 * This will mostly likely be a bound method from a request stub used to make
 * an rpc call.
 *
 * The result is created by applying a series of function decorators defined
 * in this module to ``func``.  ``settings`` is used to determine which
 * function decorators to apply.
 *
 * The result is another callable which for most values of ``settings`` has
 * has the same signature as the original. Only when ``settings`` configures
 * bundling does the signature change.
 * @param {APICall} func - is used to make a bare rpc call
 * @param {CallSettings} settings - provides the settings for this call
 * @returns {APICallable} func - a bound method on a request stub used
 *   to make an rpc call
 * @throws - if ``settings`` has incompatible values, e.g, if bundling
 *   and page_streaming are both configured
 */
exports.createApiCall = function createApiCall(func, settings) {
  var apiCall = retryable(func, settings);
  if (settings.pageDescriptor) {
    assert(!settings.bundler, 'The API call has incompatible settings: ' +
        'bundling and page streaming');
    return pageStreamable(apiCall,
                          settings.pageDescriptor.requestPageTokenField,
                          settings.pageDescriptor.responsePageTokenField,
                          settings.pageDescriptor.resourceField);
  }
  // TODO: support bundling
  return apiCall;
};
