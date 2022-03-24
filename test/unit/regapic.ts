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

/* xslint-disable @typescript-eslint/ban-ts-ignore */
/* xslint-disable no-undef */

import * as assert from 'assert';
import {describe, it, afterEach, before} from 'mocha';
import * as nodeFetch from 'node-fetch';
import * as protobuf from 'protobufjs';
import * as path from 'path';
import * as sinon from 'sinon';
import {echoProtoJson} from '../fixtures/echoProtoJson';
import {GrpcClient} from '../../src/fallback';
import {OAuth2Client} from 'google-auth-library';
import {GrpcClientOptions} from '../../src';
// import * as protosOp from '../../protos/operations';
// import * as protosEcho from '../fixtures/google-gax-packaging-test-app/protos/protos';
// import * as longrunning from '../../src/longRunningCalls/longrunning';

const authClient = {
  async getRequestHeaders() {
    return {Authorization: 'Bearer SOME_TOKEN'};
  },
};

const authStub = {
  async getClient() {
    return authClient;
  },
};

const opts = {
  auth: authStub,
  fallback: 'rest', // enabling REGAPIC
} as unknown as (GrpcClientOptions | {auth: OAuth2Client}) & {
  fallback?: boolean | 'rest' | 'proto';
};

function generateSampleMessage<T extends object>(instance: T) {
  const filledObject = (
    instance.constructor as typeof protobuf.Message
  ).toObject(instance as protobuf.Message<T>, {defaults: true});
  return (instance.constructor as typeof protobuf.Message).fromObject(
    filledObject
  ) as T;
}

