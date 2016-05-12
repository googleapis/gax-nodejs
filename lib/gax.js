/**
 * Copyright 2016, Google Inc.
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
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

/**
 * Google API Extensions
 */

'use strict';

var assert = require('chai').assert;

/**
 * Global constant.
 *
 * If a CallOptions field is set to OPTION_INHERIT, the call to which that
 * CallOptions belongs will attempt to inherit that field from its default
 * settings.
 */
var OPTION_INHERIT = exports.OPTION_INHERIT = {};

/**
 * @param {Object} settings - An object containing parameters of this settings.
 * @param {number} settings.timeout - The client-side timeout for API calls.
 *   This parameter is ignored for retrying calls.
 * @param {RetryOptions} settings.retry - The configuration for retrying upon
 *   transient error. If set to null, this call will not retry.
 * @param {PageDescriptor} settings.pageDescriptor - indicates the structure
 *   of page streaming to be performed. If set to null, page streaming
 *   is disabled.
 * @param {Object} settings.bundler - orchestrates bundling. If null, bundling
 *   is not performed.
 */
function CallSettings(settings) {
  settings = settings || {};
  this.timeout = settings.timeout || 30;
  this.retry = settings.retry;
  this.pageDescriptor = settings.pageDescriptor;
  this.bundler = settings.bundler;
}
exports.CallSettings = CallSettings;

/**
 * Returns a new CallSettings merged from this and a CallOptions object.
 *
 * @param {CallOptions} options - an instance whose values override
 *   those in this object. If null, ``merge`` returns a copy of this
 *   object
 * @returns {CallSettings}
 */
CallSettings.prototype.merge = function merge(options) {
  if (!options) {
    return new CallSettings(this);
  }
  var timeout;
  var retry;
  var pageDescriptor;
  if (options.timeout == OPTION_INHERIT) {
    timeout = this.timeout;
  } else {
    timeout = options.timeout;
  }
  if (options.retry == OPTION_INHERIT) {
    retry = this.retry;
  } else {
    retry = options.retry;
  }
  if (options.isPageStreaming) {
    pageDescriptor = this.pageDescriptor;
  } else {
    pageDescriptor = null;
  }

  return new CallSettings({
    timeout: timeout,
    retry: retry,
    pageDescriptor: pageDescriptor,
    bundler: this.bundler});
};

/**
 * Encapsulates the overridable settings for a particular API call.
 *
 * ``CallOptions`` is an optional arg for all GAX API calls.  It is used to
 * configure the settings of a specific API call.
 *
 * When provided, its values override the GAX service defaults for that
 * particular call.
 *
 * @example <caption>change an api call's timeout</caption>
 * new CallOptions({timeout: 30})  // make the timeout 30 seconds
 * @example
 * <caption>disable page streaming on an api call that normally supports it</caption>
 * new CallOptions({pageStreaming: false})
 * @example
 * <caption>disable retrying on an api call that normally retries</caption>
 * o3 = new CallOptions({retry: null})
 *
 * @param {Object} options The optional parameters.
 * @param {number} options.timeout - The client-side timeout for API calls.
 * @param {RetryOptions} options.retry - determines whether and how to retry
 *   on transient errors. When set to null, the call will not retry.
 * @param {boolean} isPageStreaming - If set and the call is configured for
 *   page streaming, page streaming is performed.
 */
function CallOptions(options) {
  if ('timeout' in options) {
    this.timeout = options.timeout;
  } else {
    this.timeout = OPTION_INHERIT;
  }
  if ('retry' in options) {
    this.retry = options.retry;
  } else {
    this.retry = OPTION_INHERIT;
  }
  if ('isPageStreaming' in options) {
    this.isPageStreaming = options.isPageStreaming;
  } else {
    this.isPageStreaming = OPTION_INHERIT;
  }
}
exports.CallOptions = CallOptions;

/**
 * Describes the structure of a page-streaming call.
 */
