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

var through2 = require('through2');
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
function PageStreamable(pageDescriptor) {
  this.pageDescriptor = pageDescriptor;
}

PageStreamable.prototype.createActualCallback = function(callback) {
  return function fetchNextPageToken(err, response) {
    if (err) {
      callback(err);
    }
    var pageToken = response[this.pageDescriptor.responsePageTokenField];
    callback(err, response, pageToken);
  }.bind(this);
};

PageStreamable.prototype.init = function(settings, callback) {
  if (callback) {
    settings.flattenPages = false;
    callback = this.createActualCallback(callback);
  }
  if (!settings.flattenPages) {
    return NormalApiCaller.prototype.init.call(this, settings, callback);
  }
  return through2.obj();
};

PageStreamable.prototype.wrap = function(func) {
  return func;
};

PageStreamable.prototype.call = function(apiCall, argument, settings, stream) {
  if (settings.pageToken) {
    argument[this.pageDescriptor.requestPageTokenField] = settings.pageToken;
  }
  if (!settings.flattenPages) {
    NormalApiCaller.prototype.call.call(
        this, apiCall, argument, settings, stream);
    return;
  }

  var pageDescriptor = this.pageDescriptor;
  function streamingCallback(err, response) {
    if (err) {
      stream.emit('error', err);
      stream.end();
      return;
    }

    var resources = response[pageDescriptor.resourceField];
    for (var i in resources) {
      if (!stream.writable) {
        return;
      }
      stream.write(resources[i]);
    }
    if (!stream.writable) {
      return;
    }
    var nextPageToken = response[pageDescriptor.responsePageTokenField];
    if (!nextPageToken) {
      stream.end();
      return;
    }
    argument[pageDescriptor.requestPageTokenField] = nextPageToken;
    setTimeout(apiCall.bind(null, argument, streamingCallback), 0);
  }

  setTimeout(apiCall.bind(null, argument, streamingCallback), 0);
};

PageStreamable.prototype.fail = function(status, err) {
  if (status instanceof ReadableStream) {
    this.stream.emit('error', err);
  } else {
    NormalApiCaller.prototype.fail.call(this, status, err);
  }
};

PageStreamable.prototype.result = function(status) {
  return status;
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
 * Returns a new API caller.
 * @return {PageStreamable} - the page streaming caller.
 */
PageDescriptor.prototype.apiCaller = function() {
  return new PageStreamable(this);
};
