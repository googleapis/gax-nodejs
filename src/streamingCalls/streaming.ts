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
  SimpleCallbackFunction,
} from '../apitypes';
import {RetryRequestOptions} from '../gax';

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

export class StreamProxy extends duplexify implements GRPCCallResult {
  type: StreamType;
  private _callback: APICallback;
  private _isCancelCalled: boolean;
  stream?: CancellableStream;
  /**
   * StreamProxy is a proxy to gRPC-streaming method.
   *
   * @private
   * @constructor
   * @param {StreamType} type - the type of gRPC stream.
   * @param {ApiCallback} callback - the callback for further API call.
   */
  constructor(type: StreamType, callback: APICallback) {
    super(undefined, undefined, {
      objectMode: true,
      readable: type !== StreamType.CLIENT_STREAMING,
      writable: type !== StreamType.SERVER_STREAMING,
    } as DuplexOptions);
    this.type = type;
    this._callback = callback;
    this._isCancelCalled = false;
  }

  cancel() {
    if (this.stream) {
      this.stream.cancel();
    } else {
      this._isCancelCalled = true;
    }
  }

  /**
   * Forward events from an API request stream to the user's stream.
   * @param {Stream} stream - The API request stream.
   */
  forwardEvents(stream: Stream) {
    const eventsToForward = ['metadata', 'response', 'status'];

    eventsToForward.forEach(event => {
      stream.on(event, this.emit.bind(this, event));
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
    });
  }

  /**
   * Specifies the target stream.
   * @param {ApiCall} apiCall - the API function to be called.
   * @param {Object} argument - the argument to be passed to the apiCall.
   */
  setStream(
    apiCall: SimpleCallbackFunction,
    argument: {},
    retryRequestOptions: RetryRequestOptions = {}
  ) {
    if (this.type === StreamType.SERVER_STREAMING) {
      const retryStream = retryRequest(null, {
        objectMode: true,
        request: () => {
          if (this._isCancelCalled) {
            if (this.stream) {
              this.stream.cancel();
            }
            return;
          }
          const stream = apiCall(argument, this._callback) as CancellableStream;
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
}
