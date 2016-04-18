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
 * Updates aFunc so that it gets called with the timeout as its final arg.
 *
 * This converts a function, aFunc, into another function with updated deadline.
 *
 * @param {function()} aFunc - a function to be updated
 * @param {number} timeout - to be added to the original function as it final
 *   positional arg.
 * @returns {function()} the original function updated to the timeout arg
 */
function addTimeoutArg(aFunc, timeout) {
  return function timeoutFunc(argument, metadata, options, callback) {
    var now = new Date();
    options.deadline = new Date(now.getTime() + timeout);
    return aFunc(argument, metadata, options, callback);
  };
}

/**
 * Creates a function equivalent to aFunc, but that retries on certain
 * exceptions.
 *
 * @param {function()} aFunc - A function.
 * @param {RetryOptions} retry - Configures the exceptions upon which the
 *   function eshould retry, and the parameters to the exponential backoff retry
 *   algorithm.
 * @returns {function()} A function that will retry on exception.
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
  return function retryingFunc(argument, metadata, options, callback) {
    if (now.getTime() >= deadline) {
      callback(error);
      return;
    }
    var toCall = addTimeoutArg(aFunc, timeout);
    toCall(argument, metadata, options, function(err, response) {
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
                     retryingFunc(argument, metadata, options, callback);
                   }, toSleep);
      }
    });
  };
}

/**
 * Creates a function that returns a stream to performs page-streaming.
 * @param {function()} a_func - an API call that is page streaming.
 * @param {string} requestPageTokenField - The field of the page token in the
 *   request.
 * @param {string} responsePageTokenField - The field of the next page token in
 *   the response.
 * @param {string} resourceField - The field to be streamed.
 * @returns {function()} A function for the page streaming. By default, it
 *   returns a stream over the specified field, but if callback function
 *   is specified at the end, it invokes the callback function with the response
 *   object and returns null.
 */
function pageStreamable(aFunc,
                        requestPageTokenField,
                        responsePageTokenField,
                        resourceField) {
  return function pageStreaming(argument, metadata, options, callback) {
    if (callback) {
      aFunc(argument, metadata, options, callback);
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
      aFunc(argument, metadata, options, function(err, response) {
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
      });
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
 * @param {function()} func - is used to make a bare rpc call
 * @param {CallSettings} settings - provides the settings for this call
 * @returns {function()} func - a bound method on a request stub used
 *   to make an rpc call
 * @throws - if ``settings`` has incompatible values, e.g, if bundling
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
                          settings.pageDescriptor.requestPageTokenField,
                          settings.pageDescriptor.responsePageTokenField,
                          settings.pageDescriptor.resourceField);
  }
  // TODO: support bundling
  return apiCall;
};
