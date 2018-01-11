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

var extend = require('extend');
var util = require('util');
var NormalApiCaller = require('./api_callable').NormalApiCaller;
var through2 = require('through2');
var ended = require('is-stream-ended');

/**
 * Creates an API caller that returns a stream to performs page-streaming.
 *
 * @private
 * @constructor
 * @param {PageDescriptor} pageDescriptor - indicates the structure
 *   of page streaming to be performed.
 */
function PagedIteration(pageDescriptor) {
  NormalApiCaller.call(this);
  this.pageDescriptor = pageDescriptor;
}

util.inherits(PagedIteration, NormalApiCaller);

PagedIteration.prototype.createActualCallback = function(request, callback) {
  var self = this;
  return function fetchNextPageToken(err, response) {
    if (err) {
      callback(err);
      return;
    }
    var resources = response[self.pageDescriptor.resourceField];
    var pageToken = response[self.pageDescriptor.responsePageTokenField];
    if (pageToken) {
      request[self.pageDescriptor.requestPageTokenField] = pageToken;
      callback(err, resources, request, response);
    } else {
      callback(err, resources, null, response);
    }
  };
};

PagedIteration.prototype.wrap = function(func) {
  var self = this;
  return function wrappedCall(argument, metadata, options, callback) {
    return func(
      argument,
      metadata,
      options,
      self.createActualCallback(argument, callback)
    );
  };
};

PagedIteration.prototype.init = function(settings, callback) {
  return NormalApiCaller.prototype.init.call(this, settings, callback);
};

PagedIteration.prototype.call = function(
  apiCall,
  argument,
  settings,
  canceller
) {
  argument = extend({}, argument);
  if (settings.pageToken) {
    argument[this.pageDescriptor.requestPageTokenField] = settings.pageToken;
  }
  if (settings.pageSize) {
    argument[this.pageDescriptor.requestPageSizeField] = settings.pageSize;
  }
  if (!settings.autoPaginate) {
    NormalApiCaller.prototype.call.call(
      this,
      apiCall,
      argument,
      settings,
      canceller
    );
    return;
  }

  var maxResults = settings.maxResults || -1;
  var allResources = [];
  function pushResources(err, resources, next) {
    if (err) {
      canceller.callback(err);
      return;
    }

    for (var i = 0; i < resources.length; ++i) {
      allResources.push(resources[i]);
      if (allResources.length === maxResults) {
        next = null;
        break;
      }
    }
    if (!next) {
      canceller.callback(null, allResources);
      return;
    }
    setImmediate(apiCall, next, pushResources);
  }

  setImmediate(apiCall, argument, pushResources);
};

/**
 * Describes the structure of a page-streaming call.
 *
 * @property {String} requestPageTokenField
 * @property {String} responsePageTokenField
 * @property {String} resourceField
 *
 * @param {String} requestPageTokenField - The field name of the page token in
 *   the request.
 * @param {String} responsePageTokenField - The field name of the page token in
 *   the response.
 * @param {String} resourceField - The resource field name.
 *
 * @constructor
 */
function PageDescriptor(
  requestPageTokenField,
  responsePageTokenField,
  resourceField
) {
  this.requestPageTokenField = requestPageTokenField;
  this.responsePageTokenField = responsePageTokenField;
  this.resourceField = resourceField;
}
exports.PageDescriptor = PageDescriptor;

/**
 * Creates a new object Stream which emits the resource on 'data' event.
 * @private
 * @param {ApiCall} apiCall - the callable object.
 * @param {Object} request - the request object.
 * @param {CallOptions=} options - the call options to customize the api call.
 * @return {Stream} - a new object Stream.
 */
PageDescriptor.prototype.createStream = function(apiCall, request, options) {
  var stream = through2.obj();
  options = extend({}, options, {autoPaginate: false});
  var maxResults = 'maxResults' in options ? options.maxResults : -1;
  var pushCount = 0;
  var started = false;
  function callback(err, resources, next) {
    if (err) {
      stream.emit('error', err);
      return;
    }
    for (var i = 0; i < resources.length; ++i) {
      if (ended(stream)) {
        return;
      }
      if (resources[i] === null) {
        continue;
      }
      stream.push(resources[i]);
      pushCount++;
      if (pushCount === maxResults) {
        stream.end();
      }
    }
    if (ended(stream)) {
      return;
    }
    if (!next) {
      stream.end();
      return;
    }
    // When pageToken is specified in the original options, it will overwrite
    // the page token field in the next request. Therefore it must be cleared.
    if ('pageToken' in options) {
      delete options.pageToken;
    }
    if (stream.isPaused()) {
      request = next;
      started = false;
    } else {
      setImmediate(apiCall, next, options, callback);
    }
  }
  stream.on('resume', function() {
    if (!started) {
      started = true;
      apiCall(request, options, callback);
    }
  });
  return stream;
};

/**
 * Returns a new API caller.
 * @private
 * @return {PageStreamable} - the page streaming caller.
 */
PageDescriptor.prototype.apiCaller = function() {
  return new PagedIteration(this);
};
