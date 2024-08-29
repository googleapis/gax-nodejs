/**
 * Copyright 2020 Google LLC
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

/* This file describes the gRPC-streaming. */

import {Duplex, DuplexOptions, Readable, Stream, Writable} from 'stream';

import {
  APICallback,
  CancellableStream,
  GRPCCallResult,
  RequestType,
  SimpleCallbackFunction,
} from '../apitypes';
import {RetryOptions, RetryRequestOptions} from '../gax';
import {GoogleError} from '../googleError';
import {Status} from '../status';
import {PassThrough} from 'stream';
import {ResponseType} from '../apitypes';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const duplexify: DuplexifyConstructor = require('duplexify');
// eslint-disable-next-line @typescript-eslint/no-var-requires
const retryRequest = require('retry-request');

// Directly copy over Duplexify interfaces
export interface DuplexifyOptions extends DuplexOptions {
  autoDestroy?: boolean;
  end?: boolean;
}

export interface Duplexify extends Duplex {
  readonly destroyed: boolean;
  setWritable(writable: Writable | false | null): void;
  setReadable(readable: Readable | false | null): void;
}

export interface DuplexifyConstructor {
  obj(
    writable?: Writable | false | null,
    readable?: Readable | false | null,
    options?: DuplexifyOptions
  ): Duplexify;
  new (
    writable?: Writable | false | null,
    readable?: Readable | false | null,
    options?: DuplexifyOptions
  ): Duplexify;
  (
    writable?: Writable | false | null,
    readable?: Readable | false | null,
    options?: DuplexifyOptions
  ): Duplexify;
}

/**
 * The type of gRPC streaming.
 * @enum {number}
 */
export enum StreamType {
  /** Client sends a single request, server streams responses. */
  SERVER_STREAMING = 1,

  /** Client streams requests, server returns a single response. */
  CLIENT_STREAMING = 2,

  /** Both client and server stream objects. */
  BIDI_STREAMING = 3,
}

// In retry-request, you could pass parameters to request using the requestOpts parameter
// when we called retry-request from gax, we always passed null
// passing null here removes an unnecessary parameter from this implementation
const requestOps = null;

interface streamingRetryRequestOptions {
  request: Function;
  retry: RetryOptions;
  maxRetries?: number;
}

export class StreamProxy extends duplexify implements GRPCCallResult {
  type: StreamType;
  private _callback: APICallback;
  private _isCancelCalled: boolean;
  stream?: CancellableStream;
  private _responseHasSent: boolean;
  rest?: boolean;
  gaxServerStreamingRetries?: boolean;
  apiCall?: SimpleCallbackFunction;
  argument?: {};
  prevDeadline?: number;
  retries?: number = 0;
  /**
   * StreamProxy is a proxy to gRPC-streaming method.
   *
   * @private
   * @constructor
   * @param {StreamType} type - the type of gRPC stream.
   * @param {ApiCallback} callback - the callback for further API call.
   */
  constructor(
    type: StreamType,
    callback: APICallback,
    rest?: boolean,
    gaxServerStreamingRetries?: boolean
  ) {
    super(undefined, undefined, {
      objectMode: true,
      readable: type !== StreamType.CLIENT_STREAMING,
      writable: type !== StreamType.SERVER_STREAMING,
    } as DuplexOptions);
    this.type = type;
    this._callback = callback;
    this._isCancelCalled = false;
    this._responseHasSent = false;
    this.rest = rest;
    this.gaxServerStreamingRetries = gaxServerStreamingRetries;
  }
  private shouldRetryRequest(error: Error, retry: RetryOptions): boolean {
    const e = GoogleError.parseGRPCStatusDetails(error);
    let shouldRetry = this.defaultShouldRetry(e!, retry);
    if (retry.shouldRetryFn) {
      shouldRetry = retry.shouldRetryFn(e!);
    }
    return shouldRetry;
  }

  cancel() {
    if (this.stream) {
      this.stream.cancel();
    } else {
      this._isCancelCalled = true;
    }
  }

