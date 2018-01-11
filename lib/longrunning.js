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

var createBackoffSettings = require('./gax').createBackoffSettings;
var NormalApiCaller = require('./api_callable').NormalApiCaller;
var events = require('events');
var util = require('util');

/**
 * A callback to upack a google.protobuf.Any message.
 * @callback anyDecoder
 * @param {google.protobuf.Any} message - The message to unpacked.
 * @return {Object} - The unpacked message.
 */

/**
 * Describes the structure of a page-streaming call.
 *
 * @property {OperationsClient} operationsClient
 * @property {anyDecoder} responseDecoder
 * @property {anyDecoder} metadataDecoder
 *
 * @param {OperationsClient} operationsClient - The client used to poll or
 *   cancel an operation.
 * @param {anyDecoder=} responseDecoder - The decoder to unpack
 *   the response message.
 * @param {anyDecoder=} metadataDecoder - The decoder to unpack
 *   the metadata message.
 *
 * @constructor
 */
function LongrunningDescriptor(
  operationsClient,
  responseDecoder,
  metadataDecoder
) {
  this.operationsClient = operationsClient;
  this.responseDecoder = responseDecoder;
  this.metadataDecoder = metadataDecoder;
}

LongrunningDescriptor.prototype.apiCaller = function() {
  return new LongrunningApiCaller(this);
};

exports.LongrunningDescriptor = LongrunningDescriptor;

/**
 * Creates an API caller that performs polling on a long running operation.
 *
 * @private
 * @constructor
 * @param {LongrunningDescriptor} longrunningDescriptor - Holds the
 * decoders used for unpacking responses and the operationsClient
 * used for polling the operation.
 */
function LongrunningApiCaller(longrunningDescriptor) {
  NormalApiCaller.call(this);
  this.longrunningDescriptor = longrunningDescriptor;
}

util.inherits(LongrunningApiCaller, NormalApiCaller);

LongrunningApiCaller.prototype.call = function(
  apiCall,
  argument,
  settings,
  canceller
) {
  var self = this;
  canceller.call(function(argument, callback) {
    self._wrapOperation(apiCall, settings, argument, callback);
  }, argument);
};

LongrunningApiCaller.prototype._wrapOperation = function(
  apiCall,
  settings,
  argument,
  callback
) {
  var backoffSettings = settings.longrunning;
  if (!backoffSettings) {
    backoffSettings = createBackoffSettings(
      100,
      1.3,
      60000,
      null,
      null,
      null,
      null
    );
  }

  var longrunningDescriptor = this.longrunningDescriptor;
  return apiCall(argument, function(err, rawResponse) {
    if (err) {
      callback(err, null, rawResponse);
      return;
    }

    var operation = new Operation(
      rawResponse,
      longrunningDescriptor,
      backoffSettings,
      settings
    );

    callback(null, operation, rawResponse);
  });
};

/**
 * Wrapper for a google.longrunnung.Operation.
 *
 * @constructor
 *
 * @param {google.longrunning.Operation} grpcOp - The operation to be wrapped.
 * @param {LongrunningDescriptor} longrunningDescriptor - This defines the
 * operations service client and unpacking mechanisms for the operation.
 * @param {BackoffSettings} backoffSettings - The backoff settings used in
 * in polling the operation.
 * @param {CallOptions=} callOptions - CallOptions used in making get operation
 * requests.
 */
function Operation(
  grpcOp,
  longrunningDescriptor,
  backoffSettings,
  callOptions
) {
  events.EventEmitter.call(this);
  this.completeListeners = 0;
  this.hasActiveListeners = false;

  this.latestResponse = grpcOp;
  this.longrunningDescriptor = longrunningDescriptor;
  this.result = null;
  this.metadata = null;
  this.backoffSettings = backoffSettings;
  this._unpackResponse(grpcOp);
  this._listenForEvents();
  this._callOptions = callOptions;
}
util.inherits(Operation, events.EventEmitter);

/**
 * Begin listening for events on the operation. This method keeps track of how
 * many "complete" listeners are registered and removed, making sure polling is
 * handled automatically.
 *
 * As long as there is one active "complete" listener, the connection is open.
 * When there are no more listeners, the polling stops.
 *
 * @private
 */
Operation.prototype._listenForEvents = function() {
  var self = this;

  this.on('newListener', function(event) {
    if (event === 'complete') {
      self.completeListeners++;

      if (!self.hasActiveListeners) {
        self.hasActiveListeners = true;
        self.startPolling_();
      }
    }
  });

  this.on('removeListener', function(event) {
    if (event === 'complete' && --self.completeListeners === 0) {
      self.hasActiveListeners = false;
    }
  });
};

/**
 * Cancels current polling api call and cancels the operation.
 *
 * @return {Promise} the promise of the OperationsClient#cancelOperation api
 * request.
 */
Operation.prototype.cancel = function() {
  if (this.currentCallPromise_) {
    this.currentCallPromise_.cancel();
  }
  var operationsClient = this.longrunningDescriptor.operationsClient;
  return operationsClient.cancelOperation({name: this.latestResponse.name});
};

/**
 * @callback GetOperationCallback
 * @param {?Error} error
 * @param {?Object} result
 * @param {?Object} metadata
 * @param {?google.longrunning.Operation} rawResponse
 */

