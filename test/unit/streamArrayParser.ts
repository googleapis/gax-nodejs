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
import {toProtobufJSON} from './utils';

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
  const User = root.lookupType('User');

  let inStream: Readable;
  let streamMethod: protobuf.Method;
  before(() => {
    UserService.resolveAll();
    streamMethod = UserService.methods['RunQuery'];
  });
  it('should successfully decode array of valid JSON', done => {
    const expectedResults = [
      {
        name: {firstName: 'John', lastName: 'Doe'},
        occupation: ['gardener'],
        updateTime: '2021-07-21T07:37:32.616613Z',
        description: 'Normal Test',
        age: 22,
      },
      {
        name: {firstName: 'Susan', lastName: 'Young'},
        occupation: ['teacher'],
        updateTime: '2021-07-21T07:37:33.038352Z',
        description: 'Escaping Double "Quotes',
        age: 55,
      },
      {
        name: {firstName: 'Sue', lastName: 'Young'},
        occupation: ['teacher', 'worker'],
        updateTime: '2021-07-21T07:37:33.038352Z',
        description: 'Escaping escape \\"Quotes',
        age: 50,
      },
      {
        name: {firstName: 'Kiran', lastName: 'Mitchell'},
        occupation: ['accountant'],
        updateTime: '2021-07-21T07:37:33.038352Z',
        description: 'String Nest {Curly Brackets}',
        age: 32,
      },
      {
        name: {firstName: 'Omar', lastName: 'Coleman'},
        occupation: ['pilot', 'engineer'],
        updateTime: '2021-10-15T22:20:58.331136Z',
        description: 'String Nest [Square Brackets]',
        age: 29,
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
      assert.strictEqual(actualResults.length, expectedResults.length);
      actualResults.forEach((actual, index) => {
        const expect = toProtobufJSON(User, expectedResults[index]);
        assert.strictEqual(JSON.stringify(actual), JSON.stringify(expect));
      });
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
        "Internal Error: API service stream data must start with a '[' and close with the corresponding ']'"
      );
      done();
    });
  });
});
