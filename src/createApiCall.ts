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

/**
 * Provides function wrappers that implement page streaming and retrying.
 */

import {createAPICaller} from './apiCaller';
import {
  APICallback,
  GaxCall,
  GRPCCall,
  GRPCCallOtherArgs,
  RequestType,
  SimpleCallbackFunction,
} from './apitypes';
import {Descriptor} from './descriptor';
import {CallOptions, CallSettings} from './gax';
import {retryable} from './normalCalls/retries';
import {addTimeoutArg} from './normalCalls/timeout';

/**
 * Converts an rpc call into an API call governed by the settings.
 *
 * In typical usage, `func` will be a promise to a callable used to make an rpc
 * request. This will mostly likely be a bound method from a request stub used
 * to make an rpc call. It is not a direct function but a Promise instance,
 * because of its asynchronism (typically, obtaining the auth information).
 *
 * The result is a function which manages the API call with the given settings
 * and the options on the invocation.
 *
 * @param {Promise<GRPCCall>|GRPCCall} func - is either a promise to be used to make
 *   a bare RPC call, or just a bare RPC call.
 * @param {CallSettings} settings - provides the settings for this call
 * @param {Descriptor} descriptor - optionally specify the descriptor for
 *   the method call.
 * @return {GaxCall} func - a bound method on a request stub used
 *   to make an rpc call.
 */
export function createApiCall(
  func: Promise<GRPCCall> | GRPCCall,
  settings: CallSettings,
  descriptor?: Descriptor
): GaxCall {
  // we want to be able to accept both promise resolving to a function and a
  // function. Currently client librares are only calling this method with a
  // promise, but it will change.
  const funcPromise = typeof func === 'function' ? Promise.resolve(func) : func;

  // the following apiCaller will be used for all calls of this function...
  const apiCaller = createAPICaller(settings, descriptor);

  return (
    request: RequestType,
    callOptions?: CallOptions,
    callback?: APICallback
  ) => {
    const thisSettings = settings.merge(callOptions);

    let currentApiCaller = apiCaller;
    // special case: if bundling is disabled for this one call,
    // use default API caller instead
    if (settings.isBundling && !thisSettings.isBundling) {
      currentApiCaller = createAPICaller(settings, undefined);
    }

    const ongoingCall = currentApiCaller.init(thisSettings, callback);
    funcPromise
      .then((func: GRPCCall) => {
        // Initially, the function is just what gRPC server stub contains.
        func = currentApiCaller.wrap(func);
        const retry = thisSettings.retry;
        if (retry && retry.retryCodes && retry.retryCodes.length > 0) {
          return retryable(
            func,
            thisSettings.retry!,
            thisSettings.otherArgs as GRPCCallOtherArgs
          );
        }
        return addTimeoutArg(
          func,
          thisSettings.timeout,
          thisSettings.otherArgs as GRPCCallOtherArgs
        );
      })
      .then((apiCall: SimpleCallbackFunction) => {
        // After adding retries / timeouts, the call function becomes simpler:
        // it only accepts request and callback.
        currentApiCaller.call(apiCall, request, thisSettings, ongoingCall);
      })
      .catch(err => {
        currentApiCaller.fail(ongoingCall, err);
      });

    // Calls normally return a "cancellable promise" that can be used to `await` for the actual result,
    // or to cancel the ongoing call.
    return currentApiCaller.result(ongoingCall);
  };
}
