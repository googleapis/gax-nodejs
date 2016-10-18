/*
 * Copyright 2016 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 * EDITING INSTRUCTIONS
 * This file was generated from the file
 * https://github.com/googleapis/googleapis/blob/master/google/longrunning/operations.proto,
 * and updates to that file get reflected here through a refresh process.
 * For the short term, the refresh process will only be runnable by Google
 * engineers.
 *
 * The only allowed edits are to method and file documentation. A 3-way
 * merge preserves those additions if the generated source changes.
 */
/* TODO: introduce line-wrapping so that it never exceeds the limit. */
/* jscs: disable maximumLineLength */
'use strict';

var configData = require('./operations_client_config');
var extend = require('extend');
var gax = require('./gax');
extend(gax, require('./api_callable'));
extend(gax, require('./path_template'));
gax.version = require('../package').version;

var SERVICE_ADDRESS = 'longrunning.googleapis.com';

var DEFAULT_SERVICE_PORT = 443;

var CODE_GEN_NAME_VERSION = 'gapic/0.1.0';


var PAGE_DESCRIPTORS = {
  listOperations: new gax.PageDescriptor(
      'pageToken',
      'nextPageToken',
      'operations')
};

/**
 * The scopes needed to make gRPC calls to all of the methods defined in
 * this service.
 */
var ALL_SCOPES = [
];

/**
 * Manages long-running operations with an API service.
 *
 * When an API method normally takes long time to complete, it can be designed
 * to return {@link Operation} to the client, and the client can use this
 * interface to receive the real response asynchronously by polling the
 * operation resource, or pass the operation resource to another API (such as
 * Google Cloud Pub/Sub API) to receive the response.  Any API service that
 * returns long-running operations should implement the `Operations` interface
 * so developers can have a consistent client experience.
 *
 * This will be created through a builder function which can be obtained by the module.
 * See the following example of how to initialize the module and how to access to the builder.
 * @see {@link operationsApi}
 *
 * @example
 * var googleLongrunning = require('google-gax').lro({
 *   // optional auth parameters.
 * });
 * var api = googleLongrunning.operationsApi();
 *
 * @class
 */
function OperationsApi(gaxGrpc, grpcClients, opts) {
  opts = opts || {};
  var servicePath = opts.servicePath || SERVICE_ADDRESS;
  var port = opts.port || DEFAULT_SERVICE_PORT;
  var sslCreds = opts.sslCreds || null;
  var clientConfig = opts.clientConfig || {};
  var appName = opts.appName || 'gax';
  var appVersion = opts.appVersion || gax.version;

  var googleApiClient = [
    appName + '/' + appVersion,
    CODE_GEN_NAME_VERSION,
    'gax/' + gax.version,
    'nodejs/' + process.version].join(' ');

  var defaults = gaxGrpc.constructSettings(
      'google.longrunning.Operations',
      configData,
      clientConfig,
      PAGE_DESCRIPTORS,
      null,
      {'x-goog-api-client': googleApiClient});

  var operationsStub = gaxGrpc.createStub(
      servicePath,
      port,
      grpcClients.operationsClient.google.longrunning.Operations,
      {sslCreds: sslCreds});
  var operationsStubMethods = [
    'getOperation',
    'listOperations',
    'cancelOperation',
    'deleteOperation'
  ];
  operationsStubMethods.forEach(function(methodName) {
    this['_' + methodName] = gax.createApiCall(
      operationsStub.then(function(operationsStub) {
        return operationsStub[methodName].bind(operationsStub);
      }),
      defaults[methodName]);
  }.bind(this));
}

// Path templates

var OPERATION_PATH_PATH_TEMPLATE = new gax.PathTemplate(
    'operations/{operation_path=**}');

/**
 * Returns a fully-qualified operation_path resource name string.
 * @param {String} operation_path
 * @returns {String}
 */
OperationsApi.prototype.operationPathPath = function(operationPath) {
  return OPERATION_PATH_PATH_TEMPLATE.render({
    operation_path: operationPath
  });
};

