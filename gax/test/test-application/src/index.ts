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
import {Duplex, PassThrough, pipeline} from 'stream';
const pumpify=require('pumpify');
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
  // TODO do I have duplicate clients?
  const grpcClientWithServerStreamingRetries = new EchoClient(
    grpcClientOptsWithServerStreamingRetries
  );
  const grpcSequenceClientNoGaxRetries = new SequenceServiceClient(
    grpcClientOpts
  );
  const grpcSequenceClientWithServerStreamingRetries =
    new SequenceServiceClient(grpcClientOptsWithServerStreamingRetries);

  const restClient = new EchoClient(restClientOpts);
  const restClientCompat = new EchoClient(restClientOptsCompat);

  // assuming gRPC server is started locally
  await testEcho(grpcClient);
  await testEchoError(grpcClient);
  await testExpand(grpcClient);
  await testPagedExpand(grpcClient);
  await testPagedExpandAsync(grpcClient);
  await testCollect(grpcClient);
  await testChat(grpcClient);
  await testWait(grpcClient);

  await testEcho(restClient);
  await testExpand(restClient); // REGAPIC supports server streaming
  await testPagedExpand(restClient);
  await testPagedExpandAsync(restClient);
  await testCollectThrows(restClient); // REGAPIC does not support client streaming
  await testChatThrows(restClient); // REGAPIC does not support bidi streaming
  await testWait(restClient);

  await testEcho(restClientCompat);
  await testExpand(restClientCompat); // REGAPIC supports server streaming
  await testPagedExpand(restClientCompat);
  await testPagedExpandAsync(restClientCompat);
  await testCollectThrows(restClientCompat); // REGAPIC does not support client streaming
  await testChatThrows(restClientCompat); // REGAPIC does not support bidi streaming
  await testWait(restClientCompat);
  // Testing with gaxServerStreamingRetries being true
  // ALL  GOOD
  await testServerStreamingRetryOptions(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testServerStreamingRetriesWithShouldRetryFn(
    grpcSequenceClientWithServerStreamingRetries
  );
  await testServerStreamingRetrieswithRetryOptions(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testServerStreamingRetrieswithRetryRequestOptions(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testServerStreamingRetrieswithRetryRequestOptionsResumptionStrategy(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testServerStreamingRetrieswithRetryRequestOptionsErrorsOnBadResumptionStrategy(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testServerStreamingThrowsClassifiedTransientErrorNote(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testServerStreamingRetriesAndThrowsClassifiedTransientErrorNote(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testServerStreamingThrowsCannotSetTotalTimeoutMillisMaxRetries(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testShouldFailOnThirdError(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testErrorMaxRetries0(grpcSequenceClientWithServerStreamingRetries);

  await testServerStreamingRetriesImmediatelywithRetryOptions(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testResetRetriesToZero(grpcSequenceClientWithServerStreamingRetries);

  // ensure legacy tests pass with streaming retries client
  await testEcho(grpcClientWithServerStreamingRetries);
  await testEchoError(grpcClientWithServerStreamingRetries);
  await testExpand(grpcClientWithServerStreamingRetries);
  await testPagedExpand(grpcClientWithServerStreamingRetries);
  await testPagedExpandAsync(grpcClientWithServerStreamingRetries);
  await testCollect(grpcClientWithServerStreamingRetries);
  await testChat(grpcClientWithServerStreamingRetries);
  await testWait(grpcClientWithServerStreamingRetries);

  // TODO add a test for exceeding the timeout
  /* Series of tests that validate behavior of gax behavior with stream pipelines */

  /* NO BUFFERING YES GAX NATIVE RETRIES
  This section has pipelines of streams but no data buffering
  and tests them against gax clients that DO utilize gax native retries
  some scenarios may not actually involve retrying */

  //ALL GOOD

  await testImmediateStreamingErrorNoBufferPumpify(
    grpcSequenceClientWithServerStreamingRetries
  );
  await testImmediateStreamingErrorNoBufferPipeline(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify(
    grpcSequenceClientWithServerStreamingRetries
  );
  await testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPipeline(
    grpcSequenceClientWithServerStreamingRetries
  );

  //TODO rename these two
  await testStreamingPipelineErrorAfterDataNoBufferNoRetryPumpify(
    grpcSequenceClientWithServerStreamingRetries
  );
  await testStreamingPipelineErrorAfterDataNoBufferNoRetryPipeline(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testImmediateStreamingErrorNoBufferYesRetryRequestRetryPipeline(
    grpcSequenceClientWithServerStreamingRetries
  );
  await testImmediateStreamingErrorNoBufferYesRetryRequestRetryPumpify(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testImmediateStreamingErrorThenSucceedsNoBufferYesRetryPumpify(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testImmediateStreamingErrorThenSucceedsNoBufferYesRetryPipeline(
    grpcSequenceClientWithServerStreamingRetries
  );

  await testStreamingPipelineErrorAfterDataNoBufferYesRetryPumpify(
    grpcSequenceClientWithServerStreamingRetries
  );
  await testStreamingPipelineErrorAfterDataNoBufferYesRetryPipeline(
    grpcSequenceClientWithServerStreamingRetries
  );

  // TODO - buffer tests
  // await testStreamingPipelineSuccessAfterDataYesBufferNoRetry(grpcSequenceClientWithServerStreamingRetries);
  // await testStreamingPipelineErrorAfterDataYesBufferYesRetry(grpcSequenceClientWithServerStreamingRetries);
  // await testStreamingPipelineErrorAfterDataYesBufferNoRetry(grpcSequenceClientWithServerStreamingRetries);
  // await testStreamingErrorAfterDataYesBufferYesRetryRequestRetry(grpcSequenceClientWithServerStreamingRetries)
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
  stream.on('error', error => {
    throw new Error('testExpand error' + error.message);
  });
}

function testInputFactory(size: number): string[] {
  const words = ['nobody', 'ever', 'reads', 'test', 'input'];
  const output: string[] = [];
  for (let i = 0; i < size; i++) {
    output.push(words[i % 5]);
  }
  return output;
}

// sequence that fails on the first error in the sequence
// tests streams connected by pumpify
async function testImmediateStreamingErrorNoBufferPumpify(
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
    [0, 2, 11], //error before any data is sent
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);
  attemptStream.on('data', () => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferPumpify error attemptStream'
    );
  });

  togetherStream.on('data', () => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferPumpify error togetherStream'
    );
  });

  // when using pipeline it is expected that togetherStream would log before thirdStream because they're basically invoking the same thing
  // imagine togetherStream is three physical pipes put together - what comes out of the third section of pipe is the same
  // as what comes out of the whole thing and arrives at the same time

  // when using pumpify, only first stream and final stream will be logged
  togetherStream.on('error', (e: GoogleError) => {
    assert.strictEqual(e.code, 14);
  });

  attemptStream.on('error', (e: GoogleError) => {
    assert.strictEqual(e.code, 14);
  });

  attemptStream.on('end', () => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferPumpify ended without error'
    );
  });

  togetherStream.on('end', () => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferPumpify ended without error'
    );
  });
  togetherStream.on('close', () => {
    // streams should already be cleaned up
    // but end them anyway for posterity
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}

// sequence that fails on the first error in the sequence
// tests streams connected by pipeline
async function testImmediateStreamingErrorNoBufferPipeline(
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
    [0, 2, 11], //error before any data is sent
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const togetherStream = pipeline(
    [attemptStream, secondStream, thirdStream],
    err => {
      if (!err) {
        throw new Error(
          'testImmediateStreamingErrorNoBufferPipeline suceeded, expected error'
        );
      }
    }
  );
  attemptStream.on('data', () => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferPipeline received data, should have errored'
    );
  });

  const results: string[] = [];
  togetherStream.on('error', (e: GoogleError) => {
    results.push('togetherStream');
    assert.strictEqual(e.code, 14);
    // when using pipeline it is expected that togetherStream would log before thirdStream because they're basically invoking the same thing
    // imagine togetherStream is three physical pipes put together - what comes out of the third section of pipe is the same
    // as what comes out of the whole thing and arrives at the same time
    assert.deepStrictEqual(results, [
      'attemptStream',
      'secondStream',
      'togetherStream',
    ]);
  });
  secondStream.on('error', (e: GoogleError) => {
    results.push('secondStream');
    assert.strictEqual(e.code, 14);
  });
  thirdStream.on('error', (e: GoogleError) => {
    results.push('thirdStream'); // this won't happen
    assert.strictEqual(e.code, 14);
  });
  attemptStream.on('error', (e: GoogleError) => {
    results.push('attemptStream');
    assert.strictEqual(e.code, 14);
  });
  togetherStream.on('end', () => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferPipeline ended without error'
    );
  });
  togetherStream.on('close', () => {
    // these should be cleaned up already but
    // it doesn't hurt to call end
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}

// sequence that throws a retriable error code before receiving data
// then succeeds
async function testImmediateStreamingErrorThenSucceedsNoBufferYesRetryPumpify(
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
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings); // default resumption strategy starts from beginning which is fine in this case

  const settings = {
    retry: retryOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1],
    [0, 100], // throw a retryable error code immediately
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const results: String[] = [];
  const results2: String[] = [];

  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);

  attemptStream.on('data', (data: {content: string}) => {
    results.push(data.content);
  });

  togetherStream.on('data', (data: {content: string}) => {
    results2.push(data.content);
  });

  togetherStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testImmediateStreamingErrorThenSucceedsNoBufferYesRetryPumpify error ' +
        e
    );
  });

  togetherStream.on('close', () => {
    throw new Error(
      'testImmediateStreamingErrorThenSucceedsNoBufferYesRetryPumpify closed on an error'
    );
  });
  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}

