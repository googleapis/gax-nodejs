/*
 * Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
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

import {EventEmitter} from 'events';
import {status} from 'grpc';
import {APICall, APICallback, CancellablePromise, NormalApiCaller, PromiseCanceller} from './apiCallable';
import {BackoffSettings, CallOptions, createBackoffSettings} from './gax';
import {GoogleError} from './GoogleError';
import {Metadata, MetadataValue} from './grpc';
import {OperationsClient} from './operationsClient';

/**
 * A callback to upack a google.protobuf.Any message.
 * @callback anyDecoder
 * @param {google.protobuf.Any} message - The message to unpacked.
 * @return {Object} - The unpacked message.
 */
export interface AnyDecoder {
  (message: {}): Metadata;
}

/**
 * @callback GetOperationCallback
 * @param {?Error} error
 * @param {?Object} result
 * @param {?Object} metadata
 * @param {?google.longrunning.Operation} rawResponse
 */
export interface GetOperationCallback {
  (err?: Error|null, result?: {}, metadata?: {}, rawResponse?: Operation): void;
}

export class LongrunningDescriptor {
  operationsClient: OperationsClient;
  responseDecoder: AnyDecoder;
  metadataDecoder: AnyDecoder;

  /**
   * Describes the structure of a page-streaming call.
   *
   * @property {OperationsClient} operationsClient
   * @property {anyDecoder} responseDecoder
   * @property {anyDecoder} metadataDecoder
   *
   * @param {OperationsClient} operationsClient - The client used to poll or
   *   cancel an operation.
   * @param {anyDecoder=} responseDecoder - The decoder to unpack
   *   the response message.
   * @param {anyDecoder=} metadataDecoder - The decoder to unpack
   *   the metadata message.
   *
   * @constructor
   */
  constructor(
      operationsClient: OperationsClient, responseDecoder: AnyDecoder,
      metadataDecoder: AnyDecoder) {
    this.operationsClient = operationsClient;
    this.responseDecoder = responseDecoder;
    this.metadataDecoder = metadataDecoder;
  }

  apiCaller() {
    return new LongrunningApiCaller(this);
  }
}

export class LongrunningApiCaller extends NormalApiCaller {
  longrunningDescriptor: LongrunningDescriptor;
  /**
   * Creates an API caller that performs polling on a long running operation.
   *
   * @private
   * @constructor
   * @param {LongrunningDescriptor} longrunningDescriptor - Holds the
   * decoders used for unpacking responses and the operationsClient
   * used for polling the operation.
   */
  constructor(longrunningDescriptor: LongrunningDescriptor) {
    super();
    this.longrunningDescriptor = longrunningDescriptor;
  }


  call(
      apiCall: APICall, argument: {}, settings: CallOptions,
      canceller: PromiseCanceller) {
    canceller.call((argument, callback) => {
      return this._wrapOperation(apiCall, settings, argument, callback);
    }, argument);
  }

  _wrapOperation(
      apiCall: APICall, settings: CallOptions, argument: {},
      callback: APICallback) {
    // TODO: this code defies all logic, and just can't be accurate.
    // tslint:disable-next-line no-any
    let backoffSettings: any = settings.longrunning;
    if (!backoffSettings) {
      backoffSettings =
          createBackoffSettings(100, 1.3, 60000, null, null, null, null);
    }

    const longrunningDescriptor = this.longrunningDescriptor;
    return apiCall(argument, (err: Error, rawResponse: Operation) => {
      if (err) {
        callback(err, null, rawResponse);
        return;
      }

      const operation = new Operation(
          rawResponse, longrunningDescriptor, backoffSettings!, settings);

      callback(null, operation, rawResponse);
    });
  }
}

export class Operation extends EventEmitter {
  completeListeners: number;
  hasActiveListeners: boolean;
  latestResponse: Operation;
  longrunningDescriptor: LongrunningDescriptor;
  result: {}|null;
  metadata: Metadata|null;
  backoffSettings: BackoffSettings;
  _callOptions?: CallOptions;
  currentCallPromise_?: CancellablePromise;
  name?: string;
  done?: boolean;
  error?: GoogleError;
  response?: {value: {}};

