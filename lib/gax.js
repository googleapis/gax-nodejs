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

/**
 * Encapsulates the overridable settings for a particular API call.
 *
 * ``CallOptions`` is an optional arg for all GAX API calls.  It is used to
 * configure the settings of a specific API call.
 *
 * When provided, its values override the GAX service defaults for that
 * particular call.
 *
 * Typically the API clients will accept this as the second to the last
 * argument. See the examples below.
 * @typedef {Object} CallOptions
 * @property {number=} timeout - The client-side timeout for API calls.
 * @property {RetryOptions=} retry - determines whether and how to retry
 *   on transient errors. When set to null, the call will not retry.
 * @property {boolean=} autoPaginate - If set to false and the call is
 *   configured for paged iteration, page unrolling is not performed, instead
 *   the callback will be called with the response object.
 * @property {Object=} pageToken - If set and the call is configured for
 *   paged iteration, paged iteration is not performed and requested with this
 *   pageToken.
 * @property {number} maxResults - If set and the call is configured for
 *   paged iteration, the call will stop when the number of response elements
 *   reaches to the specified size. By default, it will unroll the page to
 *   the end of the list.
 * @property {boolean=} isBundling - If set to false and the call is configured
 *   for bundling, bundling is not performed.
 * @property {BackoffSettings=} longrunning - BackoffSettings used for polling.
 * @property {Function=} promise - A constructor for a promise that implements the ES6
 * specification of promise which will be used to create promises. If not
 * provided, native promises will be used.
 * @example
 * // suppress bundling for bundled method.
 * api.bundlingMethod(
 *     param, {optParam: aValue, isBundling: false}, function(err, response) {
 *   // handle response.
 * });
 * @example
 * // suppress streaming for page-streaming method.
 * api.pageStreamingMethod(
 *     param, {optParam: aValue, autoPaginate: false}, function(err, page) {
 *   // not returning a stream, but callback is called with the paged response.
 * });
 */

/**
 * Per-call configurable settings for retrying upon transient failure.
 * @typedef {Object} RetryOptions
 * @property {String[]} retryCodes
 * @property {BackoffSettings} backoffSettings
 */

/**
 * Parameters to the exponential backoff algorithm for retrying.
 * @typedef {Object} BackoffSettings
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
 * @propetry {number} rpcTimeoutMultiplier - the multiplier by which to
 *   increase the timeout parameter between failed requests.
 * @property {number} maxRpcTimeoutMillis - the maximum timeout parameter, in
 *   milliseconds, for a request. When this value is reached,
 *   ``rpcTimeoutMultiplier`` will no longer be used to increase the timeout.
 * @property {number} totalTimeoutMillis - the total time, in milliseconds,
 *   starting from when the initial request is sent, after which an error will
 *   be returned, regardless of the retrying attempts made meanwhile.
 */

/**
 * Parameter to configure bundling behavior.
 * @typedef {Object} BundleOptions
 * @property {number} elementCountThreshold -
 *   the bundled request will be sent once the count of outstanding elements
 *   in the repeated field reaches this value.
 * @property {number} elementCountLimit -
 *   represents a hard limit on the number of elements in the repeated field
 *   of the bundle; if adding a request to a bundle would exceed this value,
 *   the bundle is sent and the new request is added to a fresh bundle. It is
 *   invalid for a single request to exceed this limit.
 * @property {number} requestByteThreshold -
 *   the bundled request will be sent once the count of bytes in the request
 *   reaches this value. Note that this value is pessimistically approximated
 *   by summing the bytesizes of the elements in the repeated field, and
 *   therefore may be an under-approximation.
 * @property {number} requestByteLimit -
 *   represents a hard limit on the size of the bundled request; if adding
 *   a request to a bundle would exceed this value, the bundle is sent and
 *   the new request is added to a fresh bundle. It is invalid for a single
 *   request to exceed this limit. Note that this value is pessimistically
 *   approximated by summing the bytesizes of the elements in the repeated
 *   field, with a buffer applied to correspond to the resulting
 *   under-approximation.
 * @property {number} delayThreshold -
 *   the bundled request will be sent this amount of time after the first
 *   element in the bundle was added to it.
 */

