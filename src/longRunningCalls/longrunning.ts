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

import {ResultTuple} from '../apitypes';
import {CancellablePromise} from '../call';
import {BackoffSettings, CallOptions} from '../gax';
import {GoogleError} from '../googleError';
import {Metadata} from '../grpc';
import {LongRunningDescriptor} from './longRunningDescriptor';
import * as operationProtos from '../../protos/operations';
import * as computeOperationProtos from '../../protos/compute_operations';
import {google} from '../../protos/iam_service';
import {OperationsClient} from '../operationsClient';
import {RegionOperationsClient} from '../diregapicOperationsClient/regionOperationsClient';

/**
 * @callback GetOperationCallback
 * @param {?Error} error
 * @param {?Object} result
 * @param {?Object} metadata
 * @param {?google.longrunning.Operation | google.cloud.compute.v1.Operation} rawResponse
 */
export interface GetOperationCallback {
  (
    err?: Error | null,
    result?: {},
    metadata?: {} | null,
    rawResponse?: LROOperation | ComputeLROOperation
  ): void;
}

type LROOperation = operationProtos.google.longrunning.Operation;
type ComputeLROOperation =
  computeOperationProtos.google.cloud.compute.v1.Operation;

function setOperationName(
  operation: LROOperation | ComputeLROOperation,
  isDiregapic: boolean | undefined
): string | null | undefined {
  if (isDiregapic) {
    return (operation as ComputeLROOperation).id;
  }
  return (operation as LROOperation).name;
}

function setOperationDone(
  operation: LROOperation | ComputeLROOperation,
  isDiregapic: boolean | undefined
): boolean {
  if (isDiregapic) {
    return (
      (operation as ComputeLROOperation).status ===
      computeOperationProtos.google.cloud.compute.v1.Operation.Status.DONE
    );
  }
  return (operation as LROOperation).done;
}

function setOperationError(
  operation: LROOperation | ComputeLROOperation,
  isDiregapic: boolean | undefined
): GoogleError | undefined {
  if (isDiregapic) {
    if (!(operation as ComputeLROOperation).httpErrorMessage) {
      return undefined;
    }
    const computeErr = new GoogleError(
      (operation as ComputeLROOperation).httpErrorMessage!
    );
    if (!(operation as ComputeLROOperation).httpErrorStatusCode) {
      return undefined;
    }
    computeErr.code = (operation as ComputeLROOperation).httpErrorStatusCode!;
    return computeErr;
  }
  return (operation as LROOperation).error as unknown as GoogleError;
}