// sequence that throws a retriable error code before receiving data
// then succeeds
async function testImmediateStreamingErrorThenSucceedsNoBufferYesRetryPipeline(
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
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings); // default resumption strategy starts from beginning which is fine in this case

  const settings = {
    retry: retryOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1],
    [0, 100], // throw a retryable error code immediately
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const results: String[] = [];
  const results2: String[] = [];

  const togetherStream = pipeline(
    [attemptStream, secondStream, thirdStream],
    err => {
      if (err) {
        throw new Error(
          'testImmediateStreamingErrorNoBufferYesRetryPipeline failed' + err
        );
      } else {
        assert.strictEqual(results.length, 100);
      }
    }
  );
  attemptStream.on('data', (data: {content: string}) => {
    results.push(data.content);
  });

  togetherStream.on('data', (data: {content: string}) => {
    results2.push(data.content);
  });

  togetherStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testImmediateStreamingErrorThenSucceedsNoBufferYesRetryPipeline error ' +
        e.message
    );
  });

  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
  // we only check for attemptStream.on("close") which would indicate
  // closing on an error. togetherStream.on("close") is handled
  // by the pipeline constructor earlier in the test
  attemptStream.on('close', () => {
    throw new Error(
      'testImmediateStreamingErrorThenSucceedsNoBufferYesRetryPipeline closed on error'
    );
  });
}
// sequence that errors immediately, retries, then succeeds
async function testImmediateStreamingErrorNoBufferYesRetryRequestRetryPipeline(
  client: SequenceServiceClient
) {
  const retryRequestOptions = {
    objectMode: true,
    shouldRetryFn: () => {
      return true;
    },
  }; //always retry

  const settings = {
    retryRequestOptions: retryRequestOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1],
    [0, 100], //error before any data is sent but retry
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const results: String[] = [];
  const results2: String[] = [];
  const togetherStream = pipeline(
    [attemptStream, secondStream, thirdStream],
    err => {
      if (err) {
        throw new Error(
          'testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPipeline error' +
            err
        );
      } else {
        assert.strictEqual(results.length, 100);
      }
    }
  );

  attemptStream.on('data', (data: {content: string}) => {
    results.push(data.content);
  });
  // TODO fix this any and other anys
  togetherStream.on('data', (data: {content: string}) => {
    results2.push(data.content);
  });
  togetherStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPipeline error' + e
    );
  });

  attemptStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPipeline error' + e
    );
  });
  // we only check for attemptStream.on("close") which would indicate
  // closing on an error. togetherStream.on("close") is handled
  // by the pipeline constructor earlier in the test
  attemptStream.on('close', (e: GoogleError) => {
    throw new Error(
      'testImmediateStreamingErrorNobufferYesRetryRequestRetryPipeline closed on error and should not have ' +
        e
    );
  });
  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}
