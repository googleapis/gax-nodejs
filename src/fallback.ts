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

// Not all browsers support `TextEncoder`. The following `require` will
// provide a fast UTF8-only replacement for those browsers that don't support
// text encoding natively.
import {isBrowser} from './isbrowser';
let needTextEncoderPolyfill = false;

if (
  isBrowser() &&
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  (typeof TextEncoder === 'undefined' || typeof TextDecoder === 'undefined')
) {
  needTextEncoderPolyfill = true;
}
if (
  typeof process !== 'undefined' &&
  process?.versions?.node &&
  process?.versions?.node.match(/^10\./)
) {
  // Node.js 10 does not have global TextDecoder
  // TODO(@alexander-fenster): remove this logic after Node.js 10 is EOL.
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const util = require('util');
  Object.assign(global, {
    TextDecoder: util.TextDecoder,
    TextEncoder: util.TextEncoder,
  });
}
if (needTextEncoderPolyfill) {
  require('fast-text-encoding');
}

import * as protobuf from 'protobufjs';
import * as gax from './gax';
import nodeFetch from 'node-fetch';
import {Response as NodeFetchResponse} from 'node-fetch';
import * as routingHeader from './routingHeader';
import {AbortController as NodeAbortController} from 'abort-controller';
import {Status} from './status';
import {OutgoingHttpHeaders} from 'http';
import {
  GoogleAuth,
  OAuth2Client,
  Compute,
  JWT,
  UserRefreshClient,
  GoogleAuthOptions,
  BaseExternalAccountClient,
} from 'google-auth-library';
import * as objectHash from 'object-hash';
import {OperationsClientBuilder} from './operationsClient';
import {GrpcClientOptions, ClientStubOptions} from './grpc';
import {GaxCall, GRPCCall} from './apitypes';
import {Descriptor} from './descriptor';
import {createApiCall as _createApiCall} from './createApiCall';
import {FallbackErrorDecoder, FallbackServiceError} from './fallbackError';
import {transcode} from './transcoding';
export {FallbackServiceError};
export {PathTemplate} from './pathTemplate';
export {routingHeader};
export {CallSettings, constructSettings, RetryOptions} from './gax';
export const version = require('../../package.json').version + '-fallback';

export {
  BundleDescriptor,
  LongrunningDescriptor,
  PageDescriptor,
  StreamDescriptor,
} from './descriptor';

export {StreamType} from './streamingCalls/streaming';

interface NodeFetchType {
  (url: RequestInfo, init?: RequestInit): Promise<Response>;
}

const CLIENT_VERSION_HEADER = 'x-goog-api-client';

interface FallbackServiceStub {
  [method: string]: Function;
}

export class GrpcClient {
  auth?: OAuth2Client | GoogleAuth;
  authClient?:
    | OAuth2Client
    | Compute
    | JWT
    | UserRefreshClient
    | BaseExternalAccountClient;
  fallback: boolean | 'rest' | 'proto';
  grpcVersion: string;
  private static protoCache = new Map<string, protobuf.Root>();

  /**
   * In rare cases users might need to deallocate all memory consumed by loaded protos.
   * This method will delete the proto cache content.
   */
  static clearProtoCache() {
    GrpcClient.protoCache.clear();
  }

  /**
   * gRPC-fallback version of GrpcClient
   * Implements GrpcClient API for a browser using grpc-fallback protocol (sends serialized protobuf to HTTP/1 $rpc endpoint).
   *
   * @param {Object=} options.auth - An instance of OAuth2Client to use in browser, or an instance of GoogleAuth from google-auth-library
   *  to use in Node.js. Required for browser, optional for Node.js.
   * @constructor
   */

  constructor(
    options: (GrpcClientOptions | {auth: OAuth2Client}) & {
      fallback?: boolean | 'rest' | 'proto';
    } = {}
  ) {
    if (isBrowser()) {
      if (!options.auth) {
        throw new Error(
          JSON.stringify(options) +
            'You need to pass auth instance to use gRPC-fallback client in browser. Use OAuth2Client from google-auth-library.'
        );
      }
      this.auth = options.auth as OAuth2Client;
    } else {
      this.auth =
        (options.auth as GoogleAuth) ||
        new GoogleAuth(options as GoogleAuthOptions);
    }
    this.fallback = options.fallback !== 'rest' ? 'proto' : 'rest';
    this.grpcVersion = require('../../package.json').version;
  }

