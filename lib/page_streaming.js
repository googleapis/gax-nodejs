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

var util = require('util');
var NormalApiCaller = require('./api_callable').NormalApiCaller;
var ReadableStream = require('readable-stream');

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

PagedIteration.prototype.createActualCallback = function(callback) {
  return function fetchNextPageToken(err, response) {
    if (err) {
      callback(err);
    }
    var pageToken = response[this.pageDescriptor.responsePageTokenField];
    callback(err, response, pageToken);
  }.bind(this);
};

PagedIteration.prototype.init = function(settings, callback) {
  if (callback && !settings.autoPaginate) {
    callback = this.createActualCallback(callback);
  }
  return NormalApiCaller.prototype.init.call(this, settings, callback);
};

PagedIteration.prototype.call = function(
    apiCall, argument, settings, canceller) {
  if (settings.pageToken) {
    argument[this.pageDescriptor.requestPageTokenField] = settings.pageToken;
  }
  if (settings.pageSize) {
    argument[this.pageDescriptor.requestPageSizeField] = settings.pageSize;
  }
  if (!settings.autoPaginate) {
    NormalApiCaller.prototype.call.call(
        this, apiCall, argument, settings, canceller);
    return;
  }

  var resources = [];
  var pageDescriptor = this.pageDescriptor;
  function pushResources(err, response) {
    if (err) {
      canceller.callback(err);
      return;
    }

    resources.push.apply(resources, response[pageDescriptor.resourceField]);
    var nextPageToken = response[pageDescriptor.responsePageTokenField];
    if (!nextPageToken) {
      canceller.callback(null, resources);
      return;
    }
    argument[pageDescriptor.requestPageTokenField] = nextPageToken;
    apiCall(argument, pushResources);
  }

  apiCall(argument, pushResources);
};

/**
 * An implementation of readalbe stream which fits for the usage of paged iteration.
 * @private
 * @constructor
 */
function PagedStream() {
  ReadableStream.call(this, {objectMode: true});
}

util.inherits(PagedStream, ReadableStream);

PagedStream.prototype._read = function(n) {
};

/**
 */
PagedStream.prototype.end = function() {
  // pushing a null will cause ending the stream.
  this.push(null);

  // onEof callback of ReadableStream does not update 'readable' field immediately,
  // thus settings here explicitly.
  this.readable = false;
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
function PageDescriptor(requestPageTokenField,
                        responsePageTokenField,
                        resourceField) {
  this.requestPageTokenField = requestPageTokenField;
  this.responsePageTokenField = responsePageTokenField;
  this.resourceField = resourceField;
}
exports.PageDescriptor = PageDescriptor;

/**
 * @private
 * Creates a new object Stream which emits the resource on 'data' event.
 * @param {ApiCall} apiCall - the callable object.
 * @param {Object} request - the request object.
 * @param {CallOptions=} options - the call options to customize the api call.
 * @return {Stream} - a new object Stream.
 */
PageDescriptor.prototype.createStream = function(
    apiCall, request, options) {
  var stream = new PagedStream();
  options = options || {};
  options.autoPaginate = false;
  function callback(response) {
    var resources = response[this.resourceField];
    for (var i = 0; i < resources.length; ++i) {
      if (!stream.readable) {
        return;
      }
      if (resources[i] === null) {
        continue;
      }
      stream.push(resources[i]);
    }
    if (!stream.readable) {
      return;
    }
    var nextPageToken = response[this.responsePageTokenField];
    if (!nextPageToken) {
      stream.end();
      return;
    }
    options.pageToken = nextPageToken;
    return apiCall(request, options)
      .then(callback.bind(this))
      .catch(stream.emit.bind(stream, 'error'));
  }
  apiCall(request, options)
      .then(callback.bind(this))
      .catch(stream.emit.bind(stream, 'error'));
  return stream;
};

/**
 * @private
 * Returns a new API caller.
 * @return {PageStreamable} - the page streaming caller.
 */
PageDescriptor.prototype.apiCaller = function() {
  return new PagedIteration(this);
};
