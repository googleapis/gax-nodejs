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

/**
 * Google API Extensions
 */

import {BundleOptions} from './bundlingCalls/bundleExecutor';

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
export class RetryOptions {
  retryCodes: number[];
  backoffSettings: BackoffSettings;
  constructor(retryCodes: number[], backoffSettings: BackoffSettings) {
    this.retryCodes = retryCodes;
    this.backoffSettings = backoffSettings;
  }
}

export interface RetryRequestOptions {
  objectMode?: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  request?: any;
  retries?: number;
  noResponseRetries?: number;
  currentRetryAttempt?: number;
  shouldRetryFn?: () => boolean;
}

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
export interface BackoffSettings {
  maxRetries?: number;
  initialRetryDelayMillis: number;
  retryDelayMultiplier: number;
  maxRetryDelayMillis: number;
  initialRpcTimeoutMillis?: number | null;
  maxRpcTimeoutMillis?: number | null;
  totalTimeoutMillis?: number | null;
  rpcTimeoutMultiplier?: number | null;
}

export interface CallOptions {
  timeout?: number;
  retry?: Partial<RetryOptions> | null;
  autoPaginate?: boolean;
  maxResults?: number;
  maxRetries?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherArgs?: {[index: string]: any};
  bundleOptions?: BundleOptions | null;
  isBundling?: boolean;
  longrunning?: BackoffSettings;
  apiName?: string;
  retryRequestOptions?: RetryRequestOptions;
}

export class CallSettings {
  timeout: number;
  retry?: RetryOptions | null;
  autoPaginate?: boolean;
  pageToken?: string;
  pageSize?: number;
  maxResults?: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  otherArgs: {[index: string]: any};
  bundleOptions?: BundleOptions | null;
  isBundling: boolean;
  longrunning?: BackoffSettings;
  apiName?: string;
  retryRequestOptions?: RetryRequestOptions;

  /**
   * @param {Object} settings - An object containing parameters of this settings.
   * @param {number} settings.timeout - The client-side timeout for API calls.
   *   This parameter is ignored for retrying calls.
   * @param {RetryOptions} settings.retry - The configuration for retrying upon
   *   transient error. If set to null, this call will not retry.
   * @param {boolean} settings.autoPaginate - If there is no `pageDescriptor`,
   *   this attrbute has no meaning. Otherwise, determines whether a page
   * streamed response should make the page structure transparent to the user by
   *   flattening the repeated field in the returned generator.
   * @param {number} settings.pageToken - If there is no `pageDescriptor`,
   *   this attribute has no meaning. Otherwise, determines the page token used
   * in the page streaming request.
   * @param {Object} settings.otherArgs - Additional arguments to be passed to
   *   the API calls.
   *
   * @constructor
   */
  constructor(settings?: CallOptions) {
    settings = settings || {};
    this.timeout = settings.timeout || 30 * 1000;
    this.retry = settings.retry as RetryOptions;
    this.autoPaginate =
      'autoPaginate' in settings ? settings.autoPaginate : true;
    this.maxResults = settings.maxResults;
    this.otherArgs = settings.otherArgs || {};
    this.bundleOptions = settings.bundleOptions;
    this.isBundling = 'isBundling' in settings ? settings.isBundling! : true;
    this.longrunning =
      'longrunning' in settings ? settings.longrunning : undefined;
    this.apiName = settings.apiName ?? undefined;
    this.retryRequestOptions = settings.retryRequestOptions;
  }