  /**
   * gRPC-fallback version of loadProto
   * Loads the protobuf root object from a JSON object created from a proto file
   * @param {Object} jsonObject - A JSON version of a protofile created usin protobuf.js
   * @returns {Object} Root namespace of proto JSON
   */
  loadProto(jsonObject: {}) {
    const rootObject = protobuf.Root.fromJSON(jsonObject);
    return rootObject;
  }

  loadProtoJSON(json: protobuf.INamespace, ignoreCache = false) {
    const hash = objectHash(json);
    const cached = GrpcClient.protoCache.get(hash);
    if (cached && !ignoreCache) {
      return cached;
    }
    const root = protobuf.Root.fromJSON(json);
    GrpcClient.protoCache.set(hash, root);
    return root;
  }

  private static getServiceMethods(service: protobuf.Service) {
    const methods: {[name: string]: protobuf.Method} = {};
    for (const [methodName, methodObject] of Object.entries(service.methods)) {
      const methodNameLowerCamelCase =
        methodName[0].toLowerCase() + methodName.substring(1);
      methods[methodNameLowerCamelCase] = methodObject;
    }

    return methods;
  }

  /**
   * gRPC-fallback version of constructSettings
   * A wrapper of {@link constructSettings} function under the gRPC context.
   *
   * Most of parameters are common among constructSettings, please take a look.
   * @param {string} serviceName - The fullly-qualified name of the service.
   * @param {Object} clientConfig - A dictionary of the client config.
   * @param {Object} configOverrides - A dictionary of overriding configs.
   * @param {Object} headers - A dictionary of additional HTTP header name to
   *   its value.
   * @return {Object} A mapping of method names to CallSettings.
   */
  constructSettings(
    serviceName: string,
    clientConfig: gax.ClientConfig,
    configOverrides: gax.ClientConfig,
    headers: OutgoingHttpHeaders
  ) {
    function buildMetadata(abTests: {}, moreHeaders: OutgoingHttpHeaders) {
      const metadata: OutgoingHttpHeaders = {};
      if (!headers) {
        headers = {};
      }
      // Since gRPC expects each header to be an array,
      // we are doing the same for fallback here.
      for (const key in headers) {
        metadata[key] = Array.isArray(headers[key])
          ? (headers[key] as string[])
          : ([headers[key]] as string[]);
      }

      // gRPC-fallback request must have 'grpc-web/' in 'x-goog-api-client'
      const clientVersions: string[] = [];
      if (
        metadata[CLIENT_VERSION_HEADER] &&
        (
          metadata[CLIENT_VERSION_HEADER] as Array<string | number | string[]>
        )[0]
      ) {
        clientVersions.push(
          ...(metadata[CLIENT_VERSION_HEADER] as string[])[0].split(' ')
        );
      }
      clientVersions.push(`grpc-web/${version}`);
      metadata[CLIENT_VERSION_HEADER] = [clientVersions.join(' ')];

      if (!moreHeaders) {
        return metadata;
      }
      for (const key in moreHeaders) {
        if (key.toLowerCase() !== CLIENT_VERSION_HEADER) {
          const value = moreHeaders[key];
          if (Array.isArray(value)) {
            if (metadata[key] === undefined) {
              metadata[key] = value;
            } else {
              if (Array.isArray(metadata[key])) {
                (
                  metadata[key]! as Array<
                    string | number | string[] | undefined
                  >
                ).push(...value);
              } else {
                throw new Error(
                  `Can not add value ${value} to the call metadata.`
                );
              }
            }
          } else {
            metadata[key] = [value] as string[];
          }
        }
      }
      return metadata;
    }
    return gax.constructSettings(
      serviceName,
      clientConfig,
      configOverrides,
      Status,
      {metadataBuilder: buildMetadata}
    );
  }

