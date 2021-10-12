/**
 * Copyright 2021 Google LLC
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
import {StreamArrayParser} from '../../src/streamArrayParser';
import {before, describe, it} from 'mocha';
import {pipeline, Readable} from 'stream';
import path = require('path');
import protobuf = require('protobufjs');

interface User {
  name: string;
  occupation: string;
  born: string;
}

function createRandomChunkReadableStream(data: string) {
  const stream = new Readable({
    objectMode: true,
    read() {},
  });

  const users = data.split('');
  let index = 0;
  while (index < users.length) {
    const random = Math.floor(Math.random() * 20);
    let str = '';
    for (let idx = 0; idx < random && index < users.length; ++idx) {
      str += users[index];
      ++index;
    }
    stream.push(str);
  }
  stream.push(null);
  return stream;
}

describe('Parse REST stream array', () => {
  const protos_path = path.resolve(__dirname, '..', 'fixtures', 'user.proto');
  const root = protobuf.loadSync(protos_path);
  const UserService = root.lookupService('UserService');

  let inStream: Readable;
  let streamMethod: protobuf.Method;
  before(() => {
    UserService.resolveAll();
    streamMethod = UserService.methods['RunQuery'];
  });
  it('should successfully decode array of valid JSON', done => {
    const expectedResults = [
      {
        name: 'John Doe',
        occupation: 'gardener',
        born: '1992-03-02',
      },
      {
        name: 'Skipped Double "Quotes',
        occupation: 'teacher',
        born: '1967-11-22',
      },
      {
        name: 'String Nest {Curly Brackets}',
        occupation: 'accountant',
        born: '1995-04-07',
      },
      {
        name: 'String Nest [Square Brackets]',
        occupation: 'pilot',
        born: '1977-10-31',
      },
    ];
    inStream = createRandomChunkReadableStream(JSON.stringify(expectedResults));
    const streamArrayParser = new StreamArrayParser(streamMethod);
    pipeline(inStream, streamArrayParser, err => {
      if (err) {
        throw new Error('should not be run.');
      }
      assert.strictEqual(err, undefined);
    });
    const actualResults: User[] = [];
    streamArrayParser.on('data', data => {
      actualResults.push(data);
    });
    streamArrayParser.on('end', () => {
      assert.strictEqual(
        JSON.stringify(actualResults),
        JSON.stringify(expectedResults)
      );
      done();
    });
  });
  it("should listen on error if input stream is not start '['", done => {
    const expectedResults = {};
    inStream = createRandomChunkReadableStream(JSON.stringify(expectedResults));
    const streamArrayParser = new StreamArrayParser(streamMethod);
    pipeline(inStream, streamArrayParser, err => {
      assert(err instanceof Error);
    });
    streamArrayParser.once('error', err => {
      assert(err instanceof Error);
      assert.deepStrictEqual(
        err.message,
        "API service stream data must start with a '[' and close with the corresponding ']'"
      );
      done();
    });
  });
});