function isComputeOperationDone(
  operation: LROOperation | ComputeLROOperation,
  isDiregapic: boolean | undefined
): boolean | undefined {
  return (
    isDiregapic &&
    (operation as ComputeLROOperation).status ===
      computeOperationProtos.google.cloud.compute.v1.Operation.Status.DONE
  );
}

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
  name?: string | null;
  done?: boolean;
  error?: GoogleError;
  response?: {};
  diregapic?: boolean;

  /**
   * Wrapper for a google.longrunnung.Operation.
   *
   * @constructor
   *
   * @param {google.longrunning.Operation | google.cloud.compute.v1.Operation} grpcOp - The operation to be wrapped.
   * @param {LongRunningDescriptor} longrunningDescriptor - This defines the
   * operations service client and unpacking mechanisms for the operation.
   * @param {BackoffSettings} backoffSettings - The backoff settings used in
   * in polling the operation.
   * @param {CallOptions} callOptions - CallOptions used in making get operation
   * requests.
   */
  constructor(
    grpcOp: LROOperation | ComputeLROOperation,
    longrunningDescriptor: LongRunningDescriptor,
    backoffSettings: BackoffSettings,
    callOptions?: CallOptions
  ) {
    super();
    this.completeListeners = 0;
    this.hasActiveListeners = false;
    this.latestResponse = grpcOp;
    this.longrunningDescriptor = longrunningDescriptor;
    this.diregapic = this.longrunningDescriptor.diregapic;
    this.name = setOperationName(this.latestResponse, this.diregapic);
    this.done = setOperationDone(this.latestResponse, this.diregapic);
    this.error = setOperationError(this.latestResponse, this.diregapic);
    this.longrunningDescriptor = longrunningDescriptor;
    this.result = null;
    this.metadata = null;
    this.backoffSettings = backoffSettings;
    this.diregapic
      ? this._unpackDiregapicResponse(grpcOp as ComputeLROOperation)
      : this._unpackResponse(grpcOp as LROOperation);
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
          if ((self.latestResponse as LROOperation).error) {
            const error = new GoogleError(
              (self.latestResponse as LROOperation).error!.message!
            );
            error.code = (self.latestResponse as LROOperation).error!.code!;
            reject(error);
          } else {
            resolve([self.result, self.metadata, self.latestResponse]);
          }
        });
      }
      return;
    }
    function promisifyDiregapicResponse() {
      if (!callback) {
        return new Promise((resolve, reject) => {
          if ((self.latestResponse as ComputeLROOperation).httpErrorMessage) {
            const error = new GoogleError(
              (self.latestResponse as ComputeLROOperation).httpErrorMessage!
            );
            if (
              (self.latestResponse as ComputeLROOperation).httpErrorStatusCode
            ) {
              error.code = (
                self.latestResponse as ComputeLROOperation
              ).httpErrorStatusCode!;
              reject(error);
            }
          } else {
            resolve([self.result, null, self.latestResponse]);
          }
        });
      }
      return;
    }

    if (!this.diregapic && (this.latestResponse as LROOperation).done) {
      this._unpackResponse(this.latestResponse as LROOperation, callback);
      return promisifyResponse() as Promise<{}>;
    }
    if (isComputeOperationDone(this.latestResponse, this.diregapic)) {
      this._unpackDiregapicResponse(
        this.latestResponse as ComputeLROOperation,
        callback
      );
      return promisifyDiregapicResponse() as Promise<{}>;
    }
    if (!this.diregapic) {
      const request =
        new operationProtos.google.longrunning.GetOperationRequest();
      request.name = (this.latestResponse as LROOperation).name;
      this.currentCallPromise_ = (
        operationsClient as OperationsClient
      ).getOperationInternal(request, this._callOptions!);
    } else {
      const request =
        new computeOperationProtos.google.cloud.compute.v1.GetRegionOperationRequest();
      operationsClient.getProjectId().then(project => {
        request.project = project;
        request.operation = this.longrunningDescriptor.operation!;
        request.region = this.longrunningDescriptor.region!;
        this.currentCallPromise_ = (
          operationsClient as RegionOperationsClient
        ).getOperationInternal(request, this._callOptions!);
      });
    }

    const noCallbackPromise = this.currentCallPromise_!.then(responses => {
      if (self.diregapic) {
        self.latestResponse = responses[0] as ComputeLROOperation;
        self._unpackDiregapicResponse(
          responses[0] as ComputeLROOperation,
          callback
        );
        return promisifyDiregapicResponse()!;
      }
      self.latestResponse = responses[0] as LROOperation;
      self._unpackResponse(responses[0] as LROOperation, callback);
      return promisifyResponse()!;
    });

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
    if (isComputeOperationDone(op, true)) {
      if (op.httpErrorMessage) {
        const error = new GoogleError(op.httpErrorMessage);
        if (op.httpErrorStatusCode) {
          error.code = op.httpErrorStatusCode;
        }
        this.error = error;
        if (callback) {
          callback(error);
        }
        return;
      }

      if (op) {
        this.response = op;
        this.done = true;
      }
    }

    if (callback) {
      callback(null, this.response!, null, op);
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
    if (!this.diregapic && (this.latestResponse as LROOperation).metadata) {
      previousMetadataBytes = (this.latestResponse as LROOperation).metadata!
        .value!;
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
            previousMetadataBytes = (rawResponse as LROOperation).metadata!
              .value!;
          }
          // special case: some APIs fail to set either result or error
          // but set done = true (e.g. speech with silent file).
          // Some APIs just use this for the normal completion
          // (e.g. nodejs-contact-center-insights), so let's just return
          // an empty response in this case.
          if (!self.diregapic && (rawResponse as LROOperation)!.done) {
            setImmediate(emit, 'complete', {}, metadata, rawResponse);
            return;
          }
          if (isComputeOperationDone(rawResponse!, self.diregapic)) {
            setImmediate(emit, 'complete', {}, {}, rawResponse);
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
 * @param {google.longrunning.Operation | google.cloud.compute.v1.Operation} op - The operation to be wrapped.
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
