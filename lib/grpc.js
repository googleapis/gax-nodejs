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

var CredentialsHolder = require('./auth').CredentialsHolder;

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
 * StubHolder holds an rpc stub.
 *
 * It provides a method, get, that is used to obtain the stub.
 *
 * @param {string} servicePath - The domain name of the API remote host.
 * @param {integer} port - The port on which to connect to the remote host.
 * @param {function} createStub - The constructor used to create grpc stub instance.
 * @param {object} options - optional settings for configuring
 * @param {function(callback, opts)} options.getCredentials - the callback used to
 *   obtain the credentials
 * @param {string|string[]} option.scopes - the scope or scopes to use when
 *   obtaining the credentials used by the stub.
 *
 * @constructor
 */
function StubHolder(servicePath, port, createStub, options) {
  /**
   * A createStub the constructor used to create the grpc stub instance.
   */
  this.CreateStub = createStub;

  /**
   * A stub for accesing a grpc service.
   */
  this.stub = null;

  /**
   * The domain name of the API remote host.
   */
  this.servicePath = servicePath;

  /**
   * The port on which to access the service.
   */
  this.port = port;

  /**
   * A CredentialsHolders for accessing the credentials.
   */
  this.credsHolder = new CredentialsHolder(
      options.getCredentials || getCredentials,
      options.scopes);
}

/**
 * get obtains the stub instance.
 *
 * The callback is a standard node callback, i.e it will be called with either
 * - (err) if a problem occurs initializing the stub
 * - (null, credentials)
 *
 * @param {function} callback - to be invoked once the stub is initialized.
 */
StubHolder.prototype.get = function get(callback) {
  var buildStub = function buildStub(err, credentials) {
    if (err) {
      callback(err);
    } else {
      this.stub = new this.CreateStub(this.servicePath + ':' + this.port,
                                      credentials);
      callback(null, this.stub);
    }
  }.bind(this);

  if (!this.stub) {
    this.credsHolder.get(buildStub);
  } else {
    callback(null, this.stub);
  }
};
