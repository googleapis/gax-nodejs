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

const {PassThrough} = require('stream');

const DEFAULTS = {
  /*
    Max # of retries
  */
  maxRetries: 2,

  /*
    The maximum time to delay in seconds. If retryDelayMultiplier results in a
    delay greater than maxRetryDelay, retries should delay by maxRetryDelay
    seconds instead.
  */
  maxRetryDelayMillis: 64000,

  /*
    The multiplier by which to increase the delay time between the completion of
    failed requests, and the initiation of the subsequent retrying request.
  */
  retryDelayMultiplier: 2,

  /*
    The length of time to keep retrying in seconds. The last sleep period will
    be shortened as necessary, so that the last retry runs at deadline (and not
    considerably beyond it).  The total time starting from when the initial
    request is sent, after which an error will be returned, regardless of the
    retrying attempts made meanwhile.
  */
  totalTimeoutMillis: 600000,

  /*
    The initial delay time, in milliseconds, between the completion of the first
    failed request and the initiation of the first retrying request.
  */
  initialRetryDelayMillis: 60,

  /*
    Initial timeout parameter to the request.
  */
  initialRpcTimeoutMillis: 60,

  /*
    Maximum timeout in milliseconds for a request.
    When this value is reached, rpcTimeoutMulitplier will no
    longer be used to increase the timeout.
  */
  maxRpcTimeoutMillis: 60,

  /*
   Multiplier by which to increase timeout parameter in
   between failed requests.
  */
  rpcTimeoutMultiplier: 2,

  /*
    The number of retries that have occured.
  */
  retries: 0,

  retryCodesOrShouldRetryFn:
    [14] ||
    function (response: any) {
      return undefined;
    },

  getResumptionRequestFn: function (response: any) {
    return undefined;
  },
};

export function streamingRetryRequest(
  requestOpts: any = null,
  opts: any = null,
  callback: any = null,
  ...args: any
) {
  const streamMode = typeof args[args.length - 1] !== 'function';

  if (typeof opts === 'function') {
    callback = opts;
  }

  opts = Object.assign({}, DEFAULTS, opts);

  if (typeof opts.request === 'undefined') {
    try {
      // eslint-disable-next-line node/no-unpublished-require
      opts.request = require('request');
    } catch (e) {
      throw new Error('A request library must be provided to retry-request.');
    }
  }

  let numNoResponseAttempts = 0;
  let streamResponseHandled = false;

  let retryStream: any;
  let requestStream: any;
  let delayStream: any;

  let activeRequest: {abort: () => void};
  const retryRequest = {
    abort: function () {
      if (activeRequest && activeRequest.abort) {
        activeRequest.abort();
      }
    },
  };

  if (streamMode) {
    retryStream = new PassThrough({objectMode: opts.objectMode});
    // retryStream.abort = resetStreams;
  }

  makeRequest();

  if (streamMode) {
    return retryStream;
  } else {
    return retryRequest;
  }

  function makeRequest() {
    if (streamMode) {
      streamResponseHandled = false;

      delayStream = new PassThrough({objectMode: opts.objectMode});
      requestStream = opts.request(requestOpts);

      setImmediate(() => {
        retryStream.emit('request');
      });

      requestStream
        // gRPC via google-cloud-node can emit an `error` as well as a `response`
        // Whichever it emits, we run with-- we can't run with both. That's what
        // is up with the `streamResponseHandled` tracking.
        .on('error', (err: any) => {
          if (streamResponseHandled) {
            return;
          }
          streamResponseHandled = true;
          onResponse(err);
        })
        .on('response', (resp: any, body: any) => {
          if (streamResponseHandled) {
            return;
          }

          streamResponseHandled = true;
          onResponse(null, resp, body);
        })
        .on('complete', retryStream.emit.bind(retryStream, 'complete'));

      requestStream.pipe(delayStream);
    } else {
      activeRequest = opts.request(requestOpts, onResponse);
    }
  }

  function onResponse(err: any, response: any = null, body: any = null) {
    // An error such as DNS resolution.
    if (err) {
      numNoResponseAttempts++;

      if (numNoResponseAttempts <= opts.maxRetries) {
        makeRequest();
      } else {
        if (streamMode) {
          retryStream.emit('error', err);
        } else {
          callback(err, response, body);
        }
      }

      return;
    }

    // No more attempts need to be made, just continue on.
    if (streamMode) {
      retryStream.emit('response', response);
      delayStream.pipe(retryStream);
      requestStream.on('error', (err: any) => {
        retryStream.destroy(err);
      });
    } else {
      callback(err, response, body);
    }
  }
}
