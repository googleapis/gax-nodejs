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

var util = require('util');
var _ = require('lodash');

/* constants used in the pegjs parser */
var BINDING = exports.BINDING = 1;
exports.END_BINDING = 2;
var TERMINAL = exports.TERMINAL = 3;

/**
 * Checks that segments only has one terminal segment that is a path wildcard.
 *
 * @private
 *
 * @param {Segments[]} segments the parsed segments
 * @throws {TypeError} if there are too many
 */
function allowOnePathWildcard(segments) {
  var hasPathWildcard = false;
  for (var i = 0; i < segments.length; i++) {
    var s = segments[i];
    if (s.kind !== TERMINAL || s.literal !== '**') {
      continue;
    }
    if (hasPathWildcard) {
      var tooManyWildcards = 'cannot contain more than one path wildcard';
      throw new TypeError(tooManyWildcards);
    }
    hasPathWildcard = true;
  }
}

/**
 * Counts the number of terminal segments.
 *
 * @private
 *
 * @param {Segments[]} segments the parsed segments
 * @return {number} the number of terminal segments in the template
 */
function countTerminals(segments) {
  var terms = _.filter(segments, function(x) {
    return x.kind === TERMINAL;
  });
  return terms.length;
}

/**
 * Updates missing literals of each of the binding segments.
 *
 * @private
 *
 * @param {Segments[]} segments the parsed segments
 */
function updateBindingLiterals(segments) {
  var bindingIndex = 0;
  segments.forEach(function(s) {
    if (s.kind === BINDING && !s.literal) {
      s.literal = util.format('$%d', bindingIndex);
      bindingIndex += 1;
    }
  });
}

/**
 * Completes the parsing of the segments
 *
 * Validates them, and transforms them into the object used by the
 * PathTemplate class.
 *
 * @private
 *
 * @param {Segments[]} segments the parsed segments
 * @param {Object} initializes the attributes of a PathTemplate
 * @return {Object} Returns segments and size
 * @throws {TypeError} if multiple path wildcards exist
 */
function finishParse(segments) {
  allowOnePathWildcard(segments);
  updateBindingLiterals(segments);
  return {
    segments: segments,
    size: countTerminals(segments)
  };
}

exports.finishParse = finishParse;
