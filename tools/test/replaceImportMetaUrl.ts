// Copyright 2023 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {describe, it} from 'mocha';
import * as babel from '@babel/core';
import replaceImportMetaUrl from '../src/replaceImportMetaUrl';
import * as assert from 'assert';

describe('replace import.meta.url', () => {
  it('does not replace import.meta without url property', async () => {
    const program = 'console.log(import.meta);';
    const result = await babel.transformAsync(program, {
      plugins: [replaceImportMetaUrl],
    });
    assert.strictEqual(result?.code, program);
  });

  it('does not replace properties other than url on import.meta', async () => {
    const program = 'console.log(import.meta.foo);';
    const result = await babel.transformAsync(program, {
      plugins: [replaceImportMetaUrl],
    });
    assert.strictEqual(result?.code, program);
  });

  it('replaces import.meta.url with __dirname when no user option provided', async () => {
    const program = 'console.log(import.meta.url);';
    const expected = 'console.log(__dirname);';
    const result = await babel.transformAsync(program, {
      plugins: [replaceImportMetaUrl],
    });
    assert.strictEqual(result?.code, expected);
  });

  it('replaces import.meta.url with the provided option', async () => {
    const program = 'console.log(import.meta.url)';
    const expected = 'console.log(foo.bar);';
    const result = await babel.transformAsync(program, {
      babelrc: false,
      filename: 'replaceImportMetaUrl.ts',
      plugins: [[replaceImportMetaUrl, {replacementValue: 'foo.bar'}]],
    });
    assert.strictEqual(result?.code, expected);
  });
});