  /**
   * Wrapper for a google.longrunnung.Operation.
   *
   * @constructor
   *
   * @param {google.longrunning.Operation} grpcOp - The operation to be wrapped.
   * @param {LongrunningDescriptor} longrunningDescriptor - This defines the
   * operations service client and unpacking mechanisms for the operation.
   * @param {BackoffSettings} backoffSettings - The backoff settings used in
   * in polling the operation.
   * @param {CallOptions=} callOptions - CallOptions used in making get operation
   * requests.
   */
  constructor(
      grpcOp: Operation, longrunningDescriptor: LongrunningDescriptor,
      backoffSettings: BackoffSettings, callOptions?: CallOptions) {
    super();
    this.completeListeners = 0;
    this.hasActiveListeners = false;
    this.latestResponse = grpcOp;
    this.longrunningDescriptor = longrunningDescriptor;
    this.result = null;
    this.metadata = null;
    this.backoffSettings = backoffSettings;
    this._unpackResponse(grpcOp);
    this._listenForEvents();
    this._callOptions = callOptions;
  }

  /**
   * Begin listening for events on the operation. This method keeps track of how
   * many "complete" listeners are registered and removed, making sure polling
   * is handled automatically.
   *
   * As long as there is one active "complete" listener, the connection is open.
   * When there are no more listeners, the polling stops.
   *
   * @private
   */
  _listenForEvents() {
    this.on('newListener', event => {
      if (event === 'complete') {
        this.completeListeners++;

        if (!this.hasActiveListeners) {
          this.hasActiveListeners = true;
          this.startPolling_();
        }
      }
    });

    this.on('removeListener', event => {
      if (event === 'complete' && --this.completeListeners === 0) {
        this.hasActiveListeners = false;
      }
    });
  }

  /**
   * Cancels current polling api call and cancels the operation.
   *
   * @return {Promise} the promise of the OperationsClient#cancelOperation api
   * request.
   */
  cancel() {
    if (this.currentCallPromise_) {
      this.currentCallPromise_.cancel();
    }
    const operationsClient = this.longrunningDescriptor.operationsClient;
    return operationsClient.cancelOperation({name: this.latestResponse.name});
  }

  /**
   * Get the updated status of the operation. If the Operation has previously
   * completed, this will use the status of the cached completed operation.
   *
   *   - callback(err): Operation failed
   *   - callback(null, result, metadata, rawResponse): Operation complete
   *   - callback(null, null, metadata, rawResponse): Operation incomplete
   *
   * @param {getOperationCallback} callback - Callback to handle the polled
   * operation result and metadata.
   * @return {Promise|undefined} - This returns a promise if a callback is not specified.
   * The promise resolves to an array where the first element is the unpacked
   * result, the second element is the metadata, and the third element is the
   * raw response of the api call. The promise rejects if the operation returns
   * an error.
   */
  getOperation(): Promise<{}>;
  getOperation(callback: GetOperationCallback): void;
  getOperation(callback?: GetOperationCallback): Promise<{}>|void {
    const self = this;
    const operationsClient = this.longrunningDescriptor.operationsClient;

    function promisifyResponse() {
      if (!callback) {
        // tslint:disable-next-line variable-name
        const PromiseCtor = self._callOptions!.promise!;
        return new PromiseCtor((resolve, reject) => {
          if (self.latestResponse.error) {
            const error = new GoogleError(self.latestResponse.error.message);
            error.code = self.latestResponse.error.code;
            reject(error);
          } else {
            resolve([self.result, self.metadata, self.latestResponse]);
          }
        });
      }
      return;
    }

    if (this.latestResponse.done) {
      this._unpackResponse(this.latestResponse, callback);
      return promisifyResponse();
    }

    this.currentCallPromise_ = operationsClient.getOperation(
        {name: this.latestResponse.name}, this._callOptions!);

    const noCallbackPromise = this.currentCallPromise_!.then(responses => {
      self.latestResponse = responses[0];
      self._unpackResponse(responses[0], callback);
      return promisifyResponse()!;
    });

    if (!callback) {
      return noCallbackPromise;
    }
  }

