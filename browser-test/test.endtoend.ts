import * as assert from 'assert';
import {expect} from 'chai';
import * as EchoClient from './fixtures/echo_client';

function sleep(timeout) {
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
  };

  const client = new EchoClient(opts);

  before(async function() {
    this.timeout(30000);

    //TODO: Make sure server is up and running before starting tests, but
    //      without using sleep for some arbitrary amount of time
    // await sleep(10000);
    const request = {
      content: 'test',
    };
    const MAX_RETRIES = 20;
    const TIMEOUT = 1000;

    // Code to make sure server is up before starting tests. Commented
    // out since it doesn't work quite yet

    for (let retryCount = 0; retryCount < MAX_RETRIES; ++retryCount) {
        console.log('attempt #', retryCount);
        try {
            console.log('trying to send request');
            await client.echo(request);
        }
        catch (err) {
            console.log('Still waiting for server...');
            console.log(err);
            await sleep(TIMEOUT);
            continue;
        }
        console.log('Server is up and running');
        break;
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
    const result = response.map(r => r.content);
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
