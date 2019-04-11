/*
 * Copyright 2019, Google LLC
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

import {APICaller, ApiCallerSettings} from '../apiCaller';
import {APICallback, GRPCCall, SimpleCallbackFunction} from '../apitypes';
import {OngoingCall, OngoingCallPromise} from '../call';
import {CallSettings} from '../gax';
import {GoogleError} from '../googleError';

import {BundleExecutor} from './bundleExecutor';
import {TaskCallback} from './task';

/**
 * An implementation of APICaller for bundled calls.
 * Uses BundleExecutor to do bundling.
 */
export class BundleApiCaller implements APICaller {
  bundler: BundleExecutor;

  constructor(bundler: BundleExecutor) {
    this.bundler = bundler;
  }

  init(settings: ApiCallerSettings, callback?: APICallback): OngoingCallPromise
      |OngoingCall {
    if (callback) {
      return new OngoingCall(callback);
    }
    return new OngoingCallPromise(settings.promise);
  }

  wrap(func: GRPCCall): GRPCCall {
    return func;
  }

  call(
      apiCall: SimpleCallbackFunction, argument: {}, settings: CallSettings,
      status: OngoingCallPromise) {
    if (!settings.isBundling) {
      throw new GoogleError('Bundling enabled with no isBundling!');
    }

    status.call((argument: {}, callback: TaskCallback) => {
      this.bundler.schedule(apiCall, argument, callback);
      return status;
    }, argument);
  }

  fail(canceller: OngoingCallPromise, err: GoogleError): void {
    canceller.callback!(err);
  }

  result(canceller: OngoingCallPromise) {
    return canceller.promise;
  }
}
