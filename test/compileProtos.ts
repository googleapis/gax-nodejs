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
import * as assert from 'assert';
import * as fs from 'fs';
import * as rimraf from 'rimraf';
import * as util from 'util';
import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as compileProtos from '../tools/compileProtos';

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

  it('compiles protos to JSON', async () => {
    await compileProtos.main([
      path.join(__dirname, '..', '..', 'test', 'fixtures', 'protoLists'),
    ]);
    const expectedResultFile = path.join(resultDir, 'protos.json');
    assert(fs.existsSync(expectedResultFile));

    const json = await readFile(expectedResultFile);
    const root = protobuf.Root.fromJSON(JSON.parse(json.toString()));

    assert(root.lookup('TestMessage'));
    assert(root.lookup('LibraryService'));
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
