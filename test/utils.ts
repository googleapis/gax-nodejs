/* Copyright 2016, Google Inc.
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

import * as apiCallable from '../src/api_callable';
import * as gax from '../src/gax';
import {GoogleError} from '../src/GoogleError';

const FAKE_STATUS_CODE_1 = (exports.FAKE_STATUS_CODE_1 = 1);

export function fail(argument, metadata, options, callback) {
  const error = new GoogleError();
  error.code = FAKE_STATUS_CODE_1;
  callback(error);
}

export function createApiCall(func, opts?) {
  opts = opts || {};
  const settings = new gax.CallSettings(opts.settings || {});
  const descriptor = opts.descriptor;
  return apiCallable.createApiCall(
      Promise.resolve((argument, metadata, options, callback) => {
        if (opts.returnCancelFunc) {
          return {
            cancel: func(argument, metadata, options, callback),
          };
        }
        func(argument, metadata, options, callback);
        return {
          cancel: opts.cancel || (() => {
                    callback(new Error('canceled'));
                  }),
        };
      }),
      settings, descriptor);
}

export function createRetryOptions(backoff, ...args: Array<{}>) {
  if (args.length > 0) {
    backoff = gax.createBackoffSettings.apply(null, arguments);
  }
  return gax.createRetryOptions([FAKE_STATUS_CODE_1], backoff);
}