function PageDescriptor(requestPageTokenField,
                        responsePageTokenField,
                        resourceField) {
  this.requestPageTokenField = requestPageTokenField;
  this.responsePageTokenField = responsePageTokenField;
  this.resourceField = resourceField;
}
exports.PageDescriptor = PageDescriptor;
/**
 * Per-call configurable settings for retrying upon transient failure.
 * @property {string[]} retryCodes - a list of Google API canonical error codes
 *   upon which a retry should be attempted.
 * @property {BackoffSettings} backoffSettings - configures the retry
 *   exponential backoff algorithm.
 */
function RetryOptions(retryCodes, backoffSettings) {
  this.retryCodes = retryCodes;
  this.backoffSettings = backoffSettings;
}
exports.RetryOptions = RetryOptions;

/**
 * Parameters to the exponential backoff algorithm for retrying.
 * @property {number} initialRetryDelayMillis - the initial delay time,
 *   in milliseconds, between the completion of the first failed request and the
 *   initiation of the first retrying request.
 * @property {number} retryDelayMultiplier - the multiplier by which to
 *   increase the delay time between the completion of failed requests, and the
 *   initiation of the subsequent retrying request.
 * @property {number} maxRetryDelayMillis - the maximum delay time, in
 *   milliseconds, between requests. When this value is reached,
 *   ``retryDelayMultiplier`` will no longer be used to increase delay time.
 * @property {number} initialRpcTimeoutMillis - the initial timeout parameter
 *   to the request.
 * @property {number} rpcTimeoutMultiplier - the multiplier by which to
 *   increase the timeout parameter between failed requests.
 * @property {number} maxRpcTimeoutMillis - the maximum timeout parameter, in
 *   milliseconds, for a request. When this value is reached,
 *   ``rpcTimeoutMultiplier`` will no longer be used to increase the timeout.
 * @property {number} totalTimeoutMillis - the total time, in milliseconds,
 *   starting from when the initial request is sent, after which an error will
 *   be returned, regardless of the retrying attempts made meanwhile.
 */
function BackoffSettings(initialRetryDelayMillis,
                         retryDelayMultiplier,
                         maxRetryDelayMillis,
                         initialRpcTimeoutMillis,
                         rpcTimeoutMultiplier,
                         maxRpcTimeoutMillis,
                         totalTimeoutMillis) {
  this.initialRetryDelayMillis = initialRetryDelayMillis;
  this.retryDelayMultiplier = retryDelayMultiplier;
  this.maxRetryDelayMillis = maxRetryDelayMillis;
  this.initialRpcTimeoutMillis = initialRpcTimeoutMillis;
  this.rpcTimeoutMultiplier = rpcTimeoutMultiplier;
  this.maxRpcTimeoutMillis = maxRpcTimeoutMillis;
  this.totalTimeoutMillis = totalTimeoutMillis;
}
exports.BackoffSettings = BackoffSettings;

/**
 * Holds values used to configure bundling.
 *
 * The xxxThreshold attributes are used to configure when the bundled request
 * should be made. All properties default to 0.
 * @param {Object} options - An object to hold optional parameters. See
 *   properties for the content of options.
 * @property {number} elementCountThreshold - the bundled request will be sent
 *   once the count of outstanding elements in the repeated field reaches this
 *   value.
 * @property {number} elementCountLimit - represents a hard limit on the
 *   number of elements in the repeated field of the bundle; if adding a request
 *   to a bundle would exceed this value, the bundle is sent and the new request
 *   is added to a fresh bundle. It is invalid for a single request to exceed
 *   this limit.
 * @property {number} requestByteThreshold - the bundled request will be sent
 *   once the count of bytes in the request reaches this value. Note that this
 *   value is pessimistically approximated by summing the bytesizes of the
 *   elements in the repeated field, and therefore may be an
 *   under-approximation.
 * @property {number} requestByteLimit - represents a hard limit on the size
 *   of the bundled request; if adding a request to a bundle would exceed this
 *   value, the bundle is sent and the new request is added to a fresh bundle.
 *   It is invalid for a single request to exceed this limit. Note that this
 *   value is pessimistically approximated by summing the bytesizes of the
 *   elements in the repeated field, with a buffer applied to correspond to
 *   the resulting under-approximation.
 * @property {number} delayThreshold - the bundled request will be sent this
 *   amount of time after the first element in the bundle was added to it.
 */
