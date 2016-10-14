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

var through2 = require('through2');
var gax = require('./gax');
var util = require('util');
var setTimeout = require('timers').setTimeout;
var DuplexStream = require('readable-stream').Duplex;

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
 * @return {Promise|Stream}
 */

/**
 * PromiseCanceller manages a promise which has cancel function.
 * @param {APICallback=} callback
 *   The callback to be called when the promise is fulfilled.
 * @constructor
 * @private
 */
function PromiseCanceller(callback) {
  this.promise = new Promise(function(resolve, reject) {
    this.resolve = resolve;
    this.reject = reject;
  }.bind(this));
  if (callback) {
    this.promise = this.promise.then(function(response) {
      callback(null, response);
    }, callback);
  }
  this.promise.cancel = this.cancel.bind(this);
  this.cancelFunc = null;
  this.completed = false;
}

/**
 * Cancels the ongoing promise.
 */
PromiseCanceller.prototype.cancel = function() {
  if (this.completed) {
    return;
  }
  this.completed = true;
  if (this.cancelFunc) {
    this.cancelFunc();
  } else {
    this.reject(new Error('cancelled'));
  }
};

/**
 * A callback-styled method.
 *
 * This will be used for the final parameter of API call.
 * @param {Error=} err
 *   The error when something goes wrong.
 * @param {Object=} response
 *   The response object when succeeds.
 */
PromiseCanceller.prototype.callback = function(err, response) {
  this.completed = true;
  if (err) {
    this.reject(err);
  } else {
    this.resolve(response);
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
PromiseCanceller.prototype.call = function(aFunc, argument) {
  if (this.completed) {
    return;
  }
  var canceller = aFunc(argument, this.callback.bind(this));
  this.cancelFunc = canceller.cancel.bind(canceller);
};

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
 * @return {function(Object, APICallback)}
 *  the function with other arguments and the timeout.
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
    var error = new Error('Retry total timeout exceeded before any' +
        'response was received');
    var now = new Date();
    var deadline = now.getTime() + retry.backoffSettings.totalTimeoutMillis;

    /** Repeat the API call as long as necessary. */
    function repeat() {
      timeoutId = null;
      if (now.getTime() >= deadline) {
        callback(error);
        return;
      }

      var toCall = addTimeoutArg(aFunc, timeout, otherArgs);
      canceller = toCall(argument, function(err, response) {
        if (!err) {
          callback(null, response);
          return;
        }
        canceller = null;
        if (retry.retryCodes.indexOf(err.code) < 0) {
          err.note = 'Exception occurred in retry method that was ' +
              'not classified as transient';
          callback(err);
        } else {
          error = err;
          error.note = 'Retry total timeout exceeded with exception';
          var toSleep = Math.random() * delay;
          timeoutId = setTimeout(function() {
            now = new Date();
            delay = Math.min(delay * delayMult, maxDelay);
            timeout = Math.min(timeout * timeoutMult, maxTimeout,
                                          deadline - now.getTime());
            repeat();
          }, toSleep);
        }
      });
    }
    repeat();

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
      }
    };
  };
}

/**
 * Creates an API caller for normal methods.
 *
 * @private
 * @constructor
 */
function NormalApiCaller() {
}

NormalApiCaller.prototype.init = function(settings, callback) {
  this.canceller = new PromiseCanceller(callback);
  return this.canceller.promise;
};

NormalApiCaller.prototype.wrap = function(func) {
  return func;
};

NormalApiCaller.prototype.call = function(apiCall, argument, settings) {
  this.canceller.call(apiCall, argument);
};

NormalApiCaller.prototype.fail = function(err) {
  this.canceller.reject(err);
};

/**
 * Creates an API caller that returns a stream to performs page-streaming.
 *
 * @private
 * @constructor
 * @param {PageDescriptor} pageDescriptor - indicates the structure
 *   of page streaming to be performed.
 */
function PageStreamable(pageDescriptor) {
  this.pageDescriptor = pageDescriptor;
}

PageStreamable.prototype.createActualCallback = function(callback) {
  return function fetchNextPageToken(err, response) {
    if (err) {
      callback(err);
    }
    var pageToken = response[this.pageDescriptor.responsePageTokenField];
    callback(err, response, pageToken);
  }.bind(this);
};

PageStreamable.prototype.init = function(settings, callback) {
  if (callback) {
    settings.flattenPages = false;
    callback = this.createActualCallback(callback);
  }
  if (!settings.flattenPages) {
    return NormalApiCaller.prototype.init.call(this, settings, callback);
  }
  this.stream = through2.obj();
  return this.stream;
};

PageStreamable.prototype.wrap = function(func) {
  return func;
};

PageStreamable.prototype.streamingCallback = function(err, response) {
  if (err) {
    this.stream.emit('error', err);
    this.stream.end();
    return;
  }

  var resources = response[this.pageDescriptor.resourceField];
  for (var i in resources) {
    if (!this.stream.writable) {
      return;
    }
    this.stream.write(resources[i]);
  }
  if (!this.stream.writable) {
    return;
  }
  var nextPageToken = response[this.pageDescriptor.responsePageTokenField];
  if (!nextPageToken) {
    this.stream.end();
    return;
  }
  this.argument[this.pageDescriptor.requestPageTokenField] = nextPageToken;
  setTimeout(this.streaming.bind(this), 0);
};

PageStreamable.prototype.streaming = function() {
  this.apiCall(this.argument, this.streamingCallback.bind(this));
};

