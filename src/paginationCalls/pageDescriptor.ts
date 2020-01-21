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
  resolveFunction: Function;
  resolveRequest: Function;
  requestPageTokenField: string;
  responsePageTokenField: string;
  requestPageSizeField?: string;
  resourceField: string;

  constructor(
    requestPageTokenField: string,
    responsePageTokenField: string,
    resourceField: string
  ) {
    this.requestPageTokenField = requestPageTokenField;
    this.responsePageTokenField = responsePageTokenField;
    this.resourceField = resourceField;
    this.resolveFunction = () => {};
    this.resolveRequest = () => {};
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
    const iterable = this.createIterator(options);
    const funcPromise =
      typeof apiCall === 'function' ? Promise.resolve(apiCall) : apiCall;
    funcPromise
      .then((func: GaxCall) => {
        this.resolveParams(request, func, options);
      })
      .catch(error => {
        throw new Error(error);
      });
    return iterable;
  }

  createIterator(options: CallSettings): AsyncIterable<{} | undefined> {
    const self = this;
    const requestPageTokenFieldName = self.requestPageTokenField;
    const responsePageTokenFieldName = self.responsePageTokenField;
    const resourceField = self.resourceField;
    const getNextPageRequest = self.getNextPageRequest;
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        const funcPromise = new Promise((resolve, reject) => {
          self.resolveFunction = resolve;
        });
        const requestPromise = new Promise((resolve, reject) => {
          self.resolveRequest = resolve;
        });
        const cache: Array<{}> = [];
        let nextPageRequest: RequestType | null = {};
        let firstCall = true;
        return {
          async next() {
            const ongoingCall = new call.OngoingCallPromise(options.promise);
            const func = (await funcPromise) as SimpleCallbackFunction;
            const request = (await requestPromise) as RequestType;
            if (cache.length > 0) {
              const value = cache.shift();
              return Promise.resolve({done: false, value});
            }
            if (!firstCall && !nextPageRequest) {
              return Promise.resolve({done: true, value: -1});
            }
            nextPageRequest = await getNextPageRequest(
              cache,
              func,
              firstCall ? request : nextPageRequest!,
              ongoingCall,
              requestPageTokenFieldName,
              responsePageTokenFieldName,
              resourceField
            );
            firstCall = false;
            if (cache.length === 0) {
              nextPageRequest = null;
              return Promise.resolve({done: true, value: -1});
            }
            return Promise.resolve({done: false, value: cache.shift()});
          },
        };
      },
    };
    return asyncIterable; // return iterable
  }

  async getNextPageRequest(
    cache: Array<{}>,
    func: SimpleCallbackFunction,
    request: RequestType,
    ongoingCall: call.OngoingCallPromise,
    requestPageTokenFieldName: string,
    responsePageTokenField: string,
    resourceField: string
  ): Promise<RequestType | null> {
    ongoingCall.call(func, request);
    let nextPageRequest = null;
    const [response, nextRequest, rawResponse] = await ongoingCall.promise;
    const pageToken = (response as ResponseType)[responsePageTokenField];
    if (pageToken) {
      nextPageRequest = Object.assign({}, request);
      nextPageRequest[requestPageTokenFieldName] = pageToken;
    }
    const responses = (response as ResponseType)[resourceField];
    cache.push(...responses);
    return nextPageRequest;
  }

  resolveParams(request: RequestType, func: GaxCall, settings: CallSettings) {
    if (settings.pageToken) {
      request[this.requestPageTokenField] = settings.pageToken;
    }
    if (settings.pageSize) {
      request[this.requestPageSizeField!] = settings.pageSize;
    }
    this.resolveRequest(request);
    this.resolveFunction(func);
  }

  getApiCaller(settings: CallSettings): APICaller {
    if (!settings.autoPaginate) {
      return new NormalApiCaller();
    }
    return new PagedApiCaller(this);
  }
}
