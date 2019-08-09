/*
 * Copyright 2019 Google LLC
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

import {expect} from 'chai';
import {PathTemplate} from '../../src/pathTemplate';

describe('PathTemplate', () => {
  describe('constructor', () => {
    it('should parse and obtain the correct number of segments', () => {
      const t = new PathTemplate('a/b/**/*/{a=hello/world}');
      expect(t.segments.length).to.eql(12);
      expect(t.size).to.eql(6);
    });

    it('should fail on multiple path wildcards', () => {
      const shouldFail = () => {
        return new PathTemplate('buckets/*/**/**/objects/*');
      };
      expect(shouldFail).to.throw(TypeError);
    });
  });

  describe('method `match`', () => {
    it('should fail on an impossible match', () => {
      const t = new PathTemplate('hello/world');
      const mismatches = ['hello', 'hello/world/fail'];
      mismatches.forEach(m => {
        expect(() => {
          t.match(m);
        }).to.throw(TypeError);
      });
    });

    it('should fail on mismatched literal', () => {
      const t = new PathTemplate('hello/world');
      const mismatches = ['hello/world2', 'hello/world3'];
      mismatches.forEach(m => {
        expect(() => {
          t.match(m);
        }).to.throw(TypeError);
      });
    });

    it('should match atomic resource name', () => {
      const tests = [
        {
          path: 'buckets/f/o/objects/bar',
          template: 'buckets/*/*/objects/*',
          want: {
            $0: 'f',
            $1: 'o',
            $2: 'bar',
          },
        },
        {
          path: 'buckets/world',
          template: 'buckets/{hello}',
          want: {
            hello: 'world',
          },
        },
        {
          path: 'buckets/world',
          template: 'buckets/{hello=*}',
          want: {
            hello: 'world',
          },
        },
      ];
      tests.forEach(t => {
        const template = new PathTemplate(t.template);
        expect(template.match(t.path)).to.eql(t.want);
      });
    });

    it('should match escaped chars', () => {
      const template = new PathTemplate('buckets/*/objects');
      const want = {$0: 'hello%2F%2Bworld'};
      expect(template.match('buckets/hello%2F%2Bworld/objects')).to.eql(want);
    });

    it('should match template with unbounded wildcard', () => {
      const template = new PathTemplate('buckets/*/objects/**');
      const want = {$0: 'foo', $1: 'bar/baz'};
      expect(template.match('buckets/foo/objects/bar/baz')).to.eql(want);
    });

    it('should match template with unbound in the middle', () => {
      const template = new PathTemplate('bar/**/foo/*');
      const want = {$0: 'foo/foo', $1: 'bar'};
      expect(template.match('bar/foo/foo/foo/bar')).to.eql(want);
    });
  });

  describe('method `render`', () => {
    it('should render atomic resource', () => {
      const template = new PathTemplate('buckets/*/*/*/objects/*');
      const params = {
        $0: 'f',
        $1: 'o',
        $2: 'o',
        $3: 'google.com:a-b',
      };
      const want = 'buckets/f/o/o/objects/google.com:a-b';
      expect(template.render(params)).to.eql(want);
    });

    it('should fail when there are too few variables', () => {
      const template = new PathTemplate('buckets/*/*/*/objects/*');
      const params = {
        $0: 'f',
        $1: 'o',
        $2: 'o',
      };
      expect(() => {
        template.render(params);
      }).to.throw(TypeError);
    });

    it('should succeed with an unbound in the middle', () => {
      const template = new PathTemplate('bar/**/foo/*');
      const params = {
        $0: '1/2',
        $1: '3',
      };
      const want = 'bar/1/2/foo/3';
      expect(template.render(params)).to.eql(want);
    });
  });

  describe('method `inspect`', () => {
    const tests = {
      'bar/**/foo/*': 'bar/{$0=**}/foo/{$1=*}',
      'buckets/*/objects/*': 'buckets/{$0=*}/objects/{$1=*}',
      '/buckets/{hello}': 'buckets/{hello=*}',
      '/buckets/{hello=what}/{world}': 'buckets/{hello=what}/{world=*}',
      '/buckets/helloazAZ09-.~_what': 'buckets/helloazAZ09-.~_what',
    };

    Object.keys(tests).forEach(template => {
      const want = tests[template];
      it(`should render template ${template} ok`, () => {
        const t = new PathTemplate(template);
        expect(t.inspect()).to.eql(want);
      });
    });
  });
});
