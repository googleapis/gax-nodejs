"use strict";
// Copyright 2020 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//
// ** This file is automatically generated by gapic-generator-typescript. **
// ** https://github.com/googleapis/gapic-generator-typescript **
// ** All changes to this file may be overwritten. **
Object.defineProperty(exports, "__esModule", { value: true });
exports.IamClient = void 0;
const createApiCall_1 = require("./createApiCall");
const routingHeader = require("./routingHeader");
const gapicConfig = require("./iam_policy_service_client_config.json");
const fallback = require("./fallback");
let version = require('../../package.json').version;
const jsonProtos = require("../protos/iam_service.json");
/**
 *  Google Cloud IAM Client.
 *  This is manually written for providing methods [setIamPolicy, getIamPolicy, testIamPerssion] to the generated client.
 */
class IamClient {
    constructor(gaxGrpc, 
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    options) {
        this._terminated = false;
        this.descriptors = { page: {}, stream: {}, longrunning: {} };
        this.innerApiCalls = {};
        this.gaxGrpc = gaxGrpc;
        // Ensure that options include the service address and port.
        const opts = Object.assign({
            servicePath: options.servicePath,
            port: options.port,
            clientConfig: options.clientConfig,
            apiEndpoint: options.apiEndpoint,
            fallback: options.fallback,
        }, options);
        version = opts.fallback ? fallback.version : version;
        opts.scopes = this.constructor.scopes;
        // Save options to use in initialize() method.
        this._opts = opts;
        // Save the auth object to the client, for use by other methods.
        this.auth = gaxGrpc.auth;
        // Determine the client header string.
        const clientHeader = [`gax/${version}`, `gapic/${version}`];
        if (typeof process !== 'undefined' && 'versions' in process) {
            clientHeader.push(`gl-node/${process.versions.node}`);
        }
        else {
            clientHeader.push(`gl-web/${version}`);
        }
        if (!opts.fallback) {
            clientHeader.push(`grpc/${gaxGrpc.grpcVersion}`);
        }
        if (opts.libName && opts.libVersion) {
            clientHeader.push(`${opts.libName}/${opts.libVersion}`);
        }
        // Load the applicable protos.
        this._protos = this.gaxGrpc.loadProtoJSON(jsonProtos);
        // Put together the default options sent with requests.
        this._defaults = gaxGrpc.constructSettings('google.iam.v1.IAMPolicy', gapicConfig, opts.clientConfig || {}, { 'x-goog-api-client': clientHeader.join(' ') });
        this.innerApiCalls = {};
    }
    /**
     * Initialize the client.
     * Performs asynchronous operations (such as authentication) and prepares the client.
     * This function will be called automatically when any class method is called for the
     * first time, but if you need to initialize it before calling an actual method,
     * feel free to call initialize() directly.
     *
     * You can await on this method if you want to make sure the client is initialized.
     *
     * @returns {Promise} A promise that resolves to an authenticated service stub.
     */
    initialize() {
        // If the client stub promise is already initialized, return immediately.
        if (this.iamPolicyStub) {
            return this.iamPolicyStub;
        }
        // Put together the "service stub" for
        // google.iam.v1.IAMPolicy.
        this.iamPolicyStub = this.gaxGrpc.createStub(this._opts.fallback
            ? this._protos.lookupService('google.iam.v1.IAMPolicy')
            : this._protos.google.iam.v1.IAMPolicy, this._opts);
        // Iterate over each of the methods that the service provides
        // and create an API call method for each.
        const iamPolicyStubMethods = [
            'getIamPolicy',
            'setIamPolicy',
            'testIamPermissions',
        ];
        for (const methodName of iamPolicyStubMethods) {
            const innerCallPromise = this.iamPolicyStub.then(stub => (...args) => {
                if (this._terminated) {
                    return Promise.reject('The client has already been closed.');
                }
                const func = stub[methodName];
                return func.apply(stub, args);
            }, (err) => () => {
                throw err;
            });
            this.innerApiCalls[methodName] = (0, createApiCall_1.createApiCall)(innerCallPromise, this._defaults[methodName], this.descriptors.page[methodName]);
        }
        return this.iamPolicyStub;
    }
    /**
     * The DNS address for this API service.
     */
    static get servicePath() {
        return 'cloudkms.googleapis.com';
    }
    /**
     * The DNS address for this API service - same as servicePath(),
     * exists for compatibility reasons.
     */
    static get apiEndpoint() {
        return 'cloudkms.googleapis.com';
    }
    /**
     * The port for this API service.
     */
    static get port() {
        return 443;
    }
    /**
     * The scopes needed to make gRPC calls for every method defined
     * in this service.
     */
    static get scopes() {
        return [
            'https://www.googleapis.com/auth/cloud-platform',
            'https://www.googleapis.com/auth/cloudkms',
        ];
    }
    getProjectId(callback) {
        if (this.auth && 'getProjectId' in this.auth) {
            return this.auth.getProjectId(callback);
        }
        if (callback) {
            callback(new Error('Cannot determine project ID.'));
        }
        else {
            return Promise.reject('Cannot determine project ID.');
        }
    }
    getIamPolicy(request, optionsOrCallback, callback) {
        let options;
        if (optionsOrCallback instanceof Function && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        request = request || {};
        options = options || {};
        options.otherArgs = options.otherArgs || {};
        options.otherArgs.headers = options.otherArgs.headers || {};
        options.otherArgs.headers['x-goog-request-params'] =
            routingHeader.fromParams({
                resource: request.resource,
            });
        this.initialize();
        return this.innerApiCalls.getIamPolicy(request, options, callback);
    }
    setIamPolicy(request, optionsOrCallback, callback) {
        let options;
        if (optionsOrCallback instanceof Function && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        request = request || {};
        options = options || {};
        options.otherArgs = options.otherArgs || {};
        options.otherArgs.headers = options.otherArgs.headers || {};
        options.otherArgs.headers['x-goog-request-params'] =
            routingHeader.fromParams({
                resource: request.resource,
            });
        this.initialize();
        return this.innerApiCalls.setIamPolicy(request, options, callback);
    }
    testIamPermissions(request, optionsOrCallback, callback) {
        let options;
        if (optionsOrCallback instanceof Function && callback === undefined) {
            callback = optionsOrCallback;
            options = {};
        }
        else {
            options = optionsOrCallback;
        }
        request = request || {};
        options = options || {};
        options.otherArgs = options.otherArgs || {};
        options.otherArgs.headers = options.otherArgs.headers || {};
        options.otherArgs.headers['x-goog-request-params'] =
            routingHeader.fromParams({
                resource: request.resource,
            });
        this.initialize();
        return this.innerApiCalls.testIamPermissions(request, options, callback);
    }
    /**
     * Terminate the GRPC channel and close the client.
     *
     * The client will no longer be usable and all future behavior is undefined.
     */
    close() {
        this.initialize();
        if (!this._terminated) {
            return this.iamPolicyStub.then(stub => {
                this._terminated = true;
                stub.close();
            });
        }
        return Promise.resolve();
    }
}
exports.IamClient = IamClient;
//# sourceMappingURL=iamService.js.map