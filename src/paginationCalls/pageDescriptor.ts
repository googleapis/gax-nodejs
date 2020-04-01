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

import * as ended from 'is-stream-ended';
import {PassThrough, Transform} from 'stream';

import {APICaller} from '../apiCaller';
import {
  GaxCall,
  APICallback,
  SimpleCallbackFunction,
  RequestType,
} from '../apitypes';
import {Descriptor} from '../descriptor';
import {CallSettings} from '../gax';
import {NormalApiCaller} from '../normalCalls/normalApiCaller';

import {PagedApiCaller} from './pagedApiCaller';
import * as call from '../call';

export interface ResponseType {
  [index: string]: string;
}
/**
 * A descriptor for methods that support pagination.
 */
export class PageDescriptor implements Descriptor {
  resolveParams: Function;
  requestPageTokenField: string;
  responsePageTokenField: string;
  requestPageSizeField?: string;
  resourceField: string;
  cache: Array<{}>;

  constructor(
    requestPageTokenField: string,
    responsePageTokenField: string,
    resourceField: string
  ) {
    this.requestPageTokenField = requestPageTokenField;
    this.responsePageTokenField = responsePageTokenField;
    this.resourceField = resourceField;
    this.resolveParams = () => {};
    this.cache = [];
  }

  /**
   * Creates a new object Stream which emits the resource on 'data' event.
   */
  createStream(
    apiCall: GaxCall,
    request: {},
    options: CallSettings
  ): Transform {
    const stream = new PassThrough({objectMode: true});
    options = Object.assign({}, options, {autoPaginate: false});
    const maxResults = 'maxResults' in options ? options.maxResults : -1;
    let pushCount = 0;
    let started = false;
    function callback(err: Error | null, resources: Array<{}>, next: {}) {
      if (err) {
        stream.emit('error', err);
        return;
      }
      for (let i = 0; i < resources.length; ++i) {
        if (ended(stream)) {
          return;
        }
        if (resources[i] === null) {
          continue;
        }
        stream.push(resources[i]);
        pushCount++;
        if (pushCount === maxResults) {
          stream.end();
        }
      }
      if (ended(stream)) {
        return;
      }
      if (!next) {
        stream.end();
        return;
      }
      // When pageToken is specified in the original options, it will overwrite
      // the page token field in the next request. Therefore it must be cleared.
      if ('pageToken' in options) {
        delete options.pageToken;
      }
      if (stream.isPaused()) {
        request = next;
        started = false;
      } else {
        setImmediate(apiCall, next, options, callback);
      }
    }
    stream.on('resume', () => {
      if (!started) {
        started = true;
        apiCall(request, options, (callback as unknown) as APICallback);
      }
    });
    return stream;
  }

  /**
   * Create an async iterable which can be recursively called for data on-demand.
   */
  asyncIterate(
    apiCall: GaxCall,
    request: RequestType,
    options: CallSettings
  ): AsyncIterable<{} | undefined> {
    const iterable = this.createIterator();
    const funcPromise =
      typeof apiCall === 'function' ? Promise.resolve(apiCall) : apiCall;
    funcPromise
      .then((func: GaxCall) => {
        this.makeCall(request, func, options);
      })
      .catch(error => {
        throw new Error(error);
      });
    return iterable;
  }

  createIterator(): AsyncIterable<{} | undefined> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const self = this;
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        const paramPromise: Promise<[
          RequestType,
          SimpleCallbackFunction
        ]> = new Promise(resolve => {
          self.resolveParams = resolve;
        });
        let nextPageRequest: RequestType | null = {};
        let firstCall = true;
        return {
          async next() {
            const ongoingCall = new call.OngoingCallPromise();
            const [request, func] = await paramPromise;
            if (self.cache.length > 0) {
              return Promise.resolve({
                done: false,
                value: self.cache.shift(),
              });
            }
            if (!firstCall && !nextPageRequest) {
              return Promise.resolve({done: true, value: undefined});
            }
            nextPageRequest = await self.getNextPageRequest(
              func,
              firstCall ? request : nextPageRequest!,
              ongoingCall
            );
            firstCall = false;
            if (self.cache.length === 0) {
              nextPageRequest = null;
              return Promise.resolve({done: true, value: undefined});
            }
            return Promise.resolve({done: false, value: self.cache.shift()});
          },
        };
      },
    };
    return asyncIterable;
  }

  async getNextPageRequest(
    func: SimpleCallbackFunction,
    request: RequestType,
    ongoingCall: call.OngoingCallPromise
  ): Promise<RequestType | null> {
    ongoingCall.call(func, request);
    let nextPageRequest = null;
    const [response] = await ongoingCall.promise;
    const pageToken = (response as ResponseType)[this.responsePageTokenField];
    if (pageToken) {
      nextPageRequest = Object.assign({}, request);
      nextPageRequest[this.requestPageTokenField] = pageToken;
    }
    const responses = (response as ResponseType)[this.resourceField];
    this.cache.push(...responses);
    return nextPageRequest;
  }

  makeCall(request: RequestType, func: GaxCall, settings: CallSettings) {
    if (settings.pageToken) {
      request[this.requestPageTokenField] = settings.pageToken;
    }
    if (settings.pageSize) {
      request[this.requestPageSizeField!] = settings.pageSize;
    }
    this.resolveParams([request, func]);
  }

  getApiCaller(settings: CallSettings): APICaller {
    if (!settings.autoPaginate) {
      return new NormalApiCaller();
    }
    return new PagedApiCaller(this);
  }
}
