/**
 * Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
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
'use strict';

/* This file describes the gRPC-streaming. */

var util = require('util');
var DuplexStream = require('readable-stream').Duplex;

/**
 * The type of gRPC streaming.
 * @enum {number}
 */
var StreamType = {
  /** Client sends a single request, server streams responses. */
  SERVER_STREAMING: 1,

  /** Client streams requests, server returns a single response. */
  CLIENT_STREAMING: 2,

  /** Both client and server stream objects. */
  BIDI_STREAMING: 3
};

exports.StreamType = StreamType;

/**
 * StreamProxy is a proxy to gRPC-streaming method.
 *
 * @private
 * @constructor
 * @param {StreamType} type - the type of gRPC stream.
 * @param {ApiCallback} callback - the callback for further API call.
 */
function StreamProxy(type, callback) {
  DuplexStream.call(this, {
    objectMode: true,
    readable: type !== StreamType.CLIENT_STREAMING,
    writable: type !== StreamType.SERVER_STREAMING
  });
  this.type = type;
  this._callback = callback;
  this._writeQueue = [];
  this._isEndCalled = false;
  this._isCancelCalled = false;
  var self = this;
  this.on('finish', function() {
    self._onFinish();
  });
}

util.inherits(StreamProxy, DuplexStream);

StreamProxy.prototype._read = function(n) {
  if (this.type === StreamType.CLIENT_STREAMING) {
    this.emit('error', new Error('stream is not readable'));
  }
};

StreamProxy.prototype._write = function(chunk, encoding, callback) {
  if (this.type === StreamType.SERVER_STREAMING) {
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
    this.stream.end();
  } else {
    this._isEndCalled = true;
  }
};

StreamProxy.prototype.cancel = function() {
  if (this.stream) {
    this.stream.cancel();
  } else {
    this._isCancelCalled = true;
  }
};

/**
 * Specifies the target stream.
 * @param {ApiCall} apiCall - the API function to be called.
 * @param {Object} argument - the argument to be passed to the apiCall.
 */
StreamProxy.prototype.setStream = function(apiCall, argument) {
  var stream = apiCall(argument, this._callback);
  this.stream = stream;
  var self = this;
  (['error', 'metadata', 'status']).forEach(function(event) {
    stream.on(event, function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift(event);
      self.emit.apply(self, args);
    });
  });
  // We also want to supply the status data as 'response' event to support
  // the behavior of google-cloud-node expects.
  // see: https://github.com/GoogleCloudPlatform/google-cloud-node/pull/1775#issuecomment-259141029
  // https://github.com/GoogleCloudPlatform/google-cloud-node/blob/116436fa789d8b0f7fc5100b19b424e3ec63e6bf/packages/common/src/grpc-service.js#L355
  stream.on('metadata', function(metadata) {
    // Create a response object with succeeds.
    // TODO: unify this logic with the decoration of gRPC response when it's added.
    // see: https://github.com/googleapis/gax-nodejs/issues/65
    self.emit('response', {
      code: 200,
      details: '',
      message: 'OK',
      metadata: metadata
    });
  });
  if (this.type !== StreamType.CLIENT_STREAMING) {
    stream.on('data', function() {
      var args = Array.prototype.slice.call(arguments, 0);
      args.unshift('data');
      self.emit.apply(self, args);
    });
    // Pushing null causes an ending process of the readable stream.
    stream.on('end', function() {
      self.push(null);
    });
    // This is required in case no 'data' handler exists.
    this.resume();
  }
  if (this.type !== StreamType.SERVER_STREAMING) {
    this._writeQueue.forEach(function(data) {
      stream.write(data);
    });
    this._writeQueue = [];
    if (this._isEndCalled) {
      stream.end();
    }
    if (this._isCancelCalled) {
      stream.cancel();
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
  return new StreamProxy(this.descriptor.type, callback);
};

GrpcStreamable.prototype.wrap = function(func) {
  switch (this.descriptor.type) {
    case StreamType.SERVER_STREAMING:
      return function(argument, metadata, options, callback) {
        return func(argument, metadata, options);
      };
    case StreamType.CLIENT_STREAMING:
      return function(argument, metadata, options, callback) {
        return func(metadata, options, callback);
      };
    case StreamType.BIDI_STREAMING:
      return function(argument, metadata, options, callback) {
        return func(metadata, options);
      };
    default:
      console.error('Unknown stream type', this.descriptor.type);
  }
  return func;
};

GrpcStreamable.prototype.call = function(apiCall, argument, settings, stream) {
  stream.setStream(apiCall, argument);
};

GrpcStreamable.prototype.fail = function(stream, err) {
  stream.emit('error', err);
};

GrpcStreamable.prototype.result = function(stream) {
  return stream;
};

/**
 * Describes the structure of gRPC streaming call.
 * @constructor
 * @param {StreamType} streamType - the type of streaming.
 */
function StreamDescriptor(streamType) {
  this.type = streamType;
}

StreamDescriptor.prototype.apiCaller = function(settings) {
  // Right now retrying does not work with gRPC-streaming, because retryable
  // assumes an API call returns an event emitter while gRPC-streaming methods
  // return Stream.
  // TODO: support retrying.
  settings.retry = null;
  return new GrpcStreamable(this);
};

exports.StreamDescriptor = StreamDescriptor;
