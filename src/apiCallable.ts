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

/**
 * Provides function wrappers that implement page streaming and retrying.
 */

import {status} from 'grpc';
import {CallSettings, RetryOptions} from './gax';
import {GoogleError} from './GoogleError';

export interface ArgumentFunction {
  (argument: {}, callback: APICallback): void;
}

/**
 * @callback APICallback
 * @param {?Error} error
 * @param {?Object} response
 */
export type APICallback =
    // tslint:disable-next-line no-any
    (err: GoogleError|null, response?: any, next?: {}|null,
     rawResponse?: {}|null) => void;

/**
 * @callback APIFunc
 * @param {Object} argument
 * @param {grpc.Metadata} metadata
 * @param {Object} options
 * @param {APICallback} callback
 */
export type APIFunc =
    (argument: {}, metadata: {}, options: {}, callback: APICallback) =>
        Canceller;

/**
 * @callback APICall
 * @param {Object} argument
 * @param {CallOptions} callOptions
 * @param {APICallback} callback
 * @return {Promise|Stream|undefined}
 */
export interface APICall {
  // tslint:disable-next-line no-any
  (argument?: {}|null, callOptions?: {}|null, callback?: APICallback): any;
}

export class Canceller {
  callback?: APICallback;
  cancelFunc?: () => void;
  completed: boolean;

  /**
   * Canceller manages callback, API calls, and cancellation
   * of the API calls.
   * @param {APICallback=} callback
   *   The callback to be called asynchronously when the API call
   *   finishes.
   * @constructor
   * @property {APICallback} callback
   *   The callback function to be called.
   * @private
   */
  constructor(callback?: APICallback) {
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
      error.code = status.CANCELLED;
      this.callback!(error);
    }
  }


  /**
   * Call calls the specified function. Result will be used to fulfill
   * the promise.
   *
   * @param {function(Object, APICallback=)} aFunc
   *   A function for an API call.
   * @param {Object} argument
   *   A request object.
   */
  call(
      aFunc: (obj: {}, callback: APICallback) => PromiseCanceller,
      argument: {}): void {
    if (this.completed) {
      return;
    }
    // tslint:disable-next-line no-any
    const canceller = aFunc(argument, (...args: any[]) => {
      this.completed = true;
      setImmediate(this.callback!, ...args);
    });
    this.cancelFunc = () => canceller.cancel();
  }
}

// tslint:disable-next-line no-any
export interface CancellablePromise<T = any> extends Promise<T> {
  cancel(): void;
}

// tslint:disable-next-line no-any
export class PromiseCanceller<T = any> extends Canceller {
  promise: CancellablePromise<T>;
  /**
   * PromiseCanceller is Canceller, but it holds a promise when
   * the API call finishes.
   * @param {Function} PromiseCtor - A constructor for a promise that implements
   * the ES6 specification of promise.
   * @constructor
   * @private
   */
  // tslint:disable-next-line variable-name
  constructor(PromiseCtor: PromiseConstructor) {
    super();
    this.promise = new PromiseCtor((resolve, reject) => {
                     this.callback = (err, response, next, rawResponse) => {
                       if (err) {
                         reject(err);
                       } else {
                         resolve([response, next, rawResponse]);
                       }
                     };
                   }) as CancellablePromise;
    this.promise.cancel = () => {
      this.cancel();
    };
  }
}

export interface ApiCallOtherArgs {
  options?: {deadline?: Date;};
  headers?: {};
  metadataBuilder: (abTests?: {}, headers?: {}) => {};
}

/**
 * Updates aFunc so that it gets called with the timeout as its final arg.
 *
 * This converts a function, aFunc, into another function with updated deadline.
 *
 * @private
 *
 * @param {APIFunc} aFunc - a function to be updated.
 * @param {number} timeout - to be added to the original function as it final
 *   positional arg.
 * @param {Object} otherArgs - the additional arguments to be passed to aFunc.
 * @param {Object=} abTests - the A/B testing key/value pairs.
 * @return {function(Object, APICallback)}
 *  the function with other arguments and the timeout.
 */
function addTimeoutArg(
    aFunc: APIFunc, timeout: number, otherArgs: ApiCallOtherArgs,
    abTests?: {}): ArgumentFunction {
  // TODO: this assumes the other arguments consist of metadata and options,
  // which is specific to gRPC calls. Remove the hidden dependency on gRPC.
  return function timeoutFunc(argument, callback) {
    const now = new Date();
    const options = otherArgs.options || {};
    options.deadline = new Date(now.getTime() + timeout);
    const metadata = otherArgs.metadataBuilder ?
        otherArgs.metadataBuilder(abTests, otherArgs.headers || {}) :
        null;
    return aFunc(argument, metadata!, options, callback);
  };
}

/**
 * Creates a function equivalent to aFunc, but that retries on certain
 * exceptions.
 *
 * @private
 *
 * @param {APIFunc} aFunc - A function.
 * @param {RetryOptions} retry - Configures the exceptions upon which the
 *   function eshould retry, and the parameters to the exponential backoff retry
 *   algorithm.
 * @param {Object} otherArgs - the additional arguments to be passed to aFunc.
 * @return {function(Object, APICallback)} A function that will retry.
 */
