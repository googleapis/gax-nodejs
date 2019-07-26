/**
 * Copyright 2019 Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
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

import * as protobuf from 'protobufjs';
import * as gax from './gax';
import {Status} from './status';
import {OutgoingHttpHeaders} from 'http';
import {GoogleAuth} from 'google-auth-library';
import {OperationsClientBuilder} from './operationsClientBrowser';
import {GrpcClientOptions, ClientStubOptions} from './grpc';
import {GaxCall, GRPCCall} from './apitypes';
import {Descriptor} from './descriptor';
import {createApiCall as _createApiCall} from './createApiCall';

export {PathTemplate} from './pathTemplate';
export {CallSettings, constructSettings, RetryOptions} from './gax';

export {
  BundleDescriptor,
  LongrunningDescriptor,
  PageDescriptor,
  StreamDescriptor,
} from './descriptor';

export {StreamType} from './streamingCalls/streaming';

interface CancelHandler {
  canceller: AbortController;
  cancelRequested: boolean;
}

export class GrpcClient {
  auth: GoogleAuth;
  promise?: PromiseConstructor;

  /**
   * Browser version of GrpcClient
   * Implements GrpcClient API for a browser using grpc-fallback protocol (sends serialized protobuf to HTTP/1 $rpc endpoint).
   *
   * @param {Object=} options.auth - An instance of google-auth-library.
   * @param {Function=} options.promise - A constructor for a promise that
   * implements the ES6 specification of promise.
   * @constructor
   */

  constructor(options: GrpcClientOptions = {}) {
    if (!options.auth) {
      throw new Error(
        'You need to pass auth instance to gRPC-fallback client. Use OAuth2Client from google-auth-library.'
      );
    }
    this.auth = options.auth;
    this.promise = 'promise' in options ? options.promise! : Promise;
  }

  /**
   * Browser version of loadProto
   * Loads the protobuf root object from a JSON object created from a proto file
   * @param {Object} jsonObject - A JSON version of a protofile created usin protobuf.js
   * @returns {Object} Root namespace of proto JSON
   */
  loadProto(jsonObject) {
    const rootObject = protobuf.Root.fromJSON(jsonObject);
    return rootObject;
  }

  private getServiceMethods(service: protobuf.Service) {
    const methods = Object.keys(service.methods);

    const methodsLowerCamelCase = methods.map(method => {
      return method[0].toLowerCase() + method.substring(1);
    });

    return methodsLowerCamelCase;
  }

  /**
   * Browser version of constructSettings
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
    return gax.constructSettings(
      serviceName,
      clientConfig,
      configOverrides,
      Status,
      this.promise
    );
  }

  /**
   * Browser version of createStub
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
    const authHeader = await this.auth.getRequestHeaders();
    function serviceClientImpl(method, requestData, callback) {
      let cancelController, cancelSignal;
      if (typeof AbortController !== 'undefined') {
        cancelController = new AbortController();
        cancelSignal = cancelController.signal;
      }
      const cancelHandler: CancelHandler = {
        canceller: cancelController,
        cancelRequested: false,
      };
      const headers = Object.assign({}, authHeader);
      headers['Content-Type'] = 'application/x-protobuf';

      const grpcFallbackProtocol = opts.protocol || 'https';
      let servicePath = opts.servicePath;
      if (!servicePath) {
        if (service.options && service.options['(google.api.default_host)']) {
          servicePath = service.options['(google.api.default_host)'];
        } else {
          callback(new Error('Service path is undefined'));
          return;
        }
      }
      let servicePort;
      const match = servicePath.match(/^(.*):(\d+)$/);
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
      let currNamespace = method.parent;
      while (currNamespace.name !== '') {
        protoNamespaces.unshift(currNamespace.name);
        currNamespace = currNamespace.parent;
      }
      const protoServiceName = protoNamespaces.join('.');
      const rpcName = method.name;

      const url = `${grpcFallbackProtocol}://${servicePath}:${servicePort}/$rpc/${protoServiceName}/${rpcName}`;

      fetch(url, {
        headers,
        method: 'post',
        body: requestData,
        signal: cancelSignal,
      })
        .then(response => {
          return response.arrayBuffer();
        })
        .then(buffer => {
          callback(null, new Uint8Array(buffer));
        })
        .catch(err => {
          if (!cancelHandler.cancelRequested || err.name !== 'AbortError') {
            callback(err);
          }
        });
      return cancelHandler;
    }

    const serviceStub = service.create(serviceClientImpl, false, false);
    const methods = this.getServiceMethods(service);

    const newServiceStub = service.create(serviceClientImpl, false, false);
    for (const methodName of methods) {
      newServiceStub[methodName] = (req, options, metadata, callback) => {
        const cancelHandler = serviceStub[methodName].apply(serviceStub, [
          req,
          callback,
        ]) as CancelHandler;
        return {
          cancel: () => {
            if (!cancelHandler.canceller) {
              console.warn(
                'AbortController not found: Cancellation is not supported in this environment'
              );
              return;
            }
            cancelHandler.cancelRequested = true;
            cancelHandler.canceller.abort();
          },
        };
      };
    }
    return newServiceStub;
  }
}

/**
 * Browser version of lro
 *
 * @param {Object=} options.auth - An instance of google-auth-library.
 * @param {Function=} options.promise - A constructor for a promise that
 * implements the ES6 specification of promise.
 * @return {Object} A OperationsClientBuilder that will return a OperationsClient
 */
export function lro(options: GrpcClientOptions) {
  options = Object.assign({scopes: []}, options);
  const gaxGrpc = new GrpcClient(options);
  return new OperationsClientBuilder(gaxGrpc);
}

/**
 * Browser version of createApiCall
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
