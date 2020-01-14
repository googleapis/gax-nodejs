/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {expect} from 'chai';

describe('The PathTemplate parser', () => {
  it('should load the pegjs generated module ok', () => {
    const parser = require('../../src/pathTemplateParser');
    expect(parser).to.not.eql(null);
  });

  describe('function `parse`', () => {
    const parser = require('../../src/pathTemplateParser');

    it('should succeed with valid inputs', () => {
      const shouldPass = () => {
        parser.parse('a/b/**/*/{a=hello/world}');
      };
      expect(shouldPass).to.not.throw();
    });

    it('should fail on invalid tokens', () => {
      const shouldFail = () => {
        parser.parse('hello/wor* ld}');
      };
      expect(shouldFail).to.throw();
    });

    it('should fail on unexpected eof', () => {
      const shouldFail = () => {
        parser.parse('a/{hello=world');
      };
      expect(shouldFail).to.throw();
    });

    it('should fail on inner binding', () => {
      const shouldFail = () => {
        parser.parse('buckets/{hello={world}}');
      };
      expect(shouldFail).to.throw();
    });
  });
});
