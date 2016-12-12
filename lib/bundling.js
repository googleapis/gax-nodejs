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
 * Provides behavior that supports request bundling.
 */

'use strict';

var _ = require('lodash');
var util = require('util');
var NormalApiCaller = require('./api_callable').NormalApiCaller;

/**
 * A function which does nothing. Used for an empty cancellation funciton.
 * @private
 */
function noop() {
}

/**
 * Compute the identifier of the `obj`. The objects of the same ID
 * will be bundled together.
 *
 * @param {Object} obj - The request object.
 * @param {String[]} discriminatorFields - The array of field names.
 *   A field name may include '.' as a separator, which is used to
 *   indicate object traversal.
 * @return {String|undefined} - the identifier string, or undefined if any
 *   discriminator.
 *   fields do not exist.
 */
function computeBundleId(obj, discriminatorFields) {
  var ids = [];
  for (var i = 0; i < discriminatorFields.length; ++i) {
    var id = _.at(obj, discriminatorFields[i])[0];
    if (id === undefined) {
      return undefined;
    }
    ids.push(id);
  }
  return ids.join(',');
}
exports.computeBundleId = computeBundleId;

/**
 * Creates a deep copy of the object with the consideration of subresponse
 * fields for bundling.
 *
 * @param {Object} obj - The source object.
 * @param {Object?} subresponseInfo - The information to copy the subset of
 *   the field for the response. Do nothing if it's null.
 * @param {String} subresponseInfo.field - The field name.
 * @param {number} subresponseInfo.start - The offset where the copying
 *   element should starts with.
 * @param {number} subresponseInfo.end - The ending index where the copying
 *   region of the elements ends.
 * @return {Object} The copied object.
 * @private
 */
function deepCopyForResponse(obj, subresponseInfo) {
  var result;
  if (obj === null) {
    return null;
  }
  if (Array.isArray(obj)) {
    result = [];
    obj.forEach(function(element) {
      result.push(deepCopyForResponse(element, null));
    });
    return result;
  }
  // Some objects (such as ByteBuffer) have copy method.
  if (obj.copy !== undefined) {
    return obj.copy();
  }
  // ArrayBuffer should be copied through slice().
  if (obj instanceof ArrayBuffer) {
    return obj.slice();
  }
  if (typeof obj === 'object') {
    result = {};
    Object.keys(obj).forEach(function(key) {
      if (subresponseInfo && key === subresponseInfo.field &&
          Array.isArray(obj[key])) {
        // Note that subresponses are not deep-copied. This is safe because
        // those subresponses are not shared among callbacks.
        result[key] =
            obj[key].slice(subresponseInfo.start, subresponseInfo.end);
      } else {
        result[key] = deepCopyForResponse(obj[key], null);
      }
    });
    return result;
  }
  return obj;
}
exports.deepCopyForResponse = deepCopyForResponse;

/**
 * A task coordinates the execution of a single bundle.
 *
 * @param {function} apiCall - The function to conduct calling API.
 * @param {Object} bundlingRequest - The base request object to be used
 *   for the actual API call.
 * @param {string} bundledField - The name of the field in bundlingRequest
 *   to be bundled.
 * @param {string=} subresponseField - The name of the field in the response
 *   to be passed to the callback.
 * @constructor
 * @private
 */
function Task(apiCall, bundlingRequest, bundledField, subresponseField) {
  this._apiCall = apiCall;
  this._request = bundlingRequest;
  this._bundledField = bundledField;
  this._subresponseField = subresponseField;
  this._data = [];
}

exports.Task = Task;

/**
 * Returns the number of elements in a task.
 * @return {number} The number of elements.
 */
Task.prototype.getElementCount = function() {
  var count = 0;
  for (var i = 0; i < this._data.length; ++i) {
    count += this._data[i].elements.length;
  }
  return count;
};

/**
 * Returns the total byte size of the elements in a task.
 * @return {number} The byte size.
 */
Task.prototype.getRequestByteSize = function() {
  var size = 0;
  for (var i = 0; i < this._data.length; ++i) {
    size += this._data[i].bytes;
  }
  return size;
};

/**
 * Invokes the actual API call with current elements.
 * @return {string[]} - the list of ids for invocations to be run.
 */
