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
import {Duplex, PassThrough, Stream, pipeline } from 'stream';
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

  await testResetRetriesToZero(grpcSequenceClientWithServerStreamingRetries);

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

  // // ensure legacy tests pass with streaming retries client
  // await testEcho(grpcClientWithServerStreamingRetries);
  // await testEchoError(grpcClientWithServerStreamingRetries);
  // await testExpand(grpcClientWithServerStreamingRetries);
  // await testPagedExpand(grpcClientWithServerStreamingRetries);
  // await testPagedExpandAsync(grpcClientWithServerStreamingRetries);
  // await testCollect(grpcClientWithServerStreamingRetries);
  // await testChat(grpcClientWithServerStreamingRetries);
  // await testWait(grpcClientWithServerStreamingRetries);


  /* Series of tests that validate behavior of gax behavior with stream pipelines */ 

 
  /* NO BUFFERING YES GAX NATIVE RETRIES
  This section has pipelines of streams but no data buffering 
  and tests them against gax clients that DO utilize gax native retries
  some scenarios may not actually involve retrying */

  //ALL GOOD
  // await testImmediateStreamingErrorNoBufferPumpify(grpcSequenceClientWithServerStreamingRetries);
  // await testImmediateStreamingErrorNoBufferPipeline(grpcSequenceClientWithServerStreamingRetries);

  // await testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify(grpcSequenceClientWithServerStreamingRetries);
  // await testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPipeline(grpcSequenceClientWithServerStreamingRetries);

  // await testStreamingPipelineErrorAfterDataNoBufferNoRetryPumpify(grpcSequenceClientWithServerStreamingRetries);
  // await testStreamingPipelineErrorAfterDataNoBufferNoRetryPipeline(grpcSequenceClientWithServerStreamingRetries);
   
  //TODO FIX
  // TODO pumpify also
  // await testImmediateStreamingErrorNoBufferYesRetryRequestRetry(grpcSequenceClientNoGaxRetries);
  await testServerStreamingRetriesImmediatelywithRetryOptions(
      grpcSequenceClientWithServerStreamingRetries
    );
    await testImmediateStreamingErrorNoBufferYesRetryPipeline(grpcSequenceClientWithServerStreamingRetries);
    // await testStreamingPipelineErrorAfterDataNoBufferYesRetry(grpcSequenceClientWithServerStreamingRetries);





