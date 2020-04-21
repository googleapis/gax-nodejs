/**
 * Copyright 2020 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* eslint-disable @typescript-eslint/ban-ts-ignore */

import {expect} from 'chai';
import * as path from 'path';
import * as proxyquire from 'proxyquire';
import * as sinon from 'sinon';
import {describe, it, beforeEach} from 'mocha';

import {protobuf} from '../../src/index';
import {
  GoogleProtoFilesRoot,
  GrpcClient,
  GrpcClientOptions,
  GrpcModule,
} from '../../src/grpc';

function gaxGrpc(options?: GrpcClientOptions) {
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
      const mockGrpc = ({} as unknown) as GrpcModule;
      expect(gaxGrpc({grpc: mockGrpc}).grpcVersion).to.eq('');
    });
  });

  describe('metadataBuilder', () => {
    const grpcClient = gaxGrpc();

    it('builds metadata', () => {
      const headers: {[name: string]: string} = {
        'X-Dummy-Header': 'Dummy value',
        'Other-Header': 'Other value',
        'X-Goog-Api-Client': 'gl-node/6.6.0 gccl/0.7.0 gax/0.11.0 grpc/1.1.0',
      };
      const builder = grpcClient.metadataBuilder(headers);
      const metadata = builder();
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
    class DummyStub {
      constructor(public address: {}, public creds: {}, public options: {}) {}
    }
    let grpcClient: GrpcClient;
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
      grpcClient = gaxGrpc(({
        auth: stubAuth,
        grpc: stubGrpc,
      } as unknown) as GrpcClientOptions);
    });

    it('creates a stub', () => {
      const opts = {servicePath: 'foo.example.com', port: 443};
      // @ts-ignore
      return grpcClient.createStub(DummyStub, opts).then(stub => {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        expect(stub.creds).to.deep.eq(dummyChannelCreds);
        expect(stub.options).to.deep.eq({
          'grpc.max_receive_message_length': -1,
        });
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
      // @ts-ignore
      return grpcClient.createStub(DummyStub, opts).then(stub => {
        expect(stub).to.be.an.instanceOf(DummyStub);
        expect(stub.address).to.eq('foo.example.com:443');
        expect(stub.creds).to.deep.eq(dummyChannelCreds);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (expect(stub.options).has as any).key([
          'grpc.max_send_message_length',
          'grpc.initial_reconnect_backoff_ms',
          'grpc.max_receive_message_length', // added by createStub
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (expect(stub.options).to.not.have as any).key([
          'servicePath',
          'port',
          'other_dummy_options',
        ]);
      });
    });

    it('supports the older grpc options logic for compatibility', () => {
      const opts = {
        servicePath: 'foo.example.com',
        port: 443,
        'grpc.grpc.max_send_message_length': 10 * 1024 * 1024,
      };
      // @ts-ignore
      return grpcClient.createStub(DummyStub, opts).then(stub => {
        expect(stub).to.be.an.instanceOf(DummyStub);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (expect(stub.options).has as any).key([
          'grpc.max_send_message_length',
          'grpc.max_receive_message_length', // added by createStub
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (expect(stub.options).to.not.have as any).key(['servicePath', 'port']);
      });
    });

    it('makes it possible to override grpc.max_receive_message_length', () => {
      const opts = {
        servicePath: 'foo.example.com',
        port: 443,
        'grpc.max_receive_message_length': 10 * 1024 * 1024,
      };
      // @ts-ignore
      return grpcClient.createStub(DummyStub, opts).then(stub => {
        expect(stub).to.be.an.instanceOf(DummyStub);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (expect(stub.options).has as any).key([
          'grpc.max_receive_message_length',
        ]);
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (expect(stub.options).to.not.have as any).key(['servicePath', 'port']);
        expect(stub.options['grpc.max_receive_message_length']).to.equal(
          10 * 1024 * 1024
        );
      });
    });

    it('uses the passed grpc channel credentials', () => {
      const customCreds = {channelCreds: 'custom'};
      const opts = {
        servicePath: 'foo.example.com',
        port: 443,
        sslCreds: customCreds,
      };
      // @ts-ignore
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
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const protos = grpcClient.loadProto(TEST_PATH, TEST_FILE) as any;
      expect(protos.google.example.library.v1.LibraryService).to.be.a(
        'Function'
      );
    });

    it('should load the test file using single parameter syntax', () => {
      const fullPath = path.join(TEST_PATH, TEST_FILE);
      // no-any disabled because if the accessed fields are non-existent, this
      // test will fail anyway.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const protos = grpcClient.loadProto(fullPath) as any;
      expect(protos.google.example.library.v1.LibraryService).to.be.a(
        'Function'
      );
    });

    it('should load a common proto', () => {
      const nonExistentDir = path.join(__dirname, 'nonexistent', 'dir');
      const iamService = path.join('google', 'iam', 'v1', 'iam_policy.proto');
      // no-any disabled because if the accessed fields are non-existent, this
      // test will fail anyway.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const protos = grpcClient.loadProto(nonExistentDir, iamService) as any;
      expect(protos.google.iam.v1.IAMPolicy).to.be.a('Function');
    });

    it('should be able to load no files', () => {
      const protos = grpcClient.loadProto('.', []);
      expect(protos).to.deep.equal({});
    });

    it('should load multiple files', () => {
      const iamService = path.join('google', 'iam', 'v1', 'iam_policy.proto');
      // no-any disabled because if the accessed fields are non-existent, this
      // test will fail anyway.
      const protos = grpcClient.loadProto(TEST_PATH, [
        TEST_FILE,
        iamService,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ]) as any;
      expect(protos.google.example.library.v1.LibraryService).to.be.a(
        'Function'
      );
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
        const findIncludePath = proxyquire('../../src/grpc', {
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
        const findIncludePath = proxyquire('../../src/grpc', {
          fs: {
            existsSync(path: string) {
              return path === correctPath;
            },
          },
        }).GoogleProtoFilesRoot._findIncludePath;
        expect(findIncludePath(originPath, includePath)).to.equal(correctPath);
      });
    });
  });
});
