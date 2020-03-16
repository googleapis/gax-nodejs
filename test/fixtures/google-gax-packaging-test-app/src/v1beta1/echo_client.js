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

'use strict';

const gapicConfig = require('./echo_client_config.json');
const gax = require('google-gax');
const path = require('path');

const VERSION = require('../../package.json').version;

/**
 * This service is used showcase the four main types of rpcs - unary, server
 * side streaming, client side streaming, and bidirectional streaming. This
 * service also exposes methods that explicitly implement server delay, and
 * paginated calls.
 *
 * @class
 * @memberof v1beta1
 */
class EchoClient {
  /**
   * Construct an instance of EchoClient.
   *
   * @param {object} [options] - The configuration object. See the subsequent
   *   parameters for more details.
   * @param {object} [options.credentials] - Credentials object.
   * @param {string} [options.credentials.client_email]
   * @param {string} [options.credentials.private_key]
   * @param {string} [options.email] - Account email address. Required when
   *     using a .pem or .p12 keyFilename.
   * @param {string} [options.keyFilename] - Full path to the a .json, .pem, or
   *     .p12 key downloaded from the Google Developers Console. If you provide
   *     a path to a JSON file, the projectId option below is not necessary.
   *     NOTE: .pem and .p12 require you to specify options.email as well.
   * @param {number} [options.port] - The port on which to connect to
   *     the remote host.
   * @param {string} [options.projectId] - The project ID from the Google
   *     Developer's Console, e.g. 'grape-spaceship-123'. We will also check
   *     the environment variable GCLOUD_PROJECT for your project ID. If your
   *     app is running in an environment which supports
   *     {@link https://developers.google.com/identity/protocols/application-default-credentials Application Default Credentials},
   *     your project ID will be detected automatically.
   * @param {function} [options.promise] - Custom promise module to use instead
   *     of native Promises.
   * @param {string} [options.apiEndpoint] - The domain name of the
   *     API remote host.
   */
  constructor(opts) {
    opts = opts || {};
    this._descriptors = {};

    const servicePath =
      opts.servicePath || opts.apiEndpoint || this.constructor.servicePath;

    // Ensure that options include the service address and port.
    opts = Object.assign(
      {
        clientConfig: {},
        port: this.constructor.port,
        servicePath,
      },
      opts
    );

    const gaxModule = opts.fallback ? gax.fallback : gax;

    // Create a `gaxGrpc` object, with any grpc-specific options
    // sent to the client.
    opts.scopes = this.constructor.scopes;
    const gaxGrpc = new gaxModule.GrpcClient(opts);

    // Save the auth object to the client, for use by other methods.
    this.auth = gaxGrpc.auth;

    // Determine the client header string.
    const clientHeader = [
      `gl-node/${process.version}`,
      `grpc/${gaxGrpc.grpcVersion}`,
      `gax/${gaxModule.version}`,
      `gapic/${VERSION}`,
    ];
    if (opts.libName && opts.libVersion) {
      clientHeader.push(`${opts.libName}/${opts.libVersion}`);
    }

    // Load the applicable protos.
    // For Node.js, pass the path to JSON proto file.
    // For browsers, pass the JSON content.

    const nodejsProtoPath = path.join(
      __dirname,
      '..',
      '..',
      'protos',
      'protos.json'
    );
    const protos = gaxGrpc.loadProto(
      global.isBrowser || opts.fallback
        ? require('../../protos/protos.json')
        : nodejsProtoPath
    );

    // Some of the methods on this service return "paged" results,
    // (e.g. 50 results at a time, with tokens to get subsequent
    // pages). Denote the keys used for pagination and results.
    this._descriptors.page = {
      pagedExpand: new gaxModule.PageDescriptor(
        'pageToken',
        'nextPageToken',
        'responses'
      ),
    };

    // Some of the methods on this service provide streaming responses.
    // Provide descriptors for these.
    this._descriptors.stream = {
      expand: new gaxModule.StreamDescriptor(
        gaxModule.StreamType.SERVER_STREAMING
      ),
      collect: new gaxModule.StreamDescriptor(
        gaxModule.StreamType.CLIENT_STREAMING
      ),
      chat: new gaxModule.StreamDescriptor(gaxModule.StreamType.BIDI_STREAMING),
    };

    const protoFilesRoot =
      global.isBrowser || opts.fallback
        ? gaxModule.protobuf.Root.fromJSON(require('../../protos/protos.json'))
        : gaxModule.protobuf.loadSync(nodejsProtoPath);

    // This API contains "long-running operations", which return a
    // an Operation object that allows for tracking of the operation,
    // rather than holding a request open.
    this.operationsClient = new gaxModule.lro({
      auth: gaxGrpc.auth,
      grpc: gaxGrpc.grpc,
    }).operationsClient(opts);

    const waitResponse = protoFilesRoot.lookup(
      'google.showcase.v1beta1.WaitResponse'
    );
    const waitMetadata = protoFilesRoot.lookup(
      'google.showcase.v1beta1.WaitMetadata'
    );

    this._descriptors.longrunning = {
      wait: new gaxModule.LongrunningDescriptor(
        this.operationsClient,
        waitResponse.decode.bind(waitResponse),
        waitMetadata.decode.bind(waitMetadata)
      ),
    };

    // Put together the default options sent with requests.
    const defaults = gaxGrpc.constructSettings(
      'google.showcase.v1beta1.Echo',
      gapicConfig,
      opts.clientConfig,
      {'x-goog-api-client': clientHeader.join(' ')}
    );

    // Set up a dictionary of "inner API calls"; the core implementation
    // of calling the API is handled in `google-gax`, with this code
    // merely providing the destination and request information.
    this._innerApiCalls = {};

    // Put together the "service stub" for
    // google.showcase.v1beta1.Echo.
    const echoStub = gaxGrpc.createStub(
      global.isBrowser || opts.fallback
        ? protos.lookupService('google.showcase.v1beta1.Echo')
        : protos.google.showcase.v1beta1.Echo,
      opts
    );

    // Iterate over each of the methods that the service provides
    // and create an API call method for each.
    const echoStubMethods = [
      'echo',
      'expand',
      'collect',
      'chat',
      'wait',
      'pagedExpand',
    ];
    for (const methodName of echoStubMethods) {
      const innerCallPromise = echoStub.then(
        stub => (...args) => {
          return stub[methodName].apply(stub, args);
        },
        err => () => {
          throw err;
        }
      );
      this._innerApiCalls[methodName] = gaxModule.createApiCall(
        innerCallPromise,
        defaults[methodName],
        this._descriptors.page[methodName] ||
          this._descriptors.stream[methodName] ||
          this._descriptors.longrunning[methodName]
      );
    }
  }

