// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

const assert = require('assert');

let grpc;
if (process.env['GOOGLE_CLOUD_USE_GRPC_JS']) {
  grpc = require('@grpc/grpc-js');
} else {
  grpc = require('grpc');
}

// Import the clients for each version supported by this package.
const gapic = Object.freeze({
  v1beta1: require('./v1beta1'),
});

module.exports.v1beta1 = gapic.v1beta1;

// Alias `module.exports` as `module.exports.default`, for future-proofing.
module.exports.default = Object.assign({}, module.exports);

if (require.main === module) {
  testShowcase().then(
    () => {
      console.log('It works!');
    },
    err => {
      process.exitCode = 1;
      console.log(err);
    }
  );
}

async function testShowcase() {
  const client = new gapic.v1beta1.EchoClient({
    grpc,
    sslCreds: grpc.credentials.createInsecure(),
  });

  // assuming gRPC server is started locally
  await testEcho(client);
  await testExpand(client);
  await testPagedExpand(client);
  await testCollect(client);
  await testChat(client);
  await testWait(client);
}

async function testEcho(client) {
  const request = {
    content: 'test',
  };
  const [response] = await client.echo(request);
  assert.deepStrictEqual(request.content, response.content);
}

async function testExpand(client) {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const request = {
    content: words.join(' '),
  };
  const result = await new Promise((resolve, reject) => {
    const stream = client.expand(request);
    const result = [];
    stream.on('data', response => {
      result.push(response.content);
    });
    stream.on('end', () => {
      resolve(result);
    });
    stream.on('error', reject);
  });
  assert.deepStrictEqual(words, result);
}

async function testPagedExpand(client) {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const request = {
    content: words.join(' '),
    pageSize: 2,
  };
  const [response] = await client.pagedExpand(request);
  const result = response.map(r => r.content);
  assert.deepStrictEqual(words, result);
}

async function testCollect(client) {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const result = await new Promise((resolve, reject) => {
    const stream = client.collect((err, result) => {
      if (err) {
        reject(err);
        return;
      }
      resolve(result);
    });
    for (const word of words) {
      const request = {content: word};
      stream.write(request);
    }
    stream.end();
  });
  assert.deepStrictEqual(result.content, words.join(' '));
}

async function testChat(client) {
  const words = [
    'nobody',
    'ever',
    'reads',
    'test',
    'input',
    'especially',
    'this',
    'one',
  ];
  const result = await new Promise((resolve, reject) => {
    const result = [];
    const stream = client.chat();
    stream.on('data', response => {
      result.push(response.content);
    });
    stream.on('end', () => {
      resolve(result);
    });
    stream.on('error', reject);
    for (const word of words) {
      stream.write({content: word});
    }
    stream.end();
  });
  assert.deepStrictEqual(result, words);
}

async function testWait(client) {
  const request = {
    ttl: {
      seconds: 5,
      nanos: 0,
    },
    success: {
      content: 'done',
    },
  };
  const [operation] = await client.wait(request);
  const [response] = await operation.promise();
  assert.deepStrictEqual(response.content, request.success.content);
}
