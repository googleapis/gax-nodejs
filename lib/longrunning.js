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

function Operation(grpcOp, longrunningDescriptor, backoffSettings) {
  events.EventEmitter.call(this);
  this.completeListeners = 0;
  this.hasActiveListeners = false;

  this.grpcOp = grpcOp;
  this.longrunningDescriptor = longrunningDescriptor;
  this.backoffSettings = backoffSettings;
  this.listenForEvents_();
}
util.inherits(Operation, events.EventEmitter);

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

Operation.prototype.cancel = function() {
  if (this.currentCallPromise) {
    this.currentCallPromise.cancel();
  }
  var operationsClient = this.longrunningDescriptor.operationsClient;
  return operationsClient.cancelOperation({name: this.grpcOp.name});
};

Operation.prototype.poll_ = function(callback) {
  var self = this;
  var responseDecoder = this.longrunningDescriptor.responseDecoder;
  var metadataDecoder = this.longrunningDescriptor.metadataDecoder;
  var operationsClient = this.longrunningDescriptor.operationsClient;

  function unpackResponse(op) {
    self.grpcOp = op;
    var response;
    var metadata;

    if (op.done) {
      if (op.result === 'error') {
        var error;
        error = new Error(op.error.message);
        error.code = op.error.code;
        callback(error);
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

  if (this.grpcOp.done) {
    unpackResponse(this.grpcOp);
    return;
  }

  this.currentCallPromise =
      operationsClient.getOperation({name: this.grpcOp.name});

  this.currentCallPromise
    .then(function(responses) {
      unpackResponse(responses[0]);
    }).catch(function(err) {
      callback(err);
    });
};

Operation.prototype.startPolling_ = function() {
  var self = this;

  var now = new Date();
  var delayMult = self.backoffSettings.retryDelayMultiplier;
  var maxDelay = self.backoffSettings.maxRetryDelayMillis;
  var delay = self.backoffSettings.initialRetryDelayMillis;
  var deadline = now.getTime() + self.backoffSettings.totalTimeoutMillis;

  function retry() {
    if (!self.hasActiveListeners) {
      return;
    }

    if (now.getTime() >= deadline) {
      self.emit('error', new Error('Total timeout exceeded before any' +
          'response was received'));
      return;
    }

    self.poll_(function(err, result, metadata, rawResponse) {
      if (err) {
        setTimeout(function() {
          self.emit('error', err);
        }, 0);
        return;
      }

      setTimeout(function() {
        self.emit('response', metadata, rawResponse);
      }, 0);

      if (!result) {
        setTimeout(function() {
          now = new Date();
          delay = Math.min(delay * delayMult, maxDelay);
          retry();
        }, delay);
        return;
      }
      setTimeout(function() {
        self.emit('complete', result, metadata, rawResponse);
      }, 0);
    });
  }
  retry();
};

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

Operation.prototype.unpackResponse_ = function(response) {};

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
  canceller.call(this._wrapOperation.bind(this, apiCall, settings), argument);
};

LongrunningApiCaller.prototype._wrapOperation = function(
  apiCall, settings, argument, callback) {
  var backoffSettings = settings.longrunningBackoffSettings;
  if (!backoffSettings) {
    backoffSettings =
        createBackoffSettings(100, 1.3, 60000, null, null, null, 600000);
  }
  var operation;

  var longrunningDescriptor = this.longrunningDescriptor;
  var initialApiCallCancel = apiCall(argument, function(err, rawResponse) {
    if (err) {
      callback(err);
      return;
    }
    operation = new Operation(
      rawResponse,
      longrunningDescriptor,
      backoffSettings
    );

    callback(null, operation, rawResponse);
  });

  return {
    cancel: function() {
      if (operation) {
        console.log('here');

        operation.cancel().then(function() {
          console.log('here');
          callback(new Error(
            'Operation ' + operation.name + ' has been cancelled.'
          ));
        });
        return;
      }
      initialApiCallCancel();
      callback(new Error('cancelled'));
    }
  };
};

/**
* A callback to upack a google.protobuf.Any message.
* @callback anyDecoder
* @param {google.protobuf.Any} message - The message to unpacked.
* @return {Object} - The unpacked message.
*/

/**
 * Describes the structure of a page-streaming call.
 *
 * @property {operationsClient} operationsClient
 * @property {anyDecoder} responseDecoder
 * @property {anyDecoder} metadataDecoder
 *
 * @param {operationsClient} operationsClient - The client used to poll or cancel an
 *   operations
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
