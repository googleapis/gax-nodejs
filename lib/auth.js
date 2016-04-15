/*
 *
 * Copyright 2015, Google Inc.
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

/**
 * To authorize requests through gRPC, we must get the raw google-auth-library
 * auth client object.
 *
 * @private
 *
 * @param {function} callback - The callback function.
 * @param {object} opts - options values for configuring auth
 * @param {?error} callback.err - An error getting an auth client.
 */
function getGrpcCredentials(callback, opts) {
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
 * CredentialsHolder holds the credentials obtained using getGrpcCredentials.
 *
 * It provides a method, get, that is used to obtain the credentials and store
 * them.
 *
 * @param {string|string[]} opt_scopes - the scope or scopes to use when
 *   obtaining the credentials.
 *
 * @constructor
 */
function CredentialsHolder(opt_scopes) {
  /**
   * A credentials obtained by getCredentials
   */
  this.credentials = null;

  /**
   * The scopes to use to create the credentials
   */
  this.scopes = opt_scopes;
}

/**
 * get obtains the credential instance to be used.
 *
 * The callback is a standard node callback, i.e it will be called with either
 * - (err) if a problem occurs obtaining the credentials
 * - (null, credentials)
 *
 * @param {function} callback - to be invoked once credentials are obtained.
 */
CredentialsHolder.prototype.get = function get(callback) {
  var storeCredentials = function storeCredentials(err, credentials) {
    if (err) {
      callback(err);
    } else {
      this.credentials = credentials;
      callback(null, this.credentials);
    }
  }.bind(this);

  if (!this.credentials) {
    getGrpcCredentials(storeCredentials, {scopes: this.scopes});
  } else {
    callback(null, this.credentials);
  }
};

exports.CredentialsHolder = CredentialsHolder;
