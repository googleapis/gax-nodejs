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
 * @callback APICallback
 * @param {?Error} error
 * @param {?Object} response
 */

/**
 * @callback APIFunc
 * @param {Object} argument
 * @param {APICallback} callback
 * @param {grpc.Metadata} metadata
 * @param {Object} options
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
 * @returns {APIFunc} the original function updated to the timeout arg
 */
function addTimeoutArg(aFunc, timeout) {
  return function timeoutFunc(argument, callback, metadata, options) {
    var now = new Date();
    options.deadline = new Date(now.getTime() + timeout);
    aFunc(argument, callback, metadata, options);
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
 * @returns {APIFunc} A function that will retry on exception.
 */
function retryable(aFunc, retry) {
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
   */
  return function retryingFunc(argument, callback, metadata, options) {
    if (now.getTime() >= deadline) {
      callback(error);
      return;
    }
    var toCall = addTimeoutArg(aFunc, timeout);
    toCall(argument, function(err, response) {
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
                     retryingFunc(argument, callback, metadata, options);
                   }, toSleep);
      }
    }, metadata, options);
  };
}

/**
 * Creates a function that returns a stream to performs page-streaming.
 *
 * @private
 *
 * @param {APIFunc} aFunc - an API call that is page streaming.
 * @param {gax.PageDescriptor} pageDescriptor - indicates the structure
 *   of page streaming to be performed.
 * @param {Object} pageToken - If set and page streaming is over pages of
 *   the response, indicates the page_token to be passed to the API call.
 * @param {boolean} flattenPages - If true, the returned iterable is over
 *   `resourceField`; otherwise the returned iterable is over the pages
 *   of the response, each of which is an iterable over `resourceField`.
 * @returns {APIFunc} A function for the page streaming. By default, it returns
 *   a stream over the specified field, but if callback function  is specified
 *   at the end, it invokes the callback function with the response object and
 *   returns null.
 */
function pageStreamable(aFunc,
                        pageDescriptor,
                        pageToken,
                        flattenPages) {
  return function pageStreaming(argument, callback, metadata, options) {
    if (callback) {
      console.warn('callback is specified, but callbacks are ignored for ' +
                   'page streaming API calls.');
    }

    var stream = through2.obj();
    if (!flattenPages && pageToken != gax.FIRST_PAGE) {
      argument[pageDescriptor.requestPageTokenField] = pageToken;
    }

    function streaming() {
      aFunc(argument, function(err, response) {
        if (err) {
          stream.emit('error', err);
          stream.end();
          return;
        }
        if (!stream.writable) {
          return;
        }
        if (flattenPages) {
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
      }, metadata, options);
    }
    setTimeout(streaming, 0);
    return stream;
  };
}

/**
 * Converts an rpc call into an API call governed by the settings.
 *
 * In typical usage, `func` will be a callable used to make an rpc request.
 * This will mostly likely be a bound method from a request stub used to make
 * an rpc call.
 *
 * The result is created by applying a series of function decorators defined
 * in this module to `func`.  `settings` is used to determine which function
 * decorators to apply.
 *
 * The result is another callable which for most values of `settings` has
 * has the same signature as the original. Only when `settings` configures
 * bundling does the signature change.
 * @param {APIFunc} func - is used to make a bare rpc call
 * @param {CallSettings} settings - provides the settings for this call
 * @returns {APIFunc} func - a bound method on a request stub used
 *   to make an rpc call
 * @throws - if `settings` has incompatible values, e.g, if bundling
 *   and page_streaming are both configured
 */
exports.createApiCall = function createApiCall(func, settings) {
  var apiCall;
  if (settings.retry && settings.retry.retryCodes) {
    apiCall = retryable(func, settings.retry);
  } else {
    apiCall = addTimeoutArg(func, settings.timeout);
  }
  if (settings.pageDescriptor) {
    assert(!settings.bundler, 'The API call has incompatible settings: ' +
        'bundling and page streaming');
    return pageStreamable(apiCall,
                          settings.pageDescriptor,
                          settings.pageToken,
                          settings.flattenPages);
  }
  // TODO: support bundling
  return apiCall;
};