function retryable(
    aFunc: APIFunc, retry: RetryOptions,
    otherArgs: ApiCallOtherArgs): ArgumentFunction {
  const delayMult = retry.backoffSettings.retryDelayMultiplier;
  const maxDelay = retry.backoffSettings.maxRetryDelayMillis;
  const timeoutMult = retry.backoffSettings.rpcTimeoutMultiplier;
  const maxTimeout = retry.backoffSettings.maxRpcTimeoutMillis;

  let delay = retry.backoffSettings.initialRetryDelayMillis;
  let timeout = retry.backoffSettings.initialRpcTimeoutMillis;

  /**
   * Equivalent to ``aFunc``, but retries upon transient failure.
   *
   * Retrying is done through an exponential backoff algorithm configured
   * by the options in ``retry``.
   * @param {Object} argument The request object.
   * @param {APICallback} callback The callback.
   * @return {function()} cancel function.
   */
  return function retryingFunc(argument: {}, callback: APICallback) {
    let canceller: Canceller|null|void;
    let timeoutId: NodeJS.Timer|null;
    let now = new Date();
    let deadline: number;
    if (retry.backoffSettings.totalTimeoutMillis) {
      deadline = now.getTime() + retry.backoffSettings.totalTimeoutMillis;
    }
    let retries = 0;
    const maxRetries = retry.backoffSettings.maxRetries!;
    // TODO: define A/B testing values for retry behaviors.

    /** Repeat the API call as long as necessary. */
    function repeat() {
      timeoutId = null;
      if (deadline && now.getTime() >= deadline) {
        const error = new GoogleError(
            'Retry total timeout exceeded before any response was received');
        error.code = status.DEADLINE_EXCEEDED;
        callback(error);
        return;
      }

      if (retries && retries >= maxRetries) {
        const error = new GoogleError(
            'Exceeded maximum number of retries before any ' +
            'response was received');
        error.code = status.DEADLINE_EXCEEDED;
        callback(error);
        return;
      }

      retries++;
      const toCall = addTimeoutArg(aFunc, timeout!, otherArgs);
      canceller = toCall(argument, (err, response, next, rawResponse) => {
        if (!err) {
          callback(null, response, next, rawResponse);
          return;
        }
        canceller = null;
        if (retry.retryCodes.indexOf(err!.code!) < 0) {
          err.note = 'Exception occurred in retry method that was ' +
              'not classified as transient';
          callback(err);
        } else {
          const toSleep = Math.random() * delay;
          timeoutId = setTimeout(() => {
            now = new Date();
            delay = Math.min(delay * delayMult, maxDelay);
            timeout = Math.min(
                timeout! * timeoutMult!, maxTimeout!, deadline - now.getTime());
            repeat();
          }, toSleep);
        }
      });
    }

    if (maxRetries && deadline!) {
      const error = new GoogleError(
          'Cannot set both totalTimeoutMillis and maxRetries ' +
          'in backoffSettings.');
      error.code = status.INVALID_ARGUMENT;
      callback(error);
    } else {
      repeat();
    }

    return {
      cancel() {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (canceller) {
          canceller.cancel();
        } else {
          const error = new GoogleError('cancelled');
          error.code = status.CANCELLED;
          callback(error);
        }
      },
    };
  };
}

export interface NormalApiCallerSettings {
  promise: PromiseConstructor;
}

/**
 * Creates an API caller for normal methods.
 *
 * @private
 * @constructor
 */
export class NormalApiCaller {
  init(settings: NormalApiCallerSettings, callback: APICallback):
      PromiseCanceller|Canceller {
    if (callback) {
      return new Canceller(callback);
    }
    return new PromiseCanceller(settings.promise);
  }

  wrap(func: Function): Function {
    return func;
  }

  call(
      apiCall: APICall, argument: {}, settings: {},
      canceller: PromiseCanceller): void {
    canceller.call(apiCall, argument);
  }

  fail(canceller: PromiseCanceller, err: GoogleError): void {
    canceller.callback!(err);
  }

  result(canceller: PromiseCanceller) {
    if (canceller.promise) {
      return canceller.promise;
    }
    return;
  }
}

/**
 * Converts an rpc call into an API call governed by the settings.
 *
 * In typical usage, `func` will be a promsie to a callable used to make an rpc
 * request. This will mostly likely be a bound method from a request stub used
 * to make an rpc call. It is not a direct function but a Promise instance,
 * because of its asynchronism (typically, obtaining the auth information).
 *
 * The result is a function which manages the API call with the given settings
 * and the options on the invocation.
 *
 * @param {Promise.<APIFunc>} funcWithAuth - is a promise to be used to make
 *   a bare rpc call. This is a Promise instead of a bare function because
 *   the rpc call will be involeved with asynchronous authentications.
 * @param {CallSettings} settings - provides the settings for this call
 * @param {Object=} optDescriptor - optionally specify the descriptor for
 *   the method call.
 * @return {APICall} func - a bound method on a request stub used
 *   to make an rpc call.
 */
export function createApiCall(
    funcWithAuth: Promise<APIFunc>, settings: CallSettings,
    // tslint:disable-next-line no-any
    optDescriptor?: any): APICall {
  const apiCaller =
      optDescriptor ? optDescriptor.apiCaller(settings) : new NormalApiCaller();

  return function apiCallInner(request?, callOptions?, callback?) {
    const thisSettings = settings.merge(callOptions);

    const status = apiCaller.init(thisSettings, callback);
    funcWithAuth
        .then(func => {
          func = apiCaller.wrap(func);
          const retry = thisSettings.retry;
          if (retry && retry.retryCodes && retry.retryCodes.length > 0) {
            return retryable(
                func, thisSettings.retry!,
                thisSettings.otherArgs as ApiCallOtherArgs);
          }
          return addTimeoutArg(
              func, thisSettings.timeout,
              thisSettings.otherArgs as ApiCallOtherArgs);
        })
        .then(apiCall => {
          apiCaller.call(apiCall, request, thisSettings, status);
        })
        .catch(err => {
          apiCaller.fail(status, err);
        });
    return apiCaller.result(status);
  };
}
