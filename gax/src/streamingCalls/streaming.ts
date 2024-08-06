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

import {Duplex, DuplexOptions, Readable, Stream, Writable, pipeline} from 'stream';

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
// MIGRATING SRR
// TODO - maybe bring this inside of the streamproxy class?
const DEFAULTS = {
  /*
    Max # of retries
  */
  maxRetries: 2,
};
// In retry-request, you could pass parameters to request using the requestOpts parameter
// when we called retry-request from gax, we always passed null
// passing null here removes an unnecessary parameter from this implementation
const requestOps = null;
const objectMode = true; // we don't support objectMode being false

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

  retry(stream: CancellableStream, retry: RetryOptions) {
    let retryArgument = this.argument! as unknown as RequestType;
    if (typeof retry.getResumptionRequestFn! === 'function') {
      const resumptionRetryArgument =
        retry.getResumptionRequestFn(retryArgument);
      if (resumptionRetryArgument !== undefined) {
        retryArgument = resumptionRetryArgument;
      }
    }
    console.log("right before reset streams")
    this.resetStreams(stream);

    console.log('after resetStreams')
    const newStream = this.apiCall!(
      retryArgument,
      this._callback
    ) as CancellableStream;
    this.stream = newStream;
    this.streamHandoffHelper(newStream, retry);
    console.log("after SHH in retry")
    return newStream;
  }

  /**
   * Helper function to handle total timeout + max retry check for server streaming retries
   * @param {number} deadline - the current retry deadline
   * @param {number} maxRetries - maximum total number of retries
   * @param {number} totalTimeoutMillis - total timeout in milliseconds
   */
  throwIfMaxRetriesOrTotalTimeoutExceeded(
    deadline: number,
    maxRetries: number,
    totalTimeoutMillis: number
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
      this.emit('error', error);
      this.destroy();
      // Without throwing error you get unhandled error since we are returning a new stream
      // There might be a better way to do this
      throw error;
    }

    if (this.retries && this.retries >= maxRetries) {
      const error = new GoogleError(
        'Exceeded maximum number of retries before any ' +
          'response was received'
      );
      error.code = Status.DEADLINE_EXCEEDED;
      this.emit('error', error);
      this.destroy();
      throw error;
    }
  }

  /**
   * Error handler for server streaming retries
   * @param {CancellableStream} stream - the stream being retried
   * @param {RetryOptions} retry - Configures the exceptions upon which the
   *   function should retry, and the parameters to the exponential backoff retry
   *   algorithm.
   * @param {Error} error - error to handle
   */

  streamHandoffErrorHandler(
    stream: CancellableStream,
    retry: RetryOptions,
    error: Error
  ): void {
    console.log('in stream hanodfferrorhandler');
    let retryStream = this.stream;
    const delayMult = retry.backoffSettings.retryDelayMultiplier;
    const maxDelay = retry.backoffSettings.maxRetryDelayMillis;
    const timeoutMult = retry.backoffSettings.rpcTimeoutMultiplier;
    const maxTimeout = retry.backoffSettings.maxRpcTimeoutMillis;

    let delay = retry.backoffSettings.initialRetryDelayMillis;
    let timeout = retry.backoffSettings.initialRpcTimeoutMillis;
    
    let now = new Date();
    let deadline = 0;


    if (retry.backoffSettings.totalTimeoutMillis) {
      deadline = now.getTime() + retry.backoffSettings.totalTimeoutMillis;
    }
    const maxRetries = retry.backoffSettings.maxRetries!;
    try {
      this.throwIfMaxRetriesOrTotalTimeoutExceeded(
        deadline,
        maxRetries,
        retry.backoffSettings.totalTimeoutMillis!
      );
    } catch (error) {
      return;
    }

    this.retries!++;

    if (this.shouldRetryRequest(error, retry)) {
      console.log('should retry');
      const toSleep = Math.random() * delay;
          setTimeout(() => {
            now = new Date();
            delay = Math.min(delay * delayMult, maxDelay);
            const timeoutCal = timeout && timeoutMult ? timeout * timeoutMult : 0;
            const rpcTimeout = maxTimeout ? maxTimeout : 0;
            this.prevDeadline = deadline;
            const newDeadline = deadline ? deadline - now.getTime() : 0;
            timeout = Math.min(timeoutCal, rpcTimeout, newDeadline);
          }, toSleep);    
        } else {
      const e = GoogleError.parseGRPCStatusDetails(error);
      e.note =
        'Exception occurred in retry method that was ' +
        'not classified as transient';
      this.emit('error', e);
      this.destroy();
      return;
    }

    console.log('this.retry othertime')
    retryStream = this.retry(stream, retry);
    this.stream = retryStream;
    return;
  }
  /**
   * Used during server streaming retries to handle
   * event forwarding, errors, and/or stream closure
   * @param {CancellableStream} stream - the stream that we're doing the retry on
   * @param {RetryOptions} retry - Configures the exceptions upon which the
   *   function should retry, and the parameters to the exponential backoff retry
   *   algorithm.
   */
  streamHandoffHelper(stream: CancellableStream, retry: RetryOptions): void {
    console.log('in streamHandoffHelper')

    let enteredError = false;
    this.eventForwardHelper(stream);
  

    stream.on('error', error => {
      console.log('shelper', error.message);
      enteredError = true;
      this.streamHandoffErrorHandler(stream, retry, error);
    });

    stream.on('data', (data: ResponseType) => {
      console.log('on data')
      this.retries = 0;
      this.emit.bind(this, 'data')(data);
    });

    stream.on('end', () => {
      console.log("end handoff")
      if (!enteredError) {
        console.log('if entered error')
        enteredError = true;
        this.emit('end');
        this.cancel();
      }
    });
  }

  eventForwardHelper(stream: Stream) {
    console.log('in eventforwardhelper')
    const eventsToForward = ['metadata', 'response', 'status'];
    eventsToForward.forEach(event => {
      stream.on(event, () => {
        this.emit.bind(this, event)
        console.log("event", event)}
      );
    });
  }

  eventForwardHelperRetries(stream: Stream, stream2: PassThrough) { // TODO types
    console.log('in new eventforwardhelper')
    const eventsToForward = ['metadata', 'response', 'status'];
    eventsToForward.forEach(event => {
      stream.on(event, () => {
        // this.emit.bind(this, event)
        this.emit(event)
        stream2.emit(event)
        console.log("event", event)}
      );
    });
  }

  statusMetadataHelper(stream: Stream) {
    // gRPC is guaranteed emit the 'status' event but not 'metadata', and 'status' is the last event to emit.
    // Emit the 'response' event if stream has no 'metadata' event.
    // This avoids the stream swallowing the other events, such as 'end'.
    stream.on('status', () => {
      console.log("emitting response in status")
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
      console.log("emitting response in metadata")

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
    console.log('calling forwardEvents')
    this.eventForwardHelper(stream);
    this.statusMetadataHelper(stream);

    stream.on('error', error => {
      console.log('uh oh, an error')
      GoogleError.parseGRPCStatusDetails(error);
    });
  }

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
   * Forward events from an API request stream to the user's stream.
   * @param {Stream} stream - The API request stream.
   * @param {RetryOptions} retry - Configures the exceptions upon which the
   *   function eshould retry, and the parameters to the exponential backoff retry
   *   algorithm.
   */
  forwardEventsWithRetries(
    stream: CancellableStream,
    retry: RetryOptions
  ): CancellableStream | undefined {
    console.log('forwardEventsWithRetries');
    let retryStream2 = new PassThrough({objectMode: true})
    let retryStream = stream;
    let togetherStream = pipeline([stream,retryStream2], (err) => {
      if(err){
        console.log('an error', err.message)
      }
      }) //todo better error handling - probably using our error handler


    // make sure we emit status, metadata, and response 
    // always - not sure if we need to surface these to retrystream
    // but we should to be safe
    this.eventForwardHelperRetries(stream, retryStream2);
    // this.eventForwardHelper(stream);

    this.statusMetadataHelper(stream);
    // this.statusMetadataHelper(togetherStream as unknown as Stream);

   
    // this only deals with the first error received
    stream.on('error', error => {
      console.log('stream on error 389', error.message);
      const timeout = retry.backoffSettings.totalTimeoutMillis;
      const maxRetries = retry.backoffSettings.maxRetries!;
      if ((maxRetries && maxRetries > 0) || (timeout && timeout > 0)) {
        if (this.shouldRetryRequest(error, retry)) {
          if (maxRetries && timeout!) {
            const newError = new GoogleError(
                'Cannot set both totalTimeoutMillis and maxRetries ' +
                  'in backoffSettings.'
              );
              newError.code = Status.INVALID_ARGUMENT;
              console.log('before an error emit, bad', newError)
              this.destroy(newError)
              console.log('after destroy 436')
              return; //end chunk          
            } else {
            this.retries!++;
            console.log('411 retry!');
            retryStream = this.retry(stream, retry);
            this.stream = retryStream;
            console.log('right before return 411')
            return retryStream;
          }
        } else {
          const e = GoogleError.parseGRPCStatusDetails(error);
          e.note =
            'Exception occurred in retry method that was ' +
            'not classified as transient';
          console.log('forwardevents destroy');
          this.destroy(e);
          return; 
        }
      } else {
        if (maxRetries === 0) {
            const e = GoogleError.parseGRPCStatusDetails(error);
            e.note = 'Max retries is set to zero.';
            this.destroy(e);
            return; // end chunk
          }
          return GoogleError.parseGRPCStatusDetails(error);      }
    });
    // this should only be success case
    console.log('right before fewr returnretrystream')

    //try a palceholder?
    return togetherStream as unknown as CancellableStream; //TODO types
  }

  /**
   * Resets the target stream as part of the retry process
   * @param {CancellableStream} requestStream - the stream to end
   */
  resetStreams(requestStream: CancellableStream) {
    if (requestStream) {
      requestStream.cancel && requestStream.cancel();
      if (requestStream.destroy) {
        console.log('destroy 442')
        requestStream.destroy();
      } else if (requestStream.end) {
        console.log("end 445")
        // TODO: not used in server streaming, but likely needed
        // if we want to add BIDI or client side streaming
        requestStream.end();
      }
    }
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
        // const request =  () => {
        //   if (this._isCancelCalled) {
        //     if (this.stream) {
        //       this.stream.cancel();
        //     }
        //     console.log('before 488 return')
        //     return;
        //   }
        //   console.log('set stream')
        //   const stream = apiCall(
        //     argument,
        //     this._callback
        //   ) as CancellableStream;
        //   this.stream = stream;
        //   console.log('before forwardeventsretries')
        //   this.stream = this.forwardEventsWithRetries(stream, retry);
        //   return this.stream;
        // };
        const request =  () => {
          if (this._isCancelCalled) {
            if (this.stream) {
              this.stream.cancel();
            }
            console.log('before 488 return')
            return;
          }
          console.log('set stream')
          const stream = apiCall(
            argument,
            this._callback
          ) as CancellableStream;
          // this.stream = stream;
          return stream
          // console.log('before forwardeventsretries')
          // this.stream = this.forwardEventsWithRetries(stream, retry);
          // return this.stream;
        };
        const retryStream = this.newStreamingRetryRequest({request, retry})
        // todo typing
        // TODO error handling
        this.stream = retryStream as unknown as CancellableStream;
        // const retryStream = request();
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
            console.log('before forwardevents2')
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
    console.log('before forwardEvents')
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

  

newStreamingRetryRequest(opts: streamingRetryRequestOptions){
  const retry = opts.retry
  const retryStream = new PassThrough({objectMode: true})
  const newMakeRequest = (newopts: streamingRetryRequestOptions) => {
    let enteredError = false;
    // make the request 
    const requestStream = newopts.request!(requestOps);
    // forward data to the outgoing stream
    // TODO - buffer
    requestStream.on('data', (data: ResponseType) => {
      this.retries = 0;
      // TODO should this be part of retryStream now that we've changed 
      // unclear I am not sure how I would do it.and teh bind has to be here
      this.emit.bind(this, 'data')(data);
    })
    requestStream.on('end', () => {
      console.log("enteredError", enteredError)
      if(!enteredError){
        retryStream.emit('end'); 
        retryStream.destroy();// not sure if needed do I need to cancel?
      }else{
        console.log('else!')
      }
    })

    // TODO timeout and deadline calculations
    requestStream.on('error', (error:Error) => {
      enteredError = true;
      console.log('stream on error 389', error.message);
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
              retryStream.destroy(newError) 
              console.log('after destroy 436')
              return; //end chunk          
            } 
            else {
              // check for exceeding timeout or max retries
              // TODO put this in a helper function
              const delayMult = retry.backoffSettings.retryDelayMultiplier;
              const maxDelay = retry.backoffSettings.maxRetryDelayMillis;
              const timeoutMult = retry.backoffSettings.rpcTimeoutMultiplier;
              const maxTimeout = retry.backoffSettings.maxRpcTimeoutMillis;
              let delay = retry.backoffSettings.initialRetryDelayMillis;
              let rpcTimeout = retry.backoffSettings.initialRpcTimeoutMillis;
              let now = new Date();
              let deadline = 0;

              if (timeout){
                deadline = now.getTime() + timeout;
              }
              try {
                this.throwIfMaxRetriesOrTotalTimeoutExceeded(
                  deadline,
                  maxRetries,
                  timeout!
                );
              } catch (error: unknown) {
                const e = GoogleError.parseGRPCStatusDetails(error as GoogleError); // TODO typecasting
                e.note =
                  'Exception occurred in retry method that was ' +
                  'not classified as transient';
                console.log('forwardevents destroy');
                retryStream.destroy(e);
                return; 
              }
              // calculate new deadlines
              const toSleep = Math.random() * delay;
              // TODO validate that these are passed to the retried call
              setTimeout(() => {
                now = new Date();
                delay = Math.min(delay * delayMult, maxDelay);
                const timeoutCal = timeout && timeoutMult ? timeout * timeoutMult : 0;
                const rpcTimeout = maxTimeout ? maxTimeout : 0;
                this.prevDeadline = deadline;
                const newDeadline = deadline ? deadline - now.getTime() : 0;
                timeout = Math.min(timeoutCal, rpcTimeout, newDeadline);
              }, toSleep);  
              this.retries!++
              console.log('retrying')
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
                console.log('before 488 return')
                return;
              }
              console.log('set stream')
              const newStream = this.apiCall!(
                retryArgument,
                this._callback
              ) as CancellableStream;
              return newStream
            }
            opts.request = newRequest;

              return newMakeRequest(opts)
   
          }
        } 
        // non retryable rror
        else {
          const e = GoogleError.parseGRPCStatusDetails(error);
          e.note =
            'Exception occurred in retry method that was ' +
            'not classified as transient';
          console.log('forwardevents destroy');
          retryStream.destroy(e);
          return; 
        }
      } 
      else {
        // edge case where max retries is zero 
        if (maxRetries === 0) {
            console.log('maxRetriesZero)')
            const e = GoogleError.parseGRPCStatusDetails(error);
            e.note = 'Max retries is set to zero.';
            console.log('right before destroy')
            retryStream.destroy(e);
            return; // end chunk
          }
          console.log('other edge case')
          // other edge cases? 
          return GoogleError.parseGRPCStatusDetails(error);      
        }
    });
    // return the stream every time
    console.log("before returning the stream")
    return retryStream;
  }
  console.log('calling new make request')
  return newMakeRequest(opts);

}
}