  /**
   * The DNS address for this API service.
   */
  static get servicePath() {
    return 'localhost';
  }

  /**
   * The DNS address for this API service - same as servicePath(),
   * exists for compatibility reasons.
   */
  static get apiEndpoint() {
    return 'localhost';
  }

  /**
   * The port for this API service.
   */
  static get port() {
    return 7469;
  }

  /**
   * The scopes needed to make gRPC calls for every method defined
   * in this service.
   */
  static get scopes() {
    return ['https://www.googleapis.com/auth/cloud-platform'];
  }

  /**
   * Return the project ID used by this class.
   * @param {function(Error, string)} callback - the callback to
   *   be called with the current project Id.
   */
  getProjectId(callback) {
    return this.auth.getProjectId(callback);
  }

  // -------------------
  // -- Service calls --
  // -------------------

  /**
   * This method simply echos the request. This method is showcases unary rpcs.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.content]
   *   The content to be echoed by the server.
   * @param {Object} [request.error]
   *   The error to be thrown by the server.
   *
   *   This object should have the same structure as [Status]{@link google.rpc.Status}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [EchoResponse]{@link google.showcase.v1beta1.EchoResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [EchoResponse]{@link google.showcase.v1beta1.EchoResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const showcase = require('showcase.v1beta1');
   *
   * const client = new showcase.v1beta1.EchoClient({
   *   // optional auth parameters.
   * });
   *
   *
   * client.echo({})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  echo(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};

    return this._innerApiCalls.echo(request, options, callback);
  }

  /**
   * This method split the given content into words and will pass each word back
   * through the stream. This method showcases server-side streaming rpcs.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.content]
   *   The content that will be split into words and returned on the stream.
   * @param {Object} [request.error]
   *   The error that is thrown after all words are sent on the stream.
   *
   *   This object should have the same structure as [Status]{@link google.rpc.Status}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @returns {Stream}
   *   An object stream which emits [EchoResponse]{@link google.showcase.v1beta1.EchoResponse} on 'data' event.
   *
   * @example
   *
   * const showcase = require('showcase.v1beta1');
   *
   * const client = new showcase.v1beta1.EchoClient({
   *   // optional auth parameters.
   * });
   *
   *
   * client.expand({}).on('data', response => {
   *   // doThingsWith(response)
   * });
   */
  expand(request, options) {
    request = request || {};
    options = options || {};

    return this._innerApiCalls.expand(request, options);
  }