  _unpackResponse(op: Operation, callback?: GetOperationCallback) {
    const responseDecoder = this.longrunningDescriptor.responseDecoder;
    const metadataDecoder = this.longrunningDescriptor.metadataDecoder;
    let response: {};
    let metadata: Metadata;

    if (op.done) {
      if (op.result === 'error') {
        const error = new GoogleError(op.error!.message);
        error.code = op.error!.code;
        if (callback) {
          callback(error);
        }
        return;
      }

      if (responseDecoder && op.response) {
        response = responseDecoder(op.response.value);
        this.result = response;
      }
    }

    if (metadataDecoder && op.metadata) {
      metadata = metadataDecoder(op.metadata.value);
      this.metadata = metadata;
    }
    if (callback) {
      callback(null, response!, metadata!, op);
    }
  }

  /**
   * Poll `getOperation` to check the operation's status. This runs a loop to
   * ping using the backoff strategy specified at initialization.
   *
   * Note: This method is automatically called once a "complete" event handler
   * is registered on the operation.
   *
   * @private
   */
  startPolling_() {
    const self = this;

    let now = new Date();
    const delayMult = this.backoffSettings.retryDelayMultiplier;
    const maxDelay = this.backoffSettings.maxRetryDelayMillis;
    let delay = this.backoffSettings.initialRetryDelayMillis;
    let deadline = Infinity;
    if (this.backoffSettings.totalTimeoutMillis) {
      deadline = now.getTime() + this.backoffSettings.totalTimeoutMillis;
    }
    let previousMetadataBytes: MetadataValue;
    if (this.latestResponse.metadata) {
      previousMetadataBytes = this.latestResponse.metadata.value;
    }

    // tslint:disable-next-line no-any
    function emit(event: string|symbol, ...args: any[]) {
      self.emit(event, ...args);
    }

    function retry() {
      if (!self.hasActiveListeners) {
        return;
      }

      if (now.getTime() >= deadline) {
        const error = new GoogleError(
            'Total timeout exceeded before any response was received');
        error.code = status.DEADLINE_EXCEEDED;
        setImmediate(emit, 'error', error);
        return;
      }

      self.getOperation((err, result, metadata, rawResponse) => {
        if (err) {
          setImmediate(emit, 'error', err);
          return;
        }

        if (!result) {
          if (rawResponse!.metadata &&
              (!previousMetadataBytes ||
               !rawResponse!.metadata!.value.equals(previousMetadataBytes))) {
            setImmediate(emit, 'progress', metadata, rawResponse);
            previousMetadataBytes = rawResponse!.metadata!.value;
          }
          // special case: some APIs fail to set either result or error
          // but set done = true (e.g. speech with silent file).
          // Don't hang forever in this case.
          if (rawResponse!.done) {
            const error = new GoogleError(
                'Long running operation has finished but there was no result');
            error.code = status.UNKNOWN;
            setImmediate(emit, 'error', error);
            return;
          }
          setTimeout(() => {
            now = new Date();
            delay = Math.min(delay * delayMult, maxDelay);
            retry();
          }, delay);
          return;
        }

        setImmediate(emit, 'complete', result, metadata, rawResponse);
      });
    }
    retry();
  }

  /**
   * Wraps the `complete` and `error` events in a Promise.
   *
   * @return {promise} - Promise that resolves on operation completion and rejects
   * on operation error.
   */
  promise() {
    // tslint:disable-next-line variable-name
    const PromiseCtor = this._callOptions!.promise!;
    return new PromiseCtor((resolve, reject) => {
      this.on('error', reject)
          .on('complete', (result, metadata, rawResponse) => {
            resolve([result, metadata, rawResponse]);
          });
    });
  }
}

/**
 * Method used to create Operation objects.
 *
 * @constructor
 *
 * @param {google.longrunning.Operation} op - The operation to be wrapped.
 * @param {LongrunningDescriptor} longrunningDescriptor - This defines the
 * operations service client and unpacking mechanisms for the operation.
 * @param {BackoffSettings} backoffSettings - The backoff settings used in
 * in polling the operation.
 * @param {CallOptions=} callOptions - CallOptions used in making get operation
 * requests.
 */
export function operation(
    op: Operation, longrunningDescriptor: LongrunningDescriptor,
    backoffSettings: BackoffSettings, callOptions?: CallOptions) {
  return new Operation(op, longrunningDescriptor, backoffSettings, callOptions);
}