/**
 * @param {Object} settings - An object containing parameters of this settings.
 * @param {number} settings.timeout - The client-side timeout for API calls.
 *   This parameter is ignored for retrying calls.
 * @param {RetryOptions} settings.retry - The configuration for retrying upon
 *   transient error. If set to null, this call will not retry.
 * @param {boolean} settings.autoPaginate - If there is no `pageDescriptor`,
 *   this attrbute has no meaning. Otherwise, determines whether a page streamed
 *   response should make the page structure transparent to the user by
 *   flattening the repeated field in the returned generator.
 * @param {number} settings.pageToken - If there is no `pageDescriptor`,
 *   this attribute has no meaning. Otherwise, determines the page token used in
 *   the page streaming request.
 * @param {Object} settings.otherArgs - Additional arguments to be passed to
 *   the API calls.
 * @param {Function=} settings.promise - A constructor for a promise that
 * implements the ES6 specification of promise. If not provided, native promises
 * will be used.
 *
 * @constructor
 */
function CallSettings(settings) {
  settings = settings || {};
  this.timeout = settings.timeout || 30 * 1000;
  this.retry = settings.retry;
  this.autoPaginate = 'autoPaginate' in settings ? settings.autoPaginate : true;
  this.pageToken = settings.pageToken;
  this.maxResults = settings.maxResults;
  this.otherArgs = settings.otherArgs || {};
  this.bundleOptions = settings.bundleOptions;
  this.isBundling = 'isBundling' in settings ? settings.isBundling : true;
  this.longrunning = 'longrunning' in settings ? settings.longrunning : null;
  this.promise = 'promise' in settings ? settings.promise : Promise;
}
exports.CallSettings = CallSettings;

/**
 * Returns a new CallSettings merged from this and a CallOptions object.
 *
 * @param {CallOptions} options - an instance whose values override
 *   those in this object. If null, ``merge`` returns a copy of this
 *   object
 * @return {CallSettings} The merged CallSettings instance.
 */
CallSettings.prototype.merge = function merge(options) {
  if (!options) {
    return new CallSettings(this);
  }
  var timeout = this.timeout;
  var retry = this.retry;
  var autoPaginate = this.autoPaginate;
  var pageToken = this.pageToken;
  var maxResults = this.maxResults;
  var otherArgs = this.otherArgs;
  var isBundling = this.isBundling;
  var longrunning = this.longrunning;
  var promise = this.promise;
  if ('timeout' in options) {
    timeout = options.timeout;
  }
  if ('retry' in options) {
    retry = options.retry;
  }

  if ('autoPaginate' in options && !options.autoPaginate) {
    autoPaginate = false;
  }

  if ('pageToken' in options) {
    autoPaginate = false;
    pageToken = options.pageToken;
  }

  if ('maxResults' in options) {
    maxResults = options.maxResults;
  }

  if ('otherArgs' in options) {
    otherArgs = {};
    for (var key in this.otherArgs) {
      otherArgs[key] = this.otherArgs[key];
    }
    for (var optionsKey in options.otherArgs) {
      otherArgs[optionsKey] = options.otherArgs[optionsKey];
    }
  }

  if ('isBundling' in options) {
    isBundling = options.isBundling;
  }

  if ('maxRetries' in options) {
    retry.backoffSettings.maxRetries = options.maxRetries;
    delete retry.backoffSettings.totalTimeoutMillis;
  }

  if ('longrunning' in options) {
    longrunning = options.longrunning;
  }

  if ('promise' in options) {
    promise = options.promise;
  }

  return new CallSettings({
    timeout: timeout,
    retry: retry,
    bundleOptions: this.bundleOptions,
    longrunning: longrunning,
    autoPaginate: autoPaginate,
    pageToken: pageToken,
    maxResults: maxResults,
    otherArgs: otherArgs,
    isBundling: isBundling,
    promise: promise,
  });
};

/**
 * Per-call configurable settings for retrying upon transient failure.
 *
 * @param {String[]} retryCodes - a list of Google API canonical error codes
 *   upon which a retry should be attempted.
 * @param {BackoffSettings} backoffSettings - configures the retry
 *   exponential backoff algorithm.
 * @return {RetryOptions} A new RetryOptions object.
 *
 */
