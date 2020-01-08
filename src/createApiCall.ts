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
