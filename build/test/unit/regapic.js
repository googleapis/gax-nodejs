"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require("assert");
const mocha_1 = require("mocha");
const nodeFetch = require("node-fetch");
const path = require("path");
const sinon = require("sinon");
const stream = require("stream");
const echoProtoJson = require("../fixtures/echo.json");
const fallback_1 = require("../../src/fallback");
const transcoding = require("../../src/transcoding");
const authClient = {
    async getRequestHeaders() {
        return { Authorization: 'Bearer SOME_TOKEN' };
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
};
(0, mocha_1.describe)('REGAPIC', () => {
    let gaxGrpc, gaxGrpcNumericEnums, protos, libProtos, echoService, libraryService, stubOptions;
    (0, mocha_1.before)(() => {
        stubOptions = {
            servicePath: 'foo.example.com',
            port: 443,
        };
        gaxGrpc = new fallback_1.GrpcClient(opts);
        gaxGrpcNumericEnums = new fallback_1.GrpcClient({
            ...opts,
            numericEnums: true,
        });
        protos = gaxGrpc.loadProto(echoProtoJson);
        echoService = protos.lookupService('Echo');
        const TEST_JSON = path.resolve(__dirname, '..', '..', 'test', 'fixtures', 'library.json');
        // eslint-disable-next-line @typescript-eslint/no-var-requires
        libProtos = gaxGrpc.loadProtoJSON(require(TEST_JSON));
        libraryService = libProtos.lookupService('LibraryService');
    });
    (0, mocha_1.afterEach)(() => {
        sinon.restore();
    });
    (0, mocha_1.it)('should make a request', done => {
        const requestObject = { content: 'test-content' };
        // incomplete types for nodeFetch, so...
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
            ok: true,
            arrayBuffer: () => {
                return Promise.resolve(Buffer.from(JSON.stringify(requestObject)));
            },
        }));
        gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
            echoStub.echo(requestObject, {}, {}, (err, result) => {
                assert.strictEqual(err, null);
                assert.strictEqual(requestObject.content, result.content);
                done();
            });
        });
    });
    (0, mocha_1.it)('should make a streaming request', done => {
        const requestObject = { content: 'test content' };
        const responseObject = [{ content: 'test' }, { content: 'content' }];
        const responseObjectJson = JSON.stringify(responseObject, null, '  ');
        const responseStream = new stream.Readable();
        responseStream.push(responseObjectJson.slice(0, 10));
        responseStream.push(responseObjectJson.slice(10));
        responseStream.push(null);
        // incomplete types for nodeFetch, so...
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
            ok: true,
            body: responseStream,
        }));
        gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
            const stream = echoStub.expand(requestObject, {}, {}, () => { });
            const results = [];
            stream.on('data', data => {
                results.push(data);
            });
            stream.on('error', done);
            stream.on('end', () => {
                assert.deepStrictEqual(results, responseObject);
                done();
            });
        });
    });
    (0, mocha_1.it)('should handle fetch failure', done => {
        const requestObject = { content: 'test-content' };
        sinon
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .stub(nodeFetch, 'Promise')
            .returns(Promise.reject(new Error('Fetch error')));
        gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
            echoStub.echo(requestObject, {}, {}, (err) => {
                assert.strictEqual(err.message, 'Fetch error');
                done();
            });
        });
    });
    (0, mocha_1.it)('should handle streaming request failure', done => {
        const requestObject = { content: 'test content' };
        sinon
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            .stub(nodeFetch, 'Promise')
            .returns(Promise.reject(new Error('Fetch error')));
        gaxGrpc.createStub(echoService, stubOptions).then(echoStub => {
            const stream = echoStub.expand(requestObject);
            stream.on('error', err => {
                assert.strictEqual(err.message, 'Fetch error');
                done();
            });
        });
    });
    (0, mocha_1.describe)('should support enum conversion in proto message', () => {
        (0, mocha_1.it)('should support enum conversion in proto message response', done => {
            const requestObject = { name: 'shelves/shelf-name' };
            const responseObject = {
                name: 'shelf-name',
                theme: 'shelf-theme',
                type: 1,
            };
            const spy = sinon.spy(transcoding, 'transcode');
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
                },
            }));
            gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
                libStub.getShelf(requestObject, {}, {}, (err, result) => {
                    var _a;
                    assert.strictEqual((_a = spy.getCall(0).returnValue) === null || _a === void 0 ? void 0 : _a.queryString, '');
                    assert.strictEqual(err, null);
                    assert.strictEqual('shelf-name', result.name);
                    assert.strictEqual('TYPEONE', result.type);
                    done();
                });
            }, /* catch: */ done);
        });
        (0, mocha_1.it)('should support enum conversion in proto message request using symbolic name', done => {
            const shelf = {
                name: 'shelf-name',
                theme: 'shelf-theme',
                type: 'TYPEONE',
            };
            const requestObject = { shelf: shelf };
            const spy = sinon.spy(transcoding, 'transcode');
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
                },
            }));
            gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
                libStub.createShelf(requestObject, {}, {}, (err) => {
                    var _a;
                    assert.strictEqual((_a = spy.getCall(0).returnValue) === null || _a === void 0 ? void 0 : _a.queryString, '');
                    assert.strictEqual(err, null);
                    done();
                });
            }, /* catch: */ done);
        });
        (0, mocha_1.it)('should support enum conversion in proto message request using type value', done => {
            const shelf = {
                name: 'shelf-name',
                theme: 'shelf-theme',
                type: 1,
            };
            const requestObject = { shelf: shelf };
            const spy = sinon.spy(transcoding, 'transcode');
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
                },
            }));
            gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
                libStub.createShelf(requestObject, {}, {}, (err) => {
                    var _a;
                    assert.strictEqual((_a = spy.getCall(0).returnValue) === null || _a === void 0 ? void 0 : _a.queryString, '');
                    assert.strictEqual(err, null);
                    done();
                });
            }, /* catch: */ done);
        });
    });
    (0, mocha_1.describe)('should support enum conversion in proto message with numeric enums enabled', () => {
        (0, mocha_1.it)('should support enum conversion in proto message response', done => {
            const requestObject = { name: 'shelves/shelf-name' };
            const responseObject = {
                name: 'shelf-name',
                theme: 'shelf-theme',
                type: 100, // unknown enum value
            };
            const spy = sinon.spy(transcoding, 'transcode');
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
                },
            }));
            gaxGrpcNumericEnums
                .createStub(libraryService, stubOptions)
                .then(libStub => {
                libStub.getShelf(requestObject, {}, {}, (err, result) => {
                    var _a;
                    assert.strictEqual((_a = spy.getCall(0).returnValue) === null || _a === void 0 ? void 0 : _a.queryString, '$alt=json%3Benum-encoding=int');
                    assert.strictEqual(err, null);
                    assert.strictEqual('shelf-name', result.name);
                    assert.strictEqual(100, result.type);
                    done();
                });
            }, /* catch: */ done);
        });
        (0, mocha_1.it)('should request numeric enums if passed as symbolic name', done => {
            const shelf = {
                name: 'shelf-name',
                theme: 'shelf-theme',
                type: 'TYPEONE',
            };
            const requestObject = { shelf: shelf };
            const spy = sinon.spy(transcoding, 'transcode');
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
                },
            }));
            gaxGrpcNumericEnums
                .createStub(libraryService, stubOptions)
                .then(libStub => {
                console.log(requestObject);
                libStub.createShelf(requestObject, {}, {}, (err) => {
                    var _a;
                    assert.strictEqual((_a = spy.getCall(0).returnValue) === null || _a === void 0 ? void 0 : _a.queryString, '$alt=json%3Benum-encoding=int');
                    assert.strictEqual(err, null);
                    done();
                });
            }, /* catch: */ done);
        });
        (0, mocha_1.it)('should preserve query string when appending numeric enums parameter', done => {
            const shelf = {
                name: 'shelf-name',
                theme: 'shelf-theme',
                type: 'TYPEONE',
            };
            const requestObject = {
                shelf: shelf,
                queryStringParameter: 'must-be-preserved',
            };
            const spy = sinon.spy(transcoding, 'transcode');
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
                },
            }));
            gaxGrpcNumericEnums
                .createStub(libraryService, stubOptions)
                .then(libStub => {
                libStub.createShelf(requestObject, {}, {}, (err) => {
                    var _a;
                    assert.strictEqual((_a = spy.getCall(0).returnValue) === null || _a === void 0 ? void 0 : _a.queryString, 'queryStringParameter=must-be-preserved&$alt=json%3Benum-encoding=int');
                    assert.strictEqual(err, null);
                    done();
                });
            }, /* catch: */ done);
        });
        (0, mocha_1.it)('should request numeric enums if passed as an unknown number', done => {
            const shelf = {
                name: 'shelf-name',
                theme: 'shelf-theme',
                type: 100,
            };
            const requestObject = { shelf: shelf };
            const spy = sinon.spy(transcoding, 'transcode');
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(shelf)));
                },
            }));
            gaxGrpcNumericEnums
                .createStub(libraryService, stubOptions)
                .then(libStub => {
                console.log(requestObject);
                libStub.createShelf(requestObject, {}, {}, (err) => {
                    var _a;
                    assert.strictEqual((_a = spy.getCall(0).returnValue) === null || _a === void 0 ? void 0 : _a.queryString, '$alt=json%3Benum-encoding=int');
                    assert.strictEqual(err, null);
                    done();
                });
            }, /* catch: */ done);
        });
    });
    (0, mocha_1.describe)('should support long data type conversion in proto message', () => {
        (0, mocha_1.it)('large number long data type conversion in proto message response', done => {
            const requestObject = { name: 'shelves/shelf-name/books/book-name' };
            const responseObject = {
                name: 'book-name',
                author: 'book-author',
                title: 'book-title',
                read: true,
                bookId: 9007199254740992,
            };
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
                },
            }));
            gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
                libStub.getBook(requestObject, {}, {}, (err, result) => {
                    assert.strictEqual(err, null);
                    assert.strictEqual('book-name', result.name);
                    assert.strictEqual('9007199254740992', result.bookId);
                    done();
                });
            }, /* catch: */ done);
        });
        (0, mocha_1.it)('small number long data type conversion in proto message response', done => {
            const requestObject = { name: 'shelves/shelf-name/books/book-name' };
            const responseObject = {
                name: 'book-name',
                author: 'book-author',
                title: 'book-title',
                read: true,
                bookId: 42,
            };
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
                },
            }));
            gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
                libStub.getBook(requestObject, {}, {}, (err, result) => {
                    assert.strictEqual(err, null);
                    assert.strictEqual('book-name', result.name);
                    assert.strictEqual('42', result.bookId);
                    done();
                });
            }, /* catch: */ done);
        });
        (0, mocha_1.it)('long data type conversion in proto message request', done => {
            const bookId = 9007199254740992;
            const requestObject = { name: `shelves/shelf-name/book_id/${bookId}` };
            const responseObject = {
                name: 'book-name',
                author: 'book-author',
                title: 'book-title',
                read: true,
                bookId: bookId,
            };
            // incomplete types for nodeFetch, so...
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            sinon.stub(nodeFetch, 'Promise').returns(Promise.resolve({
                ok: true,
                arrayBuffer: () => {
                    return Promise.resolve(Buffer.from(JSON.stringify(responseObject)));
                },
            }));
            gaxGrpc.createStub(libraryService, stubOptions).then(libStub => {
                libStub.getBook(requestObject, {}, {}, (err, result) => {
                    assert.strictEqual(err, null);
                    assert.strictEqual('book-name', result.name);
                    assert.strictEqual(bookId.toString(), result.bookId);
                    done();
                });
            }, /* catch: */ done);
        });
    });
});
//# sourceMappingURL=regapic.js.map