//TODO - I removed the new Promise stuff in some tests, but I think it needs to go back because it doesn't properly assert maybe

  

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
    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})

    const togetherStream = pumpify.obj([attemptStream, secondStream, thirdStream])
    attemptStream.on('data', () => {
      throw new Error('testImmediateStreamingErrorNoBufferPumpify error attemptStream')
    });

    togetherStream.on('data', () => {
      throw new Error('testImmediateStreamingErrorNoBufferPumpify error togetherStream')
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





}

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
    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})

    const togetherStream = pipeline([attemptStream, secondStream, thirdStream],  (err) => {
      if (!err) {
        throw new Error('testImmediateStreamingErrorNoBufferPipeline suceeded, expected error');
      }});
    attemptStream.on('data', (data) => {
      throw new Error('this is a problem')
    });

    let results = [];
    togetherStream.on('error', (e: GoogleError) => {
      results.push('togetherStream')
      assert.strictEqual(e.code, 14);
      // when using pipeline it is expected that togetherStream would log before thirdStream because they're basically invoking the same thing
      // imagine togetherStream is three physical pipes put together - what comes out of the third section of pipe is the same
      // as what comes out of the whole thing and arrives at the same time
      assert.deepStrictEqual(results, ['attemptStream', 'secondStream', 'togetherStream'])

    });
    secondStream.on('error', (e: GoogleError) => {
      results.push('secondStream')
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





}

// TODO pumpify also
async function testImmediateStreamingErrorNoBufferYesRetryPipeline(
  client: SequenceServiceClient
) {
  console.log("NO BUFFER YES RETRY PIPELINE");

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
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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
    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})
    let results: String[] = []
    let results2: String[] = []

    const togetherStream = pumpify([attemptStream, secondStream, thirdStream])


    //pipeline will throw an error as soon as attemptStream is destroyed on retry
    // const togetherStream = pipeline([attemptStream, secondStream, thirdStream],  (err) => {
    //   if (err) {
    //     throw new Error('testImmediateStreamingErrorNoBufferYesRetry failed' + err);
    //   }else{
    //     console.log(results, results2)
    //     assert.strictEqual(results2.length, 100);
    //   }});   
    attemptStream.on('data', (data) => {
      console.log('data1')
      results.push(data.content);
    });

    togetherStream.on('data', (data: any) => {
      console.log('data2')
      results2.push(data.content);
    });
    togetherStream.on('error', (e: GoogleError) => {
      throw new Error('should not happen togetherStream' + e)
    });

    // attemptStream.on('error', (e: GoogleError) => {
    //   throw new Error('should not happen attemptSTream' + e)
    // });
    togetherStream.on('close', () => {
      throw new Error('stream closed prematurely')
    })
    togetherStream.on('end', () => {
      console.log('togetherstream end')
      assert.strictEqual(results.length, 100);
      console.log('in between')
      assert.strictEqual(results2.length, 100);
      console.log("hooray")
    })





}
async function testImmediateStreamingErrorNoBufferYesRetryRequestRetry(
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
  const retryRequestOptions ={objectMode: true, shouldRetryFn: () => {return true} } //always retry

  const settings = {
    retryRequestOptions: retryRequestOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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
    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})
    let results: String[] = []
    let results2: String[]  = []
    // TODO try with pipeline too
    // const togetherStream = pumpify.obj([attemptStream, secondStream, thirdStream])
    const togetherStream = pipeline([attemptStream, secondStream, thirdStream],  (err) => {
      if (err) {
        throw new Error('testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify error');
      }else{
        assert.strictEqual(results2.length, 100);
      }});

    attemptStream.on('data', (data) => {
      results.push(data.content);
    });

    togetherStream.on('data', (data: any) => {
      results2.push(data.content);
    });
    togetherStream.on('error', (e: GoogleError) => {
      throw new Error('should not happen!')
    });

    attemptStream.on('error', (e: GoogleError) => {
      throw new Error('should not happen!')
    });
    // togetherStream.on('close', () => {
    //   throw new Error('stream closed prematurely')
    // })
    togetherStream.on('end', () => {
      console.log("results", results, results2)
      try{
        assert.strictEqual(results.length, 100);
        assert.strictEqual(results2.length, 100);
        console.log("hooray")

      }catch(error){
        console.log("error with assertion", error)
      }
    })





}
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
  const retryRequestOptions ={objectMode: true, shouldRetryFn: () => {return true} } //always retry

  const settings = {
    retryRequestOptions: retryRequestOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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
    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})

    const togetherStream = pumpify.obj([attemptStream, secondStream, thirdStream])
    let results: String[] = []
    let results2: String[]  = []
    attemptStream.on('data', (data) => {
      console.log('data1', data.content)
      results.push(data.content);
    });

    togetherStream.on('data', (data: any) => {
      console.log('data2', data.content)
      results2.push(data.content);
      togetherStream.pause();
      setTimeout(() => {
      togetherStream.resume();
    }, 50);
    });
    togetherStream.on('error', (e: GoogleError) => {
      throw new Error('should not happen!')
    });

    attemptStream.on('error', (e: GoogleError) => {
      throw new Error('should not happen!')
    });
    togetherStream.on('close', () => {
      throw new Error('stream closed prematurely')
    })
    togetherStream.on('end', () => {
      console.log("results", results, results2)
      try{
        assert.strictEqual(results.length, 100);
        assert.strictEqual(results2.length, 100);
      }catch(error){
        console.log("error with assertion", error)
      }
      console.log("hooray")
    })





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
  const retryRequestOptions ={objectMode: true, shouldRetryFn: () => {return true} } //always retry

  const settings = {
    retryRequestOptions: retryRequestOptions,
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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
    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})

    const togetherStream = pumpify.obj([attemptStream, secondStream, thirdStream])
    let results: String[] = []
    let results2: String[]  = []
    attemptStream.on('data', (data) => {
      console.log('data1')
      results.push(data.content);
    });

    togetherStream.on('data', (data: any) => {
      console.log('data2')
      results2.push(data.content);
    });
    togetherStream.on('error', (e: GoogleError) => {
      throw new Error('should not happen!')
    });

    attemptStream.on('error', (e: GoogleError) => {
      throw new Error('should not happen!')
    });
    togetherStream.on('close', () => {
      throw new Error('stream closed prematurely')
    })
    togetherStream.on('end', () => {
      console.log("results", results, results2)
      try{
        assert.strictEqual(results.length, 100);
        assert.strictEqual(results2.length, 100);
      }catch(error){
        console.log("error with assertion", error)
      }
      console.log("hooray")
    })





}



