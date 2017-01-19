/*
 *
 * Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
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
 *
 */
'use strict';

var autoAuth = require('google-auto-auth');

var gax = require('./gax');

/**
 * A class which keeps the context of gRPC and auth for the gRPC.
 *
 * @param {Object=} options - The optional parameters. It will be directly
 *   passed to google-auto-auth library, so parameters like keyFile or
 *   credentials will be valid.
 * @param {Object=} options.auth - An instance of google-auto-auth.
 *   When specified, this auth instance will be used instead of creating
 *   a new one.
 * @param {Object=} options.grpc - When specified, this will be used
 *   for the 'grpc' module in this context. By default, it will load the grpc
 *   module in the standard way.
 * @param {Function=} options.promise - A constructor for a promise that
 * implements the ES6 specification of promise. If not provided, native promises
 * will be used.
 * @constructor
 */
function GrpcClient(options) {
  if (!(this instanceof GrpcClient)) {
    return new GrpcClient(options);
  }
  options = options || {};
  this.auth = options.auth || autoAuth(options);
  this.grpc = options.grpc || require('grpc');
  this.promise = options.promise || Promise;
}
module.exports = GrpcClient;

/**
 * Creates a gRPC credentials from the authentications.
 * @private
 * @param {Object} opts - options values for configuring credentials.
 * @param {Object=} opts.sslCreds - when specified, this is used instead
 *   of default channel credentials.
 * @param {Object} auth - the authentication object.
 * @return {Object} The gRPC credential object.
 */
GrpcClient.prototype._getCredentials = function _getCredentials(opts, auth) {
  var sslCreds = opts.sslCreds || this.grpc.credentials.createSsl();
  var credentials = this.grpc.credentials.combineChannelCredentials(
      sslCreds,
      this.grpc.credentials.createFromGoogleCredential(auth)
  );
  return credentials;
};

/**
 * Load grpc proto services with the specific arguments.
 * @param {Array=} args - The argument list to be passed to grpc.load().
 * @return {Object} The gRPC loaded result (the toplevel namespace object).
 */
GrpcClient.prototype.load = function(args) {
  if (!args) {
    args = [];
  } else if (!Array.isArray(args)) {
    args = [args];
  }
  if (args.length === 1) {
    args.push('proto', {convertFieldsToCamelCase: true});
  }
  return this.grpc.load.apply(this.grpc, args);
};

/**
 * A wrapper of {@link constructSettings} function with under the gRPC context.
 *
 * Most of parameters are common among constructSettings, please take a look.
 * @param {string} serviceName - The fullly-qualified name of the service.
 * @param {Object} clientConfig - A dictionary of the client config.
 * @param {Object} configOverrides - A dictionary of overriding configs.
 * @param {Object} headers - A dictionary of additional HTTP header name to
 *   its value.
 * @return {Object} A mapping of method names to CallSettings.
 */
GrpcClient.prototype.constructSettings = function constructSettings(
    serviceName,
    clientConfig,
    configOverrides,
    headers) {
  var metadata = new this.grpc.Metadata();
  for (var key in headers) {
    metadata.set(key, headers[key]);
  }

  return gax.constructSettings(
      serviceName,
      clientConfig,
      configOverrides,
      this.grpc.status,
      {metadata: metadata},
      this.promise);
};

/**
 * Creates a gRPC stub with current gRPC and auth.
 * @param {string} servicePath - The name of the server of the service.
 * @param {number} port - The port of the service.
 * @param {function} CreateStub - The constructor function of the stub.
 * @param {Object=} options - The optional arguments to customize
 *   gRpc connection.
 * @param {grpc.ClientCredentials} options.sslCreds - The credentials to be used
 *   to set up gRPC connection.
 * @return {Promise} A promse which resolves to a gRPC stub instance.
 */
GrpcClient.prototype.createStub = function(
    servicePath, port, CreateStub, options) {
  options = options || {};
  var self = this;
  var serviceAddress = servicePath + ':' + port;
  var PromiseCtor = this.promise;
  return new PromiseCtor(function(resolve, reject) {
    self.auth.getAuthClient(function(err, auth) {
      if (err) {
        reject(err);
      } else {
        resolve(auth);
      }
    });
  }).then(function(auth) {
    return self._getCredentials(options, auth);
  }).then(function buildStub(credentials) {
    return new CreateStub(serviceAddress, credentials);
  });
};

/**
 * Creates a 'bytelength' function for a given proto message class.
 *
 * See {@link BundleDescriptor} about the meaning of the return value.
 *
 * @param {function} message - a constructor function that is generated by
 *   protobuf.js. Assumes 'encoder' field in the message.
 * @return {function(Object):number} - a function to compute the byte length
 *   for an object.
 */
GrpcClient.createByteLengthFunction =
    function createByteLengthFunction(message) {
      return function getByteLength(obj) {
        return message.encode(obj).buffer.length;
      };
    };
