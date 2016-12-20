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
var nextTick = require('process-nextick-args');
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
    operationsClient, responseDecoder, metadataDecoder) {
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
    apiCall, argument, settings, canceller) {
  var self = this;
  canceller.call(function(argument, callback) {
    self._wrapOperation(apiCall, settings, argument, callback);
  }, argument);
};

LongrunningApiCaller.prototype._wrapOperation = function(
  apiCall, settings, argument, callback) {
  var backoffSettings = settings.longrunning;
  if (!backoffSettings) {
    backoffSettings =
        createBackoffSettings(100, 1.3, 60000, null, null, null, 600000);
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
      backoffSettings
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
 */
function Operation(grpcOp, longrunningDescriptor, backoffSettings) {
  events.EventEmitter.call(this);
  this.completeListeners = 0;
  this.hasActiveListeners = false;

  this.currentOperation = grpcOp;
  this.longrunningDescriptor = longrunningDescriptor;
  this.backoffSettings = backoffSettings;
  this.listenForEvents_();
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
Operation.prototype.listenForEvents_ = function() {
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
  if (this.currentCallPromise) {
    this.currentCallPromise.cancel();
  }
  var operationsClient = this.longrunningDescriptor.operationsClient;
  return operationsClient.cancelOperation({name: this.currentOperation.name});
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
 */
Operation.prototype.getOperation = function(callback) {
  var self = this;
  var responseDecoder = this.longrunningDescriptor.responseDecoder;
  var metadataDecoder = this.longrunningDescriptor.metadataDecoder;
  var operationsClient = this.longrunningDescriptor.operationsClient;

  function unpackResponse(op) {
    self.currentOperation = op;
    var response;
    var metadata;

    if (op.done) {
      if (op.result === 'error') {
        var error = new Error(op.error.message);
        error.code = op.error.code;
        callback(error);
        return;
      }

      if (responseDecoder && op.response) {
        response = responseDecoder(op.response.value);
      }
    }

    if (metadataDecoder && op.metadata) {
      metadata = metadataDecoder(op.metadata.value);
    }
    callback(null, response, metadata, op);
  }

  if (this.currentOperation.done) {
    unpackResponse(this.currentOperation);
    return;
  }

  this.currentCallPromise =
      operationsClient.getOperation({name: this.currentOperation.name});

  this.currentCallPromise
    .then(function(responses) {
      unpackResponse(responses[0]);
    }).catch(function(err) {
      callback(err);
    });
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
  var deadline = now.getTime() + this.backoffSettings.totalTimeoutMillis;
  var previousMetadataBytes;
  if (this.currentOperation.metadata) {
    previousMetadataBytes = this.currentOperation.metadata.value;
  }

  function emit() {
    self.emit.apply(self, Array.prototype.slice.call(arguments, 0));
  }

  function retry() {
    if (!self.hasActiveListeners) {
      return;
    }

    if (now.getTime() >= deadline) {
      nextTick(emit, 'error', new Error('Total timeout exceeded before ' +
          'any response was received'));
      return;
    }

    self.getOperation(function(err, result, metadata, rawResponse) {
      if (err) {
        nextTick(emit, 'error', err);
        return;
      }

      if (!result) {
        if (rawResponse.metadata && (!previousMetadataBytes ||
              !rawResponse.metadata.value.equals(previousMetadataBytes))) {
          nextTick(emit, 'progress', metadata, rawResponse);
          previousMetadataBytes = rawResponse.metadata.value;
        }
        setTimeout(function() {
          now = new Date();
          delay = Math.min(delay * delayMult, maxDelay);
          retry();
        }, delay);
        return;
      }

      nextTick(emit, 'complete', result, metadata, rawResponse);
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

  return new Promise(function(resolve, reject) {
    self
      .on('error', reject)
      .on('complete', function(result, metadata, rawResponse) {
        resolve([result, metadata, rawResponse]);
      });
  });
};

exports.operation = function(op, longrunningDescriptor, backoffSettings) {
  return new Operation(op, longrunningDescriptor, backoffSettings);
};

