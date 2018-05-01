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

var gaxGrpc = require('../src/grpc');
var expect = require('chai').expect;
import * as path from 'path';
var protobuf = require('protobufjs');
var proxyquire = require('proxyquire');
import * as sinon from 'sinon';

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
        'X-Goog-Api-Client': 'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      };
      var builder = grpcClient.metadataBuilder(headers);
      var metadata = builder();
      for (var key in headers) {
        expect(metadata.get(key)).to.deep.eq([headers[key]]);
      }
    });

    it('adds user metadata', function() {
      var headers = {
        'X-Dummy-Header': 'Dummy value',
        'Other-Header': 'Other value',
        'X-Goog-Api-Client': 'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      };
      var builder = grpcClient.metadataBuilder(headers);
      var abTesting = null;
      var moreHeaders = {foo: 'bar'};
      var metadata = builder(abTesting, moreHeaders);
      expect(metadata.get('foo')).to.deep.eq(['bar']);
    });

    it('does not override x-goog-api-client', function() {
      var headers = {
        'X-Dummy-Header': 'Dummy value',
        'Other-Header': 'Other value',
        'X-Goog-Api-Client': 'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      };
      var builder = grpcClient.metadataBuilder(headers);
      var abTesting = null;
      var moreHeaders = {'x-GOOG-api-CLIENT': 'something else'};
      var metadata = builder(abTesting, moreHeaders);
      expect(metadata.get('x-goog-api-client')).to.deep.eq([
        'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      ]);
    });

    it.skip('customize api-client header for A/B testing', function() {
      var headers = {
        'X-Goog-Api-Client': 'gl-node/nodeVersion gax/gaxVersion',
      };
      var builder = grpcClient.metadataBuilder(headers);
      var metadata = builder({retry: '1'});
      expect(metadata.get('X-Goog-Api-Client')).to.deep.eq([
        'gl-node/nodeVersion gax/gaxVersion gl-abkey1/retry gl-abval1/1',
      ]);

      metadata = builder({retry: '2'});
      expect(metadata.get('X-Goog-Api-Client')).to.deep.eq([
        'gl-node/nodeVersion gax/gaxVersion gl-abkey1/retry gl-abval1/2',
      ]);

      metadata = builder();
      expect(metadata.get('X-Goog-Api-Client')).to.deep.eq([
        'gl-node/nodeVersion gax/gaxVersion',
      ]);
    });
  });

  describe('createStub', function() {
    function DummyStub(address, creds, options) {
      this.address = address;
      this.creds = creds;
      this.options = options;
    }
    var grpcClient;
    var dummyChannelCreds = {channelCreds: 'dummyChannelCreds'};
    var stubAuth = {getAuthClient: sinon.stub()};
    var stubGrpc = {
      credentials: {
        createSsl: sinon.stub(),
        combineChannelCredentials: sinon.stub(),
        createFromGoogleCredential: sinon.stub(),
      },
    };

    beforeEach(function() {
      var dummyAuth = {authData: 'dummyAuth'};
      var dummySslCreds = {sslCreds: 'dummySslCreds'};
      var dummyGrpcAuth = {grpcAuth: 'dummyGrpcAuth'};
      stubAuth.getAuthClient.reset();
      stubGrpc.credentials.createSsl.reset();
      stubGrpc.credentials.combineChannelCredentials.reset();
      stubGrpc.credentials.createFromGoogleCredential.reset();

      stubAuth.getAuthClient.callsArgWith(0, null, dummyAuth);
      stubGrpc.credentials.createSsl.returns(dummySslCreds);
      stubGrpc.credentials.createFromGoogleCredential
        .withArgs(dummyAuth)
        .returns(dummyGrpcAuth);
      stubGrpc.credentials.combineChannelCredentials
        .withArgs(dummySslCreds, dummyGrpcAuth)
        .returns(dummyChannelCreds);
      grpcClient = gaxGrpc({auth: stubAuth, grpc: stubGrpc});
    });

    it('creates a stub', function() {
      var opts = {servicePath: 'foo.example.com', port: 443};
      return grpcClient.createStub(DummyStub, opts).then(function(stub) {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        expect(stub.creds).to.deep.eq(dummyChannelCreds);
        expect(stub.options).to.deep.eq({});
      });
    });

    it('supports optional parameters', function() {
      var opts = {
        servicePath: 'foo.example.com',
        port: 443,
        'grpc.max_send_message_length': 10 * 1024 * 1024,
        'grpc.initial_reconnect_backoff_ms': 10000,
        other_dummy_options: 'test',
      };
      return grpcClient.createStub(DummyStub, opts).then(function(stub) {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        expect(stub.creds).to.deep.eq(dummyChannelCreds);
        expect(stub.options).has.key([
          'grpc.max_send_message_length',
          'grpc.initial_reconnect_backoff_ms',
        ]);
      });
    });

    it('uses the passed grpc channel', function() {
      var customCreds = {channelCreds: 'custom'};
      var opts = {
        servicePath: 'foo.example.com',
        port: 443,
        sslCreds: customCreds,
      };
      return grpcClient.createStub(DummyStub, opts).then(function(stub) {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        expect(stub.creds).to.deep.eq(customCreds);
        expect(stubAuth.getAuthClient.callCount).to.eq(0);
        var credentials = stubGrpc.credentials;
        expect(credentials.createSsl.callCount).to.eq(0);
        expect(credentials.combineChannelCredentials.callCount).to.eq(0);
        expect(credentials.createFromGoogleCredential.callCount).to.eq(0);
      });
    });
  });

  describe('loadProto', function() {
    var TEST_FILE = path.join(
      'fixtures',
      'google',
      'example',
      'library',
      'v1',
      'library.proto'
    );
    //var RESOLVED_TEST_FILE = path.resolve(`../`)
    var TEST_PATH = path.resolve(__dirname, '../../test');
    var grpcClient = gaxGrpc();

    it('should load the test file', function() {
      var protos = grpcClient.loadProto(TEST_PATH, TEST_FILE);
      expect(protos.google.example.library.v1.LibraryService).to.be.a(
        'Function'
      );
      expect(protos.test.TestMessage).to.be.an('object');
    });

    it('should load a common proto', function() {
      var nonExistentDir = path.join(__dirname, 'nonexistent', 'dir');
      var iamService = path.join('google', 'iam', 'v1', 'iam_policy.proto');
      var protos = grpcClient.loadProto(nonExistentDir, iamService);
      expect(protos.google.iam.v1.IAMPolicy).to.be.a('Function');
    });

    it('should emit an error for not found proto', function() {
      var nonExistentDir = path.join(__dirname, 'nonexistent', 'dir');
      var nonExistentFile = 'nonexistent.proto';
      expect(
        grpcClient.loadProto.bind(null, nonExistentDir, nonExistentFile)
      ).to.throw();
    });
  });

  describe('GoogleProtoFilesRoot', function() {
    var FIXTURES_DIR = path.join(
      path.resolve(__dirname, '../../test'),
      'fixtures',
      'google',
      'example',
      'library',
      'v1'
    );
    var TEST_FILE = path.join(FIXTURES_DIR, 'library.proto');
    var NON_EXISTENT_FILE = path.join(__dirname, 'does', 'not', 'exist.proto');
    var MISSING_INCLUDE_FILE = path.join(FIXTURES_DIR, 'missing_include.proto');

    describe('use with protobufjs load', function() {
      it('should not be able to load test file using protobufjs directly', function(done) {
        protobuf
          .load(TEST_FILE)
          .then(function() {
            done(Error('should not get here'));
          })
          .catch(function() {
            done();
          });
      });

      it('should load a test file', function(done) {
        protobuf
          .load(TEST_FILE, new gaxGrpc.GoogleProtoFilesRoot())
          .then(function(root) {
            expect(root).to.be.an.instanceOf(protobuf.Root);
            expect(
              root.lookup('google.example.library.v1.LibraryService')
            ).to.be.an.instanceOf(protobuf.Service);
            expect(root.lookup('test.TestMessage')).to.be.an.instanceOf(
              protobuf.Type
            );
            done();
          })
          .catch(done);
      });

      it('should fail trying to load a non existent file.', function(done) {
        protobuf
          .load(NON_EXISTENT_FILE, new gaxGrpc.GoogleProtoFilesRoot())
          .then(function() {
            done(Error('should not get here'));
          })
          .catch(function() {
            done();
          });
      });

      it('should fail loading a file with a missing include.', function(done) {
        protobuf
          .load(MISSING_INCLUDE_FILE, new gaxGrpc.GoogleProtoFilesRoot())
          .then(function() {
            done(Error('should not get here'));
          })
          .catch(function() {
            done();
          });
      });
    });

    describe('use with protobufjs loadSync', function() {
      it('should not be able to load test file using protobufjs directly', function() {
        var root = protobuf.loadSync(TEST_FILE);
        // Common proto that should not have been loaded.
        expect(root.lookup('google.api.Http')).to.eq(null);
      });

      it('should load a test file that relies on common protos', function() {
        var root = protobuf.loadSync(
          TEST_FILE,
          new gaxGrpc.GoogleProtoFilesRoot()
        );
        expect(root).to.be.an.instanceOf(protobuf.Root);
        expect(
          root.lookup('google.example.library.v1.LibraryService')
        ).to.be.an.instanceOf(protobuf.Service);
        expect(root.lookup('test.TestMessage')).to.be.an.instanceOf(
          protobuf.Type
        );
      });

      it('should fail trying to load a non existent file.', function() {
        expect(
          protobuf.loadSync.bind(
            null,
            NON_EXISTENT_FILE,
            new gaxGrpc.GoogleProtoFilesRoot()
          )
        ).to.throw();
      });

      it('should fail loading a file with a missing include', function() {
        expect(
          protobuf.loadSync.bind(
            null,
            MISSING_INCLUDE_FILE,
            new gaxGrpc.GoogleProtoFilesRoot()
          )
        ).to.throw();
      });
    });

    describe('_findIncludePath', function() {
      var originPath = path.join('test', 'path', 'location');
      var includePath = path.join('example', 'import.proto');

      it('should throw an error if a file is not found', function() {
        var findIncludePath = proxyquire('../src/grpc', {
          fs: {
            existsSync: function() {
              return false;
            },
          },
        }).GoogleProtoFilesRoot._findIncludePath;

        expect(findIncludePath.bind(null, originPath, includePath)).to.throw();
      });

      it('should return the correct resolved import path', function() {
        var correctPath = path.join('test', 'example', 'import.proto');
        var findIncludePath = proxyquire('../src/grpc', {
          fs: {
            existsSync: function(path) {
              return path === correctPath;
            },
          },
        }).GoogleProtoFilesRoot._findIncludePath;
        expect(findIncludePath(originPath, includePath)).to.equal(correctPath);
      });
    });
  });
});