// sequence that errors immediately, retries, then succeeds
async function testImmediateStreamingErrorNoBufferYesRetryRequestRetryPumpify(
  client: SequenceServiceClient
) {
  const retryRequestOptions = {
    objectMode: true,
    shouldRetryFn: () => {
      return true;
    },
  }; //always retry

  const settings = {
    retryRequestOptions: retryRequestOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1],
    [0, 100], //error before any data is sent but retry
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const results: String[] = [];
  const results2: String[] = [];
  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);

  attemptStream.on('data', (data: {content: string}) => {
    results.push(data.content);
  });

  togetherStream.on('data', (data: {content: string}) => {
    results2.push(data.content);
  });
  togetherStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferYesRetryRequestRetryPumpify ' + e
    );
  });

  attemptStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferYesRetryRequestRetryPumpify ' + e
    );
  });
  togetherStream.on('close', () => {
    throw new Error(
      'testImmediateStreamingErrorNoBufferYesRetryRequestRetryPumpify closed on error'
    );
  });
  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}

// TODO - use?
async function testStreamingErrorAfterDataNoBufferYesRetryRequestRetry(
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
  const retryRequestOptions = {
    objectMode: true,
    shouldRetryFn: () => {
      return true;
    },
  }; //always retry

  const settings = {
    retryRequestOptions: retryRequestOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1],
    [50, 100], //error after data
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);
  const results: String[] = [];
  const results2: String[] = [];
  attemptStream.on('data', data => {
    results.push(data.content);
  });

  togetherStream.on('data', (data: {content: string}) => {
    results2.push(data.content);
    togetherStream.pause();
    setTimeout(() => {
      togetherStream.resume();
    }, 50);
  });
  togetherStream.on('error', (e: GoogleError) => {
    throw new Error('should not happen!');
  });

  attemptStream.on('error', (e: GoogleError) => {
    throw new Error('should not happen!');
  });
  togetherStream.on('close', () => {
    throw new Error('stream closed prematurely');
  });
  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}
