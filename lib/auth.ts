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

/**
 * @callback GetCredentialsFunc
 *
 * To authorize requests through gRPC, we must get the raw google-auth-library
 * auth client object.
 *
 * @param {function()} callback - The callback function.
 * @param {Object} opts - options values for configuring auth
 * @param {(String|String[])} opts.scopes - the scope or scopes to use when
 *   obtaining the credentials.
 * @param {Object} opts.sslCreds - when specified, this is used instead
 *   of default credentials.
 */

/**
 * Creates a promise which resolves a auth credential.
 *
 * @param {GetCredentialsFunc} getCredentials - the callback used to
 *   obtain the credentials.
 * @param {Object} opts - the optional arguments to be passed to
 *   getCredentials.
 * @return {Promise} A promise which resolves to the credential.
 */
exports.createCredPromise = function createCredPromise(getCredentials, opts) {
  return new Promise(function(resolve, reject) {
    getCredentials(function(err, credentials) {
      if (err) {
        reject(err);
      } else {
        resolve(credentials);
      }
    }, opts);
  });
};
