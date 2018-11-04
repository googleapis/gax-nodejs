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

import {expect} from 'chai';
import * as sinon from 'sinon';

import {createCredPromise} from '../src/auth';

describe('credential promise', () => {
  const dummyCreds = {};
  const getCredentials = callback => {
    callback(null, dummyCreds);
  };

  it('resolves the credential', done => {
    const credP = createCredPromise(getCredentials);
    credP
        .then(cred => {
          expect(cred).to.eq(dummyCreds);
          done();
        })
        .catch(done);
  });

  it('keeps credential', done => {
    const getCredentialsSpy = sinon.spy(getCredentials);
    const credP = createCredPromise(getCredentialsSpy);
    const checkCredSpy = sinon.spy(function checkCred(cred) {
      expect(cred).to.eq(dummyCreds);
    });
    Promise.all([credP.then(checkCredSpy), credP.then(checkCredSpy)])
        .then(() => {
          expect(getCredentialsSpy.callCount).to.eq(1);
          expect(checkCredSpy.callCount).to.eq(2);
          done();
        })
        .catch(done);
  });

  it('propagates errors from the credential callback', done => {
    const testError = new Error('this is used in a test');
    const getCredentials = callback => {
      callback(testError);
    };
    const credP = createCredPromise(getCredentials);
    credP
        .catch(err => {
          expect(err).to.eq(testError);
          done();
        })
        .catch(done);
  });
});
