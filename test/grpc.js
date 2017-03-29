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
var extend = require('extend');
var sinon = require('sinon');

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

  describe('createStub', function() {
    function DummyStub(address, creds, options) {
      this.address = address;
      this.creds = creds;
      this.options = options;
    }
    var grpcClient;
    var stubGrpc;
    var dummyChannelCreds = {channelCreds: 'dummyChannelCreds'};
    var dummySslCreds = {sslCreds: 'dummySslCreds'};
    var dummyAuth = {authData: 'dummyAuth'};
    var dummyGrpcAuth = {grpcAuth: 'dummyGrpcAuth'};

    function createStub(opts, optClient) {
      var client = optClient || grpcClient;
      opts = extend({servicePath: 'foo.example.com', port: 443}, opts);
      return client.createStub(DummyStub, opts).then(function(stub) {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        return stub;
      });
    }

    beforeEach(function() {
      var stubAuth = {getAuthClient: sinon.stub()};
      stubGrpc = {credentials: {
        createSsl: sinon.stub(),
        combineChannelCredentials: sinon.stub(),
        createFromGoogleCredential: sinon.stub()
      }};
      stubAuth.getAuthClient.callsArgWith(0, null, dummyAuth);
      stubGrpc.credentials.createSsl.returns(dummySslCreds);
      stubGrpc.credentials.createFromGoogleCredential
        .withArgs(dummyAuth).returns(dummyGrpcAuth);
      stubGrpc.credentials.combineChannelCredentials
        .withArgs(dummySslCreds, dummyGrpcAuth).returns(dummyChannelCreds);
      grpcClient = gaxGrpc({auth: stubAuth, grpc: stubGrpc});
    });

    it('creates a stub', function() {
      return createStub().then(function(stub) {
        expect(stub.creds).to.deep.eq(dummyChannelCreds);
        expect(stub.options).to.be.falsy;
      });
    });

    it('supports optional parameters', function() {
      var opts = {
        'grpc.max_send_message_length': 10 * 1024 * 1024,
        'grpc.initial_reconnect_backoff_ms': 10000,
        'other_dummy_options': 'test'
      };
      return createStub(opts).then(function(stub) {
        expect(stub.creds).to.deep.eq(dummyChannelCreds);
        expect(stub.options).has.key([
          'grpc.max_send_message_length',
          'grpc.initial_reconnect_backoff_ms']);
      });
    });

    it('accepts custom channel creds', function() {
      var customCreds = {sslCreds: 'dummyCustomCreds'};
      var customChannelCreds = {channelCreds: 'dummyCustomChannel'};
      stubGrpc.credentials.combineChannelCredentials
        .withArgs(customCreds, dummyGrpcAuth).returns(customChannelCreds);
      return createStub({sslCreds: customCreds}).then(function(stub) {
        expect(stubGrpc.credentials.createSsl.callCount).to.eq(0);
        expect(stub.creds).to.deep.eq(customChannelCreds);
      });
    });

    it('disables auth', function() {
      grpcClient = gaxGrpc({auth: false, grpc: stubGrpc});
      return createStub(null, grpcClient).then(function(stub) {
        expect(stub.creds).to.deep.eq(dummySslCreds);
        expect(stubGrpc.credentials.createSsl.callCount).to.eq(1);
        expect(stubGrpc.credentials.createFromGoogleCredential.callCount).to.eq(0);
        expect(stubGrpc.credentials.combineChannelCredentials.callCount).to.eq(0);
      });
    });
  });
});