/**
 * Parses the operationPathName from a operation_path resource.
 * @param {String} operationPathName
 *   A fully-qualified path representing a operation_path resources.
 * @returns {String} - A string representing the operation_path.
 */
OperationsApi.prototype.matchOperationPathFromOperationPathName = function(operationPathName) {
  return OPERATION_PATH_PATH_TEMPLATE.match(operationPathName).operation_path;
};

// Service calls

/**
 * Gets the latest state of a long-running operation.  Clients can use this
 * method to poll the operation result at intervals as recommended by the API
 * service.
 *
 * @param {Object} request
 *   The request object that will be sent.
 * @param {string} request.name
 *   The name of the operation resource.
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error, ?Object)=} callback
 *   The function which will be called with the result of the API call.
 *
 *   The second parameter to the callback is an object representing [google.longrunning.Operation]{@link external:"google.longrunning.Operation"}
 * @returns {Promise} - The promise which resolves to the response object.
 *   The promise has a method named "cancel" which cancels the ongoing API call.
 *
 * @example
 *
 * var api = googleLongrunning.operationsApi();
 * var formattedName = api.operationPathPath("[OPERATION_PATH]");
 * api.getOperation({name: formattedName}).then(function(response) {
 *     // doThingsWith(response)
 * }).catch(function(err) {
 *     console.error(err);
 * });
 */
OperationsApi.prototype.getOperation = function(request, options, callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  if (options === undefined) {
    options = {};
  }
  return this._getOperation(request, options, callback);
};

/**
 * Lists operations that match the specified filter in the request. If the
 * server doesn't support this method, it returns `UNIMPLEMENTED`.
 *
 * @param {Object} request
 *   The request object that will be sent.
 * @param {string} request.name
 *   The name of the operation collection.
 * @param {string} request.filter
 *   The standard list filter.
 * @param {number=} request.pageSize
 *   The maximum number of resources contained in the underlying API
 *   response. If page streaming is performed per-resource, this
 *   parameter does not affect the return value. If page streaming is
 *   performed per-page, this determines the maximum number of
 *   resources in a page.
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error, ?Object, ?string)=} callback
 *   When specified, the results are not streamed but this callback
 *   will be called with the response object representing [google.longrunning.ListOperationsResponse]{@link external:"google.longrunning.ListOperationsResponse"}.
 *   The third item will be set if the response contains the token for the further results
 *   and can be reused to `pageToken` field in the options in the next request.
 * @returns {Stream|Promise}
 *   An object stream which emits an object representing
 *   [google.longrunning.Operation]{@link external:"google.longrunning.Operation"} on 'data' event.
 *   When the callback is specified or streaming is suppressed through options,
 *   it will return a promise that resolves to the response object. The promise
 *   has a method named "cancel" which cancels the ongoing API call.
 *
 * @example
 *
 * var api = googleLongrunning.operationsApi();
 * var name = '';
 * var filter = '';
 * var request = {
 *     name: name,
 *     filter: filter
 * };
 * // Iterate over all elements.
 * api.listOperations(request).on('data', function(element) {
 *     // doThingsWith(element)
 * });
 *
 * // Or obtain the paged response through the callback.
 * function callback(err, response, nextPageToken) {
 *     if (err) {
 *         console.error(err);
 *         return;
 *     }
 *     // doThingsWith(response)
 *     if (nextPageToken) {
 *         // fetch the next page.
 *         api.listOperations(request, {pageToken: nextPageToken}, callback);
 *     }
 * }
 * api.listOperations(request, {flattenPages: false}, callback);
 */
OperationsApi.prototype.listOperations = function(request, options, callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  if (options === undefined) {
    options = {};
  }
  return this._listOperations(request, options, callback);
};