  /**
   * Helper function to handle total timeout + max retry check for server streaming retries
   * @param {number} deadline - the current retry deadline
   * @param {number} maxRetries - maximum total number of retries
   * @param {number} totalTimeoutMillis - total timeout in milliseconds
   * @param {GoogleError} originalError - underlying error received by the stream
   */
  throwIfMaxRetriesOrTotalTimeoutExceeded(
    deadline: number,
    maxRetries: number,
    totalTimeoutMillis: number,
    originalError: GoogleError
  ): void {
    const now = new Date();

    if (
      this.prevDeadline! !== undefined &&
      deadline &&
      now.getTime() >= this.prevDeadline
    ) {
      const error = new GoogleError(
        `Total timeout of API exceeded ${totalTimeoutMillis} milliseconds before any response was received.`
      );
      error.code = Status.DEADLINE_EXCEEDED;
      // surface the original error to the user
      error.note = 'Underlying error: ' + originalError;
      throw error;
    }

    if (this.retries && this.retries >= maxRetries) {
      const error = new GoogleError(
        'Exceeded maximum number of retries before any ' +
          'response was received'
      );
      error.code = Status.DEADLINE_EXCEEDED;
      // surface the original error to the user
      error.note = 'Underlying error: ' + originalError;
      throw error;
    }
  }

  /**
   * Forwards events from an API request stream to the user's stream.
   * @param {Stream} stream - The API request stream.
   */
  eventForwardHelper(stream: Stream) {
    const eventsToForward = ['metadata', 'response', 'status'];
    eventsToForward.forEach(event => {
      stream.on(event, this.emit.bind(this, event));
    });
  }

  /**
   * Helper function that emits a response on the stream after either a 'metadata'
   * or a 'status' event - this helps streams to behave more like http consumers expect
   * @param {Stream} stream - The API request stream.
   */
  statusMetadataHelper(stream: Stream) {
    // gRPC is guaranteed emit the 'status' event but not 'metadata', and 'status' is the last event to emit.
    // Emit the 'response' event if stream has no 'metadata' event.
    // This avoids the stream swallowing the other events, such as 'end'.
    stream.on('status', () => {
      if (!this._responseHasSent) {
        stream.emit('response', {
          code: 200,
          details: '',
          message: 'OK',
        });
      }
    });

    // We also want to supply the status data as 'response' event to support
    // the behavior of google-cloud-node expects.
    // see:
    // https://github.com/GoogleCloudPlatform/google-cloud-node/pull/1775#issuecomment-259141029
    // https://github.com/GoogleCloudPlatform/google-cloud-node/blob/116436fa789d8b0f7fc5100b19b424e3ec63e6bf/packages/common/src/grpc-service.js#L355
    stream.on('metadata', metadata => {
      // Create a response object with succeeds.
      // TODO: unify this logic with the decoration of gRPC response when it's
      // added. see: https://github.com/googleapis/gax-nodejs/issues/65
      stream.emit('response', {
        code: 200,
        details: '',
        message: 'OK',
        metadata,
      });
      this._responseHasSent = true;
    });
  }
  /**
   * Forward events from an API request stream to the user's stream.
   * @param {Stream} stream - The API request stream.
   * @param {RetryOptions} retry - Configures the exceptions upon which the
   *   function should retry, and the parameters to the exponential backoff retry
   *   algorithm.
   */
  forwardEvents(stream: Stream) {
    this.eventForwardHelper(stream);
    this.statusMetadataHelper(stream);

    stream.on('error', error => {
      GoogleError.parseGRPCStatusDetails(error);
    });
  }

  /**
   * Default mechanism for determining whether a streaming call should retry
   * If a user passes in a "shouldRetryFn", this will not be used
   * @param {GoogleError} errpr - The error we need to determine is retryable or not
   * @param {RetryOptions} retry - Configures the exceptions upon which the
   *   function should retry, and the parameters to the exponential backoff retry
   *   algorithm.
   */
  defaultShouldRetry(error: GoogleError, retry: RetryOptions) {
    if (
      (retry.retryCodes.length > 0 &&
        retry.retryCodes.indexOf(error!.code!) < 0) ||
      retry.retryCodes.length === 0
    ) {
      return false;
    }
    return true;
  }

