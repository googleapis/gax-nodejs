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

import {describe, it} from 'mocha';
import {RequestType} from '../../src/apitypes';
import {
  transcode,
  getField,
  deleteField,
  ParsedOptionsType,
  encodeWithSlashes,
  encodeWithoutSlashes,
  applyPattern,
  flattenObject,
  deepCopy,
  match,
  buildQueryStringComponents,
  requestChangeCaseAndCleanup,
} from '../../src/transcoding';
import * as assert from 'assert';
import {camelToSnakeCase, snakeToCamelCase} from '../../src/util';
import * as protobuf from 'protobufjs';
import {testMessageJson} from '../fixtures/fallbackOptional';

describe('gRPC to HTTP transcoding', () => {
  const parsedOptions: ParsedOptionsType = [
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
  it('transcode', () => {
    assert.deepEqual(transcode({parent: 'projects/project'}, parsedOptions), {
      httpMethod: 'get',
      url: '/v3/projects/project/supportedLanguages',
      queryString: '',
      data: '',
    });

    assert.deepEqual(
      transcode({parent: 'projects/project', field: 'value'}, parsedOptions),
      {
        httpMethod: 'get',
        url: '/v3/projects/project/supportedLanguages',
        queryString: 'field=value',
        data: '',
      }
    );

    assert.deepEqual(
      transcode(
        {parent: 'projects/project', field: 'value', a: 42},
        parsedOptions
      ),
      {
        httpMethod: 'get',
        url: '/v3/projects/project/supportedLanguages',
        queryString: 'field=value&a=42',
        data: '',
      }
    );

    assert.deepEqual(
      transcode(
        {parent: 'post1/project', field: 'value', a: 42},
        parsedOptions
      ),
      {
        httpMethod: 'post',
        url: '/v3/post1/project/supportedLanguages',
        queryString: '',
        data: {field: 'value', a: 42},
      }
    );

    assert.deepEqual(
      transcode(
        {parent: 'post2/project', field: 'value', a: 42},
        parsedOptions
      ),
      {
        httpMethod: 'post',
        url: '/v3/post2/project/supportedLanguages',
        queryString: 'a=42',
        data: 'value',
      }
    );

    assert.deepEqual(
      transcode({parent: 'get/project', field: 'value', a: 42}, parsedOptions),
      {
        httpMethod: 'get',
        url: '/v3/get/project/value/supportedLanguages',
        queryString: 'a=42',
        data: '',
      }
    );

    // Checking camel-snake-case conversions
    assert.deepEqual(
      transcode(
        {
          snakeCaseFirst: 'first',
          snakeCaseBody: {snakeCaseField: 42},
          fieldName: 'value',
        },
        parsedOptions
      ),
      {
        httpMethod: 'post',
        url: '/v3/a/first',
        queryString: 'fieldName=value',
        data: {snakeCaseField: 42},
      }
    );

    assert.deepEqual(
      transcode(
        {
          snakeCaseSecond: 'second',
          snakeCaseBody: {snakeCaseField: 42},
          fieldName: 'value',
        },
        parsedOptions
      ),
      {
        httpMethod: 'post',
        url: '/v3/b/second',
        queryString: '',
        data: {snakeCaseBody: {snakeCaseField: 42}, fieldName: 'value'},
      }
    );

    assert.strictEqual(
      transcode({unknownField: 'project'}, parsedOptions),
      undefined
    );
  });

  it('transcode should ignore inherited properties', () => {
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
    assert.deepStrictEqual(transcode(request, parsedOptions), {
      httpMethod: 'get',
      url: '/v3/projects/a/locations/b/supportedLanguages',
      queryString: '',
      data: '',
    });
  });

  // Tests for helper functions

  it('getField', () => {
    assert.strictEqual(
      getField({field: 'stringValue'}, 'field'),
      'stringValue'
    );
    assert.strictEqual(
      getField({field: 'stringValue'}, 'nosuchfield'),
      undefined
    );
    assert.strictEqual(
      getField({field: 'stringValue'}, 'field.subfield'),
      undefined
    );
    assert.strictEqual(
      getField({field: {subfield: 'stringValue'}}, 'field.subfield'),
      'stringValue'
    );
    assert.deepEqual(
      getField({field: {subfield: [1, 2, 3]}}, 'field.subfield'),
      [1, 2, 3]
    );
    assert.strictEqual(
      getField({field: {subfield: 'stringValue'}}, 'field'),
      undefined
    );
    assert.strictEqual(
      getField({field: {subfield: 'stringValue'}}, 'field.nosuchfield'),
      undefined
    );
    assert.strictEqual(
      getField(
        {field: {subfield: {subsubfield: 'stringValue'}}},
        'field.subfield.subsubfield'
      ),
      'stringValue'
    );
  });

  it('deleteField', () => {
    const request1 = {field: 'stringValue'};
    deleteField(request1, 'field');
    assert.deepEqual(request1, {});

    const request2 = {field: 'stringValue'};
    deleteField(request2, 'nosuchfield');
    assert.deepEqual(request2, {
      field: 'stringValue',
    });

    const request3 = {field: 'stringValue'};
    deleteField(request3, 'field.subfield');
    assert.deepEqual(request3, {
      field: 'stringValue',
    });

    const request4 = {field: {subfield: 'stringValue'}};
    deleteField(request4, 'field.subfield');
    assert.deepEqual(request4, {field: {}});

    const request5 = {field: {subfield: 'stringValue', q: 'w'}, e: 'f'};
    deleteField(request5, 'field.subfield');
    assert.deepEqual(request5, {field: {q: 'w'}, e: 'f'});

    const request6 = {field: {subfield: 'stringValue'}};
    deleteField(request6, 'field.nosuchfield');
    assert.deepEqual(request6, {field: {subfield: 'stringValue'}});

    const request7 = {field: {subfield: {subsubfield: 'stringValue', q: 'w'}}};
    deleteField(request7, 'field.subfield.subsubfield');
    assert.deepEqual(request7, {field: {subfield: {q: 'w'}}});
  });

  it('encodeWithSlashes', () => {
    assert.strictEqual(encodeWithSlashes('abcd'), 'abcd');
    assert.strictEqual(encodeWithSlashes('тест'), '%D1%82%D0%B5%D1%81%D1%82');
    assert.strictEqual(
      encodeWithSlashes(
        '_.~0-9abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/ '
      ),
      '_.~0-9abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ%2F%20'
    );
  });

  it('encodeWithoutSlashes', () => {
    assert.strictEqual(encodeWithoutSlashes('abcd'), 'abcd');
    assert.strictEqual(
      encodeWithoutSlashes('тест'),
      '%D1%82%D0%B5%D1%81%D1%82'
    );
    assert.strictEqual(
      encodeWithoutSlashes(
        '_.~0-9abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/ '
      ),
      '_.~0-9abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ/%20'
    );
  });

  it('applyPattern', () => {
    assert.strictEqual(applyPattern('*', 'test'), 'test');
    assert.strictEqual(applyPattern('test', 'test'), 'test');
    assert.strictEqual(applyPattern('fail', 'test'), undefined);
    assert.strictEqual(
      applyPattern('projects/*', 'projects/test'),
      'projects/test'
    );
    assert.strictEqual(
      applyPattern('projects/*/locations/*', 'projects/test'),
      undefined
    );
    assert.strictEqual(applyPattern('locations/*', 'projects/test'), undefined);
    assert.strictEqual(
      applyPattern('projects/*/locations/*', 'projects/test/locations/us'),
      'projects/test/locations/us'
    );
    assert.strictEqual(
      applyPattern('projects/*/locations/*', 'projects/test/locations/us/q/z'),
      undefined
    );
    assert.strictEqual(
      applyPattern('projects/*/locations/**', 'projects/test/locations/us/q/z'),
      'projects/test/locations/us/q/z'
    );
  });

  it('flattenObject', () => {
    assert.deepEqual(flattenObject({}), {});
    assert.deepEqual(flattenObject({field: 'value'}), {field: 'value'});
    assert.deepEqual(
      flattenObject({field: 'value', nested: {subfield: 'subvalue'}}),
      {field: 'value', 'nested.subfield': 'subvalue'}
    );
  });

  it('match', () => {
    assert.deepEqual(
      match(
        {parent: 'projects/te st', test: 'value'},
        '/v3/{parent=projects/*}/supportedLanguages'
      ),
      {
        matchedFields: ['parent'],
        url: '/v3/projects/te%20st/supportedLanguages',
      }
    );
    assert.deepEqual(
      match(
        {parent: 'projects/te st/locations/location', test: 'value'},
        '/v3/{parent=projects/*}/supportedLanguages'
      ),
      undefined
    );
    assert.deepEqual(
      match(
        {parent: 'projects/te st/locations/location', test: 'value'},
        '/v3/{parent=projects/*/locations/*}/supportedLanguages'
      ),
      {
        matchedFields: ['parent'],
        url: '/v3/projects/te%20st/locations/location/supportedLanguages',
      }
    );
    assert.deepEqual(
      match(
        {parent: 'projects/te st', test: 'value'},
        '/v3/{parent=projects/*}/{field=*}/supportedLanguages'
      ),
      undefined
    );
    assert.deepEqual(
      match(
        {parent: 'projects/te st', test: 'value', field: 42},
        '/v3/{parent=projects/*}/{field=*}/supportedLanguages'
      ),
      {
        matchedFields: ['field', 'parent'],
        url: '/v3/projects/te%20st/42/supportedLanguages',
      }
    );
    assert.deepEqual(
      match(
        {
          parent: 'projects/te st',
          test: 'value',
          field: 'fields/field42',
          path: 'a/b,c/d',
        },
        '/v3/{parent=projects/*}/{field=fields/*}/{path=**}/supportedLanguages'
      ),
      {
        matchedFields: ['path', 'field', 'parent'],
        url: '/v3/projects/te%20st/fields/field42/a/b%2Cc/d/supportedLanguages',
      }
    );
    assert.deepEqual(
      match({}, '/v3/{field.subfield}/supportedLanguages'),
      undefined
    );
    assert.deepEqual(
      match({field: {subfield: 42}}, '/v3/{field.subfield}/supportedLanguages'),
      {
        matchedFields: ['field.subfield'],
        url: '/v3/42/supportedLanguages',
      }
    );
  });

  it('deepCopy', () => {
    const request = {
      field: {
        subfield: 42,
      },
      value: 'string',
      repeated: [1, 2, {a: 'b'}],
    };
    const copy = deepCopy(request as RequestType);
    assert.deepEqual(copy, request);
    request.field.subfield = 43;
    request.repeated[0] = -1;
    (request.repeated[2] as RequestType).a = 'c';
    assert.strictEqual((copy.field as RequestType).subfield, 42);
    assert.strictEqual((copy.repeated as RequestType[])[0], 1);
    assert.strictEqual((copy.repeated as RequestType[])[2].a, 'b');
  });

  it('buildQueryStringComponents', () => {
    assert.deepEqual(buildQueryStringComponents({field: 'value'}), [
      'field=value',
    ]);
    assert.deepEqual(buildQueryStringComponents({field: 'value', a: 42}), [
      'field=value',
      'a=42',
    ]);
    assert.deepEqual(
      buildQueryStringComponents({
        field: 'value',
        repeated: [1, 2, 'z z z'],
        obj: {subfield: 'string', y: 'z'},
      }),
      [
        'field=value',
        'repeated=1',
        'repeated=2',
        'repeated=z%20z%20z',
        'obj.subfield=string',
        'obj.y=z',
      ]
    );
  });

  it('requestChangeCaseAndCleanup', () => {
    const request: RequestType = {
      field: 'value',
      listField: [
        42,
        {
          field: 'value',
          twoWords: {
            nested: 'object',
            threeWordsKeys: 42,
            list: [1, 2, 3],
          },
        },
        'string',
      ],
      objectField: {
        field: 'value',
        listField: [1, 2, 3],
      },
    };
    const expectedSnakeCase = {
      field: 'value',
      list_field: [
        42,
        {
          field: 'value',
          two_words: {
            nested: 'object',
            three_words_keys: 42,
            list: [1, 2, 3],
          },
        },
        'string',
      ],
      object_field: {
        field: 'value',
        list_field: [1, 2, 3],
      },
    };
    assert.deepEqual(
      requestChangeCaseAndCleanup(request, camelToSnakeCase),
      expectedSnakeCase
    );
    assert.deepEqual(
      requestChangeCaseAndCleanup(expectedSnakeCase, snakeToCamelCase),
      request
    );
  });
});

describe('validate proto3 field with default value', () => {
  const root = protobuf.Root.fromJSON(testMessageJson);
  const testMessageFields = root.lookupType('TestMessage').fields;

  // should we throw error?
  it('should required field if a field has both require annotation and optional', () => {
    const badTestMessageFields = root.lookupType('TestMessage').fields;
    const request: RequestType = {
      projectId: 'test-project',
      content: 'test-content',
    };
    const parsedOptions: ParsedOptionsType = [
      {
        '(google.api.http)': {
          post: 'projects/{project_id}/contents/{content}',
          body: '*',
        },
      },
      {
        '(google.api.method_signature)': 'project_id, content',
      },
    ];
    const transcoded = transcode(request, parsedOptions, badTestMessageFields);
    assert.deepStrictEqual(
      transcoded?.url,
      'projects/test-project/contents/test-content'
    );
  });
  it('should throw error if required field has not been setted', () => {
    const requests: RequestType[] = [
      {
        projectId: 'test-project',
        content: 'undefined',
      },
      {
        projectId: 'test-project',
      },
    ];
    const parsedOptions: ParsedOptionsType = [
      {
        '(google.api.http)': {
          post: 'projects/{project_id}',
          body: '*',
        },
      },
      {
        '(google.api.method_signature)': 'project_id, content',
      },
    ];
    for (const request of requests) {
      assert.throws(
        () => transcode(request, parsedOptions, testMessageFields),
        Error
      );
    }
  });
  it('when body="*", all required field should emitted in body', () => {
    const request: RequestType = {
      projectId: 'test-project',
      content: 'test-content',
    };
    const parsedOptions: ParsedOptionsType = [
      {
        '(google.api.http)': {
          post: 'projects/{project_id}',
          body: '*',
        },
      },
    ];
    const transcoded = transcode(request, parsedOptions, testMessageFields);
    assert.deepStrictEqual(transcoded?.url, 'projects/test-project');
    assert.deepStrictEqual(transcoded?.data, {content: 'test-content'});
  });
  it('when body="*", unset optional field should remove from body', () => {
    const requests: RequestType[] = [
      {
        projectId: 'test-project',
        content: 'test-content',
        optionalValue: 'undefined',
      },
      {
        projectId: 'test-project',
        content: 'test-content',
      },
    ];
    const parsedOptions: ParsedOptionsType = [
      {
        '(google.api.http)': {
          post: 'projects/{project_id}/contents/{content}',
          body: '*',
        },
      },
    ];
    for (const request of requests) {
      const transcoded = transcode(request, parsedOptions, testMessageFields);
      assert.deepStrictEqual(
        transcoded?.url,
        'projects/test-project/contents/test-content'
      );
      assert.deepStrictEqual(transcoded?.data, {});
    }
  });
  it('unset optional fields should not appear in query params', () => {
    const requests: RequestType[] = [
      {
        projectId: 'test-project',
        content: 'test-content',
        optionalValue: 'undefined',
      },
      {
        projectId: 'test-project',
        content: 'test-content',
      },
    ];
    const parsedOptions: ParsedOptionsType = [
      {
        '(google.api.http)': {
          post: 'projects/{project_id}',
          body: 'content',
        },
      },
      {
        '(google.api.method_signature)': 'project_id, content',
      },
    ];
    for (const request of requests) {
      const transcoded = transcode(request, parsedOptions, testMessageFields);
      assert.deepStrictEqual(transcoded?.url, 'projects/test-project');
      assert.deepStrictEqual(transcoded?.data, 'test-content');
      assert.deepStrictEqual(transcoded.queryString, '');
    }
  });
});
