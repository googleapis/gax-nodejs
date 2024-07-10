/**
 * Copyright 2022 Google LLC
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

'use strict';
import {EchoClient, SequenceServiceClient, protos} from 'showcase-echo-client';
import {ShowcaseServer} from 'showcase-server';

import * as assert from 'assert';
import {promises as fsp} from 'fs';
import * as path from 'path';
import {
  protobuf,
  grpc,
  GoogleError,
  GoogleAuth,
  Status,
  createBackoffSettings,
  createMaxRetriesBackoffSettings,
  RetryOptions,
  
} from 'google-gax';
import {RequestType} from 'google-gax/build/src/apitypes';
import {PassThrough } from 'stream';
const pumpify = require('pumpify')

async function testShowcase() {
  const grpcClientOpts = {
    grpc,
    sslCreds: grpc.credentials.createInsecure(),
  };

  const grpcClientOptsWithServerStreamingRetries = {
    grpc,
    sslCreds: grpc.credentials.createInsecure(),
    gaxServerStreamingRetries: true,
  };

  const fakeGoogleAuth = {
    getClient: async () => {
      return {
        getRequestHeaders: async () => {
          return {
            Authorization: 'Bearer zzzz',
          };
        },
      };
    },
  } as unknown as GoogleAuth;

  const restClientOpts = {
    fallback: true,
    protocol: 'http',
    port: 7469,
    auth: fakeGoogleAuth,
  };

  const restClientOptsCompat = {
    fallback: 'rest' as const,
    protocol: 'http',
    port: 7469,
    auth: fakeGoogleAuth,
  };

  const grpcClient = new EchoClient(grpcClientOpts);
  const grpcClientWithServerStreamingRetries = new EchoClient(
    grpcClientOptsWithServerStreamingRetries
  );
  const grpcSequenceClientNoGaxRetries =
    new SequenceServiceClient(grpcClientOpts);
  const grpcSequenceClientWithServerStreamingRetries =
    new SequenceServiceClient(grpcClientOptsWithServerStreamingRetries);

  const restClient = new EchoClient(restClientOpts);
  const restClientCompat = new EchoClient(restClientOptsCompat);

  // await testResetRetriesToZero(grpcSequenceClientWithServerStreamingRetries);

  // assuming gRPC server is started locally
  // await testEcho(grpcClient);
  // await testEchoError(grpcClient);
  // await testExpand(grpcClient);
  // await testPagedExpand(grpcClient);
  // await testPagedExpandAsync(grpcClient);
  // await testCollect(grpcClient);
  // await testChat(grpcClient);
  // await testWait(grpcClient);

  // await testEcho(restClient);
  // await testExpand(restClient); // REGAPIC supports server streaming
  // await testPagedExpand(restClient);
  // await testPagedExpandAsync(restClient);
  // await testCollectThrows(restClient); // REGAPIC does not support client streaming
  // await testChatThrows(restClient); // REGAPIC does not support bidi streaming
  // await testWait(restClient);

  // await testEcho(restClientCompat);
  // await testExpand(restClientCompat); // REGAPIC supports server streaming
  // await testPagedExpand(restClientCompat);
  // await testPagedExpandAsync(restClientCompat);
  // await testCollectThrows(restClientCompat); // REGAPIC does not support client streaming
  // await testChatThrows(restClientCompat); // REGAPIC does not support bidi streaming
  // await testWait(restClientCompat);
  // // Testing with gaxServerStreamingRetries being true

  // await testServerStreamingRetryOptions(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testServerStreamingRetriesWithShouldRetryFn(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testServerStreamingRetrieswithRetryOptions(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testServerStreamingRetrieswithRetryRequestOptions(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testServerStreamingRetrieswithRetryRequestOptionsResumptionStrategy(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testServerStreamingRetrieswithRetryRequestOptionsErrorsOnBadResumptionStrategy(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testServerStreamingThrowsClassifiedTransientErrorNote(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testServerStreamingRetriesAndThrowsClassifiedTransientErrorNote(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testServerStreamingThrowsCannotSetTotalTimeoutMillisMaxRetries(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testShouldFailOnThirdError(
  //   grpcSequenceClientWithServerStreamingRetries
  // );

  // await testErrorMaxRetries0(grpcSequenceClientWithServerStreamingRetries);
  // // ensure legacy tests pass with streaming retries client
  // await testEcho(grpcClientWithServerStreamingRetries);
  // await testEchoError(grpcClientWithServerStreamingRetries);
  // await testExpand(grpcClientWithServerStreamingRetries);
  // await testPagedExpand(grpcClientWithServerStreamingRetries);
  // await testPagedExpandAsync(grpcClientWithServerStreamingRetries);
  // await testCollect(grpcClientWithServerStreamingRetries);
  // await testChat(grpcClientWithServerStreamingRetries);
  // await testWait(grpcClientWithServerStreamingRetries);

  console.log("grpcclient")
  // await testMegaExpand(grpcClient);
  // console.log('rest client');
  // await testMegaExpand(restClient);
  // console.log('retryclient')
  // await testMegaExpand(grpcClientWithServerStreamingRetries);
  await testStreamingErrorNoBufferNoRetry(grpcSequenceClientNoGaxRetries);
}

function createStreamingSequenceRequestFactory(
  statusCodeList: Status[],
  delayList: number[],
  failIndexs: number[],
  content: string
) {
  const request =
    new protos.google.showcase.v1beta1.CreateStreamingSequenceRequest();
  const streamingSequence =
    new protos.google.showcase.v1beta1.StreamingSequence();

  for (let i = 0; i < statusCodeList.length; i++) {
    const delay = new protos.google.protobuf.Duration();
    delay.seconds = delayList[i];

    const status = new protos.google.rpc.Status();
    status.code = statusCodeList[i];
    status.message = statusCodeList[i].toString();

    const response =
      new protos.google.showcase.v1beta1.StreamingSequence.Response();
    response.delay = delay;
    response.status = status;
    response.responseIndex = failIndexs[i];

    streamingSequence.responses.push(response);
    streamingSequence.content = content;
  }

  request.streamingSequence = streamingSequence;

  return request;
}

async function testEcho(client: EchoClient) {
  const request = {
    content: 'test',
  };
  const timer = setTimeout(() => {
    throw new Error('End-to-end testEcho method fails with timeout');
  }, 12000);
  const [response] = await client.echo(request);
  clearTimeout(timer);
  assert.deepStrictEqual(request.content, response.content);
}

async function testEchoError(client: EchoClient) {
  const fixtureName = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    'fixtures',
    'multipleErrors.json'
  );
  const protosPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    'build',
    'protos',
    'google',
    'rpc'
  );

  const data = await fsp.readFile(fixtureName, 'utf8');
  const root = protobuf.loadSync(path.join(protosPath, 'error_details.proto'));
  const objs = JSON.parse(data);
  const details = [];
  const expectedDetails = [];
  let errorInfo: {domain: string; reason: string; metadata: [string, string]};
  for (const obj of objs) {
    const MessageType = root.lookupType(obj.type);
    const buffer = MessageType.encode(obj.value).finish();
    details.push({
      type_url: 'type.googleapis.com/' + obj.type,
      value: buffer,
    });
    expectedDetails.push(obj.value);
    if (obj.type === 'google.rpc.ErrorInfo') {
      errorInfo = obj.value;
    }
  }
  const request = {
    error: {
      code: 3,
      message: 'Test error',
      details: details,
    },
  };
  const timer = setTimeout(() => {
    throw new Error('End-to-end testEchoError method fails with timeout');
  }, 12000);
  await assert.rejects(() => client.echo(request), Error);
  try {
    await client.echo(request);
  } catch (err) {
    clearTimeout(timer);
    assert.strictEqual(
      JSON.stringify((err as GoogleError).statusDetails),
      JSON.stringify(expectedDetails)
    );
    assert.ok(errorInfo!);
    assert.strictEqual((err as GoogleError).domain, errorInfo!.domain);
    assert.strictEqual((err as GoogleError).reason, errorInfo!.reason);
    assert.strictEqual(
      JSON.stringify((err as GoogleError).errorInfoMetadata),
      JSON.stringify(errorInfo!.metadata)
    );
  }
}

async function testExpand(client: EchoClient) {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const request = {
    content: words.join(' '),
  };
  const stream = client.expand(request);
  const result: string[] = [];
  stream.on('data', (response: {content: string}) => {
    result.push(response.content);
  });
  stream.on('end', () => {
    assert.deepStrictEqual(words, result);
  });
}

function testInputFactory(size: number): string[]{
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  let output: string[] = [];
  for(let i=0;i<size; i++){
    output.push(words[i%5]);
  }
  return output;




}
async function testMegaExpand(client: EchoClient) {
  // const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const words = testInputFactory(100);
  const request = {
    content: words.join(' '),
  };
  console.log("length of words", words.length);
  const stream = client.expand(request);
  //generated with gemini
  const secondStream = new PassThrough({objectMode: true});
  const togetherStream = pumpify.obj(stream, secondStream); //TODO retry with pumpify

  // TODO introduce backpressuring and or pausing
  const result: string[] = [];
  const result2: string[] = [];
  const result3: string[] = [];
  stream.on('status', (status) => {
    console.log('STATUS', status)
  })
  stream.on('metadata', (metadata) => {
    console.log('metadata', metadata)
  })
  stream.on('data',(response: {content: string}) => {
    console.log('data', result.length)

    result.push(response.content);
    // stream.pause()
    // setTimeout(() => {
    //   console.log('Now data will start flowing again.');
    //   stream.resume();
    // }, 1000);
  });
  stream.on('end', () => {
    console.log('first stream end')
    assert.deepStrictEqual(words, result);
    assert.deepStrictEqual(words.length, result.length)
    console.log('assertions true')
  });

  stream.on('error', (err) => {
    console.log('ERR1', err);
  })
  secondStream.on('data', (response: {content: string}) => {
    console.log('data2', result2.length)

    result2.push(response.content);
  })
  secondStream.on('end', () => {
    console.log('second stream end')
    assert.deepStrictEqual(words, result2);
    assert.deepStrictEqual(words.length, result2.length)
    console.log('assertsions true 2')
  });
  secondStream.on('error', (err) => {
    console.log('ERR2', err);
  })
  togetherStream.on('data', (response: {content: string}) => {
    console.log('data3', result3.length)

    result3.push(response.content);
  })
  togetherStream.on('end', () => {
    console.log('second stream end')
    assert.deepStrictEqual(words, result3);
    assert.deepStrictEqual(words.length, result3.length)
    console.log('assertsions true 2')
  });
  togetherStream.on('error', (err: any) => {
    console.log('ERR3', err);
  })
}

async function testStreamingErrorNoBufferNoRetry(
  client: SequenceServiceClient
) {
  const backoffSettings = createBackoffSettings(
    100,
    1.2,
    1000,
    null,
    1.5,
    3000,
    10000
  );
  const allowedCodes = [4];
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [1, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  await new Promise<void>(resolve => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    const secondStream = new PassThrough({objectMode: true})
    const togetherStream = new PassThrough({objectMode: true})
    attemptStream.pipe(secondStream).pipe(togetherStream);

    // const togetherStream = pumpify.obj(attemptStream, secondStream)
    // attemptStream.on('status', (status) => {
    //   console.log('st', status);
    // });
    // attemptStream.on('metadata', (metadata) => {
    //   console.log('mtda', metadata);
    // });
    // attemptStream.on('data', (data) => {
    //   console.log('this should not happen', data);
    //   // throw new Error('this is a problem')
    //   // resolve();
    // });
    attemptStream.on('error', (e: GoogleError) => {
      console.log('first stream')
      assert.strictEqual(e.code, 14);
      // resolve();
    });
    secondStream.on('error', (e: GoogleError) => {
      console.log("second stream")
      assert.strictEqual(e.code, 13);
      // resolve();
    });
    togetherStream.on('error', (e: GoogleError) => {
      console.log("final stream")
      assert.strictEqual(e.code, 14);
      resolve();
    });
  });
}

async function testPagedExpand(client: EchoClient) {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const request = {
    content: words.join(' '),
    pageSize: 2,
  };
  const timer = setTimeout(() => {
    throw new Error('End-to-end testPagedExpand method fails with timeout');
  }, 12000);
  const [response] = await client.pagedExpand(request);
  clearTimeout(timer);
  const result = response.map(r => r.content);
  assert.deepStrictEqual(words, result);
}

async function testPagedExpandAsync(client: EchoClient) {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const request = {
    content: words.join(' '),
    pageSize: 2,
  };
  const response = [];
  const iterable = client.pagedExpandAsync(request);
  const timer = setTimeout(() => {
    throw new Error(
      'End-to-end testPagedExpandAsync method fails with timeout'
    );
  }, 12000);
  for await (const resource of iterable) {
    response.push(resource.content);
  }
  clearTimeout(timer);
  assert.deepStrictEqual(words, response);
}

async function testCollect(client: EchoClient) {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const promise = new Promise<string>((resolve, reject) => {
    try {
      const stream = client.collect((err, result) => {
        if (err || !result) {
          reject(err);
        } else {
          resolve(result.content ?? '');
        }
      });
      for (const word of words) {
        const request = {content: word};
        stream.write(request);
      }
      stream.on('data', (result: {content: String}) => {
        assert.deepStrictEqual(result.content, words.join(' '));
      });
      stream.end();
    } catch (err) {
      reject(err);
    }
  });
  const result = await promise;
  assert.strictEqual(result, words.join(' '));
}

async function testCollectThrows(client: EchoClient) {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const promise = new Promise<string>((resolve, reject) => {
    try {
      const stream = client.collect((err, result) => {
        if (err || !result) {
          reject(err);
        } else {
          resolve(result.content ?? '');
        }
      });
      for (const word of words) {
        const request = {content: word};
        stream.write(request);
      }
      stream.on('data', (result: {content: String}) => {
        assert.deepStrictEqual(result.content, words.join(' '));
      });
      stream.end();
    } catch (err) {
      reject(err);
    }
  });
  // We expect the promise to be rejected
  promise.then(
    () => {
      assert(false);
    },
    (err: Error) => {
      assert.match(err.message, /currently does not support/);
    }
  );
}

async function testChat(client: EchoClient) {
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
  const promise = new Promise((resolve, reject) => {
    try {
      const result: string[] = [];
      const stream = client.chat();
      stream.on('data', (response: {content: string}) => {
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
    } catch (err) {
      reject(err);
    }
  });
  const result = await promise;
  assert.deepStrictEqual(result, words);
}

async function testChatThrows(client: EchoClient) {
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
  const promise = new Promise((resolve, reject) => {
    try {
      const result: string[] = [];
      const stream = client.chat();
      stream.on('data', (response: {content: string}) => {
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
    } catch (err) {
      reject(err);
    }
  });
  // We expect the promise to be rejected
  promise.then(
    () => {
      assert(false);
    },
    (err: Error) => {
      assert.match(err.message, /currently does not support/);
    }
  );
}

async function testWait(client: EchoClient) {
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

// a successful streaming call that has retry options passed but does not retry
async function testServerStreamingRetryOptions(client: SequenceServiceClient) {
  const finalData: string[] = [];
  const backoffSettings = createBackoffSettings(
    100,
    1.2,
    1000,
    null,
    1.5,
    3000,
    10000
  );

  const retryOptions = new RetryOptions([], backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.OK],
    [0.1],
    [11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('data', (response: {content: string}) => {
      finalData.push(response.content);
    });
    attemptStream.on('error', (error: GoogleError) => {
      // should not reach this
      reject(error);
    });
    attemptStream.on('end', () => {
      attemptStream.end();
      resolve();
    });
  }).then(() => {
    assert.equal(
      finalData.join(' '),
      'This is testing the brand new and shiny StreamingSequence server 3'
    );
  });
}

// a streaming call that retries two times and finishes successfully
async function testServerStreamingRetrieswithRetryOptions(
  client: SequenceServiceClient
) {
  const finalData: string[] = [];
  const backoffSettings = createBackoffSettings(
    100,
    1.2,
    1000,
    null,
    1.5,
    3000,
    10000
  );

  const retryOptions = new RetryOptions([14, 4], backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [1, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('data', (response: {content: string}) => {
      finalData.push(response.content);
    });
    attemptStream.on('error', error => {
      reject(error);
    });
    attemptStream.on('end', () => {
      attemptStream.end();
      resolve();
    });
  }).then(() => {
    assert.equal(
      finalData.join(' '),
      'This This is This is testing the brand new and shiny StreamingSequence server 3'
    );
  });
}

// a streaming call that retries twice using shouldRetryFn and finally succeeds
async function testServerStreamingRetriesWithShouldRetryFn(
  client: SequenceServiceClient
) {
  const finalData: string[] = [];
  const shouldRetryFn = function checkRetry(error: GoogleError) {
    return [14, 4].includes(error!.code!);
  };

  const backoffSettings = createBackoffSettings(
    100,
    1.2,
    1000,
    null,
    1.5,
    3000,
    10000
  );

  const retryOptions = new RetryOptions([], backoffSettings, shouldRetryFn);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [1, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];
    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('data', (response: {content: string}) => {
      finalData.push(response.content);
    });
    attemptStream.on('error', error => {
      // should not reach this
      reject(error);
    });
    attemptStream.on('end', () => {
      attemptStream.end();
      resolve();
    });
  }).then(() => {
    assert.equal(
      finalData.join(' '),
      'This This is This is testing the brand new and shiny StreamingSequence server 3'
    );
  });
}

// streaming call that retries twice using RetryRequestOptions instead of RetryOptions
async function testServerStreamingRetrieswithRetryRequestOptions(
  client: SequenceServiceClient
) {
  const finalData: string[] = [];
  const retryRequestOptions = {
    objectMode: true,
    retries: 2,
    maxRetryDelay: 70,
    retryDelayMultiplier: 3,
    totalTimeout: 650,
    noResponseRetries: 3,
    currentRetryAttempt: 0,
    shouldRetryFn: function checkRetry(error: GoogleError) {
      return [14, 4].includes(error!.code!);
    },
  };

  const settings = {
    retryRequestOptions: retryRequestOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [1, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('data', (response: {content: string}) => {
      finalData.push(response.content);
    });
    attemptStream.on('error', error => {
      reject(error);
    });
    attemptStream.on('end', () => {
      attemptStream.end();
      resolve();
    });
  }).then(() => {
    assert.equal(
      finalData.join(' '),
      'This This is This is testing the brand new and shiny StreamingSequence server 3'
    );
  });
}

// When the stream recieves data then the retry count should be set to 0
async function testResetRetriesToZero(client: SequenceServiceClient) {
  const finalData: string[] = [];
  const shouldRetryFn = (error: GoogleError) => {
    return [4, 5, 6, 7].includes(error!.code!);
  };
  const backoffSettings = createBackoffSettings(
    10000,
    2.5,
    1000,
    null,
    1.5,
    3000,
    null
  );
  // intentionally set maxRetries to a value less than
  // the number of errors in the sequence
  backoffSettings.maxRetries = 2;
  const getResumptionRequestFn = (request: RequestType) => {
    return request;
  };

  const retryOptions = new RetryOptions(
    [],
    backoffSettings,
    shouldRetryFn,
    getResumptionRequestFn
  );

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [
      Status.DEADLINE_EXCEEDED,
      Status.NOT_FOUND,
      Status.ALREADY_EXISTS,
      Status.PERMISSION_DENIED,
      Status.OK,
    ],
    [0.1, 0.1, 0.1, 0.1, 0.1],
    [1, 2, 3, 4, 5],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );
  const response = await client.createStreamingSequence(request);
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('data', (response: {content: string}) => {
      finalData.push(response.content);
    });
    attemptStream.on('error', error => {
      reject(error);
    });
    attemptStream.on('end', () => {
      attemptStream.end();
      resolve();
    });
  }).then(() => {
    assert.deepStrictEqual(
      finalData.join(' '),
      'This This is This is testing This is testing the This is testing the brand'
    );
  });
}

// When maxRetries are set to 2 then on the third error from the server gax
// should throw an error that says the retry count has been exceeded.
async function testShouldFailOnThirdError(client: SequenceServiceClient) {
  const backoffSettings = createBackoffSettings(
    100,
    1.2,
    1000,
    null,
    1.5,
    3000,
    null
  );
  const allowedCodes = [4, 5, 6];
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings);
  backoffSettings.maxRetries = 2;

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [
      Status.DEADLINE_EXCEEDED, // Error code 4
      Status.NOT_FOUND, // Error code 5
      Status.ALREADY_EXISTS, // Error code 6
      Status.OK,
    ],
    [0.1, 0.1, 0.1, 0.1],
    [0, 0, 0, 1],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );
  const response = await client.createStreamingSequence(request);
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('data', () => {
      reject(new GoogleError('The stream should not receive any data'));
    });
    attemptStream.on('error', (error: GoogleError) => {
      try {
        assert.strictEqual(error.code, 4);
        assert.strictEqual(
          error.message,
          'Exceeded maximum number of retries before any response was received'
        );
        resolve();
      } catch (assertionError: unknown) {
        reject(assertionError);
      }
    });
    attemptStream.on('end', () => {
      reject(
        new GoogleError('The stream should not end before it receives an error')
      );
    });
  });
}

// streaming call that retries twice with RetryRequestOpsions and resumes from where it left off
async function testServerStreamingRetrieswithRetryRequestOptionsResumptionStrategy(
  client: SequenceServiceClient
) {
  const finalData: string[] = [];
  const shouldRetryFn = (error: GoogleError) => {
    return [4, 14].includes(error!.code!);
  };
  const backoffSettings = createBackoffSettings(
    10000,
    2.5,
    1000,
    null,
    1.5,
    3000,
    600000
  );
  const getResumptionRequestFn = (request: RequestType) => {
    const newRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest() as unknown as RequestType;
    newRequest.name = request.name;
    newRequest.lastFailIndex = 5;
    return newRequest as unknown as RequestType;
  };

  const retryOptions = new RetryOptions(
    [],
    backoffSettings,
    shouldRetryFn,
    getResumptionRequestFn
  );

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [1, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );
  const response = await client.createStreamingSequence(request);
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('data', (response: {content: string}) => {
      finalData.push(response.content);
    });
    attemptStream.on('error', error => {
      reject(error);
    });
    attemptStream.on('end', () => {
      attemptStream.end();
      resolve();
    });
  }).then(() => {
    assert.deepStrictEqual(
      finalData.join(' '),
      'This new and new and shiny StreamingSequence server 3'
    );
  });
}

// retries twice but fails with an error not from the streaming sequence
async function testServerStreamingRetrieswithRetryRequestOptionsErrorsOnBadResumptionStrategy(
  client: SequenceServiceClient
) {
  const shouldRetryFn = (error: GoogleError) => {
    return [4, 14].includes(error!.code!);
  };
  const backoffSettings = createBackoffSettings(
    10000,
    2.5,
    1000,
    null,
    1.5,
    3000,
    600000
  );
  const getResumptionRequestFn = () => {
    // return a bad resumption strategy
    return {};
  };

  const retryOptions = new RetryOptions(
    [],
    backoffSettings,
    shouldRetryFn,
    getResumptionRequestFn
  );

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [1, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );
  const response = await client.createStreamingSequence(request);
  await new Promise<void>(resolve => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );

    attemptStream.on('error', (e: GoogleError) => {
      assert.strictEqual(e.code, 3);
      assert.match(e.note!, /not classified as transient/);
      resolve();
    });
  });
}

// fails on the first error in the sequence
async function testServerStreamingThrowsClassifiedTransientErrorNote(
  client: SequenceServiceClient
) {
  const backoffSettings = createBackoffSettings(
    100,
    1.2,
    1000,
    null,
    1.5,
    3000,
    10000
  );
  const allowedCodes = [4];
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [1, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  await new Promise<void>(resolve => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('error', (e: GoogleError) => {
      assert.strictEqual(e.code, 14);
      assert.match(e.note!, /not classified as transient/);
      resolve();
    });
  });
}

// retries once and fails on the second error in the sequence
async function testServerStreamingRetriesAndThrowsClassifiedTransientErrorNote(
  client: SequenceServiceClient
) {
  const backoffSettings = createBackoffSettings(
    100,
    1.2,
    1000,
    null,
    1.5,
    3000,
    10000
  );
  const allowedCodes = [14];
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [1, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  await new Promise<void>(resolve => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('error', (e: GoogleError) => {
      assert.strictEqual(e.code, 4);
      assert.match(e.note!, /not classified as transient/);
      resolve();
    });
  });
}

async function testServerStreamingThrowsCannotSetTotalTimeoutMillisMaxRetries(
  client: SequenceServiceClient
) {
  const backoffSettings = createBackoffSettings(
    100,
    1.2,
    1000,
    null,
    1.5,
    3000,
    10000
  );
  const allowedCodes = [14];
  backoffSettings.maxRetries = 1;
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1],
    [1, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  await new Promise<void>(resolve => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('error', (e: GoogleError) => {
      assert.strictEqual(e.code, 3);
      assert.match(
        e.message,
        /Cannot set both totalTimeoutMillis and maxRetries/
      );
      resolve();
    });
  });
}

// The test should not retry when the max retries are set to 0
// and the emitted error should bubble up to the user when it does not retry.
async function testErrorMaxRetries0(client: SequenceServiceClient) {
  const shouldRetryFn = (error: GoogleError) => {
    return [4].includes(error!.code!);
  };
  const backoffSettings = createMaxRetriesBackoffSettings(
    10000,
    2.5,
    1000,
    0,
    1.5,
    3000,
    0
  );
  const getResumptionRequestFn = (request: RequestType) => {
    return request;
  };

  const retryOptions = new RetryOptions(
    [],
    backoffSettings,
    shouldRetryFn,
    getResumptionRequestFn
  );

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  const request = createStreamingSequenceRequestFactory(
    [Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1],
    [0, 1],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );
  const response = await client.createStreamingSequence(request);
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;
    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );
    attemptStream.on('data', () => {
      reject(new GoogleError('The stream should not receive any data'));
    });
    attemptStream.on('error', (error: GoogleError) => {
      try {
        assert.strictEqual(error.code, 4);
        assert.strictEqual(error.note, 'Max retries is set to zero.');
        resolve();
      } catch (assertionError: unknown) {
        reject(assertionError);
      }
    });
    attemptStream.on('end', () => {
      reject(
        new GoogleError('The stream should not end before it receives an error')
      );
    });
  });
}

async function main() {
  // const showcaseServer = new ShowcaseServer();
  // try {
  //   await showcaseServer.start();
    await testShowcase();
  // } finally {
  //   showcaseServer.stop();
  // }
}

main();
