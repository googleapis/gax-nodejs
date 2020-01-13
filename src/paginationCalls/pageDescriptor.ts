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

import * as ended from 'is-stream-ended';
import {PassThrough, Transform} from 'stream';

import {APICaller} from '../apiCaller';
import {GaxCall, APICallback, SimpleCallbackFunction, RequestType, GaxCallPromise} from '../apitypes';
import {Descriptor} from '../descriptor';
import {CallSettings} from '../gax';
import {NormalApiCaller} from '../normalCalls/normalApiCaller';

import {PagedApiCaller} from './pagedApiCaller';
import * as call_1 from '../call';
import G = require('glob');

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
  async(    
    apiCall: GaxCall,
    request: {},
    options: CallSettings
    ): Object{
      console.warn('enter async block...');
      const iterable = this.createIterator(options);
      const funcPromise = typeof apiCall === 'function' ? Promise.resolve(apiCall) : apiCall;
      funcPromise.then((func: GaxCall)=> {
        this.resolveParams(request, func, options);
      }).catch((error) => {
        throw new Error(error);
      });      
      return iterable;
  }

  createIterator(options: CallSettings): Object{

    const responsePageTokenFieldName = this.responsePageTokenField;
    const requestPageTokenFieldName = this.requestPageTokenField;
    var asyncIterable = {
        [Symbol.asyncIterator]() {
            const funcPromise = new Promise((resolve, reject) => {
                resolveFunction = resolve;
            })
            const requestPromise = new Promise((resolve, reject) => {
                resolveRequest = resolve;
            })
            const cache: Object[] = [];
            let nextPageRequest: RequestType = {};
            let firstCall = true;
            return {
                async next() {
                    const ongoingCall = new call_1.OngoingCallPromise(options.promise);

                    let func = await funcPromise as SimpleCallbackFunction;
                    let request = await requestPromise as RequestType;
                    if(firstCall){
                      ongoingCall.call(func, request);
                      const [response, nextRequest, rawresponse] = await ongoingCall.promise;
                      //@ts-ignore
                      cache.push(...response.responses.map(r=> r.content));
                      //@ts-ignore
                      const pageToken = response[responsePageTokenFieldName];
                      if (pageToken) {
                          nextPageRequest = Object.assign({}, request);
                          nextPageRequest[requestPageTokenFieldName] = pageToken;
                      }
                      firstCall = false;
                      return Promise.resolve({ done: false, value: cache.shift() });
                    }
                    else{
                        if (cache.length > 0) {
                            const value = cache.shift();
                            return Promise.resolve({ done: false, value: value });
                        }
                        else if (nextPageRequest) {
                          ongoingCall.call(func, nextPageRequest);
                          const [response, nextRequest, rawResponse] = await ongoingCall.promise;
                          //@ts-ignore
                          const pageToken = response[responsePageTokenFieldName];
                          if (pageToken) {
                              nextPageRequest[requestPageTokenFieldName] = pageToken;
                          }
                          //@ts-ignore
                          else nextPageRequest = null;
                          //@ts-ignore
                          cache.push(...response.responses.map(r=> r.content));
                          const value = cache.shift();
                          return Promise.resolve({ done: false, value: value });
                      }
                        else {
                            return Promise.resolve({ done: true, value: -1 });
                        }
                    }
                }
            };
        }
    };
    return asyncIterable; // return iterable
}

resolveParams(request: RequestType, func: GaxCall, settings: CallSettings){
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