  /**
   * This method will collect the words given to it. When the stream is closed
   * by the client, this method will return the a concatenation of the strings
   * passed to it. This method showcases client-side streaming rpcs.
   *
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [EchoResponse]{@link google.showcase.v1beta1.EchoResponse}.
   * @returns {Stream} - A writable stream which accepts objects representing
   *   [EchoRequest]{@link google.showcase.v1beta1.EchoRequest} for write() method.
   *
   * @example
   *
   * const showcase = require('showcase.v1beta1');
   *
   * const client = new showcase.v1beta1.EchoClient({
   *   // optional auth parameters.
   * });
   *
   * const stream = client.collect((err, response) => {
   *   if (err) {
   *     console.error(err);
   *     return;
   *   }
   *   // doThingsWith(response)
   * });
   * const request = {};
   * // Write request objects.
   * stream.write(request);
   */
  collect(options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    options = options || {};

    return this._innerApiCalls.collect(null, options, callback);
  }

  /**
   * This method, upon receiving a request on the stream, the same content will
   * be passed  back on the stream. This method showcases bidirectional
   * streaming rpcs.
   *
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @returns {Stream}
   *   An object stream which is both readable and writable. It accepts objects
   *   representing [EchoRequest]{@link google.showcase.v1beta1.EchoRequest} for write() method, and
   *   will emit objects representing [EchoResponse]{@link google.showcase.v1beta1.EchoResponse} on 'data' event asynchronously.
   *
   * @example
   *
   * const showcase = require('showcase.v1beta1');
   *
   * const client = new showcase.v1beta1.EchoClient({
   *   // optional auth parameters.
   * });
   *
   * const stream = client.chat().on('data', response => {
   *   // doThingsWith(response)
   * });
   * const request = {};
   * // Write request objects.
   * stream.write(request);
   */
  chat(options) {
    options = options || {};

    return this._innerApiCalls.chat(options);
  }