Task.prototype.run = function() {
  if (this._data.length === 0) {
    return [];
  }
  var request = this._request;
  var elements = [];
  var ids = [];
  for (var i = 0; i < this._data.length; ++i) {
    elements.push.apply(elements, this._data[i].elements);
    ids.push(this._data[i].callback.id);
  }
  request[this._bundledField] = elements;

  var self = this;
  this.callCanceller = this._apiCall(request, function(err, response) {
    var responses = [];
    if (err) {
      self._data.forEach(function() {
        responses.push(null);
      });
    } else {
      var subresponseInfo = null;
      if (self._subresponseField) {
        subresponseInfo = {
          field: self._subresponseField,
          start: 0
        };
      }
      self._data.forEach(function(data) {
        if (subresponseInfo) {
          subresponseInfo.end = subresponseInfo.start + data.elements.length;
        }
        responses.push(deepCopyForResponse(response, subresponseInfo));
        if (subresponseInfo) {
          subresponseInfo.start = subresponseInfo.end;
        }
      });
    }
    for (var i = 0; i < self._data.length; ++i) {
      if (self._data[i].cancelled) {
        self._data[i].callback(new Error('cancelled'));
      } else {
        self._data[i].callback(err, responses[i]);
      }
    }
  });
  return ids;
};

/**
 * Appends the list of elements into the task.
 * @param {Object[]} elements - the new list of elements.
 * @param {number} bytes - the byte size required to encode elements in the API.
 * @param {APICallback} callback - the callback of the method call.
 */
Task.prototype.extend = function(elements, bytes, callback) {
  this._data.push({
    elements: elements,
    bytes: bytes,
    callback: callback
  });
};

/**
 * Cancels a part of elements.
 * @param {string} id - The identifier of the part of elements.
 * @return {boolean} Whether the entire task will be canceled or not.
 */
Task.prototype.cancel = function(id) {
  if (this.callCanceller) {
    var allCancelled = true;
    this._data.forEach(function(d) {
      if (d.callback.id === id) {
        d.cancelled = true;
      }
      if (!d.cancelled) {
        allCancelled = false;
      }
    });
    if (allCancelled) {
      this.callCanceller.cancel();
    }
    return allCancelled;
  }
  for (var i = 0; i < this._data.length; ++i) {
    if (this._data[i].callback.id === id) {
      this._data[i].callback(new Error('cancelled'));
      this._data.splice(i, 1);
      break;
    }
  }
  return this._data.length === 0;
};

/**
 * Organizes requests for an api service that requires to bundle them.
 *
 * @param {BundleOptions} bundleOptions - configures strategy this instance
 *   uses when executing bundled functions.
 * @param {BundleDescriptor} bundleDescriptor - the description of the bundling.
 * @constructor
 */
function BundleExecutor(bundleOptions, bundleDescriptor) {
  this._options = bundleOptions;
  this._descriptor = bundleDescriptor;
  this._tasks = {};
  this._timers = {};
  this._invocations = {};
  this._invocationId = 0;
}

exports.BundleExecutor = BundleExecutor;

/**
 * Schedule a method call.
 *
 * @param {function} apiCall - the function for an API call.
 * @param {Object} request - the request object to be bundled with others.
 * @param {APICallback} callback - the callback to be called when the method finished.
 * @return {function()} - the function to cancel the scheduled invocation.
 */
BundleExecutor.prototype.schedule = function(
    apiCall, request, callback) {
  var err;
  var bundleId = computeBundleId(
      request, this._descriptor.requestDiscriminatorFields);
  if (!callback) {
    callback = noop;
  }
  if (bundleId === undefined) {
    err = new Error('request object ' + JSON.stringify(request) +
                    ' is not compatible with discriminator fields');
    callback(err);
    return {
      cancel: noop
    };
  }

  if (!(bundleId in this._tasks)) {
    this._tasks[bundleId] = new Task(
        apiCall, request, this._descriptor.bundledField,
        this._descriptor.subresponseField);
  }
  var task = this._tasks[bundleId];
  callback.id = String(this._invocationId++);
  this._invocations[callback.id] = bundleId;

  var bundledField = request[this._descriptor.bundledField];
  var elementCount = bundledField.length;
  var requestBytes = 0;
  var self = this;
  bundledField.forEach(function(obj) {
    requestBytes += self._descriptor.byteLengthFunction(obj);
  });

  var countLimit = this._options.elementCountLimit || 0;
  var byteLimit = this._options.requestByteLimit || 0;

  if ((countLimit > 0 && elementCount >= countLimit) ||
      (byteLimit > 0 && requestBytes >= byteLimit)) {
    var message;
    if (countLimit > 0 && elementCount >= countLimit) {
      message = 'The number of elements ' + elementCount +
          ' exceeds the limit ' + this._options.elementCountLimit;
    } else {
      message = 'The required bytes ' + requestBytes +
          ' exceeds the limit ' + this._options.requestByteLimit;
    }
    callback(new Error(message));
    return {
      cancel: noop
    };
  }

  var existingCount = task.getElementCount();
  var existingBytes = task.getRequestByteSize();

  if ((countLimit > 0 && elementCount + existingCount >= countLimit) ||
      (byteLimit > 0 && requestBytes + existingBytes >= byteLimit)) {
    this._runNow(bundleId);
    this._tasks[bundleId] = new Task(
        apiCall, request, this._descriptor.bundledField,
        this._descriptor.subresponseField);
    task = this._tasks[bundleId];
  }

  task.extend(bundledField, requestBytes, callback);

  var countThreshold = this._options.elementCountThreshold || 0;
  var sizeThreshold = this._options.requestByteThreshold || 0;
  if ((countThreshold > 0 && task.getElementCount() >= countThreshold) ||
      (sizeThreshold > 0 && task.getRequestByteSize() >= sizeThreshold)) {
    this._runNow(bundleId);
  }

  if (!(bundleId in this._timers) && this._options.delayThreshold > 0) {
    this._timers[bundleId] = setTimeout(function() {
      delete self._timers[bundleId];
      self._runNow(bundleId);
    }, self._options.delayThreshold);
  }

  return {
    cancel: function() {
      self._cancel(callback.id);
    }
  };
};

