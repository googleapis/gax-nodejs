/**
 * Copyright 2021 Google LLC
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

/* global window */
/* global AbortController */

import nodeFetch from 'node-fetch';
import {Response as NodeFetchResponse} from 'node-fetch';
import {AbortController as NodeAbortController} from 'abort-controller';

import {hasWindowFetch, hasAbortController} from './featureDetection';
import {AuthClient} from './fallback';
import {StreamArrayParser} from './streamArrayParser';
import {pipeline, PipelineSource} from 'stream';

interface NodeFetchType {
  (url: RequestInfo, init?: RequestInit): Promise<Response>;
}

export interface FallbackServiceStub {
  // Compatible with gRPC service stub
  [method: string]: (
    request: {},
    options?: {},
    metadata?: {},
    callback?: (err?: Error, response?: {} | undefined) => void
  ) => StreamArrayParser | {cancel: () => void};
}

export type FetchParametersMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface FetchParameters {
  headers: {[key: string]: string};
  body: Buffer | Uint8Array | string;
  method: FetchParametersMethod;
  url: string;
}

export function generateServiceStub(
  rpcs: {[name: string]: protobuf.Method},
  protocol: string,
  servicePath: string,
  servicePort: number,
  authClient: AuthClient,
  requestEncoder: (
    rpc: protobuf.Method,
    protocol: string,
    servicePath: string,
    servicePort: number,
    request: {},
    numericEnums: boolean
  ) => FetchParameters,
  responseDecoder: (
    rpc: protobuf.Method,
    ok: boolean,
    response: Buffer | ArrayBuffer
  ) => {},
  numericEnums: boolean,
  allowEmptyDeleteFallbackResponse: boolean
) {
  const fetch = hasWindowFetch()
    ? window.fetch
    : (nodeFetch as unknown as NodeFetchType);

  const serviceStub: FallbackServiceStub = {
    // close method should close all cancel controllers. If this feature request in the future, we can have a cancelControllerFactory that tracks created cancel controllers, and abort them all in close method.
    close: () => {
      return {cancel: () => {}};
    },
  };
  for (const [rpcName, rpc] of Object.entries(rpcs)) {
    serviceStub[rpcName] = (
      request: {},
      options?: {[name: string]: string},
      _metadata?: {} | Function,
      callback?: Function
    ) => {
      console.log('options in fallbackServiceStub', options)
      options ??= {};

      // We cannot use async-await in this function because we need to return the canceller object as soon as possible.
      // Using plain old promises instead.

      let fetchParameters: FetchParameters;
      try {
        fetchParameters = requestEncoder(
          rpc,
          protocol,
          servicePath,
          servicePort,
          request,
          numericEnums
        );
      } catch (err) {
        // we could not encode parameters; pass error to the callback
        // and return a no-op canceler object.
        if (callback) {
          callback(err);
        }
        return {
          cancel() {},
        };
      }

      const cancelController = hasAbortController()
        ? new AbortController()
        : new NodeAbortController();
      const cancelSignal = cancelController.signal as AbortSignal;
      let cancelRequested = false;
      const url = fetchParameters.url;
      const headers = fetchParameters.headers;
      for (const key of Object.keys(options)) {
        headers[key] = options[key][0];
      }
      const streamArrayParser = new StreamArrayParser(rpc);

      authClient
        .getRequestHeaders()
        .then(authHeader => {
          const fetchRequest: RequestInit = {
            headers: {
              ...authHeader,
              ...headers,
            },
            body: fetchParameters.body as
              | string
              | Buffer
              | Uint8Array
              | undefined,
            method: fetchParameters.method,
            signal: cancelSignal,
          };
          if (
            fetchParameters.method === 'GET' ||
            fetchParameters.method === 'DELETE'
          ) {
            delete fetchRequest['body'];
          }
          return fetch(url, fetchRequest);
        })
        .then((response: Response | NodeFetchResponse) => {
          console.log('response', response)
          if (response.ok && rpc.responseStream) {
            pipeline(
              response.body as PipelineSource<unknown>,
              streamArrayParser,
              (err: unknown) => {
                if (
                  err &&
                  (!cancelRequested ||
                    (err instanceof Error && err.name !== 'AbortError'))
                ) {
                  console.log("hitting an error 164", err)
                  if (callback) {
                    callback(err);
                  }
                  streamArrayParser.emit('error', err);
                }
              }
            );
            return;
          } else {
            console.log('before return promise all', response, response.ok)
            return Promise.all([
              Promise.resolve(response.ok),
              response.arrayBuffer(),
            ])
              .then(([ok, buffer]: [boolean, Buffer | ArrayBuffer]) => {
                console.log('beofre responseDecoder')
                const response = responseDecoder(rpc, ok, buffer);
                console.log('response 182', response)
                callback!(null, response);
              })
              //@ts-ignore - TODO fix
              .catch((err: Error) => {
                console.log('in catch 187')
                if (!cancelRequested || err.name !== 'AbortError') {
                  if (rpc.responseStream) {
                    if (callback) {
                      callback(err);
                    }
                    streamArrayParser.emit('error', err);
                  } else if (callback) {
                    // TODO - can possibly itnercept error here
                    if(allowEmptyDeleteFallbackResponse){
                      callback(null, {}) // TODO format properly
                    }
                    callback(err);
                  } else {
                    if(allowEmptyDeleteFallbackResponse){
                      return({}) // TODO format properly
                    }
                    console.log('throwing err', err)
                    throw err;
                  }
                }
              });
          }
        })
        .catch((err: unknown) => {
          console.log('error caught 200', err)
          if (rpc.responseStream) {
            if (callback) {
              callback(err);
            }
            streamArrayParser.emit('error', err);
          } else if (callback) {
            callback(err);
          } else {
            console.log('throwing error 208', err)
            throw err;
          }
        });

      if (rpc.responseStream) {
        return streamArrayParser;
      }
      console.log('before return 219')
      return {
        cancel: () => {
          cancelRequested = true;
          cancelController.abort();
        },
      };
    };
  }
  console.log('before return serviceStub')
  return serviceStub;
}
