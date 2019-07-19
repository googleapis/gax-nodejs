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

export {CallSettings, constructSettings, RetryOptions} from './gax';

export {
  BundleDescriptor,
  LongrunningDescriptor,
  PageDescriptor,
  StreamDescriptor,
} from './descriptor';

export {StreamType} from './streamingCalls/streaming';

export const ALL_SCOPES: string[] = [];
lro.ALL_SCOPES = ALL_SCOPES;

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

    // Creating an array of all methods within the stub with correct case (i.e, first letter is lower-case)
    const methodsCorrectCase = methods.map(method => {
      return method[0].toLowerCase() + method.substring(1);
    });

    return methodsCorrectCase;
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
    async function serviceClientImpl(method, requestData, callback) {
      const headers = Object.assign({}, authHeader);
      headers['Content-Type'] = 'application/x-protobuf';
      headers['User-Agent'] = 'testapp/1.0';

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
      const servicePort = opts.port || 443;
      const serviceNameArray: string[] = [];
      let currServicePart = method.parent;
      while (currServicePart.name !== '') {
        serviceNameArray.unshift(currServicePart.name);
        currServicePart = currServicePart.parent;
      }
      const serviceName = serviceNameArray.join('.');
      const rpcName = method.name;

      const url = `${grpcFallbackProtocol}://${servicePath}:${servicePort}/$rpc/${serviceName}/${rpcName}`;

      const fetchResult = await fetch(url, {
        headers,
        method: 'post',
        body: requestData,
      });

      if (!fetchResult.ok) {
        callback(new Error(fetchResult.statusText));
        return;
      }
      const responseArrayBuffer = await fetchResult.arrayBuffer();
      callback(null, new Uint8Array(responseArrayBuffer));
    }

    const languageServiceStub = service.create(serviceClientImpl, false, false);

    const methods = this.getServiceMethods(service);

    const newLanguageServiceStub = service.create(
      serviceClientImpl,
      false,
      false
    );
    for (const methodName of methods) {
      newLanguageServiceStub[methodName] = (
        req,
        options,
        metadata,
        callback
      ) => {
        languageServiceStub[methodName].apply(languageServiceStub, [
          req,
          callback,
        ]);
      };
    }

    return newLanguageServiceStub;
  }
}

export function lro(options) {
  options = Object.assign({scopes: lro.ALL_SCOPES}, options);
  const gaxGrpc = new GrpcClient(options);
  return new OperationsClientBuilder(gaxGrpc);
}

// Wrapper function to throw exceptions on unsupported streaming calls
export function createApiCall(
  func: Promise<GRPCCall> | GRPCCall,
  settings: gax.CallSettings,
  descriptor?: Descriptor
): GaxCall {
  if (
    typeof descriptor !== 'undefined' &&
    descriptor.constructor.name === 'StreamDescriptor'
  ) {
    return () => {
      throw new Error(
        'The gRPC-fallback client library (e.g. browser version of the library) currently does not support streaming calls.'
      );
    };
  }
  return _createApiCall(func, settings, descriptor);
}
