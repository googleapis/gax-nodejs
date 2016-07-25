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

var eventemitter2 = require('eventemitter2');

/**
 * EventEmitter is a custom version of event emitter for the API call.
 *
 * In addition to normal events, it has a method 'cancel' to stop an
 * ongoing event.
 *
 * @property {Promise} result - A promise resolves to the result value
 *   of the API (or fails when API call fails or is canceled).
 * @param {?APICallback} callback - the callback to be called when
 *   the API call ends.
 * @constructor
 */
function EventEmitter(callback) {
  eventemitter2.EventEmitter2.call(this);

  this._state = EventEmitter.States.STARTED;

  var resultResolver;
  var resultRejector;
  this.result = new Promise(function(resolve, reject) {
    resultResolver = resolve;
    resultRejector = reject;
  });

  // onFailure will be called when the task is canceled or the API result
  // has failed.
  this._onFailure = function onFailure(err) {
    resultRejector(err);
    if (callback) {
      callback(err);
    }
  };

  this._callback = function emitResults(err, response) {
    if (this._state === EventEmitter.States.FINISHED ||
        this._state === EventEmitter.States.CANCELED) {
      return;
    }
    if (err) {
      if (this._state === EventEmitter.States.STARTED &&
          this.listeners('error').length > 0) {
        this.emit('error', err);
      }
      if (this._state === EventEmitter.States.CANCEL_SCHEDULED) {
        this._state = EventEmitter.States.CANCELED;
      } else {
        this._state = EventEmitter.States.FINISHED;
      }
      resultRejector(err);
      if (callback) {
        callback(err);
      }
    } else if (this._state === EventEmitter.States.STARTED) {
      this._state = EventEmitter.States.FINISHED;
      this.emit('data', response);
      resultResolver(response);
      if (callback) {
        callback(null, response);
      }
    }
  }.bind(this);
}
exports.EventEmitter = EventEmitter;

EventEmitter.prototype = Object.create(
    eventemitter2.EventEmitter2.prototype);
EventEmitter.prototype.constructor = EventEmitter;

/**
 * The internal states for EventEmitter.
 * @private
 * @enum {number}
 * @readonly
 */
EventEmitter.States = {
  STARTED: 0,
  FINISHED: 1,
  CANCEL_SCHEDULED: 2,
  CANCELED: 3,
  SCHEDULED: 4
};

/**
 * Specifies the underlying event handler for the actual API call controls.
 * @param {EventEmitter} handler The event handler for the actual API call.
 * @private
 */
EventEmitter.prototype._setEventHandler = function setEventHandler(handler) {
  this._eventHandler = handler;
  if (this._eventHandler &&
      this._state === EventEmitter.States.CANCEL_SCHEDULED) {
    this.cancel();
  }
};

/**
 * Cancels the ongoing API call.
 */
EventEmitter.prototype.cancel = function cancel() {
  if (this._state === EventEmitter.States.CANCELED ||
      this._state === EventEmitter.States.FINISHED) {
    return;
  }
  this._state = EventEmitter.States.CANCEL_SCHEDULED;
  if (this._eventHandler) {
    this._eventHandler.cancel();
    this._callback(new Error('canceled'));
  }
};

var eventId = 0;

/**
 * BundleEventEmitter manages the scheduling of bundled request.
 *
 * This is an event emitter. It emits 'data' event on the data,
 * and 'error' event when an error happens or the event emitter is canceled.
 *
 * @property {Promise} result - The promise to be resolved
 *   to the result of the API call. This would be useful
 *   for waiting the result.
 * @param {BundleExecutor} executor - The bundle executor for this event.
 * @param {Function} callback - The callback to be called when this event
 *   has been fulfilled.
 * @constructor
 */
function BundleEventEmitter(executor, callback) {
  EventEmitter.call(this, callback);

  this._state = EventEmitter.States.SCHEDULED;
  this._executor = executor;
  this._eventId = eventId;
  eventId++;
}
exports.BundleEventEmitter = BundleEventEmitter;

BundleEventEmitter.prototype = Object.create(EventEmitter.prototype);
BundleEventEmitter.prototype.constructor = BundleEventEmitter;

BundleEventEmitter.prototype._start = function _start() {
  if (this._state !== EventEmitter.States.SCHEDULED) {
    console.warn('Inconsistent event state: ' + this._state + ' should be ' +
                 'SCHEDULED');
    return;
  }
  this._state = EventEmitter.States.STARTED;
};

/**
 * Invokes the scheduled API call immediately.
 *
 * This does not wait for the API reply -- this is just a
 * utility to issue the API request immediately.
 */
BundleEventEmitter.prototype.runNow = function runNow() {
  if (this._state !== EventEmitter.States.SCHEDULED) {
    return;
  }

  this._executor._runEvent(this._eventId);
};

/**
 * Cancels the scheduled event.
 *
 * If the event is already fulfilled, this method does nothing.
 */
BundleEventEmitter.prototype.cancel = function cancel() {
  if (this._state !== EventEmitter.States.SCHEDULED) {
    EventEmitter.prototype.cancel.call(this);
    return;
  }

  this._state = EventEmitter.States.CANCEL_SCHEDULED;
  this._executor._cancelEvent(this._eventId);
  this._callback(new Error('canceled'));
};
