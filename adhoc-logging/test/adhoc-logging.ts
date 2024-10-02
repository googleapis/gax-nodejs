// Copyright 2024 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import {describe, it} from 'mocha';
import * as assert from 'assert';

import * as al from '../src/adhoc-logging';

interface TestLog {
  namespace: string;
  fields: al.LogFields;
  args: unknown[];
}

class TestSink implements al.DebugLogBackend {
  enables: string[] = [];
  logs: TestLog[] = [];

  makeLogger(namespace: string): al.AdhocDebugLogCallable {
    return (fields: al.LogFields, ...args: unknown[]) => {
      this.logs.push({namespace, fields, args});
    };
  }

  setEnables(enables: string[]): void {
    this.enables = enables;
  }

  reset() {
    this.enables = [];
    this.logs = [];
  }
}

describe('adhoc-logging', () => {
  const sink: TestSink = new TestSink();
  al.setBackend(sink);

  describe('Disabled', () => {
    beforeEach(() => {
      sink.reset();
    });

    it('obeys a lack of global enable', () => {
      delete process.env[al.env.globalEnable];
      const logger = al.makeLogger('system');
      logger({}, 'foo');
      assert.deepStrictEqual(sink.logs, []);
    });

    it('obeys a false global enable', () => {
      process.env[al.env.globalEnable] = 'false';
      const logger = al.makeLogger('system');
      logger({}, 'foo');
      assert.deepStrictEqual(sink.logs, []);
    });
  });

  describe('Basic enabled', () => {
    let logger: al.AdhocDebugLogFunction;
    beforeEach(() => {
      sink.reset();

      process.env[al.env.globalEnable] = 'true';
      logger = al.makeLogger('system');
      console.log(logger);
    });

    it('logs with empty fields', () => {
      logger({}, 'test log', 5, {other: 'foo'});
      assert.deepStrictEqual(sink.logs, [
        {
          namespace: 'system',
          fields: {},
          args: ['test log', 5, {other: 'foo'}],
        },
      ]);
    });

    it('logs with fields', () => {
      logger({severity: al.LogSeverity.INFO}, 'test log', 5, {other: 'foo'});
      assert.deepStrictEqual(sink.logs, [
        {
          namespace: 'system',
          fields: {severity: al.LogSeverity.INFO},
          args: ['test log', 5, {other: 'foo'}],
        },
      ]);
    });

    it('logs with severity', () => {
      logger.info('test info');
      logger.warn('test warn');
      logger.debug('test debug');
      logger.error('test error');
      assert.deepStrictEqual(sink.logs, [
        {
          namespace: 'system',
          fields: {severity: al.LogSeverity.INFO},
          args: ['test info'],
        },
        {
          namespace: 'system',
          fields: {severity: al.LogSeverity.WARNING},
          args: ['test warn'],
        },
        {
          namespace: 'system',
          fields: {severity: al.LogSeverity.DEBUG},
          args: ['test debug'],
        },
        {
          namespace: 'system',
          fields: {severity: al.LogSeverity.ERROR},
          args: ['test error'],
        },
      ]);
    });
  });
});
