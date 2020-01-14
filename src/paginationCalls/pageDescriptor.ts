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
  GaxCallPromise,
} from '../apitypes';
import {Descriptor} from '../descriptor';
import {CallSettings} from '../gax';
import {NormalApiCaller} from '../normalCalls/normalApiCaller';

import {PagedApiCaller} from './pagedApiCaller';
import * as call_1 from '../call';

let resolveFunction: Function;
let resolveRequest: Function;

/**
 * A descriptor for methods that support pagination.
 */
export class PageDescriptor implements Descriptor {
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

  // create async iterator(settings) => iterable
  async(apiCall: GaxCall, request: {}, options: CallSettings): {} {
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

  createIterator(options: CallSettings): {} {
    const responsePageTokenFieldName = this.responsePageTokenField;
    const requestPageTokenFieldName = this.requestPageTokenField;
    const asyncIterable = {
      [Symbol.asyncIterator]() {
        const funcPromise = new Promise((resolve, reject) => {
          resolveFunction = resolve;
        });
        const requestPromise = new Promise((resolve, reject) => {
          resolveRequest = resolve;
        });
        const cache: Array<{}> = [];
        let nextPageRequest: RequestType = {};
        let firstCall = true;
        return {
          async next() {
            const ongoingCall = new call_1.OngoingCallPromise(options.promise);

            const func = (await funcPromise) as SimpleCallbackFunction;
            const request = (await requestPromise) as RequestType;
            if (firstCall) {
              ongoingCall.call(func, request);
              const [
                response,
                nextRequest,
                rawresponse,
              ] = await ongoingCall.promise;
              //@ts-ignore
              cache.push(...response.responses.map(r => r.content));
              //@ts-ignore
              const pageToken = response[responsePageTokenFieldName];
              if (pageToken) {
                nextPageRequest = Object.assign({}, request);
                nextPageRequest[requestPageTokenFieldName] = pageToken;
              }
              firstCall = false;
              return Promise.resolve({done: false, value: cache.shift()});
            } else {
              if (cache.length > 0) {
                const value = cache.shift();
                return Promise.resolve({done: false, value});
              } else if (nextPageRequest) {
                ongoingCall.call(func, nextPageRequest);
                const [
                  response,
                  nextRequest,
                  rawResponse,
                ] = await ongoingCall.promise;
                //@ts-ignore
                const pageToken = response[responsePageTokenFieldName];
                if (pageToken) {
                  nextPageRequest[requestPageTokenFieldName] = pageToken;
                }
                //@ts-ignore
                else nextPageRequest = null;
                //@ts-ignore
                cache.push(...response.responses.map(r => r.content));
                const value = cache.shift();
                return Promise.resolve({done: false, value});
              } else {
                return Promise.resolve({done: true, value: -1});
              }
            }
          },
        };
      },
    };
    return asyncIterable; // return iterable
  }

  resolveParams(request: RequestType, func: GaxCall, settings: CallSettings) {
    if (settings.pageToken) {
      request[this.requestPageTokenField] = settings.pageToken;
    }
    if (settings.pageSize) {
      request[this.requestPageSizeField!] = settings.pageSize;
    }
    resolveRequest(request);
    resolveFunction(func);
  }

  getApiCaller(settings: CallSettings): APICaller {
    if (!settings.autoPaginate) {
      return new NormalApiCaller();
    }
    return new PagedApiCaller(this);
  }
}
