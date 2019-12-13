/**
 * Copyright 2019 Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
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

import * as assert from 'assert';
import {expect} from 'chai';
// @ts-ignore
import * as EchoClient from '../fixtures/google-gax-packaging-test-app/src/v1beta1/echo_client';

function sleep(timeout: number) {
  return new Promise(resolve => {
    setTimeout(resolve, timeout);
  });
}

describe('Run tests against gRPC server', () => {
  const authStub = {
    getRequestHeaders() {
      return {Authorization: 'Bearer SOME_TOKEN'};
    },
  };

  const opts = {
    auth: authStub,
    protocol: 'http',
    port: 1337,
  };

  // @ts-ignore
  global.isBrowser = true;
  const client = new EchoClient(opts);

  before(async function() {
    this.timeout(40000);

    const request = {
      content: 'test',
    };
    const MAX_RETRIES = 20;
    const TIMEOUT = 1000;
    let retryCount = 0;
    // Making sure server is up before starting tests.
    for (; retryCount < MAX_RETRIES; ++retryCount) {
      try {
        await client.echo(request);
      } catch (err) {
        await sleep(TIMEOUT);
        continue;
      }
      break;
    }
    if (retryCount === MAX_RETRIES) {
      throw new Error(
        `gapic-showcase server did not respond after ${MAX_RETRIES} attempts, aborting end-to-end browser tests`
      );
    }
  });

  it('should be able to call simple RPC methods', async () => {
    const request = {
      content: 'test',
    };
    const [response] = await client.echo(request);
    assert.deepStrictEqual(request.content, response.content);
  });

  it('should throw an error when calling server-side streaming calls', async () => {
    const words = ['nobody', 'ever', 'reads', 'test', 'input'];
    const request = {
      content: words.join(' '),
    };

    expect(() => {
      client.expand(request);
    }).to.throw();
  });

  it('should be able to call paging calls', async () => {
    const words = ['nobody', 'ever', 'reads', 'test', 'input'];
    const request = {
      content: words.join(' '),
      pageSize: 2,
    };
    const [response] = await client.pagedExpand(request);
    const result = response.map((r: {content: string}) => r.content);
    assert.deepStrictEqual(words, result);
  });

  it('should throw an error when calling client-side streaming calls', async () => {
    expect(() => {
      client.collect();
    }).to.throw();
  });

  it('should throw an error when calling bi-direction streaming calls', async () => {
    expect(() => {
      client.chat();
    }).to.throw();
  });

  it('should be able to call long-running calls', async function() {
    // LRO is being tested here, which takes at least 5000ms to finish running
    this.timeout(60000);
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
  });
});
