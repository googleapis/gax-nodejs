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

import {EventEmitter} from 'events';
import {Status} from '../status';

import {ComputeLROOperation, ResultTuple} from '../apitypes';
import {CancellablePromise} from '../call';
import {BackoffSettings, CallOptions} from '../gax';
import {GoogleError} from '../googleError';
import {Metadata} from '../grpc';
import {
  DiregapicLROOptions,
  LongRunningDescriptor,
} from './longRunningDescriptor';
import * as operationProtos from '../../protos/operations';
import * as computeOperationProtos from '../../protos/compute_operations';
import {OperationsClient} from '../operationsClient';

/**
 * @callback GetOperationCallback
 * @param {?Error} error
 * @param {?Object} result
 * @param {?Object} metadata
 * @param {?google.longrunning.Operation} rawResponse
 */
export interface GetOperationCallback {
  (
    err?: Error | null,
    result?: {},
    metadata?: {} | null,
    rawResponse?: LROOperation | ComputeLROOperation
  ): void;
}

// (TODO): Make error generic for diregapic, not only for compute.Should use annotation
// 'google.cloud.operation_field' to get the error code and error message.
// See https://github.com/googleapis/googleapis/blob/master/google/cloud/compute/v1small/compute_small.proto#L455
function fromDiregapicOperationError(
  operation: ComputeLROOperation
): GoogleError | undefined {
  if (!operation.error) {
    return undefined;
  }
  const computeErrorMessage = computeOperationProtos.Error.fromObject(
    operation.error
  );
  const computeErrorObj =
    computeOperationProtos.Error.toObject(computeErrorMessage);
  const json = {
    error: {
      code: operation.httpErrorStatusCode,
      message: operation.httpErrorMessage,
      computeErrorObj,
    },
  };
  return GoogleError.parseHttpError(json);
}

type LROOperation = operationProtos.google.longrunning.Operation;

export class Operation extends EventEmitter {
  completeListeners: number;
  hasActiveListeners: boolean;
  latestResponse: LROOperation | ComputeLROOperation;
  longrunningDescriptor: LongRunningDescriptor;
  result: {} | null;
  metadata: Metadata | null;
  backoffSettings: BackoffSettings;
  _callOptions?: CallOptions;
  currentCallPromise_?: CancellablePromise<ResultTuple> | Promise<ResultTuple>;
  name?: string | number | Long | null;
  done?: boolean;
  error?: GoogleError;
  response?: {};
  diregapic?: DiregapicLROOptions | null;
  diregapicLRORequest?: {[k: string]: unknown};

