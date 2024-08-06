// Copyright 2023 Google LLC

// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at

//     https://www.apache.org/licenses/LICENSE-2.0

// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// import {PassThrough} from 'stream';
// import {GoogleError} from './googleError';
// import {ResponseType} from './apitypes';
// import {StreamProxy} from './streamingCalls/streaming';

// const DEFAULTS = {
//   /*
//     Max # of retries
//   */
//   maxRetries: 2,
// };
// // In retry-request, you could pass parameters to request using the requestOpts parameter
// // when we called retry-request from gax, we always passed null
// // passing null here removes an unnecessary parameter from this implementation
// const requestOps = null;
// const objectMode = true; // we don't support objectMode being false

// interface streamingRetryRequestOptions {
//   request: Function;
//   maxRetries?: number;
// }
// /**
//  * Localized adaptation derived from retry-request
//  * @param opts - corresponds to https://github.com/googleapis/retry-request#opts-optional
//  * @returns PassThrough
//  */
// export function streamingRetryRequest(opts: streamingRetryRequestOptions): PassThrough {
//   opts = Object.assign({}, DEFAULTS, opts);
//   if (opts.request === undefined) {
//     throw new Error('A request function must be provided');
//   }

//   let numNoResponseAttempts = 0;
//   let streamResponseHandled = false;

//   let requestStream: StreamProxy;
//   let delayStream: PassThrough | null;

//   const retryStream = new PassThrough({objectMode: objectMode});

//   makeRequest();
//   console.log('before return', retryStream.destroyed);
//   return retryStream;

//   function makeRequest(): void{
//     streamResponseHandled = false;

//     delayStream = new PassThrough({objectMode: objectMode});
//     requestStream = opts.request!(requestOps);

//     requestStream
//       // gRPC via google-cloud-node can emit an `error` as well as a `response`
//       // Whichever it emits, we run with-- we can't run with both. That's what
//       // is up with the `streamResponseHandled` tracking.
//       .on('error', (err: GoogleError) => {
//         if (streamResponseHandled) {
//           console.log('before return 73')
//           return;
//         }
//         streamResponseHandled = true;
//         console.log('before onresponse err call 77')
//         onResponse(err);
//       })
//       .on('response', (resp: ResponseType) => {
//         if (streamResponseHandled) {
//           console.log('before 79 return')
//           return;
//         }

//         streamResponseHandled = true;
//         console.log('before onresponse null resp', resp);
//         onResponse(null, resp);
//       });
//     console.log("before requestreampipe delaystream")
//     requestStream.pipe(delayStream!);
//   }

//   function onResponse(err: GoogleError | null, response: ResponseType = null): void {
//     // An error such as DNS resolution.
//     if (err) {
//       numNoResponseAttempts++;

//       if (numNoResponseAttempts <= opts.maxRetries!) {
//         makeRequest();
//       } else {
//         retryStream.emit('error', err);
//       }
//       console.log('before 99 return')
//       return;
//     }

//     // No more attempts need to be made, just continue on.
//     retryStream.emit('response', response);
//     delayStream!.pipe(retryStream);
//     requestStream.on('error', () => {
//       console.log('srr destroy on error without error')
//       // resetStreams();
//       // retryStream must be destroyed here for the stream handoff part of retries to function properly
//       // but the error event should not be passed - if it emits as part of .destroy()
//       // it will bubble up early to the caller
//       console.log('destroy in restreamingretryrequ')
//       retryStream.destroy();

//       // retryStream.destroy(new Error('error in retrystreaming'))
//     });
//   }
// }
