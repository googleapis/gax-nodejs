import * as protobuf from 'protobufjs';
import * as gax from './gax';
import {Status} from './status';
import {OutgoingHttpHeaders} from 'http';
import {GoogleAuth} from 'google-auth-library';
import {OperationsClientBuilder} from './operationsClientBrowser'
import {ClientStubOptions} from './grpc';

export {createApiCall} from './createApiCall';

export {
  BundleDescriptor,
  LongrunningDescriptor,
  PageDescriptor,
  StreamDescriptor,
} from './descriptor';

export const ALL_SCOPES: string[] = [];


export class GrpcClient {
    auth: GoogleAuth;
    promise?: PromiseConstructor;

    constructor(opts, settings?: any) {
        settings = settings || {};
        this.auth = opts.auth;
        this.promise = 'promise' in settings ? settings.promise! : Promise;
    }

    loadProto(jsonObject) {
        const rootObject = protobuf.Root.fromJSON(jsonObject);
        return rootObject;
    }

    private getServiceMethods(
        service: protobuf.Service
    ) {
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

    async createStub(
        service: protobuf.Service,
        opts: ClientStubOptions) {
            const authHeader = await this.auth.getRequestHeaders();
            async function serviceClientImpl(method, requestData, callback) {

                 let headers = Object.assign({}, authHeader);
                 headers['Content-Type'] = 'application/x-protobuf';
                 headers['User-Agent'] = 'testapp/1.0';

                 const servicePath = opts.servicePath || method.parent.options['(google.api.default_host)'];
                 const servicePort = opts.port || 443;
                 const serviceName = method.parent.parent.options.java_package.substring(4);
                 const rpcNamespace = method.parent.name;
                 const rpcName = method.name;
                 
                 const url = `https://${servicePath}:${servicePort}/$rpc/${serviceName}.${rpcNamespace}/${rpcName}`;

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

           const newLanguageServiceStub = service.create(serviceClientImpl, false, false);
           for (const methodName of methods) {
             newLanguageServiceStub[methodName] = (req, options, metadata, callback) => {
               languageServiceStub[methodName].apply(languageServiceStub, [req, callback]);
             };
           }

           return newLanguageServiceStub;
    }
};

lro.ALL_SCOPES = ALL_SCOPES;

export function lro(options) {
    options = Object.assign({scopes: lro.ALL_SCOPES}, options);
    const gaxGrpc = new GrpcClient(options);
    return new OperationsClientBuilder(gaxGrpc);
}