/**
 * Clears scheduled timeout if it exists.
 *
 * @param {String} bundleId - the id for the task whose timeout needs to be
 *   cleared.
 * @private
 */
BundleExecutor.prototype._maybeClearTimeout = function(bundleId) {
  if (bundleId in this._timers) {
    var timerId = this._timers[bundleId];
    delete this._timers[bundleId];
    clearTimeout(timerId);
  }
};

/**
 * Cancels an event.
 *
 * @param {String} id - The id for the event in the task.
 * @private
 */
BundleExecutor.prototype._cancel = function(id) {
  if (!(id in this._invocations)) {
    return;
  }
  var bundleId = this._invocations[id];
  if (!(bundleId in this._tasks)) {
    return;
  }

  var task = this._tasks[bundleId];
  delete this._invocations[id];
  if (task.cancel(id)) {
    this._maybeClearTimeout(bundleId);
    delete this._tasks[bundleId];
  }
};

/**
 * Invokes a task.
 *
 * @param {String} bundleId - The id for the task.
 * @private
 */
BundleExecutor.prototype._runNow = function(bundleId) {
  if (!(bundleId in this._tasks)) {
    console.warn('no such bundleid: ' + bundleId);
    return;
  }
  this._maybeClearTimeout(bundleId);
  var task = this._tasks[bundleId];
  delete this._tasks[bundleId];

  var self = this;
  task.run().forEach(function(id) {
    delete self._invocations[id];
  });
};

/**
 * Creates an API caller that bundles requests.
 *
 * @private
 * @constructor
 * @param {BundleExecutor} bundler - bundles API calls.
 */
function Bundleable(bundler) {
  this.bundler = bundler;
  NormalApiCaller.call(this);
}

util.inherits(Bundleable, NormalApiCaller);

Bundleable.prototype.call = function(apiCall, argument, settings, status) {
  if (settings.isBundling) {
    var self = this;
    status.call(function(argument, callback) {
      self.bundler.schedule(apiCall, argument, callback);
    }, argument);
  } else {
    NormalApiCaller.prototype.call.call(
        this, apiCall, argument, settings, status);
  }
};

/**
 * Describes the structure of bundled call.
 *
 * requestDiscriminatorFields may include '.' as a separator, which is used to
 * indicate object traversal. This allows fields in nested objects to be used
 * to determine what request to bundle.
 *
 * @property {String} bundledField
 * @property {String} requestDiscriminatorFields
 * @property {String} subresponseField
 * @property {Function} byteLengthFunction
 *
 * @param {String} bundledField - the repeated field in the request message
 *   that will have its elements aggregated by bundling.
 * @param {String} requestDiscriminatorFields - a list of fields in the
 *   target request message class that are used to detemrine which request
 *   messages should be bundled together.
 * @param {String} subresponseField - an optional field, when present it
 *   indicates the field in the response message that should be used to
 *   demultiplex the response into multiple response messages.
 * @param {Function} byteLengthFunction - a function to obtain the byte
 *   length to be consumed for the bundled field messages. Because Node.JS
 *   protobuf.js/gRPC uses builtin Objects for the user-visible data and
 *   internally they are encoded/decoded in protobuf manner, this function
 *   is actually necessary to calculate the byte length.
 * @constructor
 */
function BundleDescriptor(bundledField,
                          requestDiscriminatorFields,
                          subresponseField,
                          byteLengthFunction) {
  if (!byteLengthFunction && typeof subresponseField === 'function') {
    byteLengthFunction = subresponseField;
    subresponseField = null;
  }
  this.bundledField = bundledField;
  this.requestDiscriminatorFields = requestDiscriminatorFields;
  this.subresponseField = subresponseField;
  this.byteLengthFunction = byteLengthFunction;
}
exports.BundleDescriptor = BundleDescriptor;

/**
 * @private
 * Returns a new API caller.
 * @param {CallSettings} settings - the current settings.
 * @return {Bundleable} - the new bundling API caller.
 */
BundleDescriptor.prototype.apiCaller = function(settings) {
  return new Bundleable(new BundleExecutor(settings.bundleOptions, this));
};