  /**
   * Wrapper for a google.longrunnung.Operation.
   *
   * @constructor
   *
   * @param {google.longrunning.Operation | google.cloud.compute.v1.Operation} operationType - The operation to be wrapped.
   * @param {LongRunningDescriptor} longrunningDescriptor - This defines the
   * operations service client and unpacking mechanisms for the operation.
   * @param {BackoffSettings} backoffSettings - The backoff settings used in
   * in polling the operation.
   * @param {CallOptions} callOptions - CallOptions used in making get operation
   * requests.
   */
  constructor(
    operationType: LROOperation | ComputeLROOperation,
    longrunningDescriptor: LongRunningDescriptor,
    backoffSettings: BackoffSettings,
    callOptions?: CallOptions,
    diregapicLRORequest?: {}
  ) {
    super();
    this.completeListeners = 0;
    this.hasActiveListeners = false;
    this.latestResponse = operationType;
    this.longrunningDescriptor = longrunningDescriptor;
    this.result = null;
    this.metadata = null;
    this.backoffSettings = backoffSettings;
    this.diregapic = longrunningDescriptor.diregapic;
    this.diregapicLRORequest = diregapicLRORequest;
    if (!this.diregapic) {
      this.name = operationType.name;
      this.done = (operationType as LROOperation).done;
      this.error = operationType.error as unknown as GoogleError;
      this._unpackResponse(operationType as LROOperation);
    } else {
      this.name = (operationType as ComputeLROOperation).id;
      this.done = this._isDiregapicOperationDone(
        operationType as ComputeLROOperation
      );
      this.error = fromDiregapicOperationError(
        operationType as ComputeLROOperation
      );
      this._unpackDiregapicResponse(operationType as ComputeLROOperation);
    }
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
    if (!this.diregapic && this.currentCallPromise_) {
      (this.currentCallPromise_ as CancellablePromise<ResultTuple>).cancel();
    }
    const operationsClient = this.longrunningDescriptor
      .operationsClient as OperationsClient;
    const cancelRequest =
      new operationProtos.google.longrunning.CancelOperationRequest();
    cancelRequest.name = (this.latestResponse as LROOperation).name;
    return operationsClient.cancelOperation(cancelRequest);
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
  getOperation(callback?: GetOperationCallback): Promise<{}> | void {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const operationsClient = this.longrunningDescriptor.operationsClient;
    function promisifyResponse() {
      if (!callback) {
        return new Promise((resolve, reject) => {
          if (!self.diregapic) {
            const err = (self.latestResponse as LROOperation).error;
            if (err) {
              const error = new GoogleError(err.message!);
              error.code = err.code!;
              reject(error);
            } else {
              resolve([self.result, self.metadata, self.latestResponse]);
            }
          } else {
            const err = (self.latestResponse as ComputeLROOperation).error;
            if (err) {
              const computeErr = fromDiregapicOperationError(
                self.latestResponse as ComputeLROOperation
              );
              reject(computeErr);
            } else {
              resolve([
                self.latestResponse,
                self.latestResponse,
                self.latestResponse,
              ]);
            }
          }
        });
      }
      return;
    }

    if (!this.diregapic) {
      if ((this.latestResponse as LROOperation).done) {
        this._unpackResponse(this.latestResponse as LROOperation, callback);
        return promisifyResponse() as Promise<{}>;
      }
    } else {
      if (
        this._isDiregapicOperationDone(
          this.latestResponse as ComputeLROOperation
        )
      ) {
        this._unpackDiregapicResponse(
          this.latestResponse as ComputeLROOperation,
          callback
        );
        return promisifyResponse() as Promise<{}>;
      }
    }
    if (!this.diregapic) {
      const request =
        new operationProtos.google.longrunning.GetOperationRequest();
      request.name = this.latestResponse.name;
      this.currentCallPromise_ = (
        operationsClient as OperationsClient
      ).getOperationInternal(request, this._callOptions!);
    } else {
      const request = this._diregapicPollingRequest();
      this.currentCallPromise_ =
        operationsClient[this.diregapic.pollingMethodName!](request);
    }

    const noCallbackPromise = this.currentCallPromise_!.then(
      responses => {
        if (!this.diregapic) {
          self.latestResponse = responses[0] as LROOperation;
          self._unpackResponse(responses[0] as LROOperation, callback);
        } else {
          self.latestResponse = responses[0] as ComputeLROOperation;
          self._unpackDiregapicResponse(
            responses[0] as ComputeLROOperation,
            callback
          );
        }
        return promisifyResponse()!;
      },
      (err: Error) => {
        if (callback) {
          callback(err);
          return;
        }
        return Promise.reject(err);
      }
    );

    if (!callback) {
      return noCallbackPromise as Promise<{}>;
    }
  }

  _unpackResponse(op: LROOperation, callback?: GetOperationCallback) {
    const responseDecoder = this.longrunningDescriptor.responseDecoder;
    const metadataDecoder = this.longrunningDescriptor.metadataDecoder;
    let response: {};
    let metadata: Metadata;

    if (op.done) {
      if (op.result === 'error') {
        const error = new GoogleError(op.error!.message!);
        error.code = op.error!.code!;
        this.error = error;
        if (callback) {
          callback(error);
        }
        return;
      }

      if (responseDecoder && op.response) {
        this.response = op.response;
        response = responseDecoder(op.response.value!);
        this.result = response;
        this.done = true;
      }
    }

    if (metadataDecoder && op.metadata) {
      metadata = metadataDecoder(op.metadata.value!) as unknown as Metadata;
      this.metadata = metadata;
    }
    if (callback) {
      callback(null, response!, metadata!, op);
    }
  }

  _unpackDiregapicResponse(
    op: ComputeLROOperation,
    callback?: GetOperationCallback
  ) {
    if (this._isDiregapicOperationDone(op)) {
      if (op.error) {
        const err = fromDiregapicOperationError(op);
        if (callback) {
          return callback(err);
        }
        return;
      }
      if (op) {
        this.response = op;
        this.done = true;
      }
    }
    if (callback) {
      callback(null, this.response!, this.response, op);
    }
  }

  _isDiregapicOperationDone(op: ComputeLROOperation): boolean {
    const opProtobuf = computeOperationProtos.Operation.fromObject(op);
    return opProtobuf.status === computeOperationProtos.Operation.Status.DONE;
  }

  // Polling request require fields has been checked in the LRO method before
  // operation.promise() has been called. Transcoding will throw error if any required
  // fields missing.
  //(TODO): Should use `google.cloud.operation_request_field` annotation to get operation
  // request field. Possible solution: read the rpc request's options in generator, and pass down
  // to gax through LongRunningDescriptor.diregapic.
  // See https://github.com/googleapis/googleapis/blob/master/google/cloud/compute/v1small/compute_small.proto#L361
  _diregapicPollingRequest(): {} | undefined {
    const request: {[k: string]: unknown} = {};
    if (!this.diregapic?.pollingMethodRequestType) {
      return undefined;
    }
    const fields = this.diregapic?.pollingMethodRequestType!.fieldsArray;
    for (const field of fields) {
      if (this.diregapicLRORequest && field.name in this.diregapicLRORequest) {
        request[field.name] = this.diregapicLRORequest[field.name];
      }
      const operationResponseFieldName =
        '(google.cloud.operation_response_field)';
      if (field.options && operationResponseFieldName in field.options) {
        const responseField = field.options[
          operationResponseFieldName
        ] as string;
        if (responseField in this.latestResponse) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          request[field.name] = (this.latestResponse as any)[responseField];
        }
      }
    }
    return request;
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
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;

    let now = new Date();
    const delayMult = this.backoffSettings.retryDelayMultiplier;
    const maxDelay = this.backoffSettings.maxRetryDelayMillis;
    let delay = this.backoffSettings.initialRetryDelayMillis;
    let deadline = Infinity;
    if (this.backoffSettings.totalTimeoutMillis) {
      deadline = now.getTime() + this.backoffSettings.totalTimeoutMillis;
    }
    let previousMetadataBytes: Uint8Array;
    if (!this.diregapic) {
      const metadata = (this.latestResponse as LROOperation).metadata;
      if (metadata) {
        previousMetadataBytes = metadata.value!;
      }
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function emit(event: string | symbol, ...args: any[]) {
      self.emit(event, ...args);
    }

    // Helper function to replace nodejs buffer's equals()
    function arrayEquals(a: Uint8Array, b: Uint8Array): boolean {
      if (a.byteLength !== b.byteLength) {
        return false;
      }
      for (let i = 0; i < a.byteLength; ++i) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }

    function retry() {
      if (!self.hasActiveListeners) {
        return;
      }

      if (now.getTime() >= deadline) {
        const error = new GoogleError(
          'Total timeout exceeded before any response was received'
        );
        error.code = Status.DEADLINE_EXCEEDED;
        setImmediate(emit, 'error', error);
        return;
      }

      self.getOperation((err, result, metadata, rawResponse) => {
        if (err) {
          setImmediate(emit, 'error', err);
          return;
        }

        if (!result) {
          if (
            !self.diregapic &&
            (rawResponse as LROOperation)!.metadata &&
            (!previousMetadataBytes ||
              (rawResponse &&
                !arrayEquals(
                  (rawResponse as LROOperation).metadata!.value!,
                  previousMetadataBytes
                )))
          ) {
            setImmediate(emit, 'progress', metadata, rawResponse);
            previousMetadataBytes = (rawResponse as LROOperation)!.metadata!
              .value!;
          }
          // special case: some APIs fail to set either result or error
          // but set done = true (e.g. speech with silent file).
          // Some APIs just use this for the normal completion
          // (e.g. nodejs-contact-center-insights), so let's just return
          // an empty response in this case.
          if (!self.diregapic) {
            if ((rawResponse as LROOperation)!.done) {
              setImmediate(emit, 'complete', {}, metadata, rawResponse);
              return;
            }
          } else {
            if (
              self._isDiregapicOperationDone(rawResponse as ComputeLROOperation)
            ) {
              setImmediate(emit, 'complete', {}, metadata, rawResponse);
              return;
            }
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
    return new Promise((resolve, reject) => {
      this.on('error', reject).on(
        'complete',
        (result, metadata, rawResponse) => {
          resolve([result, metadata, rawResponse]);
        }
      );
    });
  }
}

/**
 * Method used to create Operation objects.
 *
 * @constructor
 *
 * @param {google.longrunning.Operation} op - The operation to be wrapped.
 * @param {LongRunningDescriptor} longrunningDescriptor - This defines the
 * operations service client and unpacking mechanisms for the operation.
 * @param {BackoffSettings} backoffSettings - The backoff settings used in
 * in polling the operation.
 * @param {CallOptions=} callOptions - CallOptions used in making get operation
 * requests.
 */
export function operation(
  op: LROOperation | ComputeLROOperation,
  longrunningDescriptor: LongRunningDescriptor,
  backoffSettings: BackoffSettings,
  callOptions?: CallOptions
) {
  return new Operation(op, longrunningDescriptor, backoffSettings, callOptions);
}