describe('regapic', () => {
  let gaxGrpc: GrpcClient,
    protos: protobuf.NamespaceBase,
    libProtos: protobuf.NamespaceBase,
    echoService: protobuf.Service,
    libraryService: protobuf.Service,
    operationService: protobuf.Service,
    stubOptions: {};

  before(() => {
    stubOptions = {
      servicePath: 'foo.example.com',
      port: 443,
    };

    gaxGrpc = new GrpcClient(opts);
    protos = gaxGrpc.loadProto(echoProtoJson);
    echoService = protos.lookupService('Echo');
    operationService = protos.lookupService('Operations');
    const TEST_JSON = path.resolve(
      __dirname,
      '..',
      '..',
      'test',
      'fixtures',
      'library.json'
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    libProtos = gaxGrpc.loadProtoJSON(require(TEST_JSON));
    libraryService = libProtos.lookupService('LibraryService');
    stubOptions = {
      servicePath: 'foo.example.com',
      port: 443,
    };
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should make a request', done => {
    const requestObject = {content: 'test-content'};
    // incomplete types for nodeFetch, so...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    sinon.stub(nodeFetch, 'Promise' as any).returns(
      Promise.resolve({
        ok: true,
        arrayBuffer: () => {
          return Promise.resolve(Buffer.from(JSON.stringify(requestObject)));
        },
      })
    );

    gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
      echoStub.echo(requestObject, {}, {}, (err?: {}, result?: {}) => {
        assert.strictEqual(err, null);
        assert.strictEqual(
          requestObject.content,
          (result as {content: string}).content
        );
        done();
      });
    });
  });

  describe('should support enum conversion in proto message', () => {
    it('should support enum conversion in proto message response', done => {
      const requestObject = {name: 'shelves/shelf-name'};
      const responseObject = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 1,
      };
      // incomplete types for nodeFetch, so...
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sinon.stub(nodeFetch, 'Promise' as any).returns(
        Promise.resolve({
          ok: true,
          arrayBuffer: () => {
            return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
          },
        })
      );

      gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
        libStub.getShelf(requestObject, {}, {}, (err?: {}, result?: {}) => {
          assert.strictEqual(err, null);
          assert.strictEqual(
            'shelf-name',
            (result as {name: {}; theme: {}; type: {}}).name
          );
          assert.strictEqual(
            'TYPEONE',
            (result as {name: {}; theme: {}; type: {}}).type
          );
          done();
        });
      }, /* catch: */ done);
    });

    it('should support enum conversion in proto message request using symbolic name', done => {
      const shelf = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 'TYPEONE',
      };
      const requestObject = {shelf: shelf};
      // incomplete types for nodeFetch, so...
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sinon.stub(nodeFetch, 'Promise' as any).returns(
        Promise.resolve({
          ok: true,
          arrayBuffer: () => {
            return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
          },
        })
      );
      gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
        libStub.createShelf(requestObject, {}, {}, (err?: {}) => {
          assert.strictEqual(err, null);
          done();
        });
      }, /* catch: */ done);
    });

    it('should support enum conversion in proto message request using type value', done => {
      const shelf = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 1,
      };
      const requestObject = {shelf: shelf};
      // incomplete types for nodeFetch, so...
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sinon.stub(nodeFetch, 'Promise' as any).returns(
        Promise.resolve({
          ok: true,
          arrayBuffer: () => {
            return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
          },
        })
      );
      gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
        libStub.createShelf(requestObject, {}, {}, (err?: {}) => {
          assert.strictEqual(err, null);
          done();
        });
      }, /* catch: */ done);
    });
  });

  describe('should support long data type conversion in proto message', () => {
    it('large number long data type conversion in proto message response', done => {
      const requestObject = {name: 'shelves/shelf-name/books/book-name'};
      const responseObject = {
        name: 'book-name',
        author: 'book-author',
        title: 'book-title',
        read: true,
        bookId: 9007199254740992,
      };
      // incomplete types for nodeFetch, so...
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sinon.stub(nodeFetch, 'Promise' as any).returns(
        Promise.resolve({
          ok: true,
          arrayBuffer: () => {
            return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
          },
        })
      );
      gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
        libStub.getBook(requestObject, {}, {}, (err?: {}, result?: {}) => {
          assert.strictEqual(err, null);
          assert.strictEqual(
            'book-name',
            (
              result as {
                name: {};
                author: {};
                title: {};
                read: false;
                bookId: {};
              }
            ).name
          );
          assert.strictEqual(
            '9007199254740992',
            (
              result as {
                name: {};
                author: {};
                title: {};
                read: false;
                bookId: {};
              }
            ).bookId
          );
          done();
        });
      }, /* catch: */ done);
    });

    it('small number long data type conversion in proto message response', done => {
      const requestObject = {name: 'shelves/shelf-name/books/book-name'};
      const responseObject = {
        name: 'book-name',
        author: 'book-author',
        title: 'book-title',
        read: true,
        bookId: 42,
      };
      // incomplete types for nodeFetch, so...
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sinon.stub(nodeFetch, 'Promise' as any).returns(
        Promise.resolve({
          ok: true,
          arrayBuffer: () => {
            return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
          },
        })
      );
      gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
        libStub.getBook(requestObject, {}, {}, (err?: {}, result?: {}) => {
          assert.strictEqual(err, null);
          assert.strictEqual(
            'book-name',
            (
              result as {
                name: {};
                author: {};
                title: {};
                read: false;
                bookId: {};
              }
            ).name
          );
          assert.strictEqual(
            '42',
            (
              result as {
                name: {};
                author: {};
                title: {};
                read: false;
                bookId: {};
              }
            ).bookId
          );
          done();
        });
      }, /* catch: */ done);
    });

    it('long data type conversion in proto message request', done => {
      const bookId = 9007199254740992;
      const requestObject = {name: `shelves/shelf-name/book_id/${bookId}`};
      const responseObject = {
        name: 'book-name',
        author: 'book-author',
        title: 'book-title',
        read: true,
        bookId: bookId,
      };
      // incomplete types for nodeFetch, so...
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      sinon.stub(nodeFetch, 'Promise' as any).returns(
        Promise.resolve({
          ok: true,
          arrayBuffer: () => {
            return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
          },
        })
      );
      gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
        libStub.getBook(requestObject, {}, {}, (err?: {}, result?: {}) => {
          assert.strictEqual(err, null);
          assert.strictEqual(
            'book-name',
            (
              result as {
                name: {};
                author: {};
                title: {};
                read: false;
                bookId: {};
              }
            ).name
          );
          assert.strictEqual(
            bookId.toString(),
            (
              result as {
                name: {};
                author: {};
                title: {};
                read: false;
                bookId: {};
              }
            ).bookId
          );
          done();
        });
      }, /* catch: */ done);
    });
  });

  // describe.skip('REGAPIC long running operation', () => {
  //   function stubLongRunningCall<ResponseType>(
  //     response?: ResponseType,
  //     callError?: Error,
  //     lroError?: Error
  //   ) {
  //     const innerStub = lroError
  //       ? sinon.stub().rejects(lroError)
  //       : sinon.stub().resolves([response]);
  //     const mockOperation = {
  //       promise: innerStub,
  //     };
  //     return callError
  //       ? sinon.stub().rejects(callError)
  //       : sinon.stub().resolves([mockOperation]);
  //   }
  //   it('success lro', async done => {
  //     const request = generateSampleMessage(
  //       new protosEcho.google.showcase.v1beta1.WaitRequest()
  //     );
  //     const expectedOperation = generateSampleMessage(
  //       new protosOp.google.longrunning.Operation()
  //     );
  //     const expectedResponse = {
  //       response: generateSampleMessage(
  //         new protosEcho.google.showcase.v1beta1.WaitResponse()
  //       ),
  //       metadata: generateSampleMessage(
  //         new protosEcho.google.showcase.v1beta1.WaitMetadata()
  //       ),
  //     };
  //     // incomplete types for nodeFetch, so...
  //     // eslint-disable-next-line @typescript-eslint/no-explicit-any
  //     sinon.stub(nodeFetch, 'Promise' as any).returns(
  //       Promise.resolve({
  //         ok: true,
  //         arrayBuffer: () => {
  //           return Promise.resolve(
  //             Buffer.from(JSON.stringify(expectedOperation))
  //           );
  //         },
  //       })
  //     );
  //     sinon.stub(nodeFetch, 'Promise' as any).returns(
  //       Promise.resolve({
  //         ok: true,
  //         arrayBuffer: () => {
  //           return Promise.resolve(
  //             Buffer.from(JSON.stringify(expectedResponse))
  //           );
  //         },
  //       })
  //     );
  //     const echoStub = await gaxGrpc.createStub(echoService, stubOptions);
  //     echoStub.wait(request, {}, {}, (err?: {}, response?: {}) => {
  //       console.log('---operation:: ', response);
  //       assert.strictEqual(err, null);
  //       assert.strictEqual(response, expectedOperation);
  //       const operation = response as unknown as longrunning.Operation;
  //       console.log('--opeation:: ', operation);
  //       return operation.promise();
  //     });

  //     const operationStub = await gaxGrpc.createStub(
  //       operationService,
  //       stubOptions
  //     );
  //     const opRequest = generateSampleMessage(
  //       new protosOp.google.longrunning.GetOperationRequest()
  //     );
  //     operationStub.getOperation(
  //       opRequest,
  //       {},
  //       {},
  //       (err?: {}, results?: {}) => {
  //         console.log('-----results:: ', results);
  //         assert.strictEqual(err, null);
  //         assert.strictEqual(results, expectedResponse);
  //       }
  //     );
  //     done();
  //   });
  // });
});