function createRetryOptions(retryCodes, backoffSettings) {
  return {
    retryCodes: retryCodes,
    backoffSettings: backoffSettings,
  };
}
exports.createRetryOptions = createRetryOptions;

/**
 * Parameters to the exponential backoff algorithm for retrying.
 *
 * @param {number} initialRetryDelayMillis - the initial delay time,
 *   in milliseconds, between the completion of the first failed request and the
 *   initiation of the first retrying request.
 * @param {number} retryDelayMultiplier - the multiplier by which to
 *   increase the delay time between the completion of failed requests, and the
 *   initiation of the subsequent retrying request.
 * @param {number} maxRetryDelayMillis - the maximum delay time, in
 *   milliseconds, between requests. When this value is reached,
 *   ``retryDelayMultiplier`` will no longer be used to increase delay time.
 * @param {number} initialRpcTimeoutMillis - the initial timeout parameter
 *   to the request.
 * @param {number} rpcTimeoutMultiplier - the multiplier by which to
 *   increase the timeout parameter between failed requests.
 * @param {number} maxRpcTimeoutMillis - the maximum timeout parameter, in
 *   milliseconds, for a request. When this value is reached,
 *   ``rpcTimeoutMultiplier`` will no longer be used to increase the timeout.
 * @param {number} totalTimeoutMillis - the total time, in milliseconds,
 *   starting from when the initial request is sent, after which an error will
 *   be returned, regardless of the retrying attempts made meanwhile.
 * @return {BackoffSettings} a new settings.
 *
 */
function createBackoffSettings(
  initialRetryDelayMillis,
  retryDelayMultiplier,
  maxRetryDelayMillis,
  initialRpcTimeoutMillis,
  rpcTimeoutMultiplier,
  maxRpcTimeoutMillis,
  totalTimeoutMillis
) {
  return {
    initialRetryDelayMillis: initialRetryDelayMillis,
    retryDelayMultiplier: retryDelayMultiplier,
    maxRetryDelayMillis: maxRetryDelayMillis,
    initialRpcTimeoutMillis: initialRpcTimeoutMillis,
    rpcTimeoutMultiplier: rpcTimeoutMultiplier,
    maxRpcTimeoutMillis: maxRpcTimeoutMillis,
    totalTimeoutMillis: totalTimeoutMillis,
  };
}
exports.createBackoffSettings = createBackoffSettings;

/**
 * Parameters to the exponential backoff algorithm for retrying.
 * This function is unsupported, and intended for internal use only.
 *
 * @param {number} initialRetryDelayMillis - the initial delay time,
 *   in milliseconds, between the completion of the first failed request and the
 *   initiation of the first retrying request.
 * @param {number} retryDelayMultiplier - the multiplier by which to
 *   increase the delay time between the completion of failed requests, and the
 *   initiation of the subsequent retrying request.
 * @param {number} maxRetryDelayMillis - the maximum delay time, in
 *   milliseconds, between requests. When this value is reached,
 *   ``retryDelayMultiplier`` will no longer be used to increase delay time.
 * @param {number} initialRpcTimeoutMillis - the initial timeout parameter
 *   to the request.
 * @param {number} rpcTimeoutMultiplier - the multiplier by which to
 *   increase the timeout parameter between failed requests.
 * @param {number} maxRpcTimeoutMillis - the maximum timeout parameter, in
 *   milliseconds, for a request. When this value is reached,
 *   ``rpcTimeoutMultiplier`` will no longer be used to increase the timeout.
 * @param {number} maxRetries - the maximum number of retrying attempts that
 *   will be made. If reached, an error will be returned.
 * @return {BackoffSettings} a new settings.
 *
 */
function createMaxRetriesBackoffSettings(
  initialRetryDelayMillis,
  retryDelayMultiplier,
  maxRetryDelayMillis,
  initialRpcTimeoutMillis,
  rpcTimeoutMultiplier,
  maxRpcTimeoutMillis,
  maxRetries
) {
  return {
    initialRetryDelayMillis: initialRetryDelayMillis,
    retryDelayMultiplier: retryDelayMultiplier,
    maxRetryDelayMillis: maxRetryDelayMillis,
    initialRpcTimeoutMillis: initialRpcTimeoutMillis,
    rpcTimeoutMultiplier: rpcTimeoutMultiplier,
    maxRpcTimeoutMillis: maxRpcTimeoutMillis,
    maxRetries: maxRetries,
  };
}
exports.createMaxRetriesBackoffSettings = createMaxRetriesBackoffSettings;