  /**
   * This method will wait the requested amount of and then return.
   * This method showcases how a client handles a request timing out.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {Object} [request.endTime]
   *   The time that this operation will complete.
   *
   *   This object should have the same structure as [Timestamp]{@link google.protobuf.Timestamp}
   * @param {Object} [request.ttl]
   *   The duration of this operation.
   *
   *   This object should have the same structure as [Duration]{@link google.protobuf.Duration}
   * @param {Object} [request.error]
   *   The error that will be returned by the server. If this code is specified
   *   to be the OK rpc code, an empty response will be returned.
   *
   *   This object should have the same structure as [Status]{@link google.rpc.Status}
   * @param {Object} [request.success]
   *   The response to be returned on operation completion.
   *
   *   This object should have the same structure as [WaitResponse]{@link google.showcase.v1beta1.WaitResponse}
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is a [gax.Operation]{@link https://googleapis.github.io/gax-nodejs/classes/Operation.html} object.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is a [gax.Operation]{@link https://googleapis.github.io/gax-nodejs/classes/Operation.html} object.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const showcase = require('showcase.v1beta1');
   *
   * const client = new showcase.v1beta1.EchoClient({
   *   // optional auth parameters.
   * });
   *
   *
   *
   * // Handle the operation using the promise pattern.
   * client.wait({})
   *   .then(responses => {
   *     const [operation, initialApiResponse] = responses;
   *
   *     // Operation#promise starts polling for the completion of the LRO.
   *     return operation.promise();
   *   })
   *   .then(responses => {
   *     const result = responses[0];
   *     const metadata = responses[1];
   *     const finalApiResponse = responses[2];
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   *
   *
   * // Handle the operation using the event emitter pattern.
   * client.wait({})
   *   .then(responses => {
   *     const [operation, initialApiResponse] = responses;
   *
   *     // Adding a listener for the "complete" event starts polling for the
   *     // completion of the operation.
   *     operation.on('complete', (result, metadata, finalApiResponse) => {
   *       // doSomethingWith(result);
   *     });
   *
   *     // Adding a listener for the "progress" event causes the callback to be
   *     // called on any change in metadata when the operation is polled.
   *     operation.on('progress', (metadata, apiResponse) => {
   *       // doSomethingWith(metadata)
   *     });
   *
   *     // Adding a listener for the "error" event handles any errors found during polling.
   *     operation.on('error', err => {
   *       // throw(err);
   *     });
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   *
   *
   *
   * // Handle the operation using the await pattern.
   * const [operation] = await client.wait({});
   *
   * const [response] = await operation.promise();
   */
  wait(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};

    return this._innerApiCalls.wait(request, options, callback);
  }

  /**
   * This is similar to the Expand method but instead of returning a stream of
   * expanded words, this method returns a paged list of expanded words.
   *
   * @param {Object} request
   *   The request object that will be sent.
   * @param {string} [request.content]
   *   The string to expand.
   * @param {number} [request.pageSize]
   *   The amount of words to returned in each page.
   * @param {string} [request.pageToken]
   *   The position of the page to be returned.
   * @param {Object} [options]
   *   Optional parameters. You can override the default settings for this call, e.g, timeout,
   *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
   * @param {function(?Error, ?Object)} [callback]
   *   The function which will be called with the result of the API call.
   *
   *   The second parameter to the callback is an object representing [PagedExpandResponse]{@link google.showcase.v1beta1.PagedExpandResponse}.
   * @returns {Promise} - The promise which resolves to an array.
   *   The first element of the array is an object representing [PagedExpandResponse]{@link google.showcase.v1beta1.PagedExpandResponse}.
   *   The promise has a method named "cancel" which cancels the ongoing API call.
   *
   * @example
   *
   * const showcase = require('showcase.v1beta1');
   *
   * const client = new showcase.v1beta1.EchoClient({
   *   // optional auth parameters.
   * });
   *
   *
   * client.pagedExpand({})
   *   .then(responses => {
   *     const response = responses[0];
   *     // doThingsWith(response)
   *   })
   *   .catch(err => {
   *     console.error(err);
   *   });
   */
  pagedExpand(request, options, callback) {
    if (options instanceof Function && callback === undefined) {
      callback = options;
      options = {};
    }
    request = request || {};
    options = options || {};

    return this._innerApiCalls.pagedExpand(request, options, callback);
  }
}

module.exports = EchoClient;