  /**
   * Specifies the target stream.
   * @param {ApiCall} apiCall - the API function to be called.
   * @param {Object} argument - the argument to be passed to the apiCall.
   * @param {RetryOptions} retry - Configures the exceptions upon which the
   *   function should retry, and the parameters to the exponential backoff retry
   *   algorithm.
   */
  setStream(
    apiCall: SimpleCallbackFunction,
    argument: {},
    retryRequestOptions: RetryRequestOptions = {},
    retry: RetryOptions
  ) {
    this.apiCall = apiCall;
    this.argument = argument;

    if (this.type === StreamType.SERVER_STREAMING) {
      if (this.rest) {
        const stream = apiCall(argument, this._callback) as CancellableStream;
        this.stream = stream;
        this.setReadable(stream);
      } else if (this.gaxServerStreamingRetries) {
        const request = () => {
          if (this._isCancelCalled) {
            if (this.stream) {
              this.stream.cancel();
            }
            return;
          }
          const stream = apiCall(argument, this._callback) as CancellableStream;
          return stream;
        };
        const retryStream = this.newStreamingRetryRequest({request, retry});
        // todo typing
        this.stream = retryStream as unknown as CancellableStream;
        this.eventForwardHelper(retryStream); // TODO is this obsolete?
        this.setReadable(retryStream!);
      } else {
        const retryStream = retryRequest(null, {
          objectMode: true,
          request: () => {
            if (this._isCancelCalled) {
              if (this.stream) {
                this.stream.cancel();
              }
              return;
            }
            const stream = apiCall(
              argument,
              this._callback
            ) as CancellableStream;
            this.stream = stream;
            this.forwardEvents(stream);
            return stream;
          },
          retries: retryRequestOptions!.retries,
          currentRetryAttempt: retryRequestOptions!.currentRetryAttempt,
          noResponseRetries: retryRequestOptions!.noResponseRetries,
          shouldRetryFn: retryRequestOptions!.shouldRetryFn,
        });
        this.setReadable(retryStream);
      }
      return;
    }

    const stream = apiCall(argument, this._callback) as CancellableStream;
    this.stream = stream;
    this.forwardEvents(stream);

    if (this.type === StreamType.CLIENT_STREAMING) {
      this.setWritable(stream);
    }

    if (this.type === StreamType.BIDI_STREAMING) {
      this.setReadable(stream);
      this.setWritable(stream);
    }

    if (this._isCancelCalled && this.stream) {
      this.stream.cancel();
    }
  }