  /**
   * Returns a new CallSettings merged from this and a CallOptions object.
   *
   * @param {CallOptions} options - an instance whose values override
   *   those in this object. If null, ``merge`` returns a copy of this
   *   object
   * @return {CallSettings} The merged CallSettings instance.
   */
  merge(options?: CallOptions | null) {
    if (!options) {
      return new CallSettings(this);
    }
    let timeout = this.timeout;
    let retry = this.retry;
    let autoPaginate = this.autoPaginate;
    let maxResults = this.maxResults;
    let otherArgs = this.otherArgs;
    let isBundling = this.isBundling;
    let longrunning = this.longrunning;
    let apiName = this.apiName;
    let retryRequestOptions = this.retryRequestOptions;
    // If a method-specific timeout is set in the service config, and the retry codes for that
    // method are non-null, then that timeout value will be used to
    // override backoff settings.
    if (
      retry !== undefined &&
      retry !== null &&
      retry.retryCodes !== null &&
      retry.retryCodes.length > 0
    ) {
      retry.backoffSettings.initialRpcTimeoutMillis = timeout;
      retry.backoffSettings.maxRpcTimeoutMillis = timeout;
      retry.backoffSettings.totalTimeoutMillis = timeout;
    }
    // If the user provides a timeout to the method, that timeout value will be used
    // to override the backoff settings.
    if ('timeout' in options) {
      timeout = options.timeout!;
      if (
        retry !== undefined &&
        retry !== null &&
        retry.retryCodes.length > 0
      ) {
        retry.backoffSettings.initialRpcTimeoutMillis = timeout;
        retry.backoffSettings.maxRpcTimeoutMillis = timeout;
        retry.backoffSettings.totalTimeoutMillis = timeout;
      }
    }
    if ('retry' in options) {
      retry = mergeRetryOptions(retry || ({} as RetryOptions), options.retry!);
    }

    if ('autoPaginate' in options && !options.autoPaginate) {
      autoPaginate = false;
    }

    if ('maxResults' in options) {
      maxResults = options.maxResults;
    }

    if ('otherArgs' in options) {
      otherArgs = {};
      for (const key in this.otherArgs) {
        otherArgs[key] = this.otherArgs[key];
      }
      for (const optionsKey in options.otherArgs!) {
        otherArgs[optionsKey] = options.otherArgs![optionsKey];
      }
    }

    if ('isBundling' in options) {
      isBundling = options.isBundling!;
    }

    if ('maxRetries' in options) {
      retry!.backoffSettings!.maxRetries = options.maxRetries;
      delete retry!.backoffSettings!.totalTimeoutMillis;
    }

    if ('longrunning' in options) {
      longrunning = options.longrunning;
    }
    if ('apiName' in options) {
      apiName = options.apiName;
    }
    if ('retryRequestOptions' in options) {
      retryRequestOptions = options.retryRequestOptions;
    }

    return new CallSettings({
      timeout,
      retry,
      bundleOptions: this.bundleOptions,
      longrunning,
      autoPaginate,
      maxResults,
      otherArgs,
      isBundling,
      apiName,
      retryRequestOptions,
    });
  }
}

/**
 * Per-call configurable settings for retrying upon transient failure.
 *
 * @param {number[]} retryCodes - a list of Google API canonical error codes
 *   upon which a retry should be attempted.
 * @param {BackoffSettings} backoffSettings - configures the retry
 *   exponential backoff algorithm.
 * @return {RetryOptions} A new RetryOptions object.
 *
 */
export function createRetryOptions(
  retryCodes: number[],
  backoffSettings: BackoffSettings
): RetryOptions {
  return {
    retryCodes,
    backoffSettings,
  };
}

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
export function createBackoffSettings(
  initialRetryDelayMillis: number,
  retryDelayMultiplier: number,
  maxRetryDelayMillis: number,
  initialRpcTimeoutMillis: number | null,
  rpcTimeoutMultiplier: number | null,
  maxRpcTimeoutMillis: number | null,
  totalTimeoutMillis: number | null
): BackoffSettings {
  return {
    initialRetryDelayMillis,
    retryDelayMultiplier,
    maxRetryDelayMillis,
    initialRpcTimeoutMillis,
    rpcTimeoutMultiplier,
    maxRpcTimeoutMillis,
    totalTimeoutMillis,
  };
}

export function createDefaultBackoffSettings() {
  return createBackoffSettings(100, 1.3, 60000, null, null, null, null);
}

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
export function createMaxRetriesBackoffSettings(
  initialRetryDelayMillis: number,
  retryDelayMultiplier: number,
  maxRetryDelayMillis: number,
  initialRpcTimeoutMillis: number,
  rpcTimeoutMultiplier: number,
  maxRpcTimeoutMillis: number,
  maxRetries: number
): BackoffSettings {
  return {
    initialRetryDelayMillis,
    retryDelayMultiplier,
    maxRetryDelayMillis,
    initialRpcTimeoutMillis,
    rpcTimeoutMultiplier,
    maxRpcTimeoutMillis,
    maxRetries,
  };
}

/**
 * Creates a new {@link BundleOptions}.
 *
 * @private
 * @param {Object} options - An object to hold optional parameters. See
 *   properties for the content of options.
 * @return {BundleOptions} - A new options.
 */