  /**
   * gRPC-fallback version of createStub
   * Creates a gRPC-fallback stub with authentication headers built from supplied OAuth2Client instance
   *
   * @param {function} CreateStub - The constructor function of the stub.
   * @param {Object} service - A protobufjs Service object (as returned by lookupService)
   * @param {Object} opts - Connection options, as described below.
   * @param {string} opts.servicePath - The hostname of the API endpoint service.
   * @param {number} opts.port - The port of the service.
   * @return {Promise} A promise which resolves to a gRPC-fallback service stub, which is a protobuf.js service stub instance modified to match the gRPC stub API
   */
  async createStub(service: protobuf.Service, opts: ClientStubOptions) {
    // an RPC function to be passed to protobufjs RPC API
    function serviceClientImpl(
      method:
        | protobuf.Method
        | protobuf.rpc.ServiceMethod<
            protobuf.Message<{}>,
            protobuf.Message<{}>
          >,
      requestData: Uint8Array,
      callback: protobuf.RPCImplCallback
    ) {
      return [requestData, callback];
    }

    // decoder for google.rpc.Status messages
    const statusDecoder = new FallbackErrorDecoder();

    if (!this.authClient) {
      if (this.auth && 'getClient' in this.auth) {
        this.authClient = await this.auth.getClient();
      } else if (this.auth && 'getRequestHeaders' in this.auth) {
        this.authClient = this.auth;
      }
    }
    if (!this.authClient) {
      throw new Error('No authentication was provided');
    }
    const authHeader = await this.authClient.getRequestHeaders();
    const serviceStub = service.create(
      serviceClientImpl,
      false,
      false
    ) as unknown as FallbackServiceStub;

    const methods = GrpcClient.getServiceMethods(service);

    // grpcCompatibleServiceStub methods accept four parameters:
    // request, options, metadata, and callback - similar to
    // the stub returned by grpc.ts
    const grpcCompatibleServiceStub = service.create(
      serviceClientImpl,
      false,
      false
    ) as unknown as FallbackServiceStub;
    for (const [methodName, methodObject] of Object.entries(methods)) {
      grpcCompatibleServiceStub[methodName] = (
        req: {},
        options: {[name: string]: string},
        metadata: {},
        callback: Function
      ) => {
        const [requestData, serviceCallback] = serviceStub[methodName].apply(
          serviceStub,
          [
            methodObject.resolvedRequestType!.fromObject(req),
            (err: Error | null, response: protobuf.Message<{}>) => {
              if (!err) {
                // converts a protobuf message instance to a plain JavaScript object
                // with enum and long conversion options specified
                const responseObject =
                  methodObject.resolvedResponseType!.toObject(response, {
                    enums: String,
                    longs: String,
                  });
                callback(null, responseObject);
              } else {
                callback(err);
              }
            },
          ]
        );
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let cancelController: AbortController, cancelSignal: any;
        if (isBrowser() || typeof AbortController !== 'undefined') {
          // eslint-disable-next-line no-undef
          cancelController = new AbortController();
        } else {
          cancelController = new NodeAbortController();
        }
        if (cancelController) {
          cancelSignal = cancelController.signal;
        }
        let cancelRequested = false;

        const headers = Object.assign({}, authHeader);
        for (const key of Object.keys(options)) {
          headers[key] = options[key][0];
        }

        const grpcFallbackProtocol = opts.protocol || 'https';
        let servicePath = opts.servicePath;
        if (
          !servicePath &&
          service.options &&
          service.options['(google.api.default_host)']
        ) {
          servicePath = service.options['(google.api.default_host)'];
        }
        if (!servicePath) {
          serviceCallback(new Error('Service path is undefined'));
          return;
        }

        let servicePort;
        const match = servicePath!.match(/^(.*):(\d+)$/);
        if (match) {
          servicePath = match[1];
          servicePort = match[2];
        }
        if (opts.port) {
          servicePort = opts.port;
        } else if (!servicePort) {
          servicePort = 443;
        }

        const protoNamespaces: string[] = [];
        let currNamespace = methodObject.parent!;
        while (currNamespace.name !== '') {
          protoNamespaces.unshift(currNamespace.name);
          currNamespace = currNamespace.parent!;
        }
        const protoServiceName = protoNamespaces.join('.');
        const rpcName = methodObject.name;

        let url: string;
        let data: string;
        let httpMethod: string;

        // TODO(@alexander-fenster): refactor this into separate function that prepares
        // request object for `fetch`.
        if (this.fallback === 'rest') {
          // REGAPIC: JSON over HTTP/1 with gRPC trancoding
          headers['Content-Type'] = 'application/json';
          const decodedRequest =
            methodObject.resolvedRequestType!.decode(requestData);
          const requestJSON = methodObject.resolvedRequestType!.toObject(
            // TODO: use toJSON instead of toObject
            decodedRequest,
            {
              enums: String,
              longs: String,
            }
          );
          const transcoded = transcode(
            requestJSON,
            methodObject.parsedOptions,
            methodObject.resolvedRequestType!.fields
          );
          if (!transcoded) {
            throw new Error(
              `Cannot build HTTP request for ${JSON.stringify(
                requestJSON
              )}, method: ${methodObject.name}`
            );
          }
          httpMethod = transcoded.httpMethod;
          data = JSON.stringify(transcoded.data);
          url = `${grpcFallbackProtocol}://${servicePath}:${servicePort}/${transcoded.url.replace(
            /^\//,
            ''
          )}?${transcoded.queryString}`;
        } else {
          // gRPC-fallback: proto over HTTP/1
          headers['Content-Type'] = 'application/x-protobuf';
          httpMethod = 'post';
          data = requestData;
          url = `${grpcFallbackProtocol}://${servicePath}:${servicePort}/$rpc/${protoServiceName}/${rpcName}`;
        }

        const fetch = isBrowser()
          ? // eslint-disable-next-line no-undef
            window.fetch
          : (nodeFetch as unknown as NodeFetchType);
        const fetchRequest = {
          headers,
          body: data as string | undefined,
          method: httpMethod,
          signal: cancelSignal,
        };
        if (
          httpMethod === 'get' ||
          httpMethod === 'delete' ||
          httpMethod === 'head'
        ) {
          delete fetchRequest['body'];
        }
        fetch(url, fetchRequest)
          .then((response: Response | NodeFetchResponse) => {
            return Promise.all([
              Promise.resolve(response.ok),
              response.arrayBuffer(),
            ]);
          })
          .then(([ok, buffer]: [boolean, Buffer | ArrayBuffer]) => {
            // TODO(@alexander-fenster): response processing to be moved
            // to a separate function.
            if (this.fallback === 'rest') {
              // REGAPIC: JSON over HTTP/1
              // eslint-disable-next-line node/no-unsupported-features/node-builtins
              const decodedString = new TextDecoder().decode(buffer);
              const response = JSON.parse(decodedString);
              if (!ok) {
                const error = Object.assign(
                  new Error(response['error']['message']),
                  response.error
                );
                throw error;
              }
              const message =
                methodObject.resolvedResponseType!.fromObject(response);
              const encoded = methodObject
                .resolvedResponseType!.encode(message)
                .finish();
              serviceCallback(null, encoded);
            } else {
              // gRPC-fallback: proto over HTTP/1
              if (!ok) {
                const error = statusDecoder.decodeErrorFromBuffer(buffer);
                throw error;
              }
              serviceCallback(null, new Uint8Array(buffer));
            }
          })
          .catch((err: Error) => {
            if (!cancelRequested || err.name !== 'AbortError') {
              serviceCallback(err);
            }
          });

        return {
          cancel: () => {
            if (!cancelController) {
              console.warn(
                'AbortController not found: Cancellation is not supported in this environment'
              );
              return;
            }
            cancelRequested = true;
            cancelController.abort();
          },
        };
      };
    }
    return grpcCompatibleServiceStub;
  }
}

