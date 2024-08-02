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
/* eslint-disable @typescript-eslint/ban-ts-comment */
const mocha_1 = require("mocha");
const transcoding_1 = require("../../src/transcoding");
const assert = require("assert");
const protobuf = require("protobufjs");
const echoProtoJson = require("../fixtures/echo.json");
(0, mocha_1.describe)('gRPC to HTTP transcoding', () => {
    const parsedOptions = [
        {
            '(google.api.http)': {
                get: '/v3/{parent=projects/*/locations/*}/supportedLanguages',
                additional_bindings: [
                    {
                        get: '/v3/{parent=projects/*}/supportedLanguages',
                    },
                    {
                        post: '/v3/{parent=post1/*}/supportedLanguages',
                        body: '*',
                    },
                    {
                        post: '/v3/{parent=post2/*}/supportedLanguages',
                        body: 'field',
                    },
                    {
                        get: '/v3/{parent=get/*}/{field=*}/supportedLanguages',
                    },
                    {
                        get: '/v3/{parent=projects/*}/{field=fields/*}/{path=**}/supportedLanguages',
                    },
                    {
                        post: '/v3/a/{snake_case_first=*}',
                        body: 'snake_case_body',
                    },
                    {
                        post: '/v3/b/{snake_case_second=*}',
                        body: '*',
                    },
                ],
            },
        },
        {
            '(google.api.method_signature)': 'parent,model,display_language_code',
        },
    ];
    // Main transcode() function
    (0, mocha_1.it)('transcode', () => {
        assert.deepStrictEqual((0, transcoding_1.transcode)({ parent: 'projects/project' }, parsedOptions), {
            httpMethod: 'get',
            url: '/v3/projects/project/supportedLanguages',
            queryString: '',
            data: '',
        });
        assert.deepStrictEqual((0, transcoding_1.transcode)({ parent: 'projects/project', field: 'value' }, parsedOptions), {
            httpMethod: 'get',
            url: '/v3/projects/project/supportedLanguages',
            queryString: 'field=value',
            data: '',
        });
        assert.deepStrictEqual((0, transcoding_1.transcode)({ parent: 'projects/project', field: 'value', a: 42 }, parsedOptions), {
            httpMethod: 'get',
            url: '/v3/projects/project/supportedLanguages',
            queryString: 'field=value&a=42',
            data: '',
        });
        assert.deepStrictEqual((0, transcoding_1.transcode)({ parent: 'post1/project', field: 'value', a: 42 }, parsedOptions), {
            httpMethod: 'post',
            url: '/v3/post1/project/supportedLanguages',
            queryString: '',
            data: { field: 'value', a: 42 },
        });
        assert.deepStrictEqual((0, transcoding_1.transcode)({ parent: 'post2/project', field: 'value', a: 42 }, parsedOptions), {
            httpMethod: 'post',
            url: '/v3/post2/project/supportedLanguages',
            queryString: 'a=42',
            data: 'value',
        });
        assert.deepStrictEqual((0, transcoding_1.transcode)({ parent: 'get/project', field: 'value', a: 42 }, parsedOptions), {
            httpMethod: 'get',
            url: '/v3/get/project/value/supportedLanguages',
            queryString: 'a=42',
            data: '',
        });
        // Checking camel-snake-case conversions
        assert.deepStrictEqual((0, transcoding_1.transcode)({
            snakeCaseFirst: 'first',
            snakeCaseBody: { snakeCaseField: 42 },
            fieldName: 'value',
        }, parsedOptions), {
            httpMethod: 'post',
            url: '/v3/a/first',
            queryString: 'fieldName=value',
            data: { snakeCaseField: 42 },
        });
        assert.deepStrictEqual((0, transcoding_1.transcode)({
            snakeCaseSecond: 'second',
            snakeCaseBody: { snakeCaseField: 42 },
            fieldName: 'value',
        }, parsedOptions), {
            httpMethod: 'post',
            url: '/v3/b/second',
            queryString: '',
            data: { snakeCaseBody: { snakeCaseField: 42 }, fieldName: 'value' },
        });
        assert.strictEqual((0, transcoding_1.transcode)({ unknownField: 'project' }, parsedOptions), undefined);
    });
    (0, mocha_1.it)('should not change user inputted fields to camel case', () => {
        const request = {
            projectId: 'test-project',
            content: 'test-content',
            labels: { 'i-am-vm': 'true' },
        };
        const parsedOptions = [
            {
                '(google.api.http)': {
                    post: 'projects/{project_id}',
                    body: '*',
                },
            },
        ];
        const transcoded = (0, transcoding_1.transcode)(request, parsedOptions);
        assert.deepStrictEqual(transcoded === null || transcoded === void 0 ? void 0 : transcoded.url, 'projects/test-project');
        assert.deepStrictEqual(transcoded === null || transcoded === void 0 ? void 0 : transcoded.data, {
            content: 'test-content',
            labels: { 'i-am-vm': 'true' },
        });
    });
    (0, mocha_1.it)('transcode should not decapitalize the first capital letter', () => {
        assert.deepStrictEqual((0, transcoding_1.transcode)({
            parent: 'post1/project',
            IPProtocol: 'tcp',
        }, parsedOptions), {
            httpMethod: 'post',
            queryString: '',
            url: '/v3/post1/project/supportedLanguages',
            data: {
                IPProtocol: 'tcp',
            },
        });
        assert.deepStrictEqual((0, transcoding_1.transcode)({
            parent: 'post2/project',
            IPProtocol: 'tcp',
            field: 'value',
        }, parsedOptions), {
            httpMethod: 'post',
            queryString: 'IPProtocol=tcp',
            url: '/v3/post2/project/supportedLanguages',
            data: 'value',
        });
        assert.deepStrictEqual((0, transcoding_1.transcode)({
            parent: 'post1/project',
            iPProtocol: 'tcp',
        }, parsedOptions), {
            httpMethod: 'post',
            queryString: '',
            url: '/v3/post1/project/supportedLanguages',
            data: {
                iPProtocol: 'tcp',
            },
        });
    });
    (0, mocha_1.it)('transcode should ignore inherited properties', () => {
        // In this test we emulate protobuf object that has inherited circular
        // references in the prototype. This is supposed to be a pure JS code
        // so some ts-ignores are expected.
        const Request = function () {
            // @ts-ignore
            this.parent = 'projects/a/locations/b';
            // @ts-ignore
            return this;
        };
        Request.prototype.circular = {};
        Request.prototype.circular.field = Request.prototype.circular;
        // @ts-ignore
        const request = new Request();
        assert.deepStrictEqual((0, transcoding_1.transcode)(request, parsedOptions), {
            httpMethod: 'get',
            url: '/v3/projects/a/locations/b/supportedLanguages',
            queryString: '',
            data: '',
        });
    });
    // Tests for helper functions
    (0, mocha_1.it)('getField', () => {
        assert.strictEqual((0, transcoding_1.getField)({ field: 'stringValue' }, 'field'), 'stringValue');
        assert.strictEqual((0, transcoding_1.getField)({ field: 'stringValue' }, 'nosuchfield'), undefined);
        assert.strictEqual((0, transcoding_1.getField)({ field: 'stringValue' }, 'field.subfield'), undefined);
        assert.strictEqual((0, transcoding_1.getField)({ field: { subfield: 'stringValue' } }, 'field.subfield'), 'stringValue');
        assert.deepStrictEqual((0, transcoding_1.getField)({ field: { subfield: [1, 2, 3] } }, 'field.subfield'), [1, 2, 3]);
        assert.strictEqual((0, transcoding_1.getField)({ field: { subfield: 'stringValue' } }, 'field'), undefined);
        assert.strictEqual((0, transcoding_1.getField)({ field: { subfield: 'stringValue' } }, 'field.nosuchfield'), undefined);
        assert.strictEqual((0, transcoding_1.getField)({ field: { subfield: { subsubfield: 'stringValue' } } }, 'field.subfield.subsubfield'), 'stringValue');
    });
    (0, mocha_1.it)('deleteField', () => {
        const request1 = { field: 'stringValue' };
        (0, transcoding_1.deleteField)(request1, 'field');
        assert.deepStrictEqual(request1, {});
        const request2 = { field: 'stringValue' };
        (0, transcoding_1.deleteField)(request2, 'nosuchfield');
        assert.deepStrictEqual(request2, {
            field: 'stringValue',
        });
        const request3 = { field: 'stringValue' };
        (0, transcoding_1.deleteField)(request3, 'field.subfield');
        assert.deepStrictEqual(request3, {
            field: 'stringValue',
        });
        const request4 = { field: { subfield: 'stringValue' } };
        (0, transcoding_1.deleteField)(request4, 'field.subfield');
        assert.deepStrictEqual(request4, { field: {} });
        const request5 = { field: { subfield: 'stringValue', q: 'w' }, e: 'f' };
        (0, transcoding_1.deleteField)(request5, 'field.subfield');
        assert.deepStrictEqual(request5, { field: { q: 'w' }, e: 'f' });
        const request6 = { field: { subfield: 'stringValue' } };
        (0, transcoding_1.deleteField)(request6, 'field.nosuchfield');
        assert.deepStrictEqual(request6, { field: { subfield: 'stringValue' } });
        const request7 = { field: { subfield: { subsubfield: 'stringValue', q: 'w' } } };
        (0, transcoding_1.deleteField)(request7, 'field.subfield.subsubfield');
        assert.deepStrictEqual(request7, { field: { subfield: { q: 'w' } } });
    });
    (0, mocha_1.it)('encodeWithSlashes', () => {
        assert.strictEqual((0, transcoding_1.encodeWithSlashes)('abcd'), 'abcd');
        assert.strictEqual((0, transcoding_1.encodeWithSlashes)('тест'), '%D1%82%D0%B5%D1%81%D1%82');
        assert.strictEqual((0, transcoding_1.encodeWithSlashes)('_.~0-9abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/ '), '_.~0-9abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%2F%20');
    });
    (0, mocha_1.it)('encodeWithoutSlashes', () => {
        assert.strictEqual((0, transcoding_1.encodeWithoutSlashes)('abcd'), 'abcd');
        assert.strictEqual((0, transcoding_1.encodeWithoutSlashes)('тест'), '%D1%82%D0%B5%D1%81%D1%82');
        assert.strictEqual((0, transcoding_1.encodeWithoutSlashes)('_.~0-9abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/ '), '_.~0-9abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/%20');
    });
    (0, mocha_1.it)('applyPattern', () => {
        assert.strictEqual((0, transcoding_1.applyPattern)('*', 'test'), 'test');
        assert.strictEqual((0, transcoding_1.applyPattern)('test', 'test'), 'test');
        assert.strictEqual((0, transcoding_1.applyPattern)('fail', 'test'), undefined);
        assert.strictEqual((0, transcoding_1.applyPattern)('projects/*', 'projects/test'), 'projects/test');
        assert.strictEqual((0, transcoding_1.applyPattern)('projects/*/locations/*', 'projects/test'), undefined);
        assert.strictEqual((0, transcoding_1.applyPattern)('locations/*', 'projects/test'), undefined);
        assert.strictEqual((0, transcoding_1.applyPattern)('projects/*/locations/*', 'projects/test/locations/us'), 'projects/test/locations/us');
        assert.strictEqual((0, transcoding_1.applyPattern)('projects/*/locations/*', 'projects/test/locations/us/q/z'), undefined);
        assert.strictEqual((0, transcoding_1.applyPattern)('projects/*/locations/**', 'projects/test/locations/us/q/z'), 'projects/test/locations/us/q/z');
    });
    (0, mocha_1.it)('flattenObject', () => {
        assert.deepStrictEqual((0, transcoding_1.flattenObject)({}), {});
        assert.deepStrictEqual((0, transcoding_1.flattenObject)({ field: 'value' }), { field: 'value' });
        assert.deepStrictEqual((0, transcoding_1.flattenObject)({ field: 'value', nested: { subfield: 'subvalue' } }), { field: 'value', 'nested.subfield': 'subvalue' });
    });
    (0, mocha_1.it)('match', () => {
        assert.deepStrictEqual((0, transcoding_1.match)({ parent: 'projects/te st', test: 'value' }, '/v3/{parent=projects/*}/supportedLanguages'), {
            matchedFields: ['parent'],
            url: '/v3/projects/te%20st/supportedLanguages',
        });
        assert.deepStrictEqual((0, transcoding_1.match)({ parent: 'projects/te st/locations/location', test: 'value' }, '/v3/{parent=projects/*}/supportedLanguages'), undefined);
        assert.deepStrictEqual((0, transcoding_1.match)({ parent: 'projects/te st/locations/location', test: 'value' }, '/v3/{parent=projects/*/locations/*}/supportedLanguages'), {
            matchedFields: ['parent'],
            url: '/v3/projects/te%20st/locations/location/supportedLanguages',
        });
        assert.deepStrictEqual((0, transcoding_1.match)({ parent: 'projects/te st', test: 'value' }, '/v3/{parent=projects/*}/{field=*}/supportedLanguages'), undefined);
        assert.deepStrictEqual((0, transcoding_1.match)({ parent: 'projects/te st', test: 'value', field: 42 }, '/v3/{parent=projects/*}/{field=*}/supportedLanguages'), {
            matchedFields: ['field', 'parent'],
            url: '/v3/projects/te%20st/42/supportedLanguages',
        });
        assert.deepStrictEqual((0, transcoding_1.match)({
            parent: 'projects/te st',
            test: 'value',
            field: 'fields/field42',
            path: 'a/b,c/d',
        }, '/v3/{parent=projects/*}/{field=fields/*}/{path=**}/supportedLanguages'), {
            matchedFields: ['path', 'field', 'parent'],
            url: '/v3/projects/te%20st/fields/field42/a/b%2Cc/d/supportedLanguages',
        });
        assert.deepStrictEqual((0, transcoding_1.match)({}, '/v3/{field.subfield}/supportedLanguages'), undefined);
        assert.deepStrictEqual((0, transcoding_1.match)({ field: { subfield: 42 } }, '/v3/{field.subfield}/supportedLanguages'), {
            matchedFields: ['field.subfield'],
            url: '/v3/42/supportedLanguages',
        });
    });
    (0, mocha_1.it)('deepCopyWithoutMatchedFields', () => {
        const request = {
            field: {
                subfield: 42,
            },
            value: 'string',
            repeated: [1, 2, { a: 'b' }],
        };
        const copy = (0, transcoding_1.deepCopyWithoutMatchedFields)(request, new Set());
        assert.deepStrictEqual(copy, request);
        request.field.subfield = 43;
        request.repeated[0] = -1;
        request.repeated[2].a = 'c';
        assert.strictEqual(copy.field.subfield, 42);
        assert.strictEqual(copy.repeated[0], 1);
        assert.strictEqual(copy.repeated[2].a, 'b');
    });
    (0, mocha_1.it)('deepCopyWithoutMatchedFields with some fields to skip', () => {
        const request = {
            field: {
                subfield: 42,
                another: 11,
            },
            value: 'string',
            repeated: [1, 2, { a: 'b' }],
        };
        const expected = {
            field: {
                another: 11,
            },
            value: 'string',
            repeated: [1, 2, { a: 'b' }],
        };
        const copy = (0, transcoding_1.deepCopyWithoutMatchedFields)(request, new Set(['field.subfield']));
        assert.deepStrictEqual(copy, expected);
    });
    (0, mocha_1.it)('buildQueryStringComponents', () => {
        assert.deepStrictEqual((0, transcoding_1.buildQueryStringComponents)({ field: 'value' }), [
            'field=value',
        ]);
        assert.deepStrictEqual((0, transcoding_1.buildQueryStringComponents)({ field: 'value', a: 42 }), ['field=value', 'a=42']);
        assert.deepStrictEqual((0, transcoding_1.buildQueryStringComponents)({
            field: 'value',
            repeated: [1, 2, 'z z z'],
            obj: { subfield: 'string', y: 'z' },
        }), [
            'field=value',
            'repeated=1',
            'repeated=2',
            'repeated=z%20z%20z',
            'obj.subfield=string',
            'obj.y=z',
        ]);
    });
});
(0, mocha_1.describe)('override the HTTP rules in protoJson', () => {
    const httpOptionName = '(google.api.http)';
    (0, mocha_1.it)('override multiple http rules', () => {
        const httpRules = [
            {
                selector: 'google.showcase.v1beta1.Messaging.GetRoom',
                get: '/v1beta1/{name**}',
            },
            {
                selector: 'google.showcase.v1beta1.Messaging.ListRooms',
                get: '/fake/value',
            },
        ];
        const root = protobuf.Root.fromJSON(echoProtoJson);
        (0, transcoding_1.overrideHttpRules)(httpRules, root);
        for (const rule of httpRules) {
            const modifiedRpc = root.lookup(rule.selector);
            assert(modifiedRpc);
            assert(modifiedRpc.parsedOptions);
            for (const item of modifiedRpc.parsedOptions) {
                if (!(httpOptionName in item)) {
                    continue;
                }
                const httpOptions = item[httpOptionName];
                assert.deepStrictEqual(httpOptions.get, rule.get);
            }
        }
    });
    (0, mocha_1.it)("override additional bindings for a rpc doesn't has additional bindings", () => {
        const httpRules = [
            {
                selector: 'google.showcase.v1beta1.Messaging.GetRoom',
                get: 'v1beta1/room/{name=**}',
                additional_bindings: [{ get: 'v1beta1/room/{name}' }],
            },
        ];
        const root = protobuf.Root.fromJSON(echoProtoJson);
        (0, transcoding_1.overrideHttpRules)(httpRules, root);
        for (const rule of httpRules) {
            const modifiedRpc = root.lookup(rule.selector);
            assert(modifiedRpc);
            assert(modifiedRpc.parsedOptions);
            for (const item of modifiedRpc.parsedOptions) {
                if (!(httpOptionName in item)) {
                    continue;
                }
                const httpOptions = item[httpOptionName];
                assert.deepStrictEqual(httpOptions.get, rule.get);
                assert.deepStrictEqual(httpOptions.additional_bindings, rule.additional_bindings);
            }
        }
    });
    (0, mocha_1.it)('append additional bindings for a rpc has additional bindings', () => {
        const httpRules = [
            {
                selector: 'google.showcase.v1beta1.Messaging.GetBlurb',
                get: 'v1beta1/fake/value',
                additional_bindings: [
                    { get: 'v1beta1/fake/value' },
                ],
            },
        ];
        const root = protobuf.Root.fromJSON(echoProtoJson);
        const originRpc = root.lookup(httpRules[0].selector);
        const originAdditionalBindings = () => {
            for (const item of originRpc.parsedOptions) {
                if (!(httpOptionName in item)) {
                    continue;
                }
                const httpOptions = item[httpOptionName];
                return [httpOptions.additional_bindings];
            }
            return null;
        };
        assert(originAdditionalBindings());
        const expectedAditionalBindings = originAdditionalBindings().concat(httpRules[0].additional_bindings);
        (0, transcoding_1.overrideHttpRules)(httpRules, root);
        for (const rule of httpRules) {
            const modifiedRpc = root.lookup(rule.selector);
            assert(modifiedRpc);
            assert(modifiedRpc.parsedOptions);
            for (const item of modifiedRpc.parsedOptions) {
                if (!(httpOptionName in item)) {
                    continue;
                }
                const httpOptions = item[httpOptionName];
                assert.deepStrictEqual(httpOptions.get, rule.get);
                assert.deepStrictEqual(httpOptions.additional_bindings, expectedAditionalBindings);
            }
        }
    });
    (0, mocha_1.it)("can't override a non-exist rpc", () => {
        const httpRules = [
            {
                selector: 'not.a.valid.rpc',
                get: 'v1/operations/{name=**}',
            },
        ];
        const root = protobuf.Root.fromJSON(echoProtoJson);
        (0, transcoding_1.overrideHttpRules)(httpRules, root);
        for (const rule of httpRules) {
            const modifiedRpc = root.lookup(rule.selector);
            assert.equal(modifiedRpc, null);
        }
    });
    (0, mocha_1.it)('not support a rpc has no parsedOption', () => {
        const httpRules = [
            {
                selector: 'google.showcase.v1beta1.Messaging.Connect',
                get: 'fake/url',
            },
        ];
        const root = protobuf.Root.fromJSON(echoProtoJson);
        (0, transcoding_1.overrideHttpRules)(httpRules, root);
        for (const rule of httpRules) {
            const modifiedRpc = root.lookup(rule.selector);
            assert(modifiedRpc);
            assert.equal(modifiedRpc.parsedOptions, null);
        }
    });
});
//# sourceMappingURL=transcoding.js.map