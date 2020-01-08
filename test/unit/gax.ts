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

/* eslint-disable quote-props */
/* quote-props causes errors on quoted property names in the data like
 * 'foo_retry' or 'initial_retry_delay_millis' in this file. However,
 * allowing that causes another errors of non-camelcase symbols anyways.
 * Therefore quote-props is disabled explicitly only in this file. */

import {expect} from 'chai';
import * as gax from '../../src/gax';

const SERVICE_NAME = 'test.interface.v1.api';

const A_CONFIG = {
  interfaces: {},
};

//@ts-ignore
A_CONFIG.interfaces[SERVICE_NAME] = {
  retry_codes: {
    foo_retry: ['code_a', 'code_b'],
    bar_retry: ['code_c'],
  },
  retry_params: {
    default: {
      initial_retry_delay_millis: 100,
      retry_delay_multiplier: 1.2,
      max_retry_delay_millis: 1000,
      initial_rpc_timeout_millis: 300,
      rpc_timeout_multiplier: 1.3,
      max_rpc_timeout_millis: 3000,
      total_timeout_millis: 30000,
    },
  },
  methods: {
    BundlingMethod: {
      timeout_millis: 40000,
      retry_codes_name: 'foo_retry',
      retry_params_name: 'default',
      bundling: {
        element_count_threshold: 6,
        element_count_limit: 10,
      },
    },
    PageStreamingMethod: {
      retry_codes_name: 'bar_retry',
      retry_params_name: 'default',
    },
  },
};

const RETRY_DICT = {
  code_a: 1,
  code_b: 2,
  code_c: 3,
};

function expectRetryOptions(obj: {[name: string]: {}}) {
  expect(obj).to.be.an.instanceOf(Object);
  expect(obj).to.have.all.keys('retryCodes', 'backoffSettings');
  expect(obj.retryCodes).to.be.an.instanceOf(Array);
  expectBackoffSettings(obj.backoffSettings);
}

function expectBackoffSettings(obj: {[name: string]: {}}) {
  expect(obj).to.be.an.instanceOf(Object);
  expect(obj).to.have.all.keys(
    'initialRetryDelayMillis',
    'retryDelayMultiplier',
    'maxRetryDelayMillis',
    'initialRpcTimeoutMillis',
    'rpcTimeoutMultiplier',
    'maxRpcTimeoutMillis',
    'totalTimeoutMillis'
  );
}

describe('gax construct settings', () => {
  it('creates settings', () => {
    const otherArgs = {key: 'value'};
    const defaults = gax.constructSettings(
      SERVICE_NAME,
      A_CONFIG,
      {},
      RETRY_DICT,
      otherArgs
    );
    let settings = defaults.bundlingMethod;
    expect(settings.timeout).to.eq(40000);
    expectRetryOptions(settings.retry);
    expect(settings.retry.retryCodes).eql([1, 2]);
    expect(settings.otherArgs).eql(otherArgs);

    settings = defaults.pageStreamingMethod;
    expect(settings.timeout).to.eq(30000);
    expectRetryOptions(settings.retry);
    expect(settings.retry.retryCodes).eql([3]);
    expect(settings.otherArgs).eql(otherArgs);
  });

  it('overrides settings', () => {
    const overrides = {interfaces: {}};
    //@ts-ignore
    overrides.interfaces[SERVICE_NAME] = {
      methods: {
        PageStreamingMethod: null,
        BundlingMethod: {
          bundling: null,
        },
      },
    };
    const defaults = gax.constructSettings(
      SERVICE_NAME,
      A_CONFIG,
      overrides,
      RETRY_DICT
    );
    let settings = defaults.bundlingMethod;
    expect(settings.timeout).to.eq(40000);

    settings = defaults.pageStreamingMethod;
    expect(settings.timeout).to.eq(30000);
    expect(settings.retry).to.eq(null);
  });

  it('overrides settings more precisely', () => {
    const overrides = {interfaces: {}};
    //@ts-ignore
    overrides.interfaces[SERVICE_NAME] = {
      retry_codes: {
        bar_retry: [],
        baz_retry: ['code_a'],
      },
      retry_params: {
        default: {
          initial_retry_delay_millis: 1000,
          retry_delay_multiplier: 1.2,
          max_retry_delay_millis: 10000,
          initial_rpc_timeout_millis: 3000,
          rpc_timeout_multiplier: 1.3,
          max_rpc_timeout_millis: 30000,
          total_timeout_millis: 300000,
        },
      },
      methods: {
        BundlingMethod: {
          retry_params_name: 'default',
          retry_codes_name: 'baz_retry',
          timeout_millis: 50000,
        },
      },
    };

    const defaults = gax.constructSettings(
      SERVICE_NAME,
      A_CONFIG,
      overrides,
      RETRY_DICT
    );

    let settings = defaults.bundlingMethod;
    let backoff = settings.retry.backoffSettings;
    expect(backoff.initialRetryDelayMillis).to.eq(1000);
    expect(settings.retry.retryCodes).to.eql([RETRY_DICT.code_a]);
    expect(settings.timeout).to.eq(50000);

    /* page_streaming_method is unaffected because it's not specified in
     * overrides. 'bar_retry' or 'default' definitions in overrides should
     * not affect the methods which are not in the overrides. */
    settings = defaults.pageStreamingMethod;
    backoff = settings.retry.backoffSettings;
    expect(backoff.initialRetryDelayMillis).to.eq(100);
    expect(backoff.retryDelayMultiplier).to.eq(1.2);
    expect(backoff.maxRetryDelayMillis).to.eq(1000);
    expect(settings.retry.retryCodes).to.eql([RETRY_DICT.code_c]);
  });
});