/**
 * Creates a new {@link BundleOptions}.
 *
 * @private
 * @param {Object} options - An object to hold optional parameters. See
 *   properties for the content of options.
 * @return {BundleOptions} - A new options.
 */
function createBundleOptions(options) {
  var params = [
    'element_count_threshold',
    'element_count_limit',
    'request_byte_threshold',
    'request_byte_limit',
    'delay_threshold_millis',
  ];
  params.forEach(function(param) {
    if (param in options && typeof options[param] !== 'number') {
      throw new Error(param + ' should be a number');
    }
  });

  var elementCountThreshold = options.element_count_threshold || 0;
  var elementCountLimit = options.element_count_limit || 0;
  var requestByteThreshold = options.request_byte_threshold || 0;
  var requestByteLimit = options.request_byte_limit || 0;
  var delayThreshold = options.delay_threshold_millis || 0;

  if (
    elementCountThreshold === 0 &&
    requestByteThreshold === 0 &&
    delayThreshold === 0
  ) {
    throw new Error('one threshold should be > 0');
  }
  return {
    elementCountThreshold: elementCountThreshold,
    elementCountLimit: elementCountLimit,
    requestByteThreshold: requestByteThreshold,
    requestByteLimit: requestByteLimit,
    delayThreshold: delayThreshold,
  };
}
exports.createBundleOptions = createBundleOptions;

/**
 * Helper for {@link constructSettings}
 *
 * @private
 *
 * @param {Object} methodConfig - A dictionary representing a single
 *   `methods` entry of the standard API client config file. (See
 *   {@link constructSettings} for information on this yaml.)
 * @param {?Object} retryCodes - A dictionary parsed from the
 *   `retry_codes_def` entry of the standard API client config
 *   file. (See {@link constructSettings} for information on this yaml.)
 * @param {Object} retryParams - A dictionary parsed from the
 *   `retry_params` entry of the standard API client config
 *   file. (See {@link constructSettings} for information on this yaml.)
 * @param {Object} retryNames - A dictionary mapping the string names
 *   used in the standard API client config file to API response
 *   status codes.
 * @return {?RetryOptions} The new retry options.
 */
function constructRetry(methodConfig, retryCodes, retryParams, retryNames) {
  if (!methodConfig) {
    return null;
  }

  var codes = null;
  if (retryCodes && 'retry_codes_name' in methodConfig) {
    var retryCodesName = methodConfig.retry_codes_name;
    codes = (retryCodes[retryCodesName] || []).map(function(name) {
      return retryNames[name];
    });
  }

  var backoffSettings = null;
  if (retryParams && 'retry_params_name' in methodConfig) {
    var params = retryParams[methodConfig.retry_params_name];
    backoffSettings = createBackoffSettings(
      params.initial_retry_delay_millis,
      params.retry_delay_multiplier,
      params.max_retry_delay_millis,
      params.initial_rpc_timeout_millis,
      params.rpc_timeout_multiplier,
      params.max_rpc_timeout_millis,
      params.total_timeout_millis
    );
  }
  return createRetryOptions(codes, backoffSettings);
}

/**
 * Helper for {@link constructSettings}
 *
 * Takes two retry options, and merges them into a single RetryOption instance.
 *
 * @private
 *
 * @param {RetryOptions} retry - The base RetryOptions.
 * @param {RetryOptions} overrides - The RetryOptions used for overriding
 *   `retry`. Use the values if it is not null. If entire `overrides` is null,
 *   ignore the base retry and return null.
 * @return {?RetryOptions} The merged RetryOptions.
 */
function mergeRetryOptions(retry, overrides) {
  if (!overrides) {
    return null;
  }

  if (!overrides.retryCodes && !overrides.backoffSettings) {
    return retry;
  }

  var codes = retry.retryCodes;
  if (overrides.retryCodes) {
    codes = overrides.retryCodes;
  }
  var backoffSettings = retry.backoffSettings;
  if (overrides.backoffSettings) {
    backoffSettings = overrides.backoffSettings;
  }
  return createRetryOptions(codes, backoffSettings);
}

