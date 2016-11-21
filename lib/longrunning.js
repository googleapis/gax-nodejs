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

var _ = require('lodash');
var createBackoffSettings = require('./gax').createBackoffSettings;
var NormalApiCaller = require('./api_callable').NormalApiCaller;
var util = require('util');

/**
 * Creates an API caller that performs polling on a long running operation.
 *
 * @private
 * @constructor
 * @param {LongrunningDescriptor} longrunningDescriptor - Holds the
 * protoDescriptorPool used for unpacking responses and the operationsApi
 * used for polling the operation.
 */
function LongrunningApiCaller(longrunningDescriptor) {
  NormalApiCaller.call(this);
  this.longrunningDescriptor = longrunningDescriptor;
}

util.inherits(LongrunningApiCaller, NormalApiCaller);

LongrunningApiCaller.prototype.call = function(
    apiCall, argument, settings, canceller) {
  if (settings.longrunning) {
    canceller.call(this._poll.bind(this, apiCall, settings), argument);
  } else {
    NormalApiCaller.prototype.call.call(
         this, apiCall, argument, settings, canceller);
  }
};

LongrunningApiCaller.prototype._poll = function(
  apiCall, settings, argument, callback) {
  var backoffSettings = settings.longrunning;
  if (!backoffSettings instanceof Object) {
    backoffSettings =
        createBackoffSettings(100, 1.3, 60000, null, null, null, 600000);
  }

  var now = new Date();
  var delayMult = backoffSettings.retryDelayMultiplier;
  var maxDelay = backoffSettings.maxRetryDelayMillis;
  var delay = backoffSettings.initialRetryDelayMillis;
  var deadline = now.getTime() + backoffSettings.totalTimeoutMillis;
  var longrunningDescriptor = this.longrunningDescriptor;

  var op;
  var grpcCanceller;
  var promiseCanceller;

  var retryOperation = function(responses) {
    grpcCanceller = null;
    op = responses[0];

    if (op.done) {
      if (op.result === 'error') {
        var error;
        error = new Error(op.error.message);
        error.code = op.error.code;
        callback(error);
      } else {
        var response;
        if (longrunningDescriptor.responseDecoder) {
          if (op.response) {
            response = longrunningDescriptor.responseDecoder(op.response.value);
          }
        } else {
          response = this._unpack(op.response);
        }

        var metadata;
        if (longrunningDescriptor.metadataDecoder) {
          if (op.metadata) {
            metadata = longrunningDescriptor.metadataDecoder(op.metadata.value);
          }
        } else {
          metadata = this._unpack(op.metadata);
        }
        callback(null, response, metadata, op);
      }
      return;
    }

    if (now.getTime() >= deadline) {
      callback(new Error('Total timeout exceeded before any' +
          'response was received'));
      return;
    }

    setTimeout(function() {
      now = new Date();
      delay = Math.min(delay * delayMult, maxDelay);
      promiseCanceller =
          longrunningDescriptor.operationsApi.getOperation({name: op.name});
      promiseCanceller.then(retryOperation);
    }, delay);
  };
  retryOperation = retryOperation.bind(this);

  grpcCanceller = apiCall(argument, function(err) {
    if (err) {
      callback(err);
      return;
    }
    retryOperation(Array.prototype.slice.call(arguments, 1));
  });

  return {
    cancel: function() {
      if (op) {
        if (promiseCanceller) {
          promiseCanceller.cancel();
        }
        longrunningDescriptor.operationsApi
          .cancelOperation({name: op.name})
          .then(function() {
            callback(new Error('Operation ' + op.name + ' was canceled.'));
          });
        return;
      }

      if (grpcCanceller) {
        grpcCanceller();
        callback(new Error('cancelled'));
        return;
      }
    }
  };
};

LongrunningApiCaller.prototype._unpack = function(any) {
  var protoDescriptor =
    _.get(this.longrunningDescriptor.protoDescriptorPool, any.typeUrl, null);
  var decoder = protoDescriptor ? protoDescriptor.decode : null;
  return decoder ? decoder(any.value) : null;
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
 * @property {OperationsApi} operationsApi
 * @property {Object} protoDescriptorPool
 * @property {Object} decoders
 *
 * @param {OperationsApi} operationsApi - The client used to poll or cancel an
 *   operation.
 * @param {Object} protoDescriptorPool - The loaded proto object descriptors
 *   used in unpacking responses from an the operation result.
 * @param {Object=} decoders - Decoders for response and metadata
 * @param {anyDecoder=} decoders.responseDecoder - The decoder to unpack
 *   the response message. If not provided, the response will be unpacked if
 *   the proto descriptor of the any value is found in the longrunningDescriptor
 * @param {anyDecoder=} decoders.metadataDecoder - The decoder to unpack
 *   the metadata message. If not provided, the metadata will be unpacked if
 *   the proto descriptor of the any value is found in the longrunningDescriptor
 *   protoDescriptorPool.
 *
 * @constructor
 */
function LongrunningDescriptor(operationsApi, protoDescriptorPool, decoders) {
  this.operationsApi = operationsApi;
  this.protoDescriptorPool = protoDescriptorPool;
  decoders = decoders || {};
  this.responseDecoder = decoders.responseDecoder;
  this.metadataDecoder = decoders.metadataDecoder;
}

LongrunningDescriptor.prototype.apiCaller = function() {
  return new LongrunningApiCaller(this);
};

exports.LongrunningDescriptor = LongrunningDescriptor;
