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

var bundling = require('./bundling');

/**
 * Global constant.
 *
 * If a CallOptions field is set to OPTION_INHERIT, the call to which that
 * CallOptions belongs will attempt to inherit that field from its default
 * settings.
 */
var OPTION_INHERIT = exports.OPTION_INHERIT = {};

/**
 * A placeholder for the page token passed into an initial paginated request.
 */
exports.FIRST_PAGE = {};

/**
 * @param {Object} settings - An object containing parameters of this settings.
 * @param {number} settings.timeout - The client-side timeout for API calls.
 *   This parameter is ignored for retrying calls.
 * @param {RetryOptions} settings.retry - The configuration for retrying upon
 *   transient error. If set to null, this call will not retry.
 * @param {PageDescriptor} settings.pageDescriptor - indicates the structure
 *   of page streaming to be performed. If set to null, page streaming
 *   is disabled.
 * @param {boolean} settings.flattenPages - If there is no `pageDescriptor`,
 *   this attrbute has no meaning. Otherwise, determines whether a page streamed
 *   response should make the page structure transparent to the user by
 *   flattening the repeated field in the returned generator.
 * @param {number} settings.pageToken - If there is no `pageDescriptor`,
 *   this attribute has no meaning. Otherwise, determines the page token used in
 *   the page streaming request.
 * @param {Object} settings.bundler - orchestrates bundling. If null, bundling
 *   is not performed.
 * @param {Object} settings.otherArgs - Additional arguments to be passed to
 *   the API calls.
 *
 * @constructor
 */
function CallSettings(settings) {
  settings = settings || {};
  this.timeout = settings.timeout || 30;
  this.retry = settings.retry;
  this.pageDescriptor = settings.pageDescriptor;
  this.flattenPages =
      ('flattenPages' in settings) ? settings.flattenPages : true;
  this.pageToken = settings.pageToken;
  this.bundler = settings.bundler;
  this.otherArgs = settings.otherArgs || {};
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
  var flattenPages = this.flattenPages;
  var pageToken = this.pageToken;
  var otherArgs = this.otherArgs;
  var bundler = this.bundler;
  if (options.timeout !== OPTION_INHERIT) {
    timeout = options.timeout;
  }
  if (options.retry !== OPTION_INHERIT) {
    retry = options.retry;
  }

  if (options.pageToken !== OPTION_INHERIT) {
    flattenPages = false;
    pageToken = options.pageToken;
  }

  if (options.otherArgs !== OPTION_INHERIT) {
    otherArgs = {};
    for (var key in this.otherArgs) {
      otherArgs[key] = this.otherArgs[key];
    }
    for (var optionsKey in options.otherArgs) {
      otherArgs[optionsKey] = options.otherArgs[optionsKey];
    }
  }

  if (options.isBundling !== OPTION_INHERIT && !options.isBundling) {
    bundler = null;
  }

  return new CallSettings({
    timeout: timeout,
    retry: retry,
    pageDescriptor: this.pageDescriptor,
    flattenPages: flattenPages,
    pageToken: pageToken,
    bundler: bundler,
    otherArgs: otherArgs});
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
 * @param {Object} options.pageToken - If set and the call is configured for
 *   page streaming, page streaming is performed per-page, starting with this
 *   pageToken. Use {@link FIRST_PAGE} for the first request.  If unset and
 *   the call is configured for page streaming, page streaming is performed
 *   per-resource.
 * @param {boolean} options.isBundling - Whether bundling is used or not.
 *
 * @constructor
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
  if ('pageToken' in options) {
    this.pageToken = options.pageToken;
  } else {
    this.pageToken = OPTION_INHERIT;
  }
  if ('otherArgs' in options) {
    this.otherArgs = options.otherArgs;
  } else {
    this.otherArgs = OPTION_INHERIT;
  }
  if ('isBundling' in options) {
    this.isBundling = options.isBundling;
  } else {
    this.isBundling = OPTION_INHERIT;
  }
}
exports.CallOptions = CallOptions;

/**
 * Describes the structure of a page-streaming call.
 *
 * @property {String} requestPageTokenField
 * @property {String} responsePageTokenField
 * @property {String} resourceField
 *
 * @param {String} requestPageTokenField - The field name of the page token in
 *   the request.
 * @param {String} responsePageTokenField - The field name of the page token in
 *   the response.
 * @param {String} resourceField - The resource field name.
 *
 * @constructor
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
 *
 * @property {String[]} retryCodes
 * @property {BackoffSettings} backoffSettings
 *
 * @param {String[]} retryCodes - a list of Google API canonical error codes
 *   upon which a retry should be attempted.
 * @param {BackoffSettings} backoffSettings - configures the retry
 *   exponential backoff algorithm.
 *
 * @constructor
 */
function RetryOptions(retryCodes, backoffSettings) {
  this.retryCodes = retryCodes;
  this.backoffSettings = backoffSettings;
}
exports.RetryOptions = RetryOptions;