PageStreamable.prototype.call = function(apiCall, argument, settings) {
  if (settings.pageToken) {
    argument[this.pageDescriptor.requestPageTokenField] = settings.pageToken;
  }
  if (!settings.flattenPages) {
    NormalApiCaller.prototype.call.call(this, apiCall, argument, settings);
    return;
  }

  this.argument = argument;
  this.apiCall = apiCall;
  setTimeout(this.streaming.bind(this), 0);
};

PageStreamable.prototype.fail = function(err) {
  if (this.stream) {
    this.stream.emit('error', err);
  } else {
    NormalApiCaller.prototype.fail.call(this, err);
  }
};

/**
 * Creates an API caller that bundles requests.
 *
 * @private
 * @constructor
 * @param {BundleExecutor} bundler - bundles requests and schedules the events.
 */
function Bundleable(bundler) {
  this.bundler = bundler;
  NormalApiCaller.call(this);
}

util.inherits(Bundleable, NormalApiCaller);

Bundleable.prototype.call = function(apiCall, argument, settings) {
  if (!settings.bundler) {
    NormalApiCaller.prototype.call.call(this, apiCall, argument, settings);
    return;
  }
  this.canceller.call(this.bundler.schedule.bind(this.bundler, apiCall),
                      argument);
};

/**
 * StreamProxy is a proxy to gRPC-streaming method.
 *
 * @private
 * @constructor
 * @param {StreamType} type - the type of gRPC stream.
 */
function StreamProxy(type) {
  DuplexStream.call(this, {
    objectMode: true,
    readable: type !== gax.StreamType.CLIENT_STREAMING,
    writable: type !== gax.StreamType.SERVER_STREAMING
  });
  this.type = type;
  this._writeQueue = [];
  this._isEndCalled = false;
  this.on('finish', this._onFinish.bind(this));
}

util.inherits(StreamProxy, DuplexStream);

StreamProxy.prototype._read = function(n) {
  if (this.type === gax.StreamType.CLIENT_STREAMING) {
    this.emit('error', new Error('stream is not readable'));
  }
};

StreamProxy.prototype._write = function(chunk, encoding, callback) {
  if (this.type === gax.StreamType.SERVER_STREAMING) {
    this.emit('error', new Error('stream is not writable'));
    return;
  }
  if (this.stream) {
    this.stream.write(chunk);
  } else {
    this._writeQueue.push(chunk);
  }
  callback();
};

StreamProxy.prototype._onFinish = function() {
  if (this.stream) {
    console.log(this.stream);
    this.stream.end();
  } else {
    this._isEndCalled = true;
  }
};

/**
 * Specifies the target stream.
 * @param {Stream} stream - the target stream.
 */
StreamProxy.prototype.setStream = function(stream) {
  this.stream = stream;
  stream.on('error', this.emit.bind(this, 'error'));
  if (this.type !== gax.StreamType.CLIENT_STREAMING) {
    stream.on('data', this.emit.bind(this, 'data'));
    // Pushing null causes an ending process of the readable stream.
    stream.on('end', this.push.bind(this, null));
  }
  if (this.type !== gax.StreamType.SERVER_STREAMING) {
    this._writeQueue.forEach(function(data) {
      stream.write(data);
    });
    this._writeQueue = [];
    if (this._isEndCalled) {
      stream.end();
    }
  }
};

/**
 * An API caller for methods of gRPC streaming.
 * @private
 * @constructor
 * @param {StreamDescriptor} descriptor - the descriptor of the method structure.
 */
function GrpcStreamable(descriptor) {
  this.descriptor = descriptor;
}

GrpcStreamable.prototype.init = function(settings, callback) {
  this.callback = callback;
  this.stream = new StreamProxy(this.descriptor.type);
  return this.stream;
};

GrpcStreamable.prototype.wrap = function(func) {
  if (this.descriptor.type === gax.StreamType.CLIENT_STREAMING) {
    return function(argument, metadata, options, callback) {
      return func(metadata, options, callback);
    };
  } else if (this.descriptor.type === gax.StreamType.BIDI_STREAMING) {
    return function(argument, metadata, options, callback) {
      return func(metadata, options);
    };
  }
  return func;
};

GrpcStreamable.prototype.call = function(apiCall, argument, settings) {
  this.stream.setStream(apiCall(argument, this.callback));
};

GrpcStreamable.prototype.fail = function(err) {
  this.stream.emit('error', err);
};

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
  if (settings.pageDescriptor && settings.bundler) {
    throw new Error('The API call has incompatible settings: ' +
        'bundling and page streaming');
  }

  return function apiCallInner(request, callOptions, callback) {
    var thisSettings = settings.merge(callOptions);
    var apiCaller;
    if (thisSettings.pageDescriptor) {
      apiCaller = new PageStreamable(thisSettings.pageDescriptor);
    } else if (thisSettings.bundler) {
      apiCaller = new Bundleable(thisSettings.bundler);
    } else if (thisSettings.streaming) {
      apiCaller = new GrpcStreamable(thisSettings.streaming);
    } else {
      apiCaller = new NormalApiCaller();
    }

    var result = apiCaller.init(thisSettings, callback);
    funcWithAuth.then(function(func) {
      func = apiCaller.wrap(func);
      if (thisSettings.retry && thisSettings.retry.retryCodes) {
        return retryable(func, thisSettings.retry, thisSettings.otherArgs);
      }
      return addTimeoutArg(func, thisSettings.timeout, thisSettings.otherArgs);
    }).then(function(apiCall) {
      apiCaller.call(apiCall, request, thisSettings);
    }).catch(function(err) {
      // setTimeout is necessary to raise an error outside of the promise.
      // Otherwise the error won't be thrown to the outer environment but
      // used for rejecting the promise itself.
      setTimeout(function() {
        apiCaller.fail(err);
      }, 0);
    });
    return result;
  };
};
