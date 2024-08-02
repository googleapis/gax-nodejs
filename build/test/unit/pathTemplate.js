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
const pathTemplate_1 = require("../../src/pathTemplate");
(0, mocha_1.describe)('PathTemplate', () => {
    (0, mocha_1.describe)('constructor', () => {
        (0, mocha_1.it)('should parse and obtain the correct number of segments', () => {
            const t = new pathTemplate_1.PathTemplate('a/b/**/*/{a=hello/world}');
            assert.strictEqual(t.segments.length, 5);
            assert.strictEqual(t.size, 5);
        });
        (0, mocha_1.it)('should fail on multiple path wildcards', () => {
            const shouldFail = () => {
                return new pathTemplate_1.PathTemplate('buckets/*/**/**/objects/*');
            };
            assert.throws(shouldFail, TypeError);
        });
        (0, mocha_1.it)('should fail on multiple path wildcards', () => {
            const shouldFail = () => {
                return new pathTemplate_1.PathTemplate('buckets/*/**/{project=**}/objects/*');
            };
            assert.throws(shouldFail, TypeError);
        });
    });
    (0, mocha_1.describe)('method `match`', () => {
        (0, mocha_1.it)('should fail on an impossible match', () => {
            const t = new pathTemplate_1.PathTemplate('hello/world');
            const mismatches = ['hello', 'hello/world/fail'];
            mismatches.forEach(m => {
                assert.throws(() => t.match(m), TypeError);
            });
        });
        (0, mocha_1.it)('should fail on mismatched literal', () => {
            const t = new pathTemplate_1.PathTemplate('hello/world');
            const mismatches = ['hello/world2', 'hello/world3'];
            mismatches.forEach(m => {
                assert.throws(() => t.match(m), TypeError);
            });
        });
        (0, mocha_1.it)('should match atomic resource name', () => {
            const tests = [
                {
                    path: 'buckets/f/o/objects/bar',
                    template: 'buckets/*/*/objects/*',
                    want: {
                        $0: 'f',
                        $1: 'o',
                        $2: 'bar',
                    },
                },
                {
                    path: 'buckets/world',
                    template: 'buckets/{hello}',
                    want: {
                        hello: 'world',
                    },
                },
                {
                    path: 'buckets/world',
                    template: 'buckets/{hello=*}',
                    want: {
                        hello: 'world',
                    },
                },
                {
                    path: 'buckets/long-door-651',
                    template: 'buckets/{project}',
                    want: {
                        project: 'long-door-651',
                    },
                },
            ];
            tests.forEach(t => {
                const template = new pathTemplate_1.PathTemplate(t.template);
                assert.deepStrictEqual(template.match(t.path), t.want);
            });
        });
        (0, mocha_1.it)('should match escaped chars', () => {
            const template = new pathTemplate_1.PathTemplate('buckets/*/objects');
            const want = { $0: 'hello%2F%2Bworld' };
            assert.deepStrictEqual(template.match('buckets/hello%2F%2Bworld/objects'), want);
        });
        (0, mocha_1.it)('should match template with unbounded wildcard', () => {
            const template = new pathTemplate_1.PathTemplate('buckets/*/objects/**');
            const want = { $0: 'foo', $1: 'bar/baz' };
            assert.deepStrictEqual(template.match('buckets/foo/objects/bar/baz'), want);
        });
        (0, mocha_1.it)('should match template with unbound in the middle', () => {
            const template = new pathTemplate_1.PathTemplate('bar/**/foo/*');
            const want = { $0: 'foo/foo', $1: 'bar' };
            assert.deepStrictEqual(template.match('bar/foo/foo/foo/bar'), want);
        });
        (0, mocha_1.it)('should match template with non-slash resource patterns', () => {
            const template = new pathTemplate_1.PathTemplate('user/{user_id}/blurbs/legacy/{blurb_a}-{blurb_b}~{legacy_user}');
            const want = {
                user_id: 'foo',
                blurb_a: 'bara',
                blurb_b: 'barb',
                legacy_user: 'user',
            };
            assert.deepStrictEqual(template.match('user/foo/blurbs/legacy/bara-barb~user'), want);
        });
        (0, mocha_1.it)('should not match template with malformed non-slash resource patterns', () => {
            const template = new pathTemplate_1.PathTemplate('user/{user_id}/blurbs/legacy/{blurb_id}.{legacy_user}');
            assert.throws(() => {
                template.match('user/foo/blurbs/legacy/bar~user2');
            }, TypeError);
        });
    });
    (0, mocha_1.describe)('method `render`', () => {
        (0, mocha_1.it)('should render atomic resource', () => {
            const template = new pathTemplate_1.PathTemplate('buckets/*/*/*/objects/*');
            const params = {
                $0: 'f',
                $1: 'o',
                $2: 'o',
                $3: 'google.com:a-b',
            };
            const want = 'buckets/f/o/o/objects/google.com:a-b';
            assert.strictEqual(template.render(params), want);
        });
        (0, mocha_1.it)('should render atomic resource', () => {
            const template = new pathTemplate_1.PathTemplate('projects/{project}/metricDescriptors/{metric_descriptor=**}');
            const params = {
                project: 'project-name',
                metric_descriptor: 'descriptor',
            };
            const want = 'projects/project-name/metricDescriptors/descriptor';
            assert.strictEqual(template.render(params), want);
        });
        (0, mocha_1.it)('should render atomic resource', () => {
            const template = new pathTemplate_1.PathTemplate('buckets/{project=*}');
            const params = {
                project: 'long-project-name',
            };
            const want = 'buckets/long-project-name';
            assert.strictEqual(template.render(params), want);
        });
        (0, mocha_1.it)('should fail when there are too few variables', () => {
            const template = new pathTemplate_1.PathTemplate('buckets/*/*/*/objects/*');
            const params = {
                $0: 'f',
                $1: 'o',
                $2: 'o',
            };
            assert.throws(() => {
                template.render(params);
            }, TypeError);
        });
        (0, mocha_1.it)('should succeed with an unbound in the middle', () => {
            const template = new pathTemplate_1.PathTemplate('bar/**/foo/*');
            const params = {
                $0: '1/2',
                $1: '3',
            };
            const want = 'bar/1/2/foo/3';
            assert.strictEqual(template.render(params), want);
        });
        (0, mocha_1.it)('should accept both strings and numbers as values', () => {
            const template = new pathTemplate_1.PathTemplate('projects/{project}/sessions/{session}');
            const params = {
                project: 'testProject',
                session: 123,
            };
            const want = 'projects/testProject/sessions/123';
            assert.strictEqual(template.render(params), want);
        });
        (0, mocha_1.it)('should render non-slash resource', () => {
            const template = new pathTemplate_1.PathTemplate('user/{user_id}/blurbs/legacy/{blurb_id}.{legacy_user}/project/{project}');
            const params = {
                user_id: 'foo',
                blurb_id: 'bar',
                legacy_user: 'user2',
                project: 'pp',
            };
            const want = 'user/foo/blurbs/legacy/bar.user2/project/pp';
            assert.strictEqual(template.render(params), want);
        });
    });
    (0, mocha_1.describe)('method `inspect`', () => {
        const tests = {
            'bar/**/foo/*': 'bar/{$0=**}/foo/{$1=*}',
            'buckets/*/objects/*': 'buckets/{$0=*}/objects/{$1=*}',
            '/buckets/{hello}': 'buckets/{hello=*}',
            '/buckets/{hello=what}/{world}': 'buckets/{hello=what}/{world=*}',
            '/buckets/helloazAZ09-.~_what': 'buckets/helloazAZ09-.~_what',
            'user/{user_id}/blurbs/legacy/{blurb_id}.{legacy_user}': 'user/{user_id=*}/blurbs/legacy/{blurb_id=*}.{legacy_user=*}',
        };
        Object.keys(tests).forEach(template => {
            const want = tests[template];
            (0, mocha_1.it)(`should render template ${template} ok`, () => {
                const t = new pathTemplate_1.PathTemplate(template);
                assert.strictEqual(t.inspect(), want);
            });
        });
    });
});
//# sourceMappingURL=pathTemplate.js.map