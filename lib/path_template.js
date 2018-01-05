/*
 *
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
 *
 */
'use strict';

/*
 * Path template utility.
 */

var _ = require('lodash');
var extras = require('./parser_extras');
var util = require('util');

exports.PathTemplate = PathTemplate;

/**
 * @param {String} data the of the template
 *
 * @constructor
 */
function PathTemplate(data) {
  var parser = require('./path_template_parser');
  var parseResult = extras.finishParse(parser.parse(data));

  Object.defineProperty(this, 'size', {
    get: function() {
      return parseResult.size;
    },
  });

  Object.defineProperty(this, 'segments', {
    get: function() {
      return parseResult.segments;
    },
  });
}

/**
 * Matches a fully-qualified path template string.
 *
 * @param {String} path a fully-qualified path template string
 * @return {Object} contains var names matched to binding values
 * @throws {TypeError} if path can't be matched to this template
 */
PathTemplate.prototype.match = function match(path) {
  var pathSegments = path.split('/');
  var bindings = {};
  var segmentCount = this.size;
  var current = null;
  var index = 0;
  this.segments.forEach(function(segment) {
    if (index > pathSegments.length) {
      return;
    }
    if (segment.kind === extras.BINDING) {
      current = segment.literal;
    } else if (segment.kind === extras.TERMINAL) {
      if (segment.literal === '*') {
        bindings[current] = pathSegments[index];
        index += 1;
      } else if (segment.literal === '**') {
        var size = pathSegments.length - segmentCount + 1;
        segmentCount += size - 1;
        bindings[current] = pathSegments.slice(index, index + size).join('/');
        index += size;
      } else if (segment.literal === pathSegments[index]) {
        index += 1;
      } else {
        var msg = util.format(
          "mismatched literal (index=%d): '%s' != '%s'",
          index,
          segment.literal,
          pathSegments[index]
        );
        throw new TypeError(msg);
      }
    }
  });
  if (index !== pathSegments.length || index !== segmentCount) {
    var msg = util.format(
      'match error: could not instantiate a path template from %s',
      path
    );
    throw new TypeError(msg);
  }
  return bindings;
};

/**
 * Renders a path template using the provided bindings.
 *
 * @param {Object} bindings a mapping of var names to binding strings
 * @return {String} a rendered representation of the path template
 * @throws {TypeError} if a key is missing, or if a sub-template cannot be
 *   parsed
 */
PathTemplate.prototype.render = function render(bindings) {
  var out = [];
  var inABinding = false;
  this.segments.forEach(function(segment) {
    if (segment.kind === extras.BINDING) {
      if (!_.has(bindings, segment.literal)) {
        var msg = util.format(
          'Value for key %s is not provided in %s',
          segment.literal,
          bindings
        );
        throw new TypeError(msg);
      }
      var tmp = new PathTemplate(bindings[segment.literal]);
      Array.prototype.push.apply(out, tmp.segments);
      inABinding = true;
    } else if (segment.kind === extras.END_BINDING) {
      inABinding = false;
    } else if (inABinding) {
      return;
    } else {
      out.push(segment);
    }
  });

  var result = formatSegments(out);
  this.match(result);
  return result;
};

/**
 * Renders the path template.
 *
 * @return {string} contains var names matched to binding values
 */
PathTemplate.prototype.inspect = function inspect() {
  return formatSegments(this.segments);
};

/**
 * Creates the string representattion for the segments.
 * @param {Object[]} segments - The array of segments.
 * @return {string} - A string representing segments in the path template
 *   format.
 */
function formatSegments(segments) {
  var out = '';
  var slash = true;
  segments.forEach(function(segment) {
    if (segment.kind === extras.TERMINAL) {
      if (slash) {
        out += '/';
      }
      out += segment.literal;
      return;
    }
    slash = true;
    if (segment.kind === extras.BINDING) {
      out += '/{' + segment.literal + '=';
      slash = false;
    } else {
      out += segment.literal + '}';
    }
  });
  return out.substring(1);
}
