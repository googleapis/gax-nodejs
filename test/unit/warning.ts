/*
 * Copyright 2019 Google LLC
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
 */

import {assert} from 'chai';
import * as sinon from 'sinon';

import {warn} from '../../src/warnings';

describe('warnings', () => {
  it('should warn the given code once with the first message', done => {
    const stub = sinon.stub(process, 'emitWarning');
    warn('code1', 'message1-1');
    warn('code1', 'message1-2');
    warn('code1', 'message1-3');
    assert(stub.calledOnceWith('message1-1'));
    stub.restore();
    done();
  });
  it('should warn each code once', done => {
    const stub = sinon.stub(process, 'emitWarning');
    warn('codeA', 'messageA-1');
    warn('codeB', 'messageB-1');
    warn('codeA', 'messageA-2');
    warn('codeB', 'messageB-2');
    warn('codeC', 'messageC-1');
    warn('codeA', 'messageA-3');
    assert.strictEqual(stub.callCount, 3);
    stub.restore();
    done();
  });
});