function BundleOptions(options) {
  var elementCountThreshold = options.elementCountThreshold || 0;
  var elementCountLimit = options.elementCountLimit || 0;
  var requestByteThreshold = options.requestByteThreshold || 0;
  var requestByteLimit = options.requestByteLimit || 0;
  var delayThreshold = options.delayThreshold || 0;
  assert(typeof elementCountThreshold === 'number', 'should be a number');
  assert(typeof elementCountLimit === 'number', 'should be a number');
  assert(typeof requestByteThreshold === 'number', 'should be a number');
  assert(typeof requestByteLimit === 'number', 'should be a number');
  assert(typeof delayThreshold === 'number', 'should be a number');
  assert(elementCountThreshold > 0 || requestByteLimit > 0 ||
         delayThreshold > 0, 'one threashold should be > 0');
  this.elementCountThreshold = elementCountThreshold;
  this.elementCountLimit = elementCountLimit;
  this.requestByteThreshold = requestByteThreshold;
  this.requestByteLimit = requestByteLimit;
  this.delayThreshold = delayThreshold;
}
exports.BundleOptions = BundleOptions;


/**
 * Helper for {@link constructSettings}
 *
 * @param {object} methodConfig - A dictionary representing a single
 *   ``methods`` entry of the standard API client config file. (See
 *   {@link constructSettings} for information on this yaml.)
 * @param {BundleOptions|OPTION_INHERIT} methodRetryOverride -
 *   If set to OPTION_INHERIT, the retry settings are derived from
 *   method config. Otherwise, this parameter overrides
 *   methodConfig.
 * @returns An Executor that configures bundling, or null if this
 *   method should not bundle.
 */
function constructBundling(methodConfig, methodBundlingOverride) {
  if ('bundling' in methodConfig) {
    if (methodBundlingOverride === OPTION_INHERIT) {
      var params = methodConfig.bundling;
      var options = new BundleOptions({
        'elementCountThreshold': params.element_count_threshold,
        'elementCountLimit': params.element_count_limit,
        'requestByteThreshold': params.request_byte_threshold,
        'requestByteLimit': params.request_byte_limit,
        'delayThreshold': params.delay_threshold_millis});
      /*
       * TODO: comment-out when bundling is supported.
       * return new Executor(options)
       */
    } else if (methodBundlingOverride) {
        /* return new Executor(method_bundling_override) */
    }
  }
  return null;
}

/**
 * Helper for {@link constructSettings}
 *
 * @param {Object} methodConfig - A dictionary representing a single
 *   ``methods`` entry of the standard API client config file. (See
 *   {@link constructSettings} for information on this yaml.)
 * @param {RetryOptions|OPTION_INHERIT} methodRetryOverride -
 *   If set to OPTION_INHERIT, the retry settings are derived from
 *   method config. Otherwise, this parameter overrides
 *   ``method_config``.
 * @param {?Object} retryCodes - A dictionary parsed from the
 *   ``retry_codes_def`` entry of the standard API client config
 *   file. (See {@link constructSettings} for information on this yaml.)
 * @param {Object} retryParams - A dictionary parsed from the
 *   ``retry_params`` entry of the standard API client config
 *   file. (See {@link constructSettings} for information on this yaml.)
 * @param {Object} retryNames - A dictionary mapping the string names
 *   used in the standard API client config file to API response
 *   status codes.
 * @returns {?RetryOptions}
 */
