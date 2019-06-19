import { Gaxios } from "gaxios";
import * as protobuf from 'protobufjs';
import * as gax from './gax';
import {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';

export {
    CallSettings,
    constructSettings,
    RetryOptions
  } from './gax';

export {createApiCall} from './createApiCall';

export interface ClientStubOptions {
    servicePath: string;
    port: number;
    // TODO: use sslCreds?: grpc.ChannelCredentials;
    // tslint:disable-next-line no-any
    sslCreds?: any;
}

export class GrpcClient {
    auth: GoogleAuth;

    constructor(opts) {
        this.auth = opts.auth;
    }
    loadProto() {}
    constructSettings(
        service: protobuf.Service,
    ) {
        // Defining settings to be applied to all methods of service
        const settings = new gax.CallSettings();
        settings.timeout = 5000;
        const retryCodes = [42];
        const backoffSettings = {
            initialRetryDelayMillis: 5000,
            maxRetries: 4,
            retryDelayMultiplier: 2,
            maxRetryDelayMillis: 10000,
        };
        settings.retry = new gax.RetryOptions(retryCodes, backoffSettings);

        var defaults = {};

        const methods = Object.keys(service.methods);
        // Creating an array of all methods within the stub with correct case (i.e, first letter is lower-case)
        const methodsCorrectCase : string[] = [];
    
        for (const methodName of methods) {
          methodsCorrectCase.push(methodName.substring(0,1).toLowerCase() + methodName.substring(1));
        }

        // Setting the default settings of all methods in the service
        for (const methodName of methodsCorrectCase) {
            defaults[methodName] = settings;
        }

        return defaults;

    }
    async createStub(
        service: protobuf.Service,
        opts: ClientStubOptions) {

            console.log('Just to check this is what is being used (changed credentials)');
            async function serviceClientImpl(method, requestData, callback) {

                 let headers = {};
                 // Currently hard-coding the authorization token
                 headers['Authorization'] = 'Bearer ya29.c.ElosB-CeqkVquc1FyYJkCQ7vs5X7aYV1T6TCAow_lMR_zUZw12cN33KCmgySK7gBdSgF1rwsaBxUtyXRCnuC6_MhXyoSvNY4OQaNLI2L0gSEOv6szZTeqr31vRc';
                 headers['Content-Type'] = 'application/x-protobuf';
                 headers['User-Agent'] = 'testapp/1.0';

                 // url we want: https://language.googleapis.com/$rpc/google.cloud.language.v1.LanguageService/AnalyzeSentiment (or whichever method we're calling)
                 
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
                //    const body = await fetchResult.buffer();
                //    console.log(body.toString());
                   callback(new Error(fetchResult.statusText));
                   return;
                 }
                 const responseArrayBuffer = await fetchResult.arrayBuffer();
                 
           //      const response = responseType.decode(Buffer.from(responseArrayBuffer));
                 // console.log(responseArrayBuffer);
           
                 callback(null, new Uint8Array(responseArrayBuffer));
           }

           const languageServiceStub = service.create(serviceClientImpl, false, false);
           const methods = Object.keys(service.methods);

           // Creating an array of all methods within the stub with correct case (i.e, first letter is lower-case)
           const methodsCorrectCase : string[] = [];
       
           for (const methodName of methods) {
             methodsCorrectCase.push(methodName.substring(0,1).toLowerCase() + methodName.substring(1));
           }

           const newLanguageServiceStub = {};
           for (const methodName of methodsCorrectCase) {
             newLanguageServiceStub[methodName] = (req, options, metadata, callback) => {
               languageServiceStub[methodName].apply(languageServiceStub, [req, callback]);
             };
           }

           return newLanguageServiceStub;
    }
};

