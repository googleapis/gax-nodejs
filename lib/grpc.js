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

var grpc = require('grpc');
var GoogleAuth = require('google-auth-library');
var AuthFactory = new GoogleAuth();

var createCredPromise = require('./auth').createCredPromise;

/**
 * To authorize requests through gRPC, we must get the raw google-auth-library
 * auth client object.
 *
 * @private
 *
 * @param {function} callback - The callback function.
 * @param {object} opts - options values for configuring auth
 * @param {string|[]string} opts.scopes - the scope or scopes to use when
 *   obtaining the credentials.
 * @param {object} opts.sslCreds - when specified, this is used instead
 *   of default credentials.
 * @param {?error} callback.err - An error getting an auth client.
 */
function getCredentials(callback, opts) {
  AuthFactory.getApplicationDefault(function(err, auth) {
    if (err) {
      callback(err);
      return;
    }

    /* Apply any provided scope if there are required */
    if (opts.scopes && auth.createScopeRequired()) {
      auth = auth.createScoped(opts.scopes);
    }
    var sslCreds = opts.sslCreds || grpc.credentials.createSsl();
    var credentials = grpc.credentials.combineChannelCredentials(
      sslCreds,
      grpc.credentials.createFromGoogleCredential(auth)
    );

    callback(null, credentials);
  });
}

/**
 * Creates a promise which resolves to an rpc stub.
 *
 * @param {string} servicePath - The domain name of the API remote host.
 * @param {integer} port - The port on which to connect to the remote host.
 * @param {function} createStub - The constructor used to create a grpc stub
 *   instance.
 * @param {object} options - optional settings for configuring
 * @param {function(callback, opts)} options.getCredentials - the callback used
 *   to obtain the credentials
 * @param {string|string[]} option.scopes - the scope or scopes to use when
 *   obtaining the credentials used by the stub.
 * @returns {Promise} A promise which resolves to an rpc stub.
 */
exports.createStub = function createStub(
    servicePath, port, CreateStub, options) {
  var creds = createCredPromise(options.getCredentials || getCredentials,
                                options.scopes, options);
  return creds.then(function buildStub(credentials) {
    return new CreateStub(servicePath + ':' + port, credentials);
  });
};