function constructRetry(methodConfig, methodRetryOverride, retryCodes,
                        retryParams, retryNames) {
  if(methodRetryOverride !== OPTION_INHERIT) {
    return methodRetryOverride;
  }

  retryCodes = retryCodes || {};
  var retryCodesName = methodConfig.retry_codes_name;
  var codes = (retryCodes[retryCodesName] || []).map(function(name) {
    return retryNames[name];
  });

  var backoffSettings;
  if (retryParams && 'retry_params_name' in methodConfig) {
    var params = retryParams[methodConfig.retry_params_name];
    backoffSettings = new BackoffSettings(
        params.initial_retry_delay_millis,
        params.retry_delay_multiplier,
        params.max_retry_delay_millis,
        params.initial_rpc_timeout_millis,
        params.rpc_timeout_multiplier,
        params.max_rpc_timeout_millis,
        params.total_timeout_millis);
  }
  return new RetryOptions(codes, backoffSettings);
}

/**
 * Constructs a dictionary mapping method names to {@link CallSettings}.
 *
 * The `clientConfig` parameter is parsed from a client configuration JSON
 * file of the form:
 *
 *   {
 *     "interfaces": {
 *       "google.fake.v1.ServiceName": {
 *         "retry_codes": {
 *           "idempotent": ["UNAVAILABLE", "DEADLINE_EXCEEDED"],
 *           "non_idempotent": []
 *         },
 *         "retry_params": {
 *           "default": {
 *             "initial_retry_delay_millis": 100,
 *             "retry_delay_multiplier": 1.2,
 *             "max_retry_delay_millis": 1000,
 *             "initial_rpc_timeout_millis": 2000,
 *             "rpc_timeout_multiplier": 1.5,
 *             "max_rpc_timeout_millis": 30000,
 *             "total_timeout_millis": 45000
 *           }
 *         },
 *         "methods": {
 *           "CreateFoo": {
 *             "retry_codes_name": "idempotent",
 *             "retry_params_name": "default"
 *           },
 *           "Publish": {
 *             "retry_codes_name": "non_idempotent",
 *             "retry_params_name": "default",
 *             "bundling": {
 *               "element_count_threshold": 40,
 *               "element_count_limit": 200,
 *               "request_byte_threshold": 90000,
 *               "request_byte_limit": 100000,
 *               "delay_threshold_millis": 100
 *             }
 *           }
 *         }
 *       }
 *     }
 *   }
 *
 * @param {String} serviceName - The fully-qualified name of this
 *   service, used as a key into the client config file (in the
 *   example above, this value should be 'google.fake.v1.ServiceName').
 * @param {Object} clientConfig - A dictionary parsed from the
 *     standard API client config file.
 * @param {Object} bundlingOverride - A dictionary of method names to
 *   {@link BundleOptions} override those specified in `client_config`.
 * @param {Object} retryOverride - A dictionary of method names to
 *   {@link RetryOptions} that override those specified in `client_config`.
 * @param {Object} retryNames - A dictionary mapping the strings
 *   referring to response status codes to objects representing
 *   those codes.
 * @param {number} timeout - The timeout parameter for all API calls
 *   in this dictionary.
 * @param {Object} pageDescriptors - A dictionary of method names to
 *   {@link PageDescriptor} objects for methods that are page streaming-enabled.
 * @returns {?CallSettings} A CallSettings, or null if the service is not found
 *   in the config.
 */
exports.constructSettings = function constructSettings(
    serviceName, clientConfig, bundlingOverride, retryOverride,
    retryNames, timeout, pageDescriptors) {
  pageDescriptors = pageDescriptors || {};
  var defaults = {};

  var serviceConfig = (clientConfig.interfaces || {})[serviceName];
  if (!serviceConfig) {
    return null;
  }

  var methods = serviceConfig.methods;
  for (var methodName in methods) {
    var methodConfig = methods[methodName];
    var jsName = methodName[0].toLowerCase() + methodName.slice(1);

    defaults[jsName] = new CallSettings({
      'timeout': timeout,
      'retry': constructRetry(
          methodConfig,
          (jsName in retryOverride)? retryOverride[jsName] : OPTION_INHERIT,
          serviceConfig.retry_codes,
          serviceConfig.retry_params,
          retryNames),
      'pageDescriptor': pageDescriptors[jsName] || null,
      'bundler': constructBundling(
          methodConfig,
          (jsName in bundlingOverride)?
              bundlingOverride[jsName] : OPTION_INHERIT)
    });
  }
  return defaults;
};
