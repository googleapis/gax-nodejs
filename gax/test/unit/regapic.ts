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

import assert from 'assert';
import {describe, it, afterEach, before} from 'mocha';
import * as protobuf from 'protobufjs';
import * as path from 'path';
import * as sinon from 'sinon';
import * as stream from 'stream';
import echoProtoJson = require('../fixtures/echo.json');
import {GrpcClient} from '../../src/fallback';
import * as transcoding from '../../src/transcoding';
import {OAuth2Client} from 'google-auth-library';
import {GrpcClientOptions} from '../../src';
import {StreamArrayParser} from '../../src/streamArrayParser';
import proxyquire from 'proxyquire';

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

describe('REGAPIC', () => {
  let gaxGrpc: GrpcClient,
    gaxGrpcNumericEnums: GrpcClient,
    gaxGrpcMinifyJson: GrpcClient,
    protos: protobuf.NamespaceBase,
    libProtos: protobuf.NamespaceBase,
    echoService: protobuf.Service,
    libraryService: protobuf.Service,
    stubOptions: {};

  before(() => {
    stubOptions = {
      servicePath: 'foo.example.com',
      port: 443,
    };

    gaxGrpc = new GrpcClient(opts);
    gaxGrpcNumericEnums = new GrpcClient({
      ...opts,
      numericEnums: true,
    });
    gaxGrpcMinifyJson = new GrpcClient({
      ...opts,
      minifyJson: true,
    });
    protos = gaxGrpc.loadProto(echoProtoJson);
    echoService = protos.lookupService('Echo');
    const TEST_JSON = path.resolve(
      __dirname,
      '..',
      '..',
      'test',
      'fixtures',
      'library.json',
    );
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    libProtos = gaxGrpc.loadProtoJSON(require(TEST_JSON));
    libraryService = libProtos.lookupService('LibraryService');
  });

  afterEach(() => {
    sinon.restore();
  });
  it('should make a request', async () => {
    const requestObject = {content: 'test-content'};

    const {GrpcClient} = await proxyquire('../../src/fallback.js', {
      'node-fetch': () => {
        return Promise.resolve({
          ok: true,
          arrayBuffer: () => {
            return Promise.resolve(Buffer.from(JSON.stringify(requestObject)));
          },
        });
      },
    });

    const gaxGrpcMock = new GrpcClient();

    (await gaxGrpcMock)
      .createStub(echoService, stubOptions)
      .then((echoStub: any) => {
        echoStub.echo(requestObject, {}, {}, (err?: {}, result?: {}) => {
          assert.strictEqual(err, null);
          assert.strictEqual(
            requestObject.content,
            (result as {content: string}).content,
          );
        });
      });
  });

  it('should make a streaming request', async () => {
    const requestObject = {content: 'test content'};
    const responseObject = [{content: 'test'}, {content: 'content'}];
    const responseObjectJson = JSON.stringify(responseObject, null, '  ');
    const responseStream = new stream.Readable();
    responseStream.push(responseObjectJson.slice(0, 10));
    responseStream.push(responseObjectJson.slice(10));
    responseStream.push(null);
    // incomplete types for nodeFetch, so...
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const {GrpcClient} = await proxyquire('../../src/fallback.js', {
      'node-fetch': () => {
        return Promise.resolve({
          ok: true,
          body: responseStream,
        });
      },
    });

    const gaxGrpcMock = new GrpcClient();

    gaxGrpcMock.createStub(echoService, stubOptions).then((echoStub: any) => {
      const stream = echoStub.expand(
        requestObject,
        {},
        {},
        () => {},
      ) as StreamArrayParser;
      const results: {}[] = [];
      stream.on('data', (data: {}) => {
        results.push(data);
      });
      stream.on('error', () => {
        return;
      });
      stream.on('end', () => {
        assert.deepStrictEqual(results, responseObject);
      });
    });
  });

  it('should handle fetch failure', async () => {
    const requestObject = {content: 'test-content'};

    const {GrpcClient} = await proxyquire('../../src/fallback.js', {
      'node-fetch': () => {
        return Promise.reject(new Error('Fetch error'));
      },
    });

    const gaxGrpcMock = new GrpcClient();

    gaxGrpcMock.createStub(echoService, stubOptions).then((echoStub: any) => {
      echoStub.echo(requestObject, {}, {}, (err?: {}) => {
        assert.strictEqual((err as Error).message, 'Fetch error');
      });
    });
  });

  it('should handle streaming request failure', async () => {
    const requestObject = {content: 'test content'};

    const {GrpcClient} = await proxyquire('../../src/fallback.js', {
      'node-fetch': () => {
        return Promise.reject(new Error('Fetch error'));
      },
    });

    const gaxGrpcMock = new GrpcClient();
    gaxGrpc
      .createStub(echoService, stubOptions)
      .then((echoStub: any) => {
        const stream = echoStub.expand(requestObject) as StreamArrayParser;
        stream.on('error', (err: Error) => {
          assert.strictEqual((err as Error).message, 'Fetch error');
        });
      })
      .catch(console.error);
  });

  describe('should support enum conversion in proto message', () => {
    it('should support enum conversion in proto message response', async () => {
      const requestObject = {name: 'shelves/shelf-name'};
      const responseObject = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 1,
      };
      const spy = sinon.spy();

      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(
                Buffer.from(JSON.stringify(responseObject)),
              );
            },
          });
        },
        '../src/transcoding.js': {transcode: spy},
      });

      const gaxGrpcMock = new GrpcClient();

      gaxGrpcMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
          libStub.getShelf(requestObject, {}, {}, (err?: {}, result?: {}) => {
            assert.strictEqual(spy.getCall(0).returnValue?.queryString, '');
            assert.strictEqual(err, null);
            assert.strictEqual(
              'shelf-name',
              (result as {name: {}; theme: {}; type: {}}).name,
            );
            assert.strictEqual(
              'TYPEONE',
              (result as {name: {}; theme: {}; type: {}}).type,
            );
          });
        });
    });

    it('should support enum conversion in proto message request using symbolic name', async () => {
      const shelf = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 'TYPEONE',
      };
      const requestObject = {shelf: shelf};
      const spy = sinon.spy();

      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
            },
          });
        },
        '../src/transcoding.js': {transcode: spy},
      });

      const gaxGrpcMock = new GrpcClient();

      gaxGrpcMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
          libStub.createShelf(requestObject, {}, {}, (err?: {}) => {
            assert.strictEqual(spy.getCall(0).returnValue?.queryString, '');
            assert.strictEqual(err, null);
          });
        });
    });

    it('should support enum conversion in proto message request using type value', async () => {
      const shelf = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 1,
      };
      const requestObject = {shelf: shelf};
      const spy = sinon.spy();

      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
            },
          });
        },
        '../src/transcoding.js': {transcode: spy},
      });

      const gaxGrpcMock = new GrpcClient();
      gaxGrpcMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
          libStub.createShelf(requestObject, {}, {}, (err?: {}) => {
            assert.strictEqual(spy.getCall(0).returnValue?.queryString, '');
            assert.strictEqual(err, null);
          });
        });
    });
  });

  describe('should support enum conversion in proto message with numeric enums enabled', () => {
    it('should support enum conversion in proto message response', async () => {
      const requestObject = {name: 'shelves/shelf-name'};
      const responseObject = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 100, // unknown enum value
      };
      const spy = sinon.spy();

      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(
                Buffer.from(JSON.stringify(responseObject)),
              );
            },
          });
        },
        '../src/transcoding.js': {transcode: spy},
      });

      const gaxGrpcNumericEnumsMock = new GrpcClient({
        ...opts,
        numericEnums: true,
      });

      gaxGrpcNumericEnumsMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
          libStub.getShelf(requestObject, {}, {}, (err?: {}, result?: {}) => {
            assert.strictEqual(
              spy.getCall(0).returnValue?.queryString,
              '$alt=json%3Benum-encoding=int',
            );
            assert.strictEqual(err, null);
            assert.strictEqual(
              'shelf-name',
              (result as {name: {}; theme: {}; type: {}}).name,
            );
            assert.strictEqual(
              100,
              (result as {name: {}; theme: {}; type: {}}).type,
            );
          });
        });
    });

    it('should request numeric enums if passed as symbolic name', async () => {
      const shelf = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 'TYPEONE',
      };
      const requestObject = {shelf: shelf};
      const spy = sinon.spy();

      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
            },
          });
        },
        '../src/transcoding.js': {transcode: spy},
      });

      const gaxGrpcNumericEnumsMock = new GrpcClient({
        ...opts,
        numericEnums: true,
      });
      gaxGrpcNumericEnumsMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
          libStub.createShelf(requestObject, {}, {}, (err?: {}) => {
            assert.strictEqual(
              spy.getCall(0).returnValue?.queryString,
              '$alt=json%3Benum-encoding=int',
            );
            assert.strictEqual(err, null);
          });
        });
    });

    it('should preserve query string when appending numeric enums parameter', async () => {
      const shelf = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 'TYPEONE',
      };
      const requestObject = {
        shelf: shelf,
        queryStringParameter: 'must-be-preserved',
      };
      const spy = sinon.spy();

      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
            },
          });
        },
        '../src/transcoding.js': {transcode: spy},
      });

      const gaxGrpcNumericEnumsMock = new GrpcClient({
        ...opts,
        numericEnums: true,
      });
      gaxGrpcNumericEnumsMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
          libStub.createShelf(requestObject, {}, {}, (err?: {}) => {
            assert.strictEqual(
              spy.getCall(0).returnValue?.queryString,
              'queryStringParameter=must-be-preserved&$alt=json%3Benum-encoding=int',
            );
            assert.strictEqual(err, null);
          });
        });
    });

    it('should request numeric enums if passed as an unknown number', async () => {
      const shelf = {
        name: 'shelf-name',
        theme: 'shelf-theme',
        type: 100,
      };
      const requestObject = {shelf: shelf};
      const spy = sinon.spy();

      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
            },
          });
        },
        '../src/transcoding.js': {transcode: spy},
      });

      const gaxGrpcNumericEnumsMock = new GrpcClient({
        ...opts,
        numericEnums: true,
      });
      gaxGrpcNumericEnumsMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
          libStub.createShelf(requestObject, {}, {}, (err?: {}) => {
            assert.strictEqual(
              spy.getCall(0).returnValue?.queryString,
              '$alt=json%3Benum-encoding=int',
            );
            assert.strictEqual(err, null);
          });
        });
    });
  });

  describe('should support long data type conversion in proto message', () => {
    it('large number long data type conversion in proto message response', async () => {
      const requestObject = {name: 'shelves/shelf-name/books/book-name'};
      const responseObject = {
        name: 'book-name',
        author: 'book-author',
        title: 'book-title',
        read: true,
        bookId: 9007199254740992,
      };

      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(
                Buffer.from(JSON.stringify(responseObject)),
              );
            },
          });
        },
      });

      const gaxGrpcMock = new GrpcClient();
      gaxGrpcMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
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
              ).name,
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
              ).bookId,
            );
          });
        });
    });

    it('small number long data type conversion in proto message response', async () => {
      const requestObject = {name: 'shelves/shelf-name/books/book-name'};
      const responseObject = {
        name: 'book-name',
        author: 'book-author',
        title: 'book-title',
        read: true,
        bookId: 42,
      };
      // incomplete types for nodeFetch, so...
      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(
                Buffer.from(JSON.stringify(responseObject)),
              );
            },
          });
        },
      });

      const gaxGrpcMock = new GrpcClient();
      gaxGrpcMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
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
              ).name,
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
              ).bookId,
            );
          });
        });
    });

    it('long data type conversion in proto message request', async () => {
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
      const {GrpcClient} = await proxyquire('../../src/fallback.js', {
        'node-fetch': () => {
          return Promise.resolve({
            ok: true,
            arrayBuffer: () => {
              return Promise.resolve(
                Buffer.from(JSON.stringify(responseObject)),
              );
            },
          });
        },
      });

      const gaxGrpcMock = new GrpcClient();
      gaxGrpcMock
        .createStub(libraryService, stubOptions)
        .then((libStub: any) => {
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
              ).name,
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
              ).bookId,
            );
          });
        });
    });
  });
});