/**
 * Get the updated status of the operation. If the Operation has previously
 * completed, this will use the status of the cached completed operation.
 *
 *   - callback(err): Operation failed
 *   - callback(null, result, metadata, rawResponse): Operation complete
 *   - callback(null, null, metadata, rawResponse): Operation incomplete
 *
 * @param {getOperationCallback} callback - Callback to handle the polled
 * operation result and metadata.
 * @return {Promise|undefined} - This returns a promise if a callback is not specified.
 * The promise resolves to an array where the first element is the unpacked
 * result, the second element is the metadata, and the third element is the raw
 * response of the api call. The promise rejects if the operation returns an
 * error.
 */
Operation.prototype.getOperation = function(callback) {
  var self = this;
  var operationsClient = this.longrunningDescriptor.operationsClient;

  function promisifyResponse() {
    if (!callback) {
      var PromiseCtor = self._callOptions.promise;
      return new PromiseCtor(function(resolve, reject) {
        if (self.latestResponse.error) {
          var error = new Error(self.latestReponse.error.message);
          error.code = self.latestReponse.error.code;
          reject(error);
        } else {
          resolve([self.result, self.metadata, self.latestResponse]);
        }
      });
    }
    return;
  }

  if (this.latestResponse.done) {
    this._unpackResponse(this.latestResponse, callback);
    return promisifyResponse();
  }

  this.currentCallPromise_ = operationsClient.getOperation(
    {name: this.latestResponse.name},
    this._callOptions
  );

  var noCallbackPromise = this.currentCallPromise_.then(function(responses) {
    self.latestResponse = responses[0];
    self._unpackResponse(responses[0], callback);
    return promisifyResponse();
  });

  if (!callback) {
    return noCallbackPromise;
  }
};

Operation.prototype._unpackResponse = function(op, callback) {
  var responseDecoder = this.longrunningDescriptor.responseDecoder;
  var metadataDecoder = this.longrunningDescriptor.metadataDecoder;
  var response;
  var metadata;

  if (op.done) {
    if (op.result === 'error') {
      var error = new Error(op.error.message);
      error.code = op.error.code;
      if (callback) {
        callback(error);
      }
      return;
    }

    if (responseDecoder && op.response) {
      response = responseDecoder(op.response.value);
      this.result = response;
    }
  }

  if (metadataDecoder && op.metadata) {
    metadata = metadataDecoder(op.metadata.value);
    this.metadata = metadata;
  }
  if (callback) {
    callback(null, response, metadata, op);
  }
};

/**
 * Poll `getOperation` to check the operation's status. This runs a loop to ping
 * using the backoff strategy specified at initialization.
 *
 * Note: This method is automatically called once a "complete" event handler is
 * registered on the operation.
 *
 * @private
 */
Operation.prototype.startPolling_ = function() {
  var self = this;

  var now = new Date();
  var delayMult = this.backoffSettings.retryDelayMultiplier;
  var maxDelay = this.backoffSettings.maxRetryDelayMillis;
  var delay = this.backoffSettings.initialRetryDelayMillis;
  var deadline = Infinity;
  if (this.backoffSettings.totalTimeoutMillis) {
    deadline = now.getTime() + this.backoffSettings.totalTimeoutMillis;
  }
  var previousMetadataBytes;
  if (this.latestResponse.metadata) {
    previousMetadataBytes = this.latestResponse.metadata.value;
  }

  function emit() {
    self.emit.apply(self, Array.prototype.slice.call(arguments, 0));
  }

  function retry() {
    if (!self.hasActiveListeners) {
      return;
    }

    if (now.getTime() >= deadline) {
      setImmediate(
        emit,
        'error',
        new Error(
          'Total timeout exceeded before ' + 'any response was received'
        )
      );
      return;
    }

    self.getOperation(function(err, result, metadata, rawResponse) {
      if (err) {
        setImmediate(emit, 'error', err);
        return;
      }

      if (!result) {
        if (
          rawResponse.metadata &&
          (!previousMetadataBytes ||
            !rawResponse.metadata.value.equals(previousMetadataBytes))
        ) {
          setImmediate(emit, 'progress', metadata, rawResponse);
          previousMetadataBytes = rawResponse.metadata.value;
        }
        setTimeout(function() {
          now = new Date();
          delay = Math.min(delay * delayMult, maxDelay);
          retry();
        }, delay);
        return;
      }

      setImmediate(emit, 'complete', result, metadata, rawResponse);
    });
  }
  retry();
};

/**
 * Wraps the `complete` and `error` events in a Promise.
 *
 * @return {promise} - Promise that resolves on operation completion and rejects
 * on operation error.
 */
Operation.prototype.promise = function() {
  var self = this;
  var PromiseCtor = this._callOptions.promise;
  return new PromiseCtor(function(resolve, reject) {
    self
      .on('error', reject)
      .on('complete', function(result, metadata, rawResponse) {
        resolve([result, metadata, rawResponse]);
      });
  });
};

/**
 * Method used to create Operation objects.
 *
 * @constructor
 *
 * @param {google.longrunning.Operation} op - The operation to be wrapped.
 * @param {LongrunningDescriptor} longrunningDescriptor - This defines the
 * operations service client and unpacking mechanisms for the operation.
 * @param {BackoffSettings} backoffSettings - The backoff settings used in
 * in polling the operation.
 * @param {CallOptions=} callOptions - CallOptions used in making get operation
 * requests.
 */
exports.operation = function(
  op,
  longrunningDescriptor,
  backoffSettings,
  callOptions
) {
  return new Operation(op, longrunningDescriptor, backoffSettings, callOptions);
};