async function testStreamingErrorAfterDataYesBufferYesRetryRequestRetry(
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
  const retryRequestOptions = {
    objectMode: true,
    shouldRetryFn: () => {
      return true;
    },
  }; //always retry

  const settings = {
    retryRequestOptions: retryRequestOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1],
    [50, 100], //error after data
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);
  const results: String[] = [];
  const results2: String[] = [];
  attemptStream.on('data', data => {
    results.push(data.content);
  });

  togetherStream.on('data', (data: any) => {
    results2.push(data.content);
  });
  togetherStream.on('error', (e: GoogleError) => {
    throw new Error('should not happen!');
  });

  attemptStream.on('error', (e: GoogleError) => {
    throw new Error('should not happen!');
  });
  togetherStream.on('close', () => {
    throw new Error('stream closed prematurely');
  });
  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}

async function testStreamingPipelineErrorAfterDataYesBufferNoRetry(
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
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1, 0.1],
    [85, 100], //error after the 85th item
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const results: string[] = [];
  const results2: string[] = [];
  const userStream: Duplex = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);

  attemptStream.on('data', data => {
    results.push(data.content);
  });

  attemptStream.on('end', () => {
    throw new Error('should not reach this');
  });

  userStream.on('data', (data: any) => {
    results2.push(data.content);
    userStream.pause();
    setTimeout(() => {
      userStream.resume();
    }, 50);
    // }
  });
  attemptStream.on('error', (e: GoogleError) => {
    setImmediate(() => {
      assert.strictEqual(results.length, 85);
      assert.strictEqual(e.code, 14);
    });
  });

  userStream.on('end', () => {
    throw new Error('should not reach this');
  });

  userStream.on('error', (e: GoogleError) => {
    // assert.strictEqual(results2.length, 85)
    // assert.strictEqual(results.length, 85)
    assert.strictEqual(e.code, 14);
  });

  userStream.on('status', status => {
    // assert.strictEqual(results2.length, 85)
    // assert.strictEqual(results.length, 85)
    // assert.strictEqual(e.code, 14);
  });
}

