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

var _ = require('lodash');
var expect = require('chai').expect;

var PathTemplate = require('../lib/path_template.js').PathTemplate;

describe('PathTemplate', function() {
  describe('constructor', function() {
    it('should parse and obtain the correct number of segments', function() {
      var t = new PathTemplate('a/b/**/*/{a=hello/world}');
      expect(t.segments.length).to.eql(12);
      expect(t.size).to.eql(6);
    });

    it('should fail on multiple path wildcards', function() {
      var shouldFail = function() {
        return new PathTemplate('buckets/*/**/**/objects/*');
      };
      expect(shouldFail).to.throw(TypeError);
    });
  });

  describe('method `match`', function() {
    it('should fail on an impossible match', function() {
      var t = new PathTemplate('hello/world');
      var mismatches = [
        'hello',
        'hello/world/fail'
      ];
      mismatches.forEach(function(m) {
        expect(function() {t.match(m); }).to.throw(TypeError);
      });
    });

    it('should fail on mismatched literal', function() {
      var t = new PathTemplate('hello/world');
      var mismatches = [
        'hello/world2',
        'hello/world3'
      ];
      mismatches.forEach(function(m) {
        expect(function() {t.match(m); }).to.throw(TypeError);
      });
    });

    it('should match atomic resource name', function() {
      var tests = [
        {
          path: 'buckets/f/o/objects/bar',
          template: 'buckets/*/*/objects/*',
          want: {
            $0: 'f',
            $1: 'o',
            $2: 'bar'
          }
        },
        {
          path: 'buckets/world',
          template: 'buckets/{hello}',
          want: {
            hello: 'world'
          }
        },
        {
          path: 'buckets/world',
          template: 'buckets/{hello=*}',
          want: {
            hello: 'world'
          }
        }
      ];
      tests.forEach(function(t) {
        var template = new PathTemplate(t.template);
        expect(template.match(t.path)).to.eql(t.want);
      });
    });

    it('should match escaped chars', function() {
      var template = new PathTemplate('buckets/*/objects');
      var want = {$0: 'hello%2F%2Bworld'};
      expect(template.match('buckets/hello%2F%2Bworld/objects')).to.eql(want);
    });

    it('should match template with unbounded wildcard', function() {
      var template = new PathTemplate('buckets/*/objects/**');
      var want = {$0: 'foo', $1: 'bar/baz'};
      expect(template.match('buckets/foo/objects/bar/baz')).to.eql(want);
    });

    it('should match template with unbound in the middle', function() {
      var template = new PathTemplate('bar/**/foo/*');
      var want = {$0: 'foo/foo', $1: 'bar'};
      expect(template.match('bar/foo/foo/foo/bar')).to.eql(want);
    });
  });

  describe('method `render`', function() {
    it('should render atomic resource', function() {
      var template = new PathTemplate('buckets/*/*/*/objects/*');
      var params = {
        $0: 'f',
        $1: 'o',
        $2: 'o',
        $3: 'google.com:a-b'
      };
      var want = 'buckets/f/o/o/objects/google.com:a-b';
      expect(template.render(params)).to.eql(want);
    });

    it('should fail when there are too few variables', function() {
      var template = new PathTemplate('buckets/*/*/*/objects/*');
      var params = {
        $0: 'f',
        $1: 'o',
        $2: 'o'
      };
      expect(function() {template.render(params); }).to.throw(TypeError);
    });

    it('should succeed with an unbound in the middle', function() {
      var template = new PathTemplate('bar/**/foo/*');
      var params = {
        $0: '1/2',
        $1: '3'
      };
      var want = 'bar/1/2/foo/3';
      expect(template.render(params)).to.eql(want);
    });
  });

  describe('method `inspect`', function() {
    var tests = {
      'bar/**/foo/*': 'bar/{$0=**}/foo/{$1=*}',
      'buckets/*/objects/*': 'buckets/{$0=*}/objects/{$1=*}',
      '/buckets/{hello}': 'buckets/{hello=*}',
      '/buckets/{hello=what}/{world}': 'buckets/{hello=what}/{world=*}',
      '/buckets/helloazAZ09-.~_what': 'buckets/helloazAZ09-.~_what'
    };

    _.forEach(tests, function(want, template) {
      it('should render template ' + template + ' ok', function() {
        var t = new PathTemplate(template);
        expect(t.inspect()).to.eql(want);
      });
    });
  });
});
