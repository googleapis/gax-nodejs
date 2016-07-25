/* Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

/* eslint-disable quote-props */
/* quote-props causes errors on quoted property names in the data like
 * 'foo_retry' or 'initial_retry_delay_millis' in this file. However,
 * allowing that causes another errors of non-camelcase symbols anyways.
 * Therefore quote-props is disabled explicitly only in this file. */

'use strict';

var gax = require('../lib/gax');
var bundling = require('../lib/bundling');
var expect = require('chai').expect;

var SERVICE_NAME = 'test.interface.v1.api';

var A_CONFIG = {
  'interfaces': {
  }
};

A_CONFIG.interfaces[SERVICE_NAME] = {
  'retry_codes': {
    'foo_retry': ['code_a', 'code_b'],
    'bar_retry': ['code_c']
  },
  'retry_params': {
    'default': {
      'initial_retry_delay_millis': 100,
      'retry_delay_multiplier': 1.2,
      'max_retry_delay_millis': 1000,
      'initial_rpc_timeout_millis': 300,
      'rpc_timeout_multiplier': 1.3,
      'max_rpc_timeout_millis': 3000,
      'total_timeout_millis': 30000
    }
  },
  'methods': {
    'BundlingMethod': {
      'retry_codes_name': 'foo_retry',
      'retry_params_name': 'default',
      'bundling': {
        'element_count_threshold': 6,
        'element_count_limit': 10
      }
    },
    'PageStreamingMethod': {
      'retry_codes_name': 'bar_retry',
      'retry_params_name': 'default'
    }
  }
};

var PAGE_DESCRIPTORS = {
  'pageStreamingMethod': new gax.PageDescriptor(
    'page_token', 'next_page_token', 'page_streams')
};

var BUNDLE_DESCRIPTORS = {
  'bundlingMethod': new gax.BundleDescriptor('bundled_field', [])
};

var RETRY_DICT = {
  'code_a': 1,
  'code_b': 2,
  'code_c': 3
};

describe('gax construct settings', function() {
  it('creates settings', function() {
    var otherArgs = {'key': 'value'};
    var defaults = gax.constructSettings(
        SERVICE_NAME, A_CONFIG, {}, RETRY_DICT, 30, PAGE_DESCRIPTORS,
        BUNDLE_DESCRIPTORS, otherArgs);
    var settings = defaults.bundlingMethod;
    expect(settings.timeout).to.eq(30);
    expect(settings.bundler).to.be.an.instanceOf(bundling.BundleExecutor);
    expect(settings.pageDescriptor).to.eq(null);
    expect(settings.retry).to.be.an.instanceOf(gax.RetryOptions);
    expect(settings.retry.retryCodes).eql([1, 2]);
    expect(settings.retry.backoffSettings).to.be.an.instanceOf(
      gax.BackoffSettings);
    expect(settings.otherArgs).eql(otherArgs);

    settings = defaults.pageStreamingMethod;
    expect(settings.timeout).to.eq(30);
    expect(settings.bundler).to.eq(null);
    expect(settings.pageDescriptor).to.be.an.instanceOf(gax.PageDescriptor);
    expect(settings.retry).to.be.an.instanceOf(gax.RetryOptions);
    expect(settings.retry.retryCodes).eql([3]);
    expect(settings.retry.backoffSettings).to.be.an.instanceOf(
      gax.BackoffSettings);
    expect(settings.otherArgs).eql(otherArgs);
  });

  it('overrides settings', function() {
    var overrides = {'interfaces': {}};
    overrides.interfaces[SERVICE_NAME] = {
      'methods': {
        'PageStreamingMethod': null,
        'BundlingMethod': {
          'bundling': null
        }
      }
    };
    var defaults = gax.constructSettings(
        SERVICE_NAME, A_CONFIG, overrides, RETRY_DICT, 30, PAGE_DESCRIPTORS,
        BUNDLE_DESCRIPTORS);

    var settings = defaults.bundlingMethod;
    expect(settings.timeout).to.eq(30);
    expect(settings.bundler).to.eq(null);
    expect(settings.pageDescriptor).to.eq(null);

    settings = defaults.pageStreamingMethod;
    expect(settings.timeout).to.eq(30);
    expect(settings.pageDescriptor).to.be.an.instanceOf(gax.PageDescriptor);
    expect(settings.retry).to.eq(null);
  });

  it('overrides settings more precisely', function() {
    var overrides = {'interfaces': {}};
    overrides.interfaces[SERVICE_NAME] = {
      'retry_codes': {
        'bar_retry': [],
        'baz_retry': ['code_a']
      },
      'retry_params': {
        'default': {
          'initial_retry_delay_millis': 1000,
          'retry_delay_multiplier': 1.2,
          'max_retry_delay_millis': 10000,
          'initial_rpc_timeout_millis': 3000,
          'rpc_timeout_multiplier': 1.3,
          'max_rpc_timeout_millis': 30000,
          'total_timeout_millis': 300000
        }
      },
      'methods': {
        'BundlingMethod': {
          'retry_params_name': 'default',
          'retry_codes_name': 'baz_retry'
        }
      }
    };

    var defaults = gax.constructSettings(
        SERVICE_NAME, A_CONFIG, overrides, RETRY_DICT, 30, PAGE_DESCRIPTORS,
        BUNDLE_DESCRIPTORS);

    var settings = defaults.bundlingMethod;
    var backoff = settings.retry.backoffSettings;
    expect(backoff.initialRetryDelayMillis).to.eq(1000);
    expect(settings.retry.retryCodes).to.eql([RETRY_DICT.code_a]);
    expect(settings.bundler).to.be.an.instanceOf(bundling.BundleExecutor);

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
