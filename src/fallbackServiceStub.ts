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

interface NodeFetchType {
  (url: RequestInfo, init?: RequestInit): Promise<Response>;
}

export interface FallbackServiceStub {
  // Compatible with gRPC service stub
  [method: string]: (
    request: {},
    options: {},
    metadata: {},
    callback: (err?: Error, response?: {} | undefined) => void
  ) => {cancel: () => void};
}

export interface FetchParameters {
  headers: {[key: string]: string};
  body: Buffer | Uint8Array | string;
  method: 'get' | 'post' | 'put' | 'patch' | 'delete';
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
    request: {}
  ) => FetchParameters,
  responseDecoder: (
    rpc: protobuf.Method,
    ok: boolean,
    response: Buffer | ArrayBuffer
  ) => {}
) {
  const fetch = hasWindowFetch()
    ? window.fetch
    : (nodeFetch as unknown as NodeFetchType);

  const serviceStub: FallbackServiceStub = {};
  for (const [rpcName, rpc] of Object.entries(rpcs)) {
    serviceStub[rpcName] = (
      request: {},
      options: {[name: string]: string},
      _metadata: {},
      callback: Function
    ) => {
      // We cannot use async-await in this function because we need to return the canceller object as soon as possible.
      // Using plain old promises instead.

      const cancelController = hasAbortController()
        ? new AbortController()
        : new NodeAbortController();
      const cancelSignal = cancelController.signal;
      let cancelRequested = false;

      const fetchParameters = requestEncoder(
        rpc,
        protocol,
        servicePath,
        servicePort,
        request
      );
      const url = fetchParameters.url;
      const headers = fetchParameters.headers;
      for (const key of Object.keys(options)) {
        headers[key] = options[key][0];
      }

      authClient
        .getRequestHeaders()
        .then(authHeader => {
          const fetchRequest = {
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
            fetchParameters.method === 'get' ||
            fetchParameters.method === 'delete'
          ) {
            delete fetchRequest['body'];
          }

          return fetch(url, fetchRequest);
        })
        .then((response: Response | NodeFetchResponse) => {
          return Promise.all([
            Promise.resolve(response.ok),
            response.arrayBuffer(),
          ]);
        })
        .then(([ok, buffer]: [boolean, Buffer | ArrayBuffer]) => {
          const response = responseDecoder(rpc, ok, buffer);
          callback(null, response);
        })
        .catch((err: Error) => {
          if (!cancelRequested || err.name !== 'AbortError') {
            callback(err);
          }
        });

      return {
        cancel: () => {
          cancelRequested = true;
          cancelController.abort();
        },
      };
    };
  }

  return serviceStub;
}