// sequence that errors after 85 items are sent and retries
async function testStreamingPipelineErrorAfterDataNoBufferYesRetryPumpify(
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
  const getResumptionRequestFn = (request: RequestType) => {
    const newRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest() as unknown as RequestType;
    newRequest.name = request.name;
    newRequest.lastFailIndex = 85; // TODO dynamically get this
    return newRequest as unknown as RequestType;
  };
  const retryOptions = new RetryOptions(
    allowedCodes,
    backoffSettings,
    undefined,
    getResumptionRequestFn
  );

  const settings = {
    retry: retryOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1, 0.1],
    [85, 100], //error after the 85th item
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const results: string[] = [];
  const results2: string[] = [];
  const togetherStream: Duplex = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);

  attemptStream.on('data', data => {
    results.push(data.content);
  });

  attemptStream.on('end', () => {
    assert.strictEqual(results.length, 100);
  });

  togetherStream.on('data', (data: any) => {
    results2.push(data.content);
  });

  attemptStream.on('error', (e: GoogleError) => {
    setImmediate(() => {
      // assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);
    });
  });

  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
  });

  togetherStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testStreamingPipelineErrorAfterDataNoBufferYesRetryPumpify' + e
    );
  });

  togetherStream.on('close', () => {
    throw new Error(
      'testStreamingPipelineErrorAfterDataNoBufferYesRetryPumpify errored before all data was sent'
    );
  });
}
// sequence that errors after 85 items are sent and retries
async function testStreamingPipelineErrorAfterDataNoBufferYesRetryPipeline(
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
  const getResumptionRequestFn = (request: RequestType) => {
    const newRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest() as unknown as RequestType;
    newRequest.name = request.name;
    newRequest.lastFailIndex = 85; // TODO dynamically get this
    return newRequest as unknown as RequestType;
  };
  const retryOptions = new RetryOptions(
    allowedCodes,
    backoffSettings,
    undefined,
    getResumptionRequestFn
  );

  const settings = {
    retry: retryOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1, 0.1],
    [85, 100], //error after the 85th item
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const results: string[] = [];
  const results2: string[] = [];
  const togetherStream = pipeline(
    [attemptStream, secondStream, thirdStream],
    err => {
      if (err) {
        throw new Error(
          'testStreamingPipelineErrorAfterDataNoBufferYesRetryPipeline errored ' +
            err
        );
      } else {
        // togetherStream.on close gets called when the pipeline finishes without error
        assert.strictEqual(results2.length, 100);
        assert.strictEqual(results.length, 100);
      }
    }
  );

  attemptStream.on('data', data => {
    results.push(data.content);
  });

  attemptStream.on('end', () => {
    assert.strictEqual(results.length, 100);
  });

  togetherStream.on('data', (data: any) => {
    results2.push(data.content);
  });

  attemptStream.on('error', (e: GoogleError) => {
    setImmediate(() => {
      // assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);
    });
  });

  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
  });

  togetherStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testStreamingPipelineErrorAfterDataNoBufferYesRetryPipeline' + e
    );
  });
  // we only check for attemptStream.on("close") which would indicate
  // closing on an error. togetherStream.on("close") is handled
  // by the pipeline constructor earlier in the test
  attemptStream.on('close', () => {
    throw new Error(
      'testStreamingPipelineErrorAfterDataNoBufferYesRetryPipeline errored before all data was sent'
    );
  });
}

async function testStreamingPipelineErrorAfterDataYesBufferYesRetry(
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
  const getResumptionRequestFn = (request: RequestType) => {
    const newRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest() as unknown as RequestType;
    newRequest.name = request.name;
    newRequest.lastFailIndex = 85; // TODO dynamically get this
    return newRequest as unknown as RequestType;
  };
  const retryOptions = new RetryOptions(
    allowedCodes,
    backoffSettings,
    undefined,
    getResumptionRequestFn
  );

  const settings = {
    retry: retryOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.OK],
    [0.1, 0.1, 0.1],
    [85, 100], //error after the 85th item
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const results: string[] = [];
  const results2: string[] = [];
  const userStream: Duplex = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);

  attemptStream.on('data', data => {
    results.push(data.content);
  });

  attemptStream.on('end', () => {
    assert.strictEqual(results.length, 100);
  });

  userStream.on('data', (data: any) => {
    results2.push(data.content);
    userStream.pause();
    setTimeout(() => {
      userStream.resume();
    }, 50);
  });

  attemptStream.on('error', (e: GoogleError) => {
    setImmediate(() => {
      // assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);
    });
  });

  userStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
  });

  userStream.on('error', (e: GoogleError) => {
    throw new Error('should not reach this');
  });

  userStream.on('close', () => {
    console.log('upstream pipe closed');
  });
}

