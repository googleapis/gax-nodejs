/* Copyright 2017, Google Inc.
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

'use strict';

var gaxGrpc = require('../lib/grpc');
var expect = require('chai').expect;

describe('grpc', function() {
  describe('grpcVersion', function() {
    it('holds the proper grpc version', function() {
      var grpcVersion = require('grpc/package.json').version;
      expect(gaxGrpc().grpcVersion).to.eq(grpcVersion);
    });

    it('returns unknown when grpc module is mocked', function() {
      var mockGrpc = {};
      expect(gaxGrpc({grpc: mockGrpc}).grpcVersion).to.eq('');
    });
  });

  describe('metadataBuilder', function() {
    var grpcClient = gaxGrpc();

    it('builds metadata', function() {
      var headers = {
        'X-Dummy-Header': 'Dummy value',
        'Other-Header': 'Other value',
        'X-Goog-Api-Client': 'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0'
      };
      var builder = grpcClient.metadataBuilder(headers);
      var metadata = builder();
      for (var key in headers) {
        expect(metadata.get(key)).to.deep.eq([headers[key]]);
      }
    });

    it.skip('customize api-client header for A/B testing', function() {
      var headers = {
        'X-Goog-Api-Client': 'gl-node/nodeVersion gax/gaxVersion'
      };
      var builder = grpcClient.metadataBuilder(headers);
      var metadata = builder({retry: '1'});
      expect(metadata.get('X-Goog-Api-Client')).to.deep.eq(
        ['gl-node/nodeVersion gax/gaxVersion gl-abkey1/retry gl-abval1/1']);

      metadata = builder({retry: '2'});
      expect(metadata.get('X-Goog-Api-Client')).to.deep.eq(
        ['gl-node/nodeVersion gax/gaxVersion gl-abkey1/retry gl-abval1/2']);

      metadata = builder();
      expect(metadata.get('X-Goog-Api-Client')).to.deep.eq(
        ['gl-node/nodeVersion gax/gaxVersion']);
    });
  });
});
