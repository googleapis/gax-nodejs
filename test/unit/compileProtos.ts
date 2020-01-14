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

import * as assert from 'assert';
import {describe, it} from 'mocha';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as util from 'util';
import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as compileProtos from '../../tools/compileProtos';

const readFile = util.promisify(fs.readFile);
const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);

const testDir = path.join(process.cwd(), '.compileProtos-test');
const resultDir = path.join(testDir, 'protos');
const cwd = process.cwd();

describe('compileProtos tool', () => {
  before(async () => {
    if (fs.existsSync(testDir)) {
      await rmrf(testDir);
    }
    await mkdir(testDir);
    await mkdir(resultDir);

    process.chdir(testDir);
  });

  after(() => {
    process.chdir(cwd);
  });

  it('compiles protos to JSON, JS, TS', async () => {
    await compileProtos.main([
      path.join(__dirname, '..', '..', 'test', 'fixtures', 'protoLists'),
    ]);
    const expectedJsonResultFile = path.join(resultDir, 'protos.json');
    const expectedJSResultFile = path.join(resultDir, 'protos.js');
    const expectedTSResultFile = path.join(resultDir, 'protos.d.ts');
    assert(fs.existsSync(expectedJsonResultFile));
    assert(fs.existsSync(expectedJSResultFile));
    assert(fs.existsSync(expectedTSResultFile));

    const json = await readFile(expectedJsonResultFile);
    const root = protobuf.Root.fromJSON(JSON.parse(json.toString()));
    assert(root.lookup('TestMessage'));
    assert(root.lookup('LibraryService'));

    const js = await readFile(expectedJSResultFile);
    assert(js.toString().includes('TestMessage'));
    assert(js.toString().includes('LibraryService'));
    assert(
      js.toString().includes('http://www.apache.org/licenses/LICENSE-2.0')
    );

    const ts = await readFile(expectedTSResultFile);
    assert(ts.toString().includes('TestMessage'));
    assert(ts.toString().includes('LibraryService'));
    assert(ts.toString().includes('import * as Long'));
    assert(
      ts.toString().includes('http://www.apache.org/licenses/LICENSE-2.0')
    );
  });

  it('writes an empty object if no protos are given', async () => {
    await compileProtos.main([
      path.join(
        __dirname,
        '..',
        '..',
        'test',
        'fixtures',
        'protoLists',
        'empty'
      ),
    ]);
    const expectedResultFile = path.join(resultDir, 'protos.json');
    assert(fs.existsSync(expectedResultFile));

    const json = await readFile(expectedResultFile);
    assert.strictEqual(json.toString(), '{}');
  });
});