async function testStreamingPipelineErrorAfterDataYesBufferNoRetry(
  client: SequenceServiceClient
) {
  console.log("success yes buffer no retry");

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
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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
    const secondStream = new PassThrough({objectMode: true} )
    const thirdStream = new PassThrough({objectMode: true})
 
    let results: string[] = []
    let results2: string[] = []
    const userStream: Duplex = pumpify.obj([attemptStream, secondStream, thirdStream])

    console.log(userStream.readableHighWaterMark)


    attemptStream.on('data', (data) => {
      results.push(data.content);
      console.log('attemptStream data', data.content, attemptStream.destroyed)
      
    });

    attemptStream.on('end', () => {
      throw new Error('should not reach this')
    })

    userStream.on('data', (data: any) => {
      results2.push(data.content)
      console.log("userStream data", data.content)
        userStream.pause();
        setTimeout(() => {
        userStream.resume();
      }, 50);
    // }
    });
    attemptStream.on('error', (e: GoogleError) => {
      console.log('attempstream onerror')
      setImmediate(() => {      
        console.log('first stream', results.length)
        console.log(attemptStream.destroyed)
        assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);
      })

    });
    

    userStream.on('end', () => {
      throw new Error('should not reach this')

    })
   
    userStream.on('error', (e: GoogleError) => {

      console.log('userStream error')
      // assert.strictEqual(results2.length, 85)
      // assert.strictEqual(results.length, 85)
      console.log("final stream", results.length, results2.length, results2)
      assert.strictEqual(e.code, 14);
    });

    userStream.on('status', (status) => {

      console.log('userStream status', status)
      // assert.strictEqual(results2.length, 85)
      // assert.strictEqual(results.length, 85)
      console.log("final stream", results.length, results2.length, results2)
      // assert.strictEqual(e.code, 14);
    });
}

async function testStreamingPipelineErrorAfterDataNoBufferYesRetry(
  client: SequenceServiceClient
) {
  console.log("data, error, retry, finish");

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
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings, undefined, getResumptionRequestFn);
  

  const settings = {
    retry: retryOptions
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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
    const secondStream = new PassThrough({objectMode: true} ) 
    const thirdStream = new PassThrough({objectMode: true})
   

    let results: string[] = []
    let results2: string[] = []
    const userStream: Duplex = pumpify.obj([attemptStream, secondStream, thirdStream])
  

    attemptStream.on('data', (data) => {
      results.push(data.content);
      console.log('attemptStream data', data.content, attemptStream.destroyed)
      
    });

    attemptStream.on('end', () => {
      assert.strictEqual(results.length, 100)
    })

    userStream.on('data', (data: any) => {
      results2.push(data.content)
      console.log("userStream data", data.content)

    });

    attemptStream.on('error', (e: GoogleError) => {
      console.log('attempstream onerror')
      setImmediate(() => {      
        console.log('first stream', results.length)
        console.log(attemptStream.destroyed)
        // assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);
      })

    });
    

    userStream.on('end', () => {
      throw new Error('should not reach this')

    })
    
    userStream.on('error', (e: GoogleError) => {

      console.log('userStream error')
      // assert.strictEqual(results2.length, 85)
      // assert.strictEqual(results.length, 85)
      console.log("final stream", results.length, results2.length, results2)
      assert.strictEqual(e.code, 14);
    });

    userStream.on('close', () => {
      throw new Error('upstream pipe sent close')
    })
}