/**
 * Constructs a dictionary mapping method names to {@link CallSettings}.
 *
 * The `clientConfig` parameter is parsed from a client configuration JSON
 * file of the form:
 *
 *     {
 *       "interfaces": {
 *         "google.fake.v1.ServiceName": {
 *           "retry_codes": {
 *             "idempotent": ["UNAVAILABLE", "DEADLINE_EXCEEDED"],
 *             "non_idempotent": []
 *           },
 *           "retry_params": {
 *             "default": {
 *               "initial_retry_delay_millis": 100,
 *               "retry_delay_multiplier": 1.2,
 *               "max_retry_delay_millis": 1000,
 *               "initial_rpc_timeout_millis": 2000,
 *               "rpc_timeout_multiplier": 1.5,
 *               "max_rpc_timeout_millis": 30000,
 *               "total_timeout_millis": 45000
 *             }
 *           },
 *           "methods": {
 *             "CreateFoo": {
 *               "retry_codes_name": "idempotent",
 *               "retry_params_name": "default"
 *             },
 *             "Publish": {
 *               "retry_codes_name": "non_idempotent",
 *               "retry_params_name": "default",
 *               "bundling": {
 *                 "element_count_threshold": 40,
 *                 "element_count_limit": 200,
 *                 "request_byte_threshold": 90000,
 *                 "request_byte_limit": 100000,
 *                 "delay_threshold_millis": 100
 *               }
 *             }
 *           }
 *         }
 *       }
 *     }
 *
 * @param {String} serviceName - The fully-qualified name of this
 *   service, used as a key into the client config file (in the
 *   example above, this value should be 'google.fake.v1.ServiceName').
 * @param {Object} clientConfig - A dictionary parsed from the
 *   standard API client config file.
 * @param {Object} configOverrides - A dictionary in the same structure of
 *   client_config to override the settings.
 * @param {Object.<string, string[]>} retryNames - A dictionary mapping the strings
 *   referring to response status codes to objects representing
 *   those codes.
 * @param {Object} otherArgs - the non-request arguments to be passed to the API
 *   calls.
 * @param {Function=} promise - A constructor for a promise that implements the
 * ES6 specification of promise. If not provided, native promises will be used.
 * @return {Object} A mapping from method name to CallSettings, or null if the
 *   service is not found in the config.
 */
exports.constructSettings = function constructSettings(
  serviceName,
  clientConfig,
  configOverrides,
  retryNames,
  otherArgs,
  promise
) {
  otherArgs = otherArgs || {};
  var defaults = {};

  var serviceConfig = (clientConfig.interfaces || {})[serviceName];
  if (!serviceConfig) {
    return null;
  }

  var overrides = (configOverrides.interfaces || {})[serviceName] || {};

  var methods = serviceConfig.methods;
  var overridingMethods = overrides.methods || {};
  for (var methodName in methods) {
    var methodConfig = methods[methodName];
    var jsName = methodName[0].toLowerCase() + methodName.slice(1);

    var retry = constructRetry(
      methodConfig,
      serviceConfig.retry_codes,
      serviceConfig.retry_params,
      retryNames
    );
    var bundlingConfig = methodConfig.bundling;
    var timeout = methodConfig.timeout_millis;
    if (methodName in overridingMethods) {
      var overridingMethod = overridingMethods[methodName];
      if (overridingMethod) {
        if ('bundling' in overridingMethod) {
          bundlingConfig = overridingMethod.bundling;
        }
        if ('timeout_millis' in overridingMethod) {
          timeout = overridingMethod.timeout_millis;
        }
      }
      retry = mergeRetryOptions(
        retry,
        constructRetry(
          overridingMethod,
          overrides.retry_codes,
          overrides.retry_params,
          retryNames
        )
      );
    }

    defaults[jsName] = new CallSettings({
      timeout: timeout,
      retry: retry,
      bundleOptions: bundlingConfig
        ? createBundleOptions(bundlingConfig)
        : null,
      otherArgs: otherArgs,
      promise: promise || Promise,
    });
  }
  return defaults;
};
