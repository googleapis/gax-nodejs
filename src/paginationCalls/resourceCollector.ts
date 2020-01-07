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

import {
  SimpleCallbackFunction,
  NextPageRequestType,
  RawResponseType,
  RequestType,
} from '../apitypes';

/**
 * ResourceCollector class implements asynchronous logic of calling the API call that supports pagination,
 * page by page, collecting all resources (up to `maxResults`) in the array.
 *
 * Usage:
 *   const resourceCollector = new ResourceCollector(apiCall, maxResults); // -1 for unlimited
 *   resourceCollector.processAllPages(request).then(resources => ...);
 */
export class ResourceCollector {
  apiCall: SimpleCallbackFunction;
  resources: Array<{}>;
  maxResults: number;
  resolveCallback?: (resources: Array<{}>) => void;
  rejectCallback?: (err: Error) => void;

  constructor(apiCall: SimpleCallbackFunction, maxResults = -1) {
    this.apiCall = apiCall;
    this.resources = [];
    this.maxResults = maxResults;
  }

  private callback(
    err: Error | null,
    resources: Array<{}>,
    nextPageRequest: NextPageRequestType,
    rawResponse: RawResponseType
  ) {
    if (err) {
      // Something went wrong with this request - failing everything
      this.rejectCallback!(err);
      return;
    }

    // Process one page
    for (const resource of resources) {
      this.resources.push(resource);
      if (this.resources.length === this.maxResults) {
        nextPageRequest = null;
        break;
      }
    }

    // All done?
    if (!nextPageRequest) {
      this.resolveCallback!(this.resources);
      return;
    }

    // Schedule the next call
    const callback = (
      ...args: [Error | null, Array<{}>, NextPageRequestType, RawResponseType]
    ) => this.callback(...args);
    setImmediate(this.apiCall, nextPageRequest, callback);
  }

  processAllPages(firstRequest: RequestType): Promise<Array<{}>> {
    return new Promise((resolve, reject) => {
      this.resolveCallback = resolve;
      this.rejectCallback = reject;

      // Schedule the first call
      const callback = (
        ...args: [Error | null, Array<{}>, NextPageRequestType, RawResponseType]
      ) => this.callback(...args);
      setImmediate(this.apiCall, firstRequest, callback);
    });
  }
}