/**
 * gRPC-fallback version of lro
 *
 * @param {Object=} options.auth - An instance of google-auth-library.
 * @return {Object} A OperationsClientBuilder that will return a OperationsClient
 */
export function lro(options: GrpcClientOptions) {
  options = Object.assign({scopes: []}, options);
  const gaxGrpc = new GrpcClient(options);
  return new OperationsClientBuilder(gaxGrpc);
}

/**
 * gRPC-fallback version of createApiCall
 *
 * Converts an rpc call into an API call governed by the settings.
 *
 * In typical usage, `func` will be a promise to a callable used to make an rpc
 * request. This will mostly likely be a bound method from a request stub used
 * to make an rpc call. It is not a direct function but a Promise instance,
 * because of its asynchronism (typically, obtaining the auth information).
 *
 * The result is a function which manages the API call with the given settings
 * and the options on the invocation.
 *
 * Throws exception on unsupported streaming calls
 *
 * @param {Promise<GRPCCall>|GRPCCall} func - is either a promise to be used to make
 *   a bare RPC call, or just a bare RPC call.
 * @param {CallSettings} settings - provides the settings for this call
 * @param {Descriptor} descriptor - optionally specify the descriptor for
 *   the method call.
 * @return {GaxCall} func - a bound method on a request stub used
 *   to make an rpc call.
 */
export function createApiCall(
  func: Promise<GRPCCall> | GRPCCall,
  settings: gax.CallSettings,
  descriptor?: Descriptor
): GaxCall {
  if (descriptor && 'streaming' in descriptor) {
    return () => {
      throw new Error(
        'The gRPC-fallback client library (e.g. browser version of the library) currently does not support streaming calls.'
      );
    };
  }
  return _createApiCall(func, settings, descriptor);
}

export {protobuf};
export * as protobufMinimal from 'protobufjs/minimal';

// Different environments or bundlers may or may not respect "browser" field
// in package.json (e.g. Electron does not respect it, but if you run the code
// through webpack first, it will follow the "browser" field).
// To make it safer and more compatible, let's make sure that if you do
// const gax = require("google-gax");
// you can always ask for gax.fallback, regardless of "browser" field being
// understood or not.
const fallback = module.exports;
export {fallback};
