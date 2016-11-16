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
var util = require('util');
var NormalApiCaller = require('./api_callable').NormalApiCaller;
var createBackoffSettings = require('.gax').createBackoffSettings;

function LongrunningApiCaller(longrunningDescriptor) {
  NormalApiCaller.call(this);
  this.operationsApi = longrunningDescriptor.operationsApi;
  this.protoDescriptorPool = longrunningDescriptor.protoDescriptorPool;
}

util.inherits(LongrunningApiCaller, NormalApiCaller);

LongrunningApiCaller.prototype.poll = function(
  apiCall, settings, argument, callback) {
  var cancelFunc;

  var backoffSettings = settings.longrunning.backoffSettings;
  if (!backoffSettings) {
    backoffSettings =
        createBackoffSettings(100, 1.3, 60000, null, null, null, 600000);
  }

  var delayMult = backoffSettings.retryDelayMultiplier;
  var maxDelay = backoffSettings.maxRetryDelayMillis;
  var delay = backoffSettings.initialRetryDelayMillis;
  var now = new Date();
  var deadline = now.getTime() + backoffSettings.totalTimeoutMillis;
  var currentOperationPromise;

  function retryOperation(responses) {
    op = responses[0];
    cancelFunc = new function() {
      this.operationsApi.cancelOperation({name: op.name});
      if (currentOperationPromise) {
        currentOperationPromise.cancel();
      }
    }
    if (op.done) {
      if (op.result.hasError) {
        var error;
        error = new Error(op.result.error.message);
        error.code = op.result.error.code;
        callback(error);
      } else {
        // TODO: add metadata decoding.
        var response = op.result.response;
        var decoder;
        if (settings.longrunning.decoder) {
          decoder = settings.longrunning.decoder;
        } else {
          var protoDescriptor =
            _.get(this.protoDescriptorPool, response.type_url, null);
          decoder = protoDescriptor ? protoDescriptor.decode : null;
        }

        if (decoder) {
          response = decoder(response.value);
        }
        callback(null, [response, metadata, op]);
      }
      return;
    }

    if (now.getTime() >= deadline) {
      callback(new Error('Total timeout exceeded before any' +
          'response was received'));
      return;
    }

    var toSleep = Math.random() * delay;
    setTimeout(function() {
      now = new Date();
      delay = Math.min(delay * delayMult, maxDelay);
      currentOperationPromise = this.operationsApi.getOperation({name: op.name})
        .then(function(operation) {
          retryOperation(operation);
        });
    }, toSleep);
  }

  cancelFunc = apiCall(argument, function(err, response) {
    if (err) {
      callback(err);
      return;
    }
    retryOperation(response);
  });

  return {
    cancel: cancelFunc
  }
}

LongrunningApiCaller.prototype.call = function(
    apiCall, argument, settings, canceller) {
  if (settings.isLongrunning) {
    canceller.call(this.poll.bind(this, apiCall, settings), argument);
  } else {
    NormalApiCaller.prototype.call.call(
         this, apiCall, argument, settings, canceller);
    return;
  }
};

function LongrunningDescriptor(operationsApi, protoDescriptorPool) {
  this.operationsApi = operationsApi;
  this.protoDescriptorPool = protoDescriptorPool;
}

LongrunningDescriptor.prototype.apiCaller = function() {
  return new LongrunningApiCaller(this);
};

exports.LongrunningDescriptor = LongrunningDescriptor;