/**
 * Parameters to the exponential backoff algorithm for retrying.
 *
 * @property {number} initialRetryDelayMillis
 * @property {number} retryDelayMultiplier
 * @property {number} maxRetryDelayMillis
 * @property {number} initialRpcTimeoutMillis
 * @property {number} rpcTimeoutMultiplier
 * @property {number} maxRpcTimeoutMillis
 * @property {number} totalTimeoutMillis
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
 *
 * @constructor
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
 *
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
 *
 * @constructor
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
  assert(elementCountThreshold > 0 || requestByteThreshold > 0 ||
         delayThreshold > 0, 'one threshold should be > 0');
  this.elementCountThreshold = elementCountThreshold;
  this.elementCountLimit = elementCountLimit;
  this.requestByteThreshold = requestByteThreshold;
  this.requestByteLimit = requestByteLimit;
  this.delayThreshold = delayThreshold;
}
exports.BundleOptions = BundleOptions;

/**
 * Describes the structure of bundled call.
 *
 * requestDiscriminatorFields may include '.' as a separator, which is used to
 * indicate object traversal. This allows fields in nested objects to be used
 * to determine what request to bundle.
 *
 * @property {String} bundledField
 * @property {String} requestDiscriminatorFields
 * @property {String} subresponseField
 * @property {Function} byteLengthFunction
 *
 * @param {String} bundledField - the repeated field in the request message
 *   that will have its elements aggregated by bundling.
 * @param {String} requestDiscriminatorFields - a list of fields in the
 *   target request message class that are used to detemrine which request
 *   messages should be bundled together.
 * @param {String} subresponseField - an optional field, when present it
 *   indicates the field in the response message that should be used to
 *   demultiplex the response into multiple response messages.
 * @param {Function} byteLengthFunction - a function to obtain the byte
 *   length to be consumed for the bundled field messages. Because Node.JS
 *   protobuf.js/gRPC uses builtin Objects for the user-visible data and
 *   internally they are encoded/decoded in protobuf manner, this function
 *   is actually necessary to calculate the byte length.
 * @constructor
 */
function BundleDescriptor(bundledField,
                          requestDiscriminatorFields,
                          subresponseField,
                          byteLengthFunction) {
  if (!byteLengthFunction && typeof subresponseField === 'function') {
    byteLengthFunction = subresponseField;
    subresponseField = null;
  }
  this.bundledField = bundledField;
  this.requestDiscriminatorFields = requestDiscriminatorFields;
  this.subresponseField = subresponseField;
  this.byteLengthFunction = byteLengthFunction;
}
exports.BundleDescriptor = BundleDescriptor;

/**
 * Helper for {@link constructSettings}
 *
 * @private
 *
 * @param {Object} bundleConfig - A dictionary representing a single
 *   `methods` entry of the standard API client config file. (See
 *   {@link constructSettings} for information on this yaml.)
 * @param {BundleDescriptor} bundleDescriptor - The bundle descriptor
 *   to determine the structure of request bundling for the method.
 * @return {?BundleExecutor} An Executor that configures bundling, or null if
 *   this method should not bundle.
 */
function constructBundling(bundleConfig, bundleDescriptor) {
  if (bundleConfig && bundleDescriptor) {
    var options = new BundleOptions({
      elementCountThreshold: bundleConfig.element_count_threshold,
      elementCountLimit: bundleConfig.element_count_limit,
      requestByteThreshold: bundleConfig.request_byte_threshold,
      requestByteLimit: bundleConfig.request_byte_limit,
      delayThreshold: bundleConfig.delay_threshold_millis});
    return new bundling.BundleExecutor(options, bundleDescriptor);
  }
  return null;
}

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
  return new RetryOptions(codes, backoffSettings);
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
 * @param {Object} retryNames - A dictionary mapping the strings
 *   referring to response status codes to objects representing
 *   those codes.
 * @param {number} timeout - The timeout parameter for all API calls
 *   in this dictionary.
 * @param {Object} pageDescriptors - A dictionary of method names to
 *   {@link PageDescriptor} objects for methods that are page streaming-enabled.
 * @param {Object} bundleDescriptors - A dictionary of method names to
 *   {@link BundleDescriptor} objects for methods that are bundling-enabled.
 * @param {Object} otherArgs - the non-request arguments to be passed to the API
 *   calls.
 * @return {Object} A mapping from method name to CallSettings, or null if the
 *   service is not found in the config.
 */
exports.constructSettings = function constructSettings(
    serviceName, clientConfig, configOverrides,
    retryNames, timeout, pageDescriptors, bundleDescriptors, otherArgs) {
  pageDescriptors = pageDescriptors || {};
  bundleDescriptors = bundleDescriptors || {};
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

    var retry = constructRetry(methodConfig,
                               serviceConfig.retry_codes,
                               serviceConfig.retry_params,
                               retryNames);
    var bundlingConfig = methodConfig.bundling;
    if (methodName in overridingMethods) {
      var overridingMethod = overridingMethods[methodName];
      if (overridingMethod && 'bundling' in overridingMethod) {
        bundlingConfig = overridingMethod.bundling;
      }
      retry = mergeRetryOptions(
          retry,
          constructRetry(overridingMethod, overrides.retry_codes,
                         overrides.retry_params, retryNames));
    }

    defaults[jsName] = new CallSettings({
      timeout: timeout,
      retry: retry,
      pageDescriptor: pageDescriptors[jsName] || null,
      bundler: constructBundling(bundlingConfig, bundleDescriptors[jsName]),
      otherArgs: otherArgs
    });
  }
  return defaults;
};
