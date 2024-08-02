/**
 * Copyright 2022 Google LLC
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
'use strict';
Object.defineProperty(exports, "__esModule", { value: true });
const showcase_echo_client_1 = require("showcase-echo-client");
const showcase_server_1 = require("showcase-server");
const assert = require("assert");
const fs_1 = require("fs");
const path = require("path");
const google_gax_1 = require("google-gax");
async function testShowcase() {
    const grpcClientOpts = {
        grpc: google_gax_1.grpc,
        sslCreds: google_gax_1.grpc.credentials.createInsecure(),
    };
    const fakeGoogleAuth = {
        getClient: async () => {
            return {
                getRequestHeaders: async () => {
                    return {
                        Authorization: 'Bearer zzzz',
                    };
                },
            };
        },
    };
    const fallbackClientOpts = {
        fallback: true,
        protocol: 'http',
        port: 1337,
        auth: fakeGoogleAuth,
    };
    const restClientOpts = {
        fallback: 'rest',
        protocol: 'http',
        port: 7469,
        auth: fakeGoogleAuth,
    };
    const grpcClient = new showcase_echo_client_1.EchoClient(grpcClientOpts);
    const fallbackClient = new showcase_echo_client_1.EchoClient(fallbackClientOpts);
    const restClient = new showcase_echo_client_1.EchoClient(restClientOpts);
    // assuming gRPC server is started locally
    await testEcho(grpcClient);
    await testEchoError(grpcClient);
    await testExpand(grpcClient);
    await testPagedExpand(grpcClient);
    await testPagedExpandAsync(grpcClient);
    await testCollect(grpcClient);
    await testChat(grpcClient);
    await testWait(grpcClient);
    await testEcho(fallbackClient);
    await testEchoError(fallbackClient);
    await testExpandThrows(fallbackClient); // fallback does not support server streaming
    await testPagedExpand(fallbackClient);
    await testPagedExpandAsync(fallbackClient);
    await testCollectThrows(fallbackClient); // fallback does not support client streaming
    await testChatThrows(fallbackClient); // fallback does not support bidi streaming
    await testWait(fallbackClient);
    await testEcho(restClient);
    await testExpand(restClient); // REGAPIC supports server streaming
    await testPagedExpand(restClient);
    await testPagedExpandAsync(restClient);
    await testCollectThrows(restClient); // REGAPIC does not support client streaming
    await testChatThrows(restClient); // REGAPIC does not support bidi streaming
    await testWait(restClient);
}
async function testEcho(client) {
    const request = {
        content: 'test',
    };
    const timer = setTimeout(() => {
        throw new Error('End-to-end testEcho method fails with timeout');
    }, 12000);
    const [response] = await client.echo(request);
    clearTimeout(timer);
    assert.deepStrictEqual(request.content, response.content);
}
async function testEchoError(client) {
    const fixtureName = path.resolve(__dirname, '..', '..', '..', 'fixtures', 'multipleErrors.json');
    const protosPath = path.resolve(__dirname, '..', '..', '..', '..', 'build', 'protos', 'google', 'rpc');
    const data = await fs_1.promises.readFile(fixtureName, 'utf8');
    const root = google_gax_1.protobuf.loadSync(path.join(protosPath, 'error_details.proto'));
    const objs = JSON.parse(data);
    const details = [];
    const expectedDetails = [];
    let errorInfo;
    for (const obj of objs) {
        const MessageType = root.lookupType(obj.type);
        const buffer = MessageType.encode(obj.value).finish();
        details.push({
            type_url: 'type.googleapis.com/' + obj.type,
            value: buffer,
        });
        expectedDetails.push(obj.value);
        if (obj.type === 'google.rpc.ErrorInfo') {
            errorInfo = obj.value;
        }
    }
    const request = {
        error: {
            code: 3,
            message: 'Test error',
            details: details,
        },
    };
    const timer = setTimeout(() => {
        throw new Error('End-to-end testEchoError method fails with timeout');
    }, 12000);
    await assert.rejects(() => client.echo(request), Error);
    try {
        await client.echo(request);
    }
    catch (err) {
        clearTimeout(timer);
        assert.strictEqual(JSON.stringify(err.statusDetails), JSON.stringify(expectedDetails));
        assert.ok(errorInfo);
        assert.strictEqual(err.domain, errorInfo.domain);
        assert.strictEqual(err.reason, errorInfo.reason);
        assert.strictEqual(JSON.stringify(err.errorInfoMetadata), JSON.stringify(errorInfo.metadata));
    }
}
async function testExpand(client) {
    const words = ['nobody', 'ever', 'reads', 'test', 'input'];
    const request = {
        content: words.join(' '),
    };
    const stream = client.expand(request);
    const result = [];
    stream.on('data', (response) => {
        result.push(response.content);
    });
    stream.on('end', () => {
        assert.deepStrictEqual(words, result);
    });
}
async function testExpandThrows(client) {
    const words = ['nobody', 'ever', 'reads', 'test', 'input'];
    const request = {
        content: words.join(' '),
    };
    assert.throws(() => {
        const stream = client.expand(request);
        const result = [];
        stream.on('data', (response) => {
            result.push(response.content);
        });
        stream.on('end', () => {
            assert.deepStrictEqual(words, result);
        });
    }, /currently does not support/);
}
async function testPagedExpand(client) {
    const words = ['nobody', 'ever', 'reads', 'test', 'input'];
    const request = {
        content: words.join(' '),
        pageSize: 2,
    };
    const timer = setTimeout(() => {
        throw new Error('End-to-end testPagedExpand method fails with timeout');
    }, 12000);
    const [response] = await client.pagedExpand(request);
    clearTimeout(timer);
    const result = response.map(r => r.content);
    assert.deepStrictEqual(words, result);
}
async function testPagedExpandAsync(client) {
    const words = ['nobody', 'ever', 'reads', 'test', 'input'];
    const request = {
        content: words.join(' '),
        pageSize: 2,
    };
    const response = [];
    const iterable = client.pagedExpandAsync(request);
    const timer = setTimeout(() => {
        throw new Error('End-to-end testPagedExpandAsync method fails with timeout');
    }, 12000);
    for await (const resource of iterable) {
        response.push(resource.content);
    }
    clearTimeout(timer);
    assert.deepStrictEqual(words, response);
}
async function testCollect(client) {
    const words = ['nobody', 'ever', 'reads', 'test', 'input'];
    const promise = new Promise((resolve, reject) => {
        try {
            const stream = client.collect((err, result) => {
                var _a;
                if (err || !result) {
                    reject(err);
                }
                else {
                    resolve((_a = result.content) !== null && _a !== void 0 ? _a : '');
                }
            });
            for (const word of words) {
                const request = { content: word };
                stream.write(request);
            }
            stream.on('data', (result) => {
                assert.deepStrictEqual(result.content, words.join(' '));
            });
            stream.end();
        }
        catch (err) {
            reject(err);
        }
    });
    const result = await promise;
    assert.strictEqual(result, words.join(' '));
}
async function testCollectThrows(client) {
    const words = ['nobody', 'ever', 'reads', 'test', 'input'];
    const promise = new Promise((resolve, reject) => {
        try {
            const stream = client.collect((err, result) => {
                var _a;
                if (err || !result) {
                    reject(err);
                }
                else {
                    resolve((_a = result.content) !== null && _a !== void 0 ? _a : '');
                }
            });
            for (const word of words) {
                const request = { content: word };
                stream.write(request);
            }
            stream.on('data', (result) => {
                assert.deepStrictEqual(result.content, words.join(' '));
            });
            stream.end();
        }
        catch (err) {
            reject(err);
        }
    });
    // We expect the promise to be rejected
    promise.then(() => {
        assert(false);
    }, (err) => {
        assert.match(err.message, /currently does not support/);
    });
}
async function testChat(client) {
    const words = [
        'nobody',
        'ever',
        'reads',
        'test',
        'input',
        'especially',
        'this',
        'one',
    ];
    const promise = new Promise((resolve, reject) => {
        try {
            const result = [];
            const stream = client.chat();
            stream.on('data', (response) => {
                result.push(response.content);
            });
            stream.on('end', () => {
                resolve(result);
            });
            stream.on('error', reject);
            for (const word of words) {
                stream.write({ content: word });
            }
            stream.end();
        }
        catch (err) {
            reject(err);
        }
    });
    const result = await promise;
    assert.deepStrictEqual(result, words);
}
async function testChatThrows(client) {
    const words = [
        'nobody',
        'ever',
        'reads',
        'test',
        'input',
        'especially',
        'this',
        'one',
    ];
    const promise = new Promise((resolve, reject) => {
        try {
            const result = [];
            const stream = client.chat();
            stream.on('data', (response) => {
                result.push(response.content);
            });
            stream.on('end', () => {
                resolve(result);
            });
            stream.on('error', reject);
            for (const word of words) {
                stream.write({ content: word });
            }
            stream.end();
        }
        catch (err) {
            reject(err);
        }
    });
    // We expect the promise to be rejected
    promise.then(() => {
        assert(false);
    }, (err) => {
        assert.match(err.message, /currently does not support/);
    });
}
async function testWait(client) {
    const request = {
        ttl: {
            seconds: 5,
            nanos: 0,
        },
        success: {
            content: 'done',
        },
    };
    const [operation] = await client.wait(request);
    const [response] = await operation.promise();
    assert.deepStrictEqual(response.content, request.success.content);
}
async function main() {
    const showcaseServer = new showcase_server_1.ShowcaseServer();
    try {
        await showcaseServer.start();
        await testShowcase();
    }
    finally {
        showcaseServer.stop();
    }
}
main();
//# sourceMappingURL=index.js.map