async function testStreamingPipelineErrorAfterDataYesBufferYesRetry(
  client: SequenceServiceClient
) {
  console.log("data, error, retry, finish");

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
  const retryOptions = new RetryOptions(allowedCodes, backoffSettings, undefined, getResumptionRequestFn);
  

  const settings = {
    retry: retryOptions
  };

  client.initialize();
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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
    const secondStream = new PassThrough({objectMode: true} ) 
    const thirdStream = new PassThrough({objectMode: true})
   

    let results: string[] = []
    let results2: string[] = []
    const userStream: Duplex = pumpify.obj([attemptStream, secondStream, thirdStream])
  

    attemptStream.on('data', (data) => {
      results.push(data.content);
      console.log('attemptStream data', data.content, attemptStream.destroyed)
      
    });

    attemptStream.on('end', () => {
      assert.strictEqual(results.length, 100)
      console.log('upsteram end')
    })

    userStream.on('data', (data: any) => {
      results2.push(data.content)
      console.log("userStream data", data.content)
      userStream.pause();
      setTimeout(() => {
        userStream.resume();
    }, 50);

    });

    attemptStream.on('error', (e: GoogleError) => {
      console.log('attempstream onerror')
      setImmediate(() => {      
        console.log('first stream', results.length)
        console.log(attemptStream.destroyed)
        // assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);
      })

    });
    

    userStream.on('end', () => {
      assert.strictEqual(results.length, 100);
      assert.strictEqual(results2.length,100);

    })

    userStream.on('error', (e: GoogleError) => {
        throw new Error('should not reach this')
    });

    userStream.on('close', () => {
      console.log("upstream pipe closed")
    })
}