async function testStreamingPipelineSuccessAfterDataYesBufferNoRetry(
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
  const baseString = 'zero one two three four five six seven eight nine ';
  let testString = '';

  const repeats = 10;
  for (let i = 0; i < repeats; i++) {
    testString = testString.concat(baseString);
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.OK],
    [0.1, 0.1, 0.1],
    [100],
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );

  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const userStream = new PassThrough({
    objectMode: true,
    readableHighWaterMark: 10,
  });
  const results = [];
  const results2 = [];

  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);
  const originalEnd = userStream.end.bind(userStream);
  togetherStream.on('end', originalEnd);
  togetherStream.pipe(userStream, {end: false});

  attemptStream.on('data', data => {
    results.push(data);
  });
  attemptStream.on('end', () => {
    assert.strictEqual(results.length, 100);
  });

  attemptStream.on('error', (e: GoogleError) => {
    assert.strictEqual(e.code, 13);
  });
  userStream.on('data', (data: any) => {
    results2.push(data);
    userStream.pause();
    setTimeout(() => {
      userStream.resume();
    }, 100);
  });
  userStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
  });
  userStream.on('error', (e: GoogleError) => {
    // assert.strictEqual(results2.length, 85)
    assert.strictEqual(results.length, 85);

    assert.strictEqual(e.code, 14);
  });
}

// successful sequence with no errors
async function testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify(
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
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.OK],
    [0.1],
    [100], //succeed at the end
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );

  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const results: string[] = [];
  const results2: string[] = [];

  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);
  attemptStream.on('data', data => {
    results.push(data);
  });

  attemptStream.on('end', () => {
    assert.strictEqual(results.length, 100);
  });

  attemptStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify attemptStream error' +
        e
    );
  });
  togetherStream.on('data', (data: any) => {
    results2.push(data);
  });
  togetherStream.on('error', (e: GoogleError) => {
    throw new Error(
      'testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify togetherStream error ' +
        e
    );
  });
  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}
