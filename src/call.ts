/*
 * Copyright 2019 Google LLC
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

import {Status} from './status';

import {
  APICallback,
  NextPageRequestType,
  RawResponseType,
  RequestType,
  ResponseType,
  ResultTuple,
  SimpleCallbackFunction,
} from './apitypes';
import {GoogleError} from './googleError';

export class OngoingCall {
  callback: APICallback;
  cancelFunc?: () => void;
  completed: boolean;

  /**
   * OngoingCall manages callback, API calls, and cancellation
   * of the API calls.
   * @param {APICallback=} callback
   *   The callback to be called asynchronously when the API call
   *   finishes.
   * @constructor
   * @property {APICallback} callback
   *   The callback function to be called.
   * @private
   */
  constructor(callback: APICallback) {
    this.callback = callback;
    this.completed = false;
  }

  /**
   * Cancels the ongoing promise.
   */
  cancel(): void {
    if (this.completed) {
      return;
    }
    this.completed = true;
    if (this.cancelFunc) {
      this.cancelFunc();
    } else {
      const error = new GoogleError('cancelled');
      error.code = Status.CANCELLED;
      this.callback!(error);
    }
  }

  /**
   * Call calls the specified function. Result will be used to fulfill
   * the promise.
   *
   * @param {SimpleCallbackFunction} func
   *   A function for an API call.
   * @param {Object} argument
   *   A request object.
   */
  call(func: SimpleCallbackFunction, argument: RequestType): void {
    if (this.completed) {
      return;
    }
    // tslint:disable-next-line no-any
    const canceller = func(argument, (...args: any[]) => {
      this.completed = true;
      setImmediate(this.callback!, ...args);
    });
    this.cancelFunc = () => canceller.cancel();
  }
}

export interface CancellablePromise<T> extends Promise<T> {
  cancel(): void;
}

export class OngoingCallPromise extends OngoingCall {
  promise: CancellablePromise<ResultTuple>;
  /**
   * GaxPromise is GRPCCallbackWrapper, but it holds a promise when
   * the API call finishes.
   * @param {Function} PromiseCtor - A constructor for a promise that implements
   * the ES6 specification of promise.
   * @constructor
   * @private
   */
  // tslint:disable-next-line variable-name
  constructor(PromiseCtor: PromiseConstructor) {
    let resolveCallback: (
      result: [ResponseType, NextPageRequestType, RawResponseType]
    ) => void;
    let rejectCallback: (err: Error) => void;
    const callback: APICallback = (
      err: GoogleError | null,
      response?: ResponseType,
      next?: NextPageRequestType,
      rawResponse?: RawResponseType
    ) => {
      if (err) {
        rejectCallback(err);
      } else if (response !== undefined) {
        resolveCallback([response, next || null, rawResponse || null]);
      } else {
        throw new GoogleError('Neither error nor response are defined');
      }
    };
    const promise = new PromiseCtor((resolve, reject) => {
      resolveCallback = resolve;
      rejectCallback = reject;
    }) as CancellablePromise<ResultTuple>;
    super(callback);
    this.promise = promise;
    this.promise.cancel = () => {
      this.cancel();
    };
  }
}
