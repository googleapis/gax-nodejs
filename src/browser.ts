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

  constructor(options: GrpcClientOptions = {}) {
    if (!options.auth) {
      throw new Error(
        'You need to pass auth instance to gRPC-fallback client. Use OAuth2Client from google-auth-library.'
      );
    }
    this.auth = options.auth;
    this.promise = 'promise' in options ? options.promise! : Promise;
  }

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

export function lro(options) {
  options = Object.assign({scopes: []}, options);
  const gaxGrpc = new GrpcClient(options);
  return new OperationsClientBuilder(gaxGrpc);
}

// Wrapper function to throw exceptions on unsupported streaming calls
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

import * as protobuf from 'protobufjs';
export {protobuf};