export function createBundleOptions(options: BundlingConfig): BundleOptions {
  const params: Array<keyof BundlingConfig> = [
    'element_count_threshold',
    'element_count_limit',
    'request_byte_threshold',
    'request_byte_limit',
    'delay_threshold_millis',
  ];
  params.forEach(param => {
    if (param in options && typeof options[param] !== 'number') {
      throw new Error(`${param} should be a number`);
    }
  });

  const elementCountThreshold = options.element_count_threshold || 0;
  const elementCountLimit = options.element_count_limit || 0;
  const requestByteThreshold = options.request_byte_threshold || 0;
  const requestByteLimit = options.request_byte_limit || 0;
  const delayThreshold = options.delay_threshold_millis || 0;

  if (
    elementCountThreshold === 0 &&
    requestByteThreshold === 0 &&
    delayThreshold === 0
  ) {
    throw new Error('one threshold should be > 0');
  }
  return {
    elementCountThreshold,
    elementCountLimit,
    requestByteThreshold,
    requestByteLimit,
    delayThreshold,
  };
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
function constructRetry(
  methodConfig: MethodConfig | null,
  retryCodes: {[index: string]: string[]} | undefined,
  retryParams: {[index: string]: {}} | undefined,
  retryNames: {[index: string]: {}}
): RetryOptions | null | undefined {
  if (!methodConfig) {
    return null;
  }

  let codes: number[] | null = null;
  if (retryCodes && 'retry_codes_name' in methodConfig) {
    const retryCodesName = methodConfig['retry_codes_name'];
    codes = (retryCodes[retryCodesName!] || []).map(name => {
      return Number(retryNames[name]);
    });
  }

  let backoffSettings: BackoffSettings | null = null;
  if (retryParams && 'retry_params_name' in methodConfig) {
    const params = retryParams[
      methodConfig.retry_params_name!
    ] as RetryParamsConfig;
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
  return createRetryOptions(codes!, backoffSettings!);
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
function mergeRetryOptions(
  retry: RetryOptions,
  overrides: Partial<RetryOptions>
): RetryOptions | null {
  if (!overrides) {
    return null;
  }

  if (!overrides.retryCodes && !overrides.backoffSettings) {
    return retry;
  }

  const codes = overrides.retryCodes ? overrides.retryCodes : retry.retryCodes;

  const backoffSettings = overrides.backoffSettings
    ? overrides.backoffSettings
    : retry.backoffSettings;
  return createRetryOptions(codes!, backoffSettings!);
}

export interface ServiceConfig {
  retry_codes?: {[index: string]: string[]};
  retry_params?: {[index: string]: RetryParamsConfig};
  methods: {[index: string]: MethodConfig | null};
}

export interface RetryParamsConfig {
  initial_retry_delay_millis: number;
  retry_delay_multiplier: number;
  max_retry_delay_millis: number;
  initial_rpc_timeout_millis: number;
  rpc_timeout_multiplier: number;
  max_rpc_timeout_millis: number;
  total_timeout_millis: number;
}

export interface MethodConfig {
  retry_codes_name?: string;
  retry_params_name?: string;
  bundling?: BundlingConfig | null;
  timeout_millis?: number;
}

export interface BundlingConfig {
  element_count_threshold: number;
  element_count_limit: number;
  request_byte_threshold?: number;
  request_byte_limit?: number;
  delay_threshold_millis?: number;
}

export interface ClientConfig {
  interfaces?: {[index: string]: ServiceConfig};
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
 * @return {Object} A mapping from method name to CallSettings, or null if the
 *   service is not found in the config.
 */
export function constructSettings(
  serviceName: string,
  clientConfig: ClientConfig,
  configOverrides: ClientConfig,
  retryNames: {},
  otherArgs?: {}
) {
  otherArgs = otherArgs || {};
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const defaults: any = {};

  const serviceConfig = (clientConfig.interfaces || {})[serviceName];
  if (!serviceConfig) {
    return null;
  }
  // users can override the config from client side, like bundling options.
  // The detailed structure of the clientConfig can be found here: https://github.com/googleapis/gax-nodejs/blob/main/src/gax.ts#L546
  // The way to override bundling options:
  //
  // const customConfig = {"interfaces": {"service": {"methods": {"methodName": {"bundling": {..}}}}}}
  // const client = new Client({ projectId, customConfig });

  const overrides = (configOverrides.interfaces || {})[serviceName] || {};
  const methods = serviceConfig.methods;
  const overridingMethods = overrides.methods || {};
  for (const methodName in methods) {
    const methodConfig = methods[methodName];
    const jsName = methodName[0].toLowerCase() + methodName.slice(1);

    let retry = constructRetry(
      methodConfig,
      serviceConfig.retry_codes,
      serviceConfig.retry_params,
      retryNames
    );
    let bundlingConfig = methodConfig!.bundling;
    let timeout = methodConfig!.timeout_millis;
    if (methodName in overridingMethods) {
      const overridingMethod = overridingMethods[methodName];
      if (overridingMethod) {
        if ('bundling' in overridingMethod) {
          bundlingConfig = overridingMethod.bundling;
        }
        if ('timeout_millis' in overridingMethod) {
          timeout = overridingMethod.timeout_millis;
        }
      }
      retry = mergeRetryOptions(
        retry!,
        constructRetry(
          overridingMethod,
          overrides.retry_codes,
          overrides.retry_params,
          retryNames
        )!
      );
    }
    const apiName = serviceName;
    defaults[jsName] = new CallSettings({
      timeout,
      retry,
      bundleOptions: bundlingConfig
        ? createBundleOptions(bundlingConfig)
        : null,
      otherArgs,
      apiName,
    });
  }

  return defaults;
}
