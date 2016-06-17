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

/**
 * compute the identifier of the `obj`. The objects of the same ID
 * will be bundled together.
 *
 * @param {Object} obj - The request object.
 * @param {String[]} discriminatorFields - The array of field names.
 *   A field name may include '.' as a separator, which is used to
 *   indicate object traversal.
 * @returns {String} - the identifier string, or undefined if any discriminator
 *   fields do not exist.
 */
function computeBundleId(obj, discriminatorFields) {
  var ids = [];
  for (var i = 0; i < discriminatorFields.length; ++i) {
    var id = _.at(obj, discriminatorFields[i])[0];
    if(id === undefined) {
      return undefined;
    }
    ids.push(id);
  }
  return ids.join(',');
}
exports.computeBundleId = computeBundleId;

/**
 * A task coordinates the execution of a single bundle.
 *
 * @param {function} apiCall - The function to conduct calling API.
 * @param {Object} bundlingRequest - The base request object to be used
 *   for the actual API call.
 * @param {String} bundledField - The name of the field in bundlingRequest
 *   to be bundled.
 * @param {?String} subresponseField - The name of the field in the response
 *   to be passed to the callback.
 * @constructor
 * @private
 */
function Task(apiCall, bundlingRequest, bundledField, subresponseField,
              byteLengthFunction) {
  this._apiCall = apiCall;
  this._request = bundlingRequest;
  this._bundledField = bundledField;
  this._subresponseField = subresponseField;
  this._byteLengthFunction = byteLengthFunction;
  this._data = [];
}

exports.Task = Task;

/**
 * Returns the number of elements in a task.
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
 */
Task.prototype.getRequestByteSize = function() {
  var size = 0;
  for (var i = 0; i < this._data.length; ++i) {
    size += this._data[i].bytes;
  }
  return size;
};

Task.prototype.getEventEmitters = function() {
  var emitters = [];
  for (var i = 0; i < this._data.length; ++i) {
    if (this._data[i].emitter) {
      emitters.push(this._data[i].emitter);
    }
  }
  return emitters;
};

/**
 * Invokes the actual API call with current elements.
 */
Task.prototype.run = function() {
  if (this._data.length === 0) {
    return;
  }
  var request = this._request;
  var elements = [];
  for (var i = 0; i < this._data.length; ++i) {
    elements.push.apply(elements, this._data[i].elements);
  }
  request[this._bundledField] = elements;

  this._apiCall(request, function(err, response) {
    var subresponses = [];
    if (err || !this._subresponseField) {
      this._data.forEach(function() { subresponses.push(null); });
    } else {
      var responseValue = response[this._subresponseField];
      var index = 0;
      this._data.forEach(function(data) {
        var endIndex = index + data.elements.length;
        if (endIndex > responseValue.length) {
          console.warn('subresponse size is not enough.');
          return;
        }
        subresponses.push(responseValue.slice(index, endIndex));
        index = endIndex;
      });
    }
    for (var i = 0; i < this._data.length; ++i) {
      if (this._data[i].emitter) {
        this._data[i].emitter._callback(err, subresponses[i]);
      }
    }
  }.bind(this));
};

/**
 * Appends the list of elements into the task.
 * @param {Object[]} elements - the new list of elements.
 * @param {BundleEventEmitter} emitter - the event emitter.
 */
Task.prototype.extend = function(elements, emitter) {
  var bytes = 0;
  elements.forEach(function(element) {
    bytes += this._byteLengthFunction(element);
  }.bind(this));
  this._data.push({
    'elements': elements,
    'bytes': bytes,
    'emitter': emitter
  });
};

/**
 * Cancels a part of elements.
 * @param {String} id - The identifier of the part of elements.
 */
Task.prototype.cancel = function(eventId) {
  for (var i = 0; i < this._data.length; ++i) {
    if (this._data[i].emitter && this._data[i].emitter._eventId === eventId) {
      this._data.splice(i, 1);
      return true;
    }
  }
  return false;
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
  this._events = {};
}

exports.BundleExecutor = BundleExecutor;

/**
 * Schedule a method call.
 *
 * @param {function} apiCall - the function for an API call.
 * @param {Object} request - the request object to be bundled with others.
 * @param {APICallback} callback - the callback to be called when the API call
 *   has finished.
 */
BundleExecutor.prototype.schedule = function(
    apiCall, request, emitter) {
  var bundleId = computeBundleId(
      request, this._descriptor.requestDiscriminatorFields);
  if (bundleId === undefined) {
    var err = new Error('request object ' + JSON.stringify(request) +
                        ' is not compatible with discriminator fields');
    emitter._callback(err);
  }

  if (!(bundleId in this._tasks)) {
    this._tasks[bundleId] = new Task(
        apiCall, request, this._descriptor.bundledField,
        this._descriptor.subresponseField, this._descriptor.byteLengthFunction);
  }
  var task = this._tasks[bundleId];
  this._events[emitter._eventId] = bundleId;

  task.extend(request[this._descriptor.bundledField], emitter);

  var countThreshold = this._options.elementCountThreshold || 0;
  if (countThreshold > 0 && task.getElementCount() >= countThreshold) {
    this._runNow(bundleId);
  }

  var sizeThreshold = this._options.requestByteThreshold || 0;
  if (sizeThreshold > 0 && task.getRequestByteSize() >= sizeThreshold) {
    this._runNow(bundleId);
  }

  if (!(bundleId in this._timers) && this._options.delayThreshold > 0) {
    this._timers[bundleId] = setTimeout(function() {
      delete this._timers[bundleId];
      this._runNow(bundleId);
    }.bind(this), this._options.delayThreshold);
  }
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
 * @param {String} bundleId - The id for the task.
 * @param {String} eventId - The id for the event in the task.
 * @private
 */
BundleExecutor.prototype._cancelEvent = function(eventId) {
  if (!(eventId in this._events)) {
    return;
  }
  var bundleId = this._events[eventId];
  if (!(bundleId in this._tasks)) {
    return;
  }

  var task = this._tasks[bundleId];
  task.cancel(eventId);
  delete this._events[eventId];
  if (task.getElementCount() === 0) {
    this._maybeClearTimeout(bundleId);
    delete this._tasks[bundleId];
  }
};

/**
 * Invokes a task which holds the event.
 * @param {String} eventId - The id for the event.
 * @private
 */
BundleExecutor.prototype._runEvent = function(eventId) {
  if (!(eventId in this._events)) {
    return;
  }
  this._runNow(this._events[eventId]);
};

/**
 * Invokes a task.
 *
 * @param {String} bundleId - The id for the task.
 * @private
 */
BundleExecutor.prototype._runNow = function(bundleId) {
  if (!(bundleId in this._tasks)) {
    console.log('no such bundleid: ' + bundleId);
    return;
  }
  this._maybeClearTimeout(bundleId);
  var task = this._tasks[bundleId];
  delete this._tasks[bundleId];
  task.getEventEmitters().forEach(function(emitter) {
    emitter._start();
    delete this._events[emitter._eventId];
  }.bind(this));
  task.run();
};