/**
 * Starts asynchronous cancellation on a long-running operation.  The server
 * makes a best effort to cancel the operation, but success is not
 * guaranteed.  If the server doesn't support this method, it returns
 * `google.rpc.Code.UNIMPLEMENTED`.  Clients can use
 * {@link Operations.GetOperation} or
 * other methods to check whether the cancellation succeeded or whether the
 * operation completed despite cancellation. On successful cancellation,
 * the operation is not deleted; instead, it becomes an operation with
 * an {@link Operation.error} value with a {@link google.rpc.Status.code} of 1,
 * corresponding to `Code.CANCELLED`.
 *
 * @param {Object} request
 *   The request object that will be sent.
 * @param {string} request.name
 *   The name of the operation resource to be cancelled.
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error)=} callback
 *   The function which will be called with the result of the API call.
 * @returns {Promise} - The promise which resolves to the response object.
 *   The promise has a method named "cancel" which cancels the ongoing API call.
 *
 * @example
 *
 * var api = googleLongrunning.operationsApi();
 * var formattedName = api.operationPathPath("[OPERATION_PATH]");
 * api.cancelOperation({name: formattedName}).catch(function(err) {
 *     console.error(err);
 * });
 */
OperationsApi.prototype.cancelOperation = function(request, options, callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  if (options === undefined) {
    options = {};
  }
  return this._cancelOperation(request, options, callback);
};

/**
 * Deletes a long-running operation. This method indicates that the client is
 * no longer interested in the operation result. It does not cancel the
 * operation. If the server doesn't support this method, it returns
 * `google.rpc.Code.UNIMPLEMENTED`.
 *
 * @param {Object} request
 *   The request object that will be sent.
 * @param {string} request.name
 *   The name of the operation resource to be deleted.
 * @param {Object=} options
 *   Optional parameters. You can override the default settings for this call, e.g, timeout,
 *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the details.
 * @param {function(?Error)=} callback
 *   The function which will be called with the result of the API call.
 * @returns {Promise} - The promise which resolves to the response object.
 *   The promise has a method named "cancel" which cancels the ongoing API call.
 *
 * @example
 *
 * var api = googleLongrunning.operationsApi();
 * var formattedName = api.operationPathPath("[OPERATION_PATH]");
 * api.deleteOperation({name: formattedName}).catch(function(err) {
 *     console.error(err);
 * });
 */
OperationsApi.prototype.deleteOperation = function(request, options, callback) {
  if (options instanceof Function && callback === undefined) {
    callback = options;
    options = {};
  }
  if (options === undefined) {
    options = {};
  }
  return this._deleteOperation(request, options, callback);
};

function OperationsApiBuilder(gaxGrpc) {
  if (!(this instanceof OperationsApiBuilder)) {
    return new OperationsApiBuilder(gaxGrpc);
  }

  var operationsClient = gaxGrpc.load([{
    root: require('google-proto-files')('..'),
    file: 'google/longrunning/operations.proto'
  }]);
  extend(this, operationsClient.google.longrunning);

  var grpcClients = {
    operationsClient: operationsClient
  };

  /**
   * Build a new instance of {@link OperationsApi}.
   *
   * @param {Object=} opts - The optional parameters.
   * @param {String=} opts.servicePath
   *   The domain name of the API remote host.
   * @param {number=} opts.port
   *   The port on which to connect to the remote host.
   * @param {grpc.ClientCredentials=} opts.sslCreds
   *   A ClientCredentials for use with an SSL-enabled channel.
   * @param {Object=} opts.clientConfig
   *   The customized config to build the call settings. See
   *   {@link gax.constructSettings} for the format.
   * @param {number=} opts.appName
   *   The codename of the calling service.
   * @param {String=} opts.appVersion
   *   The version of the calling service.
   */
  this.operationsApi = function(opts) {
    return new OperationsApi(gaxGrpc, grpcClients, opts);
  };
  extend(this.operationsApi, OperationsApi);
}
module.exports = OperationsApiBuilder;
module.exports.SERVICE_ADDRESS = SERVICE_ADDRESS;
module.exports.ALL_SCOPES = ALL_SCOPES;