async function testStreamingPipelineSuccessAfterDataYesBufferNoRetry(
  client: SequenceServiceClient
) {
  console.log("success yes buffer no retry");

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
  let testString = ''

  const repeats = 10;
  for (let i=0; i<repeats; i++){
    testString = testString.concat(baseString)
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

    const secondStream = new PassThrough({objectMode: true} )
    const thirdStream = new PassThrough({objectMode: true})
    const userStream = new PassThrough({objectMode: true, readableHighWaterMark: 10})
    let results = []
    let results2 = []

    const togetherStream = pumpify.obj([attemptStream, secondStream, thirdStream])
    const originalEnd = userStream.end.bind(userStream);
    togetherStream.on('end', originalEnd);
    togetherStream.pipe(userStream, {end: false});

    attemptStream.on('data', (data) => {
      results.push(data);
      console.log('attemptStream data', results.length)
      
    });

    // userStream.on('drain', () => {
    //   console.log("userStream drain");
    // })

    // userStream.on('resume', () => {
    //   console.log("userStream drain");
    // })
    attemptStream.on('end', () => {
      console.log("hi hi hi")
      assert.strictEqual(results.length, 100)
    })


    attemptStream.on('error', (e: GoogleError) => {
    
      console.log('first stream', results.length)
      assert.strictEqual(e.code, 13);

    });
    userStream.on('data', (data: any) => {
      results2.push(data)
      console.log("userStream data", results2.length)
        userStream.pause();
        setTimeout(() => {
        userStream.resume();
      }, 100);

    });
    userStream.on('end', () => {

      assert.strictEqual(results.length, 100)
      assert.strictEqual(results2.length, 100)


      console.log('end')
    })
    userStream.on('error', (e: GoogleError) => {
      console.log('final error')
      // assert.strictEqual(results2.length, 85)
      assert.strictEqual(results.length, 85)

      console.log("final stream", results.length)
      assert.strictEqual(e.code, 14);
    });





}
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
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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

    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})
    let results = []
    let results2 = []

    const togetherStream = pumpify.obj([attemptStream, secondStream, thirdStream])
    attemptStream.on('data', (data) => {
      results.push(data);
    });

    attemptStream.on('end', () => {
      assert.strictEqual(results.length, 100)
    });


    attemptStream.on('error', (e: GoogleError) => {
      throw new Error('testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify attemptStream error'+e)

    });
    togetherStream.on('data', (data: any) => {
      results2.push(data)
    });
    togetherStream.on('error', (e: GoogleError) => {
     throw new Error('testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify togetherStream error'+e)
    });
    togetherStream.on('end', () => {
      assert.strictEqual(results.length, 100)
      assert.strictEqual(results2.length, 100)
    });


}
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
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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

    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})
    let results = []
    let results2 = []

    
    const togetherStream = pipeline([attemptStream, secondStream, thirdStream],  (err) => {
      if (err) {
        throw new Error('testStreamingPipelineSucceedsAfterDataNoBufferNoRetryPumpify error');
      }else{
        assert.strictEqual(results2.length, 100);
      }});
    attemptStream.on('data', (data) => {
      results.push(data);
    }); 

    attemptStream.on('end', () => {
      assert.strictEqual(results.length, 100)
    });

    attemptStream.on('error', (e: GoogleError) => {
      throw new Error('this is a problem')
    });
    togetherStream.on('data', (data: any) => {
      results2.push(data)
    });
    togetherStream.on('error', (e: GoogleError) => {
     throw new Error('this is a problem')
    });
    togetherStream.on('end', () => {
      assert.strictEqual(results.length, 100)
      assert.strictEqual(results2.length, 100)
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
  const baseArray = Array.from(Array(100).keys())
  let testString = ''

  for (let i=0; i<baseArray.length; i++){
    testString = testString.concat(baseArray[i].toString() + ' ')
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

    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})
    
    let results = []
    let results2 = []
    const togetherStream = pumpify.obj([attemptStream, secondStream, thirdStream])
    attemptStream.on('data', (data) => {
      results.push(data);
    });


    attemptStream.on('error', (e: GoogleError) => {
      setImmediate(() => {      
        console.log('first stream', results.length)
        assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);})

    });
    // togetherStream.on('data', (data: any) => {
    //   results2.push(data)
    // });
    togetherStream.on('error', (e: GoogleError) => {
      // assert.strictEqual(results2.length, 85)
      assert.strictEqual(results.length, 85)

      console.log("final stream", results.length)
      assert.strictEqual(e.code, 14);
    });





}
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
  let testString = ''

  const repeats = 100;
  for (let i=0; i<repeats; i++){
    testString = testString.concat(baseString)
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

    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})
    let results = []
    let results2 = []


    const togetherStream = pumpify.obj([attemptStream, secondStream, thirdStream])
    attemptStream.on('data', (data) => {
      results.push(data);
    });

    attemptStream.on('error', (e: GoogleError) => {
      assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);

    });
    togetherStream.on('data', (data: any) => {
      results2.push(data)
    });
    togetherStream.on('error', (e: GoogleError) => {
      assert.strictEqual(results2.length, 85)
      assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);
    });





}
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
  let testString = ''

  const repeats = 100;
  for (let i=0; i<repeats; i++){
    testString = testString.concat(baseString)
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

    const secondStream = new PassThrough({objectMode: true})
    const thirdStream = new PassThrough({objectMode: true})
    let results = []
    let results2 = []

    const togetherStream = pipeline([attemptStream, secondStream, thirdStream],  (err) => {
      if (!err) {
        throw new Error('testImmediateStreamingErrorNoBufferPipeline suceeded, expected error');
      }else{
        assert.strictEqual(results.length, 85);
      }});
    attemptStream.on('data', (data) => {
      results.push(data);
    });


    attemptStream.on('error', (e: GoogleError) => {
      assert.strictEqual(results.length, 85)
      assert.strictEqual(e.code, 14);

    });
    togetherStream.on('data', (data: any) => {
      results2.push(data)
    });
    togetherStream.on('error', (e: GoogleError) => {
      assert.strictEqual(results2.length, 85)
      assert.strictEqual(results.length, 85)

      assert.strictEqual(e.code, 14);
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
  let testString = ''

  const repeats = 100;
  for (let i=0; i<repeats; i++){
    testString = testString.concat(baseString)
  }


  const request = createStreamingSequenceRequestFactory(
    [Status.UNAVAILABLE, Status.DEADLINE_EXCEEDED, Status.OK],
    [0.5, 0.1, 0.1],
    [85, 155, 99], 
    testString
  );

  const response = await client.createStreamingSequence(request);
    const sequence = response[0];
    console.log("seq", sequence!.content!.length)

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );

    let results = []

    attemptStream.on('data', (data) => {
      results.push(data);
    });


    attemptStream.on('error', (e: GoogleError) => {
      assert.strictEqual(results.length, 85); // we chose to throw an error after the 85th result
      console.log('first stream')
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
  console.log("TEST SERVER STREAMING RETRY OPTIONS")
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
  console.log("TEST SERVER STREAMING RETRIES WITH RETRY OPTIONS")
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

// a streaming call that retries two times and finishes successfully
async function testServerStreamingRetriesImmediatelywithRetryOptions(
  client: SequenceServiceClient
) {
  console.log("RETRIES IMMEDIATELY NO PIPELINE")
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
    [0, 2, 11],
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
      console.log("on end")
      attemptStream.end();
      console.log("after end end")

      resolve();
    });
  }).then(() => {
    console.log("assertion")
    assert.equal(
      finalData.join(' '),
      'This is This is testing the brand new and shiny StreamingSequence server 3'
    );
  });
}