// successful sequence with no errors
async function testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPipeline(
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
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.OK],
    [0.1],
    [100], //succeed at the end
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );

  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const results: string[] = [];
  const results2: string[] = [];

  const togetherStream = pipeline(
    [attemptStream, secondStream, thirdStream],
    err => {
      // if an error happens on any stream in the pipeline this will be called
      if (err) {
        throw new Error(
          'testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify error'
        );
      } else {
        // this handles the error free closure of the stream
        assert.strictEqual(results2.length, 100);
      }
    }
  );
  attemptStream.on('data', data => {
    results.push(data);
  });

  attemptStream.on('end', () => {
    assert.strictEqual(results.length, 100);
  });

  togetherStream.on('data', (data: any) => {
    results2.push(data);
  });

  togetherStream.on('end', () => {
    assert.strictEqual(results.length, 100);
    assert.strictEqual(results2.length, 100);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });

  // we only check for attemptStream.on("close") which would indicate
  // closing on an error. togetherStream.on("close") is handled
  // by the pipeline constructor earlier in the test
  attemptStream.on('close', () => {
    throw new Error(
      'testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPipeline closed on error'
    );
  });
}
// TODO - possibly remove
async function testStreamingPipelineErrorAfterDataNoBufferNoRetryUseSetImmediate(
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
  const baseArray = Array.from(Array(100).keys());
  let testString = '';

  for (let i = 0; i < baseArray.length; i++) {
    testString = testString.concat(baseArray[i].toString() + ' ');
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.5, 0.1, 0.1],
    [85, 99, 100],
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );

  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});

  const results = [];
  const results2 = [];
  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);
  attemptStream.on('data', data => {
    results.push(data);
  });

  attemptStream.on('error', (e: GoogleError) => {
    setImmediate(() => {
      assert.strictEqual(results.length, 85);
      assert.strictEqual(e.code, 14);
    });
  });
  // togetherStream.on('data', (data: any) => {
  //   results2.push(data)
  // });
  togetherStream.on('error', (e: GoogleError) => {
    // assert.strictEqual(results2.length, 85)
    assert.strictEqual(results.length, 85);

    assert.strictEqual(e.code, 14);
  });
}
// sequence that fails after receiving 85 items
async function testStreamingPipelineErrorAfterDataNoBufferNoRetryPumpify(
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
  const allowedCodes = [4]; // not the code we're going to error on
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();
  const baseString = 'zero one two three four five six seven eight nine ';
  let testString = '';

  const repeats = 100;
  for (let i = 0; i < repeats; i++) {
    testString = testString.concat(baseString);
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [85, 99, 100], //error at the 85th
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );

  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const results: string[] = [];
  const results2: string[] = [];

  const togetherStream = pumpify.obj([
    attemptStream,
    secondStream,
    thirdStream,
  ]);
  attemptStream.on('data', data => {
    results.push(data);
  });

  attemptStream.on('error', (e: GoogleError) => {
    assert.strictEqual(results.length, 85);
    assert.strictEqual(e.code, 14);
  });
  togetherStream.on('data', (data: any) => {
    results2.push(data);
  });
  togetherStream.on('error', (e: GoogleError) => {
    assert.strictEqual(e.code, 14);
  });
  togetherStream.on('end', () => {
    throw new Error(
      'testStreamingPipelineErrorAfterDataNoBufferNoRetryPumpify ended cleanly but should have errored'
    );
  });
  togetherStream.on('close', () => {
    assert.strictEqual(results2.length, 85);
    assert.strictEqual(results.length, 85);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}
// sequence that fails after receiving 85 items
async function testStreamingPipelineErrorAfterDataNoBufferNoRetryPipeline(
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
  const allowedCodes = [4]; // not the code we're going to error on
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();
  const baseString = 'zero one two three four five six seven eight nine ';
  let testString = '';

  const repeats = 100;
  for (let i = 0; i < repeats; i++) {
    testString = testString.concat(baseString);
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [85, 99, 100], //error at the 85th
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );

  const secondStream = new PassThrough({objectMode: true});
  const thirdStream = new PassThrough({objectMode: true});
  const results: string[] = [];
  const results2: string[] = [];

  const togetherStream = pipeline(
    [attemptStream, secondStream, thirdStream],
    err => {
      // else case is handled by togetherStream.on("close") below
      if (!err) {
        throw new Error(
          'testImmediateStreamingErrorNoBufferPipeline suceeded, expected error'
        );
      }
    }
  );
  attemptStream.on('data', data => {
    results.push(data);
  });

  attemptStream.on('error', (e: GoogleError) => {
    assert.strictEqual(results.length, 85);
    assert.strictEqual(e.code, 14);
  });
  togetherStream.on('data', (data: any) => {
    results2.push(data);
  });
  togetherStream.on('error', (e: GoogleError) => {
    assert.strictEqual(e.code, 14);
  });
  togetherStream.on('close', () => {
    assert.strictEqual(results2.length, 85);
    assert.strictEqual(results.length, 85);
    attemptStream.end();
    secondStream.end();
    thirdStream.end();
    togetherStream.end();
  });
}
async function testStreamingErrorAfterDataNoBufferNoRetry(
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
  const baseString = 'zero one two three four five six seven eight nine ';
  let testString = '';

  const repeats = 100;
  for (let i = 0; i < repeats; i++) {
    testString = testString.concat(baseString);
  }

  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.5, 0.1, 0.1],
    [85, 155, 99],
    testString
  );

  const response = await client.createStreamingSequence(request);
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );

  const results = [];

  attemptStream.on('data', data => {
    results.push(data);
  });

  attemptStream.on('error', (e: GoogleError) => {
    assert.strictEqual(results.length, 85); // we chose to throw an error after the 85th result
    assert.strictEqual(e.code, 14);
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
  attemptStream.on('error', () => {
    throw new Error('testServerStreamingRetryOptions problem');
  });
  attemptStream.on('end', () => {
    assert.equal(
      finalData.join(' '),
      'This is testing the brand new and shiny StreamingSequence server 3'
    );
    attemptStream.end();
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
  attemptStream.on('error', () => {
    throw new Error('testServerStreamingRetrieswithRetryOptions problem');
  });
  attemptStream.on('end', () => {
    assert.equal(
      finalData.join(' '),
      'This This is This is testing the brand new and shiny StreamingSequence server 3'
    );
    attemptStream.end();
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
  attemptStream.on('error', () => {
    throw new Error('testServerStreamingRetriesWithShouldRetryFn problem');
  });
  attemptStream.on('end', () => {
    assert.equal(
      finalData.join(' '),
      'This This is This is testing the brand new and shiny StreamingSequence server 3'
    );
    attemptStream.end();
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
  attemptStream.on('error', () => {
    throw new Error(
      'testServerStreamingRetrieswithRetryRequestOptions problem'
    );
  });
  attemptStream.on('end', () => {
    assert.equal(
      finalData.join(' '),
      'This This is This is testing the brand new and shiny StreamingSequence server 3'
    );
    attemptStream.end();
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
  attemptStream.on('error', () => {
    throw new Error('testResetRetriesToZero should not receive an error event');
  });
  attemptStream.on('end', () => {
    assert.deepStrictEqual(
      finalData.join(' '),
      'This This is This is testing This is testing the This is testing the brand'
    );
    attemptStream.end();
  });
  attemptStream.on('close', () => {
    throw new Error('testResetRetriesToZero closed on an error');
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
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  attemptStream.on('data', () => {
    throw new Error('The stream should not receive any data');
  });
  attemptStream.on('error', (error: GoogleError) => {
    assert.strictEqual(error.code, 4);
    assert.strictEqual(
      error.message,
      'Exceeded maximum number of retries before any response was received'
    );
    assert.strictEqual(
      error.note,
      'Underlying error: Error: 6 ALREADY_EXISTS: 6'
    );
  });
  attemptStream.on('end', () => {
    throw new Error(
      'testShouldFailOnThirdError finished before it received an error'
    );
  });
  attemptStream.on('close', () => {
    attemptStream.end();
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
  attemptStream.on('error', () => {
    throw new Error(
      'testServerStreamingRetrieswithRetryRequestOptionsResumptionStrategy problem'
    );
  });
  attemptStream.on('end', () => {
    assert.deepStrictEqual(
      finalData.join(' '),
      'This new and new and shiny StreamingSequence server 3'
    );
    attemptStream.end();
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
    // return a bad resumption strategy that will trigger an error
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
  });
  attemptStream.on('close', () => {
    attemptStream.end();
  });
  attemptStream.on('end', () => {
    throw new Error(
      'testServerStreamingRetrieswithRetryRequestOptionsErrorsOnBadResumptionStrategy ended cleanly and did not error'
    );
  });
}

// fails on the first error in the sequence
async function testServerStreamingThrowsClassifiedTransientErrorNote(
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
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;

  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  attemptStream.on('data', (data: {content: string}) => {
    finalData.push(data.content);
  });
  attemptStream.on('error', (e: GoogleError) => {
    assert.strictEqual(e.code, 14);
    assert.match(e.note!, /not classified as transient/);
    finalData.join(' ');
    assert.equal(finalData, 'This');
  });
  attemptStream.on('close', () => {
    attemptStream.end();
  });
  attemptStream.on('end', () => {
    throw new Error(
      'testServerStreamingThrowsClassifiedTransientErrorNote ended cleanly without an error'
    );
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
  });
  attemptStream.on('close', () => {
    attemptStream.end();
  });
  attemptStream.on('end', () => {
    throw new Error(
      'testServerStreamingRetriesAndThrowsClassifiedTransientErrorNote ended cleanly without throwing an error'
    );
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
  });
  attemptStream.on('close', () => {
    attemptStream.end();
  });
  attemptStream.on('end', () => {
    throw new Error(
      'testServerStreamingThrowsCannotSetTotalTimeoutMillisMaxRetries ended cleanly without an error'
    );
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
  const sequence = response[0];

  const attemptRequest =
    new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
  attemptRequest.name = sequence.name!;
  const attemptStream = client.attemptStreamingSequence(
    attemptRequest,
    settings
  );
  attemptStream.on('data', () => {
    throw new Error('The stream should not receive any data');
  });
  attemptStream.on('error', (error: GoogleError) => {
    assert.strictEqual(error.code, 4);
    assert.strictEqual(error.note, 'Max retries is set to zero.');
  });
  attemptStream.on('end', () => {
    throw new Error(
      'testErrorMaxRetries0 should not end before it receives an error'
    );
  });
  attemptStream.on('close', () => {
    attemptStream.end();
  });
}

// a streaming call that retries two times and finishes successfully
async function testServerStreamingRetriesImmediatelywithRetryOptions(
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

  // allow the two codes we are going to send as errors
  const retryOptions = new RetryOptions([14, 4], backoffSettings);

  const settings = {
    retry: retryOptions,
  };

  client.initialize();

  // errors immediately, then again after sending "This is"
  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.1, 0.1, 0.1],
    [0, 2, 11],
    'This is testing the brand new and shiny StreamingSequence server 3'
  );

  const response = await client.createStreamingSequence(request);
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
  attemptStream.on('error', () => {
    throw new Error(
      'testServerStreamingRetriesImmediatelywithRetryOptions stream had an error'
    );
  });
  attemptStream.on('end', () => {
    assert.equal(
      finalData.join(' '),
      'This is This is testing the brand new and shiny StreamingSequence server 3'
    );
    attemptStream.end();
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
