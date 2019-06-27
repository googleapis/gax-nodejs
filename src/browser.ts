import * as protobuf from 'protobufjs';
import * as gax from './gax';
import {Status} from './status';
import {OutgoingHttpHeaders} from 'http';
import {GoogleAuth} from 'google-auth-library';

export {createApiCall} from './createApiCall';

export interface ClientStubOptions {
    servicePath: string;
    port: number;
    // TODO: use sslCreds?: grpc.ChannelCredentials;
    // tslint:disable-next-line no-any
    sslCreds?: any;
};


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
        const methodsCorrectCase : string[] = [];
        for (const methodName of methods) {
            methodsCorrectCase.push(methodName.substring(0,1).toLowerCase() + methodName.substring(1));
        }

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
 
                 // method.parent.options['(google.api.default_host)'] gives us the api.googleapis.com part of the url
                 // method.parent.parent.options.java_package.substring(4) gives is google.cloud.api.v1 part of the url
                 // method.parent.name gives us the service and method.name gives us the method being used
                 const url =
                 'https://' + method.parent.options['(google.api.default_host)'] + '/$rpc/' +
                 method.parent.parent.options.java_package.substring(4) + '.' + method.parent.name + '/' + method.name;
     
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