// a streaming call that retries twice using shouldRetryFn and finally succeeds
async function testServerStreamingRetriesWithShouldRetryFn(
  client: SequenceServiceClient
) {
  console.log("TEST SERVER STREAMING RETRIES WITH SHOULD RETRY FN")
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
  console.log("TEST SERVER STREAMING RETRIES WITH RETRY REQUEST OPTIONS")
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
  console.log("RESET TO ZERO")
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
  console.log("TEST SHOULD FAIL ON THIRD ERROR")
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
  console.log("TEST SERVER STREAMING RETRIES WITH RETRY REQUEST OPTIONS RESUMPTION STRATEGY")
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
  console.log("TEST SERVER STREAMING RETRIES WITH RETRY REQUEST OPTIONS ERRORS ON BAD RESUMPTION STRATEGY")
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
 console.log("TEST SERVER STREAMING THROWS CLASSIFIED TRANSIENT ERROR NOTE")
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
 console.log("TEST SERVER STREAMING RETRIES AND THROWS CLASSIFIED TRANSIENT ERROR NOTE")
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
  console.log("TEST SERVER STREAMING THROWS CANNOT SET TOTAL TIMEOUT MILLIS MAX RETRIES :)")
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
  await new Promise<void>((resolve, reject) => {
    const sequence = response[0];

    const attemptRequest =
      new protos.google.showcase.v1beta1.AttemptStreamingSequenceRequest();
    attemptRequest.name = sequence.name!;

    const attemptStream = client.attemptStreamingSequence(
      attemptRequest,
      settings
    );

    attemptStream.on('end', () =>
      reject("Close on error not on ending")

    )
    attemptStream.on('error', (e: GoogleError) => {
      console.log('2722')
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
  console.log("TEST ERROR MAX RETRIES 0")
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
      'This is This is testing the brand new and shiny StreamingSequence server 3'
    );
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
