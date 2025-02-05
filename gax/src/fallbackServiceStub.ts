/* eslint-disable prettier/prettier */
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

import {
  Response as NodeFetchResponse,
  RequestInfo,
  RequestInit,
} from 'node-fetch';
import {AbortController as NodeAbortController} from 'abort-controller';

import {hasWindowFetch, hasAbortController, isNodeJS} from './featureDetection';
import {AuthClient} from './fallback';
import {StreamArrayParser} from './streamArrayParser';
import {pipeline, PipelineSource} from 'stream';
import type {Agent as HttpAgent} from 'http';
import type {Agent as HttpsAgent} from 'https';
const nodeFetch = (url: URL | RequestInfo, request: RequestInit | undefined) =>
  import('node-fetch').then(({default: fetch}) => fetch(url, request));

interface NodeFetchType {
  (url: RequestInfo, init?: RequestInit): Promise<Response>;
}

// Node.js before v19 does not enable keepalive by default.
// We'll try to enable it very carefully to make sure we don't break possible non-Node use cases.
// TODO: remove this after Node 18 is EOL.
// More info: https://github.com/node-fetch/node-fetch#custom-agent
let agentOption:
  | ((parsedUrl: {protocol: string}) => HttpAgent | HttpsAgent)
  | null = null;
if (isNodeJS()) {
  const http = require('http');
  const https = require('https');
  const httpAgent = new http.Agent({keepAlive: true});
  const httpsAgent = new https.Agent({keepAlive: true});
  agentOption = (parsedUrl: {protocol: string}) => {
    if (parsedUrl.protocol === 'http:') {
      return httpAgent;
    }
    return httpsAgent;
  };
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
    numericEnums: boolean,
    minifyJson: boolean
  ) => FetchParameters,
  responseDecoder: (
    rpc: protobuf.Method,
    ok: boolean,
    response: Buffer | ArrayBuffer
  ) => {},
  numericEnums: boolean,
  minifyJson: boolean
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
          numericEnums,
          minifyJson
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
              | undefined,
            method: fetchParameters.method,
            signal: cancelSignal,
          };
          if (agentOption) {
            fetchRequest.agent = agentOption;
          }
          if (
            fetchParameters.method === 'GET' ||
            fetchParameters.method === 'DELETE'
          ) {
            delete fetchRequest['body'];
          }
          return fetch(url, fetchRequest as {});
        })
        .then((response: Response | NodeFetchResponse) => {
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
                  if (callback) {
                    callback(err);
                  }
                  streamArrayParser.emit('error', err);
                }
              }
            );
            return;
          } else {
            return Promise.all([
              Promise.resolve(response.ok),
              response.arrayBuffer(),
            ])
              .then(([ok, buffer]: [boolean, Buffer | ArrayBuffer]) => {
                const response = responseDecoder(rpc, ok, buffer);
                callback!(null, response);
              })
              .catch((err: Error) => {
                if (!cancelRequested || err.name !== 'AbortError') {
                  if (rpc.responseStream) {
                    if (callback) {
                      callback(err);
                    }
                    streamArrayParser.emit('error', err);
                  } else if (callback) {
                    callback(err);
                  } else {
                    throw err;
                  }
                }
              });
          }
        })
        .catch((err: unknown) => {
          if (rpc.responseStream) {
            if (callback) {
              callback(err);
            }
            streamArrayParser.emit('error', err);
          } else if (callback) {
            callback(err);
          } else {
            throw err;
          }
        });

      if (rpc.responseStream) {
        return streamArrayParser;
      }
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
