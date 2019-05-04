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

import {expect} from 'chai';
import * as path from 'path';
import * as protobuf from 'protobufjs';
import * as proxyquire from 'proxyquire';
import * as semver from 'semver';
import * as sinon from 'sinon';

import {GoogleProtoFilesRoot, GrpcClient} from '../src/grpc';

function gaxGrpc(options?) {
  return new GrpcClient(options);
}

describe('grpc', () => {
  describe('grpcVersion', () => {
    it('holds the proper grpc version', () => {
      const grpcModule = '@grpc/grpc-js';
      const grpcVersion = require(`${grpcModule}/package.json`).version;
      expect(gaxGrpc().grpcVersion).to.eq(grpcVersion);
    });

    it('returns unknown when grpc module is mocked', () => {
      const mockGrpc = {};
      expect(gaxGrpc({grpc: mockGrpc}).grpcVersion).to.eq('');
    });
  });

  describe('metadataBuilder', () => {
    const grpcClient = gaxGrpc();

    it('builds metadata', () => {
      const headers = {
        'X-Dummy-Header': 'Dummy value',
        'Other-Header': 'Other value',
        'X-Goog-Api-Client': 'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      };
      const builder = grpcClient.metadataBuilder(headers);
      const metadata = builder();
      // tslint:disable-next-line forin
      for (const key in headers) {
        expect(metadata.get(key)).to.deep.eq([headers[key]]);
      }
    });

    it('adds user metadata', () => {
      const headers = {
        'X-Dummy-Header': 'Dummy value',
        'Other-Header': 'Other value',
        'X-Goog-Api-Client': 'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      };
      const builder = grpcClient.metadataBuilder(headers);
      const abTesting = null;
      const moreHeaders = {foo: 'bar'};
      const metadata = builder(abTesting!, moreHeaders);
      expect(metadata.get('foo')).to.deep.eq(['bar']);
    });

    it('does not override x-goog-api-client', () => {
      const headers = {
        'X-Dummy-Header': 'Dummy value',
        'Other-Header': 'Other value',
        'X-Goog-Api-Client': 'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      };
      const builder = grpcClient.metadataBuilder(headers);
      const abTesting = null;
      const moreHeaders = {'x-GOOG-api-CLIENT': 'something else'};
      const metadata = builder(abTesting!, moreHeaders);
      expect(metadata.get('x-goog-api-client')).to.deep.eq([
        'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      ]);
    });

    it.skip('customize api-client header for A/B testing', () => {
      const headers = {
        'X-Goog-Api-Client': 'gl-node/nodeVersion gax/gaxVersion',
      };
      const builder = grpcClient.metadataBuilder(headers);
      let metadata = builder({retry: '1'});
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

  describe('createStub', () => {
    const TEST_PATH = path.resolve(__dirname, '../../test');
    class DummyStub {
      constructor(public address, public creds, public options) {}
    }
    let grpcClient;
    const dummyChannelCreds = {channelCreds: 'dummyChannelCreds'};
    const stubAuth = {getClient: sinon.stub()};
    const stubGrpc = {
      credentials: {
        createSsl: sinon.stub(),
        combineChannelCredentials: sinon.stub(),
        createFromGoogleCredential: sinon.stub(),
      },
    };

    beforeEach(() => {
      const dummyAuth = {authData: 'dummyAuth'};
      const dummySslCreds = {sslCreds: 'dummySslCreds'};
      const dummyGrpcAuth = {grpcAuth: 'dummyGrpcAuth'};
      stubAuth.getClient.reset();
      stubGrpc.credentials.createSsl.reset();
      stubGrpc.credentials.combineChannelCredentials.reset();
      stubGrpc.credentials.createFromGoogleCredential.reset();

      stubAuth.getClient.resolves(dummyAuth);
      stubGrpc.credentials.createSsl.returns(dummySslCreds);
      stubGrpc.credentials.createFromGoogleCredential
        .withArgs(dummyAuth)
        .returns(dummyGrpcAuth);
      stubGrpc.credentials.combineChannelCredentials
        .withArgs(dummySslCreds, dummyGrpcAuth)
        .returns(dummyChannelCreds);
      grpcClient = gaxGrpc({auth: stubAuth, grpc: stubGrpc});
    });

    it('creates a stub', () => {
      const opts = {servicePath: 'foo.example.com', port: 443};
      return grpcClient.createStub(DummyStub, opts).then(stub => {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        expect(stub.creds).to.deep.eq(dummyChannelCreds);
        expect(stub.options).to.deep.eq({});
      });
    });

    it('supports optional parameters', () => {
      const opts = {
        servicePath: 'foo.example.com',
        port: 443,
        'grpc.max_send_message_length': 10 * 1024 * 1024,
        'grpc.initial_reconnect_backoff_ms': 10000,
        other_dummy_options: 'test',
      };
      return grpcClient.createStub(DummyStub, opts).then(stub => {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        expect(stub.creds).to.deep.eq(dummyChannelCreds);
        // tslint:disable-next-line no-any
        (expect(stub.options).has as any).key([
          'max_send_message_length',
          'initial_reconnect_backoff_ms',
        ]);
        // tslint:disable-next-line no-any
        (expect(stub.options).to.not.have as any).key([
          'servicePath',
          'port',
          'other_dummy_options',
        ]);
      });
    });

    it('uses the passed grpc channel', () => {
      const customCreds = {channelCreds: 'custom'};
      const opts = {
        servicePath: 'foo.example.com',
        port: 443,
        sslCreds: customCreds,
      };
      return grpcClient.createStub(DummyStub, opts).then(stub => {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        expect(stub.creds).to.deep.eq(customCreds);
        expect(stubAuth.getClient.callCount).to.eq(0);
        const credentials = stubGrpc.credentials;
        expect(credentials.createSsl.callCount).to.eq(0);
        expect(credentials.combineChannelCredentials.callCount).to.eq(0);
        expect(credentials.createFromGoogleCredential.callCount).to.eq(0);
      });
    });
  });

  describe('loadProto', () => {
    const grpcClient = gaxGrpc();
    const TEST_FILE = path.join(
      'google',
      'example',
      'library',
      'v1',
      'library.proto'
    );
    const TEST_PATH = path.resolve(__dirname, '../../test/fixtures');

    it('should load the test file', () => {
      // no-any disabled because if the accessed fields are non-existent, this
      // test will fail anyway.
      // tslint:disable-next-line:no-any
      const protos = grpcClient.loadProto(TEST_PATH, TEST_FILE) as any;
      expect(protos.google.example.library.v1.LibraryService).to.be.a(
        'Function'
      );
    });

    it('should load a common proto', () => {
      const nonExistentDir = path.join(__dirname, 'nonexistent', 'dir');
      const iamService = path.join('google', 'iam', 'v1', 'iam_policy.proto');
      // no-any disabled because if the accessed fields are non-existent, this
      // test will fail anyway.
      // tslint:disable-next-line:no-any
      const protos = grpcClient.loadProto(nonExistentDir, iamService) as any;
      expect(protos.google.iam.v1.IAMPolicy).to.be.a('Function');
    });

    it('should emit an error for not found proto', () => {
      const nonExistentDir = path.join(__dirname, 'nonexistent', 'dir');
      const nonExistentFile = 'nonexistent.proto';
      expect(
        grpcClient.loadProto.bind(null, nonExistentDir, nonExistentFile)
      ).to.throw();
    });
  });

  describe('GoogleProtoFilesRoot', () => {
    const FIXTURES_DIR = path.join(
      path.resolve(__dirname, '../../test'),
      'fixtures',
      'google',
      'example',
      'library',
      'v1'
    );
    const TEST_FILE = path.join(FIXTURES_DIR, 'library.proto');
    const NON_EXISTENT_FILE = path.join(
      __dirname,
      'does',
      'not',
      'exist.proto'
    );
    const MISSING_INCLUDE_FILE = path.join(
      FIXTURES_DIR,
      'missing_include.proto'
    );

    describe('use with protobufjs load', () => {
      it('should not be able to load test file using protobufjs directly', done => {
        protobuf
          .load(TEST_FILE)
          .then(() => {
            done(Error('should not get here'));
          })
          .catch(() => {
            done();
          });
      });

      it('should load a test file', done => {
        protobuf
          .load(TEST_FILE, new GoogleProtoFilesRoot())
          .then(root => {
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

      it('should fail trying to load a non existent file.', done => {
        protobuf
          .load(NON_EXISTENT_FILE, new GoogleProtoFilesRoot())
          .then(() => {
            done(Error('should not get here'));
          })
          .catch(() => {
            done();
          });
      });

      it('should fail loading a file with a missing include.', done => {
        protobuf
          .load(MISSING_INCLUDE_FILE, new GoogleProtoFilesRoot())
          .then(() => {
            done(Error('should not get here'));
          })
          .catch(() => {
            done();
          });
      });
    });

    describe('use with protobufjs loadSync', () => {
      it('should not be able to load test file using protobufjs directly', () => {
        const root = protobuf.loadSync(TEST_FILE);
        // Common proto that should not have been loaded.
        expect(root.lookup('google.api.Http')).to.eq(null);
      });

      it('should load a test file that relies on common protos', () => {
        const root = protobuf.loadSync(TEST_FILE, new GoogleProtoFilesRoot());
        expect(root).to.be.an.instanceOf(protobuf.Root);
        expect(
          root.lookup('google.example.library.v1.LibraryService')
        ).to.be.an.instanceOf(protobuf.Service);
        expect(root.lookup('test.TestMessage')).to.be.an.instanceOf(
          protobuf.Type
        );
      });

      it('should fail trying to load a non existent file.', () => {
        expect(
          protobuf.loadSync.bind(
            null,
            NON_EXISTENT_FILE,
            new GoogleProtoFilesRoot()
          )
        ).to.throw();
      });

      it('should fail loading a file with a missing include', () => {
        expect(
          protobuf.loadSync.bind(
            null,
            MISSING_INCLUDE_FILE,
            new GoogleProtoFilesRoot()
          )
        ).to.throw();
      });
    });

    describe('_findIncludePath', () => {
      const originPath = path.join('test', 'path', 'location');
      const includePath = path.join('example', 'import.proto');

      it('should throw an error if a file is not found', () => {
        const findIncludePath = proxyquire('../src/grpc', {
          fs: {
            existsSync: () => {
              return false;
            },
          },
        }).GoogleProtoFilesRoot._findIncludePath;

        expect(findIncludePath.bind(null, originPath, includePath)).to.throw();
      });

      it('should return the correct resolved import path', () => {
        const correctPath = path.join('test', 'example', 'import.proto');
        const findIncludePath = proxyquire('../src/grpc', {
          fs: {
            existsSync(path) {
              return path === correctPath;
            },
          },
        }).GoogleProtoFilesRoot._findIncludePath;
        expect(findIncludePath(originPath, includePath)).to.equal(correctPath);
      });
    });
  });
});
