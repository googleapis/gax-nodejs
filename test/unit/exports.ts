/* Copyright 2019 Google LLC
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

import * as index from '../../src/index';
import * as fallback from '../../src/fallback';
import * as assert from 'assert';
import {describe, it} from 'mocha';

const version = require('../../../package.json').version;

// The following export tests validate the Gax interface that is used by client libraries.
// Removing any of the following exports will break client libraries.
describe('exports', () => {
  describe('index', () => {
    it('exports GrpcClient', () => {
      assert(typeof index.GrpcClient === 'function');
    });
    it('exports createApiCall', () => {
      assert(typeof index.createApiCall === 'function');
    });
    it('exports PathTemplate', () => {
      assert(typeof index.PathTemplate === 'function');
    });
    it('exports PageDescriptor', () => {
      assert(typeof index.PageDescriptor === 'function');
    });
    it('exports StreamDescriptor', () => {
      assert(typeof index.StreamDescriptor === 'function');
    });
    it('exports BundleDescriptor', () => {
      assert(typeof index.BundleDescriptor === 'function');
    });
    it('exports LongrunningDescriptor', () => {
      assert(typeof index.LongrunningDescriptor === 'function');
    });
    it('exports lro', () => {
      assert(typeof index.lro === 'function');
    });
    it('exports version', () => {
      assert(typeof index.version === 'string');
      assert.strictEqual(index.version, version);
    });
    it('exports fallback', () => {
      assert(typeof index.fallback === 'object');
    });
  });

  describe('fallback', () => {
    it('exports GrpcClient', () => {
      assert(typeof fallback.GrpcClient === 'function');
    });
    it('exports createApiCall', () => {
      assert(typeof fallback.createApiCall === 'function');
    });
    it('exports PathTemplate', () => {
      assert(typeof fallback.PathTemplate === 'function');
    });
    it('exports PageDescriptor', () => {
      assert(typeof fallback.PageDescriptor === 'function');
    });
    it('exports StreamDescriptor', () => {
      assert(typeof fallback.StreamDescriptor === 'function');
    });
    it('exports BundleDescriptor', () => {
      assert(typeof fallback.BundleDescriptor === 'function');
    });
    it('exports LongrunningDescriptor', () => {
      assert(typeof fallback.LongrunningDescriptor === 'function');
    });
    it('exports lro', () => {
      assert(typeof fallback.lro === 'function');
    });
    it('exports version', () => {
      assert(typeof fallback.version === 'string');
      assert.strictEqual(fallback.version, version + '-fallback');
    });
  });
});
