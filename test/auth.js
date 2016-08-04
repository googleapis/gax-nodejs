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

var expect = require('chai').expect;
var sinon = require('sinon');

var createCredPromise = require('../lib/auth').createCredPromise;

describe('credential promise', function() {
  var dummyCreds = {};
  var getCredentials = function(callback) {
    callback(null, dummyCreds);
  };

  it('resolves the credential', function(done) {
    var credP = createCredPromise(getCredentials);
    credP.then(function(cred) {
      expect(cred).to.eq(dummyCreds);
      done();
    }).catch(function(err) {
      done(err);
    });
  });

  it('keeps credential', function(done) {
    var getCredentialsSpy = sinon.spy(getCredentials);
    var credP = createCredPromise(getCredentialsSpy);
    var checkCredSpy = sinon.spy(function checkCred(cred) {
      expect(cred).to.eq(dummyCreds);
    });
    Promise.all([credP.then(checkCredSpy), credP.then(checkCredSpy)]).then(
        function() {
          expect(getCredentialsSpy.callCount).to.eq(1);
          expect(checkCredSpy.callCount).to.eq(2);
          done();
        }).catch(function(err) {
          done(err);
        });
  });

  it('propagates errors from the credential callback', function(done) {
    var testError = new Error('this is used in a test');
    var getCredentials = function(callback) {
      callback(testError);
    };
    var credP = createCredPromise(getCredentials);
    credP.catch(function(err) {
      expect(err).to.eq(testError);
      done();
    }).catch(function(err) {
      done(err);
    });
  });
});