  /**
   * Creates a new retry request stream - 
   *inner arrow function "newMakeRequest" handles retrying and resumption
   * @param {streamingRetryRequestOptions} opts
   *   {request} - the request to be made if the stream errors
   *   {retry} - the retry options associated with the call
   * @returns {CancellableStream} - the stream that handles retry logic
   */
  newStreamingRetryRequest(opts: streamingRetryRequestOptions): CancellableStream {
    const retry = opts.retry;
    const retryStream = new PassThrough({objectMode: true}); // TODO - make it a cancellable stream?

    const newMakeRequest = (newopts: streamingRetryRequestOptions) => {
      let dataEnd = false;
      let statusReceived = false;

      let enteredError = false;
     
       // make the request
      const requestStream = newopts.request!(requestOps);

      const eventsToForward = ['metadata', 'response', 'status'];
      eventsToForward.forEach(event => {
        requestStream.on(event, retryStream.emit.bind(retryStream, event));
      });
      this.statusMetadataHelper(requestStream);

      // TODO - buffer
      requestStream.on('data', (data: ResponseType) => {
        this.retries = 0;
        // TODO understand why this is what it is
        this.emit.bind(this, 'data')(data);
      });

      /* in retry-request, which previously handled retries,
       * "end" could be emitted on a request stream before other gRPC events.
       * To ensure it doesn't reach the consumer stream prematurely, retry-request piped
       * two streams together (delayStream and retryStream)
       * to ensure that "end" only emitted after a "response" event
       *
       * We are consciously NOT using pipeline or .pipe as part of similar logic here
       * because we want more control over what happens during event handoff and we want to
       * avoid the undesired behavior that can happen with error events
       * if consumers in client libraries are also using pipes
       *
       * Since "status" is guaranteed to be the last event emitted by gRPC.
       * If we have seen an "end" event, the dataEnd boolean will be true and we can safely
       * end the stream.
       *
       * The "statusReceived" boolean covers the opposite case - that we receive the "status" event before
       * a successful stream end event - this signals the .on('end') event handler that it's okay to end the stream
       *
       *
       */
      requestStream.on('status', () => {
        statusReceived = true;
        if (dataEnd) {
          retryStream.end();
        }
          return retryStream;
      });
      requestStream.on('end', () => {
        if (!enteredError) {
          dataEnd = true;

          // in this case, we've already received "status"
          // which is the last event from gRPC, so it's cool to end the stream
          if (statusReceived) {
            retryStream.end();
          }
        }
        return retryStream;

        // there is no else case because if enteredError
        // is true, we will handle stream destruction as part of
        // either retrying (where we don't want to end the stream)
        // or as part of error handling, which will take care of stream destruction
      });

      requestStream.on('error', (error: Error) => {
        enteredError = true;

        let timeout = retry.backoffSettings.totalTimeoutMillis;
        const maxRetries = retry.backoffSettings.maxRetries!;
        if ((maxRetries && maxRetries > 0) || (timeout && timeout > 0)) {
          if (this.shouldRetryRequest(error, retry)) {
            if (maxRetries && timeout!) {
              const newError = new GoogleError(
                'Cannot set both totalTimeoutMillis and maxRetries ' +
                  'in backoffSettings.'
              );
              newError.code = Status.INVALID_ARGUMENT;
              // clean up the request stream and retryStreams, silently destroy it on the request stream
              // but do raise it on destructin of the retryStream so the consumer can see it
              requestStream.destroy();
              retryStream.destroy(newError);

              return retryStream;
            } else {
              // check for exceeding timeout or max retries
              // TODO put this in a helper function
              const delayMult = retry.backoffSettings.retryDelayMultiplier;
              const maxDelay = retry.backoffSettings.maxRetryDelayMillis;
              const timeoutMult = retry.backoffSettings.rpcTimeoutMultiplier;
              const maxTimeout = retry.backoffSettings.maxRpcTimeoutMillis;
              let delay = retry.backoffSettings.initialRetryDelayMillis;
              const rpcTimeout = retry.backoffSettings.initialRpcTimeoutMillis;
              let now = new Date();
              let deadline = 0;

              if (timeout) {
                deadline = now.getTime() + timeout;
              }
              try {
                this.throwIfMaxRetriesOrTotalTimeoutExceeded(
                  deadline,
                  maxRetries,
                  timeout!,
                  error
                );
              } catch (error: unknown) {
                if(error instanceof GoogleError){
                  const e = GoogleError.parseGRPCStatusDetails(
                    error
                  );
                  // clean up the request stream and retryStreams, silently destroy it on the request stream
                  // but do raise it on destruction of the retryStream so the consumer can see it
                  requestStream.destroy();
                  retryStream.destroy(e);

                  return retryStream;
                }else{
                  throw(error);
                }
              }
              // calculate new deadlines
              const toSleep = Math.random() * delay;
              // TODO validate that these are passed to the retried call
              setTimeout(() => {
                now = new Date();
                delay = Math.min(delay * delayMult, maxDelay);
                const timeoutCal =
                  timeout && timeoutMult ? timeout * timeoutMult : 0;
                const rpcTimeout = maxTimeout ? maxTimeout : 0;
                this.prevDeadline = deadline;
                const newDeadline = deadline ? deadline - now.getTime() : 0;
                timeout = Math.min(timeoutCal, rpcTimeout, newDeadline);
              }, toSleep);
              this.retries!++;
              // RESUMPTION STUFF
              // TODO - helper function
              let retryArgument = this.argument! as unknown as RequestType;
              if (typeof retry.getResumptionRequestFn! === 'function') {
                const resumptionRetryArgument =
                  retry.getResumptionRequestFn(retryArgument);
                if (resumptionRetryArgument !== undefined) {
                  retryArgument = resumptionRetryArgument;
                }
              }
              const newRequest = () => {
                if (this._isCancelCalled) {
                  if (this.stream) {
                    this.stream.cancel();
                  }
                  return;
                }
                const newStream = this.apiCall!(
                  retryArgument,
                  this._callback
                ) as CancellableStream;
                return newStream;
              };
              opts.request = newRequest;

              // make a request with the updated parameters
              // based on the resumption strategy
              return newMakeRequest(opts);
            }
          }
          // non retryable error
          else {
            const e = GoogleError.parseGRPCStatusDetails(error);
            e.note =
              'Exception occurred in retry method that was ' +
              'not classified as transient';
            // clean up the request stream and retryStreams, silently destroy it on the request stream
            // but do raise it on destructin of the retryStream so the consumer can see it
            requestStream.destroy();
            retryStream.destroy(e);

            return retryStream;
          }
        } else {
          // edge case where max retries is zero
          if (maxRetries === 0) {
            const e = GoogleError.parseGRPCStatusDetails(error);
            e.note = 'Max retries is set to zero.';
            // clean up the request stream and retryStreams, silently destroy it on the request stream
            // but do raise it on destructin of the retryStream so the consumer can see it
            requestStream.destroy();
            retryStream.destroy(e);

            return retryStream;
          }
          // other edge cases, surface the error to the caller
          const e = GoogleError.parseGRPCStatusDetails(error);
          e.note =
            'Exception occurred in retry method that was ' +
            'not classified as transient';
          // clean up the request stream and retryStreams, silently destroy it on the request stream
          // but do raise it on destructin of the retryStream so the consumer can see it
          requestStream.destroy();
          retryStream.destroy(e);

          return retryStream;
        }
      });
      // return the stream if we didn't return it as
      // part of an error state
      return retryStream;
    };
    // this is the first make request call with the options the user passed in
    return newMakeRequest(opts) as unknown as CancellableStream; //TODO typecasting, is this super illegal?
  }
}
