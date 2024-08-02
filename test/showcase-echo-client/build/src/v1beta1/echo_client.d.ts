/// <reference types="node" />
import * as gax from 'google-gax';
import { Callback, CallOptions, Descriptors, ClientOptions, LROperation, PaginationCallback, IamClient, IamProtos, LocationsClient, LocationProtos } from 'google-gax';
import { Transform } from 'stream';
import * as protos from '../../protos/protos';
/**
 *  This service is used showcase the four main types of rpcs - unary, server
 *  side streaming, client side streaming, and bidirectional streaming. This
 *  service also exposes methods that explicitly implement server delay, and
 *  paginated calls. Set the 'showcase-trailer' metadata key on any method
 *  to have the values echoed in the response trailers.
 * @class
 * @memberof v1beta1
 */
export declare class EchoClient {
    private _terminated;
    private _opts;
    private _providedCustomServicePath;
    private _gaxModule;
    private _gaxGrpc;
    private _protos;
    private _defaults;
    auth: gax.GoogleAuth;
    descriptors: Descriptors;
    warn: (code: string, message: string, warnType?: string) => void;
    innerApiCalls: {
        [name: string]: Function;
    };
    iamClient: IamClient;
    locationsClient: LocationsClient;
    pathTemplates: {
        [name: string]: gax.PathTemplate;
    };
    operationsClient: gax.OperationsClient;
    echoStub?: Promise<{
        [name: string]: Function;
    }>;
    /**
     * Construct an instance of EchoClient.
     *
     * @param {object} [options] - The configuration object.
     * The options accepted by the constructor are described in detail
     * in [this document](https://github.com/googleapis/gax-nodejs/blob/main/client-libraries.md#creating-the-client-instance).
     * The common options are:
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
     * @param {string} [options.apiEndpoint] - The domain name of the
     *     API remote host.
     * @param {gax.ClientConfig} [options.clientConfig] - Client configuration override.
     *     Follows the structure of {@link gapicConfig}.
     * @param {boolean | "rest"} [options.fallback] - Use HTTP fallback mode.
     *     Pass "rest" to use HTTP/1.1 REST API instead of gRPC.
     *     For more information, please check the
     *     {@link https://github.com/googleapis/gax-nodejs/blob/main/client-libraries.md#http11-rest-api-mode documentation}.
     */
    constructor(opts?: ClientOptions);
    /**
     * Initialize the client.
     * Performs asynchronous operations (such as authentication) and prepares the client.
     * This function will be called automatically when any class method is called for the
     * first time, but if you need to initialize it before calling an actual method,
     * feel free to call initialize() directly.
     *
     * You can await on this method if you want to make sure the client is initialized.
     *
     * @returns {Promise} A promise that resolves to an authenticated service stub.
     */
    initialize(): Promise<{
        [name: string]: Function;
    }>;
    /**
     * The DNS address for this API service.
     * @returns {string} The DNS address for this service.
     */
    static get servicePath(): string;
    /**
     * The DNS address for this API service - same as servicePath(),
     * exists for compatibility reasons.
     * @returns {string} The DNS address for this service.
     */
    static get apiEndpoint(): string;
    /**
     * The port for this API service.
     * @returns {number} The default port for this service.
     */
    static get port(): number;
    /**
     * The scopes needed to make gRPC calls for every method defined
     * in this service.
     * @returns {string[]} List of default scopes.
     */
    static get scopes(): never[];
    getProjectId(): Promise<string>;
    getProjectId(callback: Callback<string, undefined, undefined>): void;
    /**
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.content
     *   The content to be echoed by the server.
     * @param {google.rpc.Status} request.error
     *   The error to be thrown by the server.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing [EchoResponse]{@link google.showcase.v1beta1.EchoResponse}.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods)
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta1/echo.echo.js</caption>
     * region_tag:localhost_v1beta1_generated_Echo_Echo_async
     */
    echo(request?: protos.google.showcase.v1beta1.IEchoRequest, options?: CallOptions): Promise<[
        protos.google.showcase.v1beta1.IEchoResponse,
        protos.google.showcase.v1beta1.IEchoRequest | undefined,
        {} | undefined
    ]>;
    echo(request: protos.google.showcase.v1beta1.IEchoRequest, options: CallOptions, callback: Callback<protos.google.showcase.v1beta1.IEchoResponse, protos.google.showcase.v1beta1.IEchoRequest | null | undefined, {} | null | undefined>): void;
    echo(request: protos.google.showcase.v1beta1.IEchoRequest, callback: Callback<protos.google.showcase.v1beta1.IEchoResponse, protos.google.showcase.v1beta1.IEchoRequest | null | undefined, {} | null | undefined>): void;
    /**
     * This method will block (wait) for the requested amount of time
     * and then return the response or error.
     * This method showcases how a client handles delays or retries.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {google.protobuf.Duration} request.responseDelay
     *   The amount of time to block before returning a response.
     * @param {google.rpc.Status} request.error
     *   The error that will be returned by the server. If this code is specified
     *   to be the OK rpc code, an empty response will be returned.
     * @param {google.showcase.v1beta1.BlockResponse} request.success
     *   The response to be returned that will signify successful method call.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing [BlockResponse]{@link google.showcase.v1beta1.BlockResponse}.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods)
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta1/echo.block.js</caption>
     * region_tag:localhost_v1beta1_generated_Echo_Block_async
     */
    block(request?: protos.google.showcase.v1beta1.IBlockRequest, options?: CallOptions): Promise<[
        protos.google.showcase.v1beta1.IBlockResponse,
        protos.google.showcase.v1beta1.IBlockRequest | undefined,
        {} | undefined
    ]>;
    block(request: protos.google.showcase.v1beta1.IBlockRequest, options: CallOptions, callback: Callback<protos.google.showcase.v1beta1.IBlockResponse, protos.google.showcase.v1beta1.IBlockRequest | null | undefined, {} | null | undefined>): void;
    block(request: protos.google.showcase.v1beta1.IBlockRequest, callback: Callback<protos.google.showcase.v1beta1.IBlockResponse, protos.google.showcase.v1beta1.IBlockRequest | null | undefined, {} | null | undefined>): void;
    /**
     * This method split the given content into words and will pass each word back
     * through the stream. This method showcases server-side streaming rpcs.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.content
     *   The content that will be split into words and returned on the stream.
     * @param {google.rpc.Status} request.error
     *   The error that is thrown after all words are sent on the stream.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Stream}
     *   An object stream which emits [EchoResponse]{@link google.showcase.v1beta1.EchoResponse} on 'data' event.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#server-streaming)
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta1/echo.expand.js</caption>
     * region_tag:localhost_v1beta1_generated_Echo_Expand_async
     */
    expand(request?: protos.google.showcase.v1beta1.IExpandRequest, options?: CallOptions): gax.CancellableStream;
    /**
     * This method will collect the words given to it. When the stream is closed
     * by the client, this method will return the a concatenation of the strings
     * passed to it. This method showcases client-side streaming rpcs.
     *
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Stream} - A writable stream which accepts objects representing
     * [EchoRequest]{@link google.showcase.v1beta1.EchoRequest}.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#client-streaming)
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta1/echo.collect.js</caption>
     * region_tag:localhost_v1beta1_generated_Echo_Collect_async
     */
    collect(options?: CallOptions, callback?: Callback<protos.google.showcase.v1beta1.IEchoResponse, protos.google.showcase.v1beta1.IEchoRequest | null | undefined, {} | null | undefined>): gax.CancellableStream;
    collect(callback?: Callback<protos.google.showcase.v1beta1.IEchoResponse, protos.google.showcase.v1beta1.IEchoRequest | null | undefined, {} | null | undefined>): gax.CancellableStream;
    /**
     * This method, upon receiving a request on the stream, the same content will
     * be passed  back on the stream. This method showcases bidirectional
     * streaming rpcs.
     *
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Stream}
     *   An object stream which is both readable and writable. It accepts objects
     *   representing [EchoRequest]{@link google.showcase.v1beta1.EchoRequest} for write() method, and
     *   will emit objects representing [EchoResponse]{@link google.showcase.v1beta1.EchoResponse} on 'data' event asynchronously.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#bi-directional-streaming)
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta1/echo.chat.js</caption>
     * region_tag:localhost_v1beta1_generated_Echo_Chat_async
     */
    chat(options?: CallOptions): gax.CancellableStream;
    /**
     * This method will wait the requested amount of and then return.
     * This method showcases how a client handles a request timing out.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {google.protobuf.Timestamp} request.endTime
     *   The time that this operation will complete.
     * @param {google.protobuf.Duration} request.ttl
     *   The duration of this operation.
     * @param {google.rpc.Status} request.error
     *   The error that will be returned by the server. If this code is specified
     *   to be the OK rpc code, an empty response will be returned.
     * @param {google.showcase.v1beta1.WaitResponse} request.success
     *   The response to be returned on operation completion.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing
     *   a long running operation. Its `promise()` method returns a promise
     *   you can `await` for.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#long-running-operations)
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta1/echo.wait.js</caption>
     * region_tag:localhost_v1beta1_generated_Echo_Wait_async
     */
    wait(request?: protos.google.showcase.v1beta1.IWaitRequest, options?: CallOptions): Promise<[
        LROperation<protos.google.showcase.v1beta1.IWaitResponse, protos.google.showcase.v1beta1.IWaitMetadata>,
        protos.google.longrunning.IOperation | undefined,
        {} | undefined
    ]>;
    wait(request: protos.google.showcase.v1beta1.IWaitRequest, options: CallOptions, callback: Callback<LROperation<protos.google.showcase.v1beta1.IWaitResponse, protos.google.showcase.v1beta1.IWaitMetadata>, protos.google.longrunning.IOperation | null | undefined, {} | null | undefined>): void;
    wait(request: protos.google.showcase.v1beta1.IWaitRequest, callback: Callback<LROperation<protos.google.showcase.v1beta1.IWaitResponse, protos.google.showcase.v1beta1.IWaitMetadata>, protos.google.longrunning.IOperation | null | undefined, {} | null | undefined>): void;
    /**
     * Check the status of the long running operation returned by `wait()`.
     * @param {String} name
     *   The operation name that will be passed.
     * @returns {Promise} - The promise which resolves to an object.
     *   The decoded operation object has result and metadata field to get information from.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#long-running-operations)
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta1/echo.wait.js</caption>
     * region_tag:localhost_v1beta1_generated_Echo_Wait_async
     */
    checkWaitProgress(name: string): Promise<LROperation<protos.google.showcase.v1beta1.WaitResponse, protos.google.showcase.v1beta1.WaitMetadata>>;
    /**
     * This is similar to the Expand method but instead of returning a stream of
     * expanded words, this method returns a paged list of expanded words.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.content
     *   The string to expand.
     * @param {number} request.pageSize
     *   The amount of words to returned in each page.
     * @param {string} request.pageToken
     *   The position of the page to be returned.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is Array of [EchoResponse]{@link google.showcase.v1beta1.EchoResponse}.
     *   The client library will perform auto-pagination by default: it will call the API as many
     *   times as needed and will merge results from all the pages into this array.
     *   Note that it can affect your quota.
     *   We recommend using `pagedExpandAsync()`
     *   method described below for async iteration which you can stop as needed.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#auto-pagination)
     *   for more details and examples.
     */
    pagedExpand(request?: protos.google.showcase.v1beta1.IPagedExpandRequest, options?: CallOptions): Promise<[
        protos.google.showcase.v1beta1.IEchoResponse[],
        protos.google.showcase.v1beta1.IPagedExpandRequest | null,
        protos.google.showcase.v1beta1.IPagedExpandResponse
    ]>;
    pagedExpand(request: protos.google.showcase.v1beta1.IPagedExpandRequest, options: CallOptions, callback: PaginationCallback<protos.google.showcase.v1beta1.IPagedExpandRequest, protos.google.showcase.v1beta1.IPagedExpandResponse | null | undefined, protos.google.showcase.v1beta1.IEchoResponse>): void;
    pagedExpand(request: protos.google.showcase.v1beta1.IPagedExpandRequest, callback: PaginationCallback<protos.google.showcase.v1beta1.IPagedExpandRequest, protos.google.showcase.v1beta1.IPagedExpandResponse | null | undefined, protos.google.showcase.v1beta1.IEchoResponse>): void;
    /**
     * Equivalent to `method.name.toCamelCase()`, but returns a NodeJS Stream object.
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.content
     *   The string to expand.
     * @param {number} request.pageSize
     *   The amount of words to returned in each page.
     * @param {string} request.pageToken
     *   The position of the page to be returned.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Stream}
     *   An object stream which emits an object representing [EchoResponse]{@link google.showcase.v1beta1.EchoResponse} on 'data' event.
     *   The client library will perform auto-pagination by default: it will call the API as many
     *   times as needed. Note that it can affect your quota.
     *   We recommend using `pagedExpandAsync()`
     *   method described below for async iteration which you can stop as needed.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#auto-pagination)
     *   for more details and examples.
     */
    pagedExpandStream(request?: protos.google.showcase.v1beta1.IPagedExpandRequest, options?: CallOptions): Transform;
    /**
     * Equivalent to `pagedExpand`, but returns an iterable object.
     *
     * `for`-`await`-`of` syntax is used with the iterable to get response elements on-demand.
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.content
     *   The string to expand.
     * @param {number} request.pageSize
     *   The amount of words to returned in each page.
     * @param {string} request.pageToken
     *   The position of the page to be returned.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Object}
     *   An iterable Object that allows [async iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
     *   When you iterate the returned iterable, each element will be an object representing
     *   [EchoResponse]{@link google.showcase.v1beta1.EchoResponse}. The API will be called under the hood as needed, once per the page,
     *   so you can stop the iteration when you don't need more results.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#auto-pagination)
     *   for more details and examples.
     * @example <caption>include:samples/generated/v1beta1/echo.paged_expand.js</caption>
     * region_tag:localhost_v1beta1_generated_Echo_PagedExpand_async
     */
    pagedExpandAsync(request?: protos.google.showcase.v1beta1.IPagedExpandRequest, options?: CallOptions): AsyncIterable<protos.google.showcase.v1beta1.IEchoResponse>;
    /**
     * Gets the access control policy for a resource. Returns an empty policy
     * if the resource exists and does not have a policy set.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.resource
     *   REQUIRED: The resource for which the policy is being requested.
     *   See the operation documentation for the appropriate value for this field.
     * @param {Object} [request.options]
     *   OPTIONAL: A `GetPolicyOptions` object for specifying options to
     *   `GetIamPolicy`. This field is only used by Cloud IAM.
     *
     *   This object should have the same structure as [GetPolicyOptions]{@link google.iam.v1.GetPolicyOptions}
     * @param {Object} [options]
     *   Optional parameters. You can override the default settings for this call, e.g, timeout,
     *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
     * @param {function(?Error, ?Object)} [callback]
     *   The function which will be called with the result of the API call.
     *
     *   The second parameter to the callback is an object representing [Policy]{@link google.iam.v1.Policy}.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing [Policy]{@link google.iam.v1.Policy}.
     *   The promise has a method named "cancel" which cancels the ongoing API call.
     */
    getIamPolicy(request: IamProtos.google.iam.v1.GetIamPolicyRequest, options?: gax.CallOptions | Callback<IamProtos.google.iam.v1.Policy, IamProtos.google.iam.v1.GetIamPolicyRequest | null | undefined, {} | null | undefined>, callback?: Callback<IamProtos.google.iam.v1.Policy, IamProtos.google.iam.v1.GetIamPolicyRequest | null | undefined, {} | null | undefined>): Promise<IamProtos.google.iam.v1.Policy>;
    /**
     * Returns permissions that a caller has on the specified resource. If the
     * resource does not exist, this will return an empty set of
     * permissions, not a NOT_FOUND error.
     *
     * Note: This operation is designed to be used for building
     * permission-aware UIs and command-line tools, not for authorization
     * checking. This operation may "fail open" without warning.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.resource
     *   REQUIRED: The resource for which the policy detail is being requested.
     *   See the operation documentation for the appropriate value for this field.
     * @param {string[]} request.permissions
     *   The set of permissions to check for the `resource`. Permissions with
     *   wildcards (such as '*' or 'storage.*') are not allowed. For more
     *   information see
     *   [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
     * @param {Object} [options]
     *   Optional parameters. You can override the default settings for this call, e.g, timeout,
     *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
     * @param {function(?Error, ?Object)} [callback]
     *   The function which will be called with the result of the API call.
     *
     *   The second parameter to the callback is an object representing [TestIamPermissionsResponse]{@link google.iam.v1.TestIamPermissionsResponse}.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing [TestIamPermissionsResponse]{@link google.iam.v1.TestIamPermissionsResponse}.
     *   The promise has a method named "cancel" which cancels the ongoing API call.
     */
    setIamPolicy(request: IamProtos.google.iam.v1.SetIamPolicyRequest, options?: gax.CallOptions | Callback<IamProtos.google.iam.v1.Policy, IamProtos.google.iam.v1.SetIamPolicyRequest | null | undefined, {} | null | undefined>, callback?: Callback<IamProtos.google.iam.v1.Policy, IamProtos.google.iam.v1.SetIamPolicyRequest | null | undefined, {} | null | undefined>): Promise<IamProtos.google.iam.v1.Policy>;
    /**
     * Returns permissions that a caller has on the specified resource. If the
     * resource does not exist, this will return an empty set of
     * permissions, not a NOT_FOUND error.
     *
     * Note: This operation is designed to be used for building
     * permission-aware UIs and command-line tools, not for authorization
     * checking. This operation may "fail open" without warning.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.resource
     *   REQUIRED: The resource for which the policy detail is being requested.
     *   See the operation documentation for the appropriate value for this field.
     * @param {string[]} request.permissions
     *   The set of permissions to check for the `resource`. Permissions with
     *   wildcards (such as '*' or 'storage.*') are not allowed. For more
     *   information see
     *   [IAM Overview](https://cloud.google.com/iam/docs/overview#permissions).
     * @param {Object} [options]
     *   Optional parameters. You can override the default settings for this call, e.g, timeout,
     *   retries, paginations, etc. See [gax.CallOptions]{@link https://googleapis.github.io/gax-nodejs/interfaces/CallOptions.html} for the details.
     * @param {function(?Error, ?Object)} [callback]
     *   The function which will be called with the result of the API call.
     *
     *   The second parameter to the callback is an object representing [TestIamPermissionsResponse]{@link google.iam.v1.TestIamPermissionsResponse}.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing [TestIamPermissionsResponse]{@link google.iam.v1.TestIamPermissionsResponse}.
     *   The promise has a method named "cancel" which cancels the ongoing API call.
     *
     */
    testIamPermissions(request: IamProtos.google.iam.v1.TestIamPermissionsRequest, options?: gax.CallOptions | Callback<IamProtos.google.iam.v1.TestIamPermissionsResponse, IamProtos.google.iam.v1.TestIamPermissionsRequest | null | undefined, {} | null | undefined>, callback?: Callback<IamProtos.google.iam.v1.TestIamPermissionsResponse, IamProtos.google.iam.v1.TestIamPermissionsRequest | null | undefined, {} | null | undefined>): Promise<IamProtos.google.iam.v1.TestIamPermissionsResponse>;
    /**
     * Gets information about a location.
     *
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.name
     *   Resource name for the location.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing [Location]{@link google.cloud.location.Location}.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#regular-methods)
     *   for more details and examples.
     * @example
     * ```
     * const [response] = await client.getLocation(request);
     * ```
     */
    getLocation(request: LocationProtos.google.cloud.location.IGetLocationRequest, options?: gax.CallOptions | Callback<LocationProtos.google.cloud.location.ILocation, LocationProtos.google.cloud.location.IGetLocationRequest | null | undefined, {} | null | undefined>, callback?: Callback<LocationProtos.google.cloud.location.ILocation, LocationProtos.google.cloud.location.IGetLocationRequest | null | undefined, {} | null | undefined>): Promise<LocationProtos.google.cloud.location.ILocation>;
    /**
     * Lists information about the supported locations for this service. Returns an iterable object.
     *
     * `for`-`await`-`of` syntax is used with the iterable to get response elements on-demand.
     * @param {Object} request
     *   The request object that will be sent.
     * @param {string} request.name
     *   The resource that owns the locations collection, if applicable.
     * @param {string} request.filter
     *   The standard list filter.
     * @param {number} request.pageSize
     *   The standard list page size.
     * @param {string} request.pageToken
     *   The standard list page token.
     * @param {object} [options]
     *   Call options. See {@link https://googleapis.dev/nodejs/google-gax/latest/interfaces/CallOptions.html|CallOptions} for more details.
     * @returns {Object}
     *   An iterable Object that allows [async iteration](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols).
     *   When you iterate the returned iterable, each element will be an object representing
     *   [Location]{@link google.cloud.location.Location}. The API will be called under the hood as needed, once per the page,
     *   so you can stop the iteration when you don't need more results.
     *   Please see the
     *   [documentation](https://github.com/googleapis/gax-nodejs/blob/master/client-libraries.md#auto-pagination)
     *   for more details and examples.
     * @example
     * ```
     * const iterable = client.listLocationsAsync(request);
     * for await (const response of iterable) {
     *   // process response
     * }
     * ```
     */
    listLocationsAsync(request: LocationProtos.google.cloud.location.IListLocationsRequest, options?: CallOptions): AsyncIterable<LocationProtos.google.cloud.location.ILocation>;
    /**
     * Gets the latest state of a long-running operation.  Clients can use this
     * method to poll the operation result at intervals as recommended by the API
     * service.
     *
     * @param {Object} request - The request object that will be sent.
     * @param {string} request.name - The name of the operation resource.
     * @param {Object=} options
     *   Optional parameters. You can override the default settings for this call,
     *   e.g, timeout, retries, paginations, etc. See [gax.CallOptions]{@link
     *   https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the
     *   details.
     * @param {function(?Error, ?Object)=} callback
     *   The function which will be called with the result of the API call.
     *
     *   The second parameter to the callback is an object representing
     * [google.longrunning.Operation]{@link
     * external:"google.longrunning.Operation"}.
     * @return {Promise} - The promise which resolves to an array.
     *   The first element of the array is an object representing
     * [google.longrunning.Operation]{@link
     * external:"google.longrunning.Operation"}. The promise has a method named
     * "cancel" which cancels the ongoing API call.
     *
     * @example
     * ```
     * const client = longrunning.operationsClient();
     * const name = '';
     * const [response] = await client.getOperation({name});
     * // doThingsWith(response)
     * ```
     */
    getOperation(request: protos.google.longrunning.GetOperationRequest, options?: gax.CallOptions | Callback<protos.google.longrunning.Operation, protos.google.longrunning.GetOperationRequest, {} | null | undefined>, callback?: Callback<protos.google.longrunning.Operation, protos.google.longrunning.GetOperationRequest, {} | null | undefined>): Promise<[protos.google.longrunning.Operation]>;
    /**
     * Lists operations that match the specified filter in the request. If the
     * server doesn't support this method, it returns `UNIMPLEMENTED`. Returns an iterable object.
     *
     * For-await-of syntax is used with the iterable to recursively get response element on-demand.
     *
     * @param {Object} request - The request object that will be sent.
     * @param {string} request.name - The name of the operation collection.
     * @param {string} request.filter - The standard list filter.
     * @param {number=} request.pageSize -
     *   The maximum number of resources contained in the underlying API
     *   response. If page streaming is performed per-resource, this
     *   parameter does not affect the return value. If page streaming is
     *   performed per-page, this determines the maximum number of
     *   resources in a page.
     * @param {Object=} options
     *   Optional parameters. You can override the default settings for this call,
     *   e.g, timeout, retries, paginations, etc. See [gax.CallOptions]{@link
     *   https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the
     *   details.
     * @returns {Object}
     *   An iterable Object that conforms to @link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Iteration_protocols.
     *
     * @example
     * ```
     * const client = longrunning.operationsClient();
     * for await (const response of client.listOperationsAsync(request));
     * // doThingsWith(response)
     * ```
     */
    listOperationsAsync(request: protos.google.longrunning.ListOperationsRequest, options?: gax.CallOptions): AsyncIterable<protos.google.longrunning.ListOperationsResponse>;
    /**
     * Starts asynchronous cancellation on a long-running operation.  The server
     * makes a best effort to cancel the operation, but success is not
     * guaranteed.  If the server doesn't support this method, it returns
     * `google.rpc.Code.UNIMPLEMENTED`.  Clients can use
     * {@link Operations.GetOperation} or
     * other methods to check whether the cancellation succeeded or whether the
     * operation completed despite cancellation. On successful cancellation,
     * the operation is not deleted; instead, it becomes an operation with
     * an {@link Operation.error} value with a {@link google.rpc.Status.code} of
     * 1, corresponding to `Code.CANCELLED`.
     *
     * @param {Object} request - The request object that will be sent.
     * @param {string} request.name - The name of the operation resource to be cancelled.
     * @param {Object=} options
     *   Optional parameters. You can override the default settings for this call,
     * e.g, timeout, retries, paginations, etc. See [gax.CallOptions]{@link
     * https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the
     * details.
     * @param {function(?Error)=} callback
     *   The function which will be called with the result of the API call.
     * @return {Promise} - The promise which resolves when API call finishes.
     *   The promise has a method named "cancel" which cancels the ongoing API
     * call.
     *
     * @example
     * ```
     * const client = longrunning.operationsClient();
     * await client.cancelOperation({name: ''});
     * ```
     */
    cancelOperation(request: protos.google.longrunning.CancelOperationRequest, options?: gax.CallOptions | Callback<protos.google.protobuf.Empty, protos.google.longrunning.CancelOperationRequest, {} | undefined | null>, callback?: Callback<protos.google.longrunning.CancelOperationRequest, protos.google.protobuf.Empty, {} | undefined | null>): Promise<protos.google.protobuf.Empty>;
    /**
     * Deletes a long-running operation. This method indicates that the client is
     * no longer interested in the operation result. It does not cancel the
     * operation. If the server doesn't support this method, it returns
     * `google.rpc.Code.UNIMPLEMENTED`.
     *
     * @param {Object} request - The request object that will be sent.
     * @param {string} request.name - The name of the operation resource to be deleted.
     * @param {Object=} options
     *   Optional parameters. You can override the default settings for this call,
     * e.g, timeout, retries, paginations, etc. See [gax.CallOptions]{@link
     * https://googleapis.github.io/gax-nodejs/global.html#CallOptions} for the
     * details.
     * @param {function(?Error)=} callback
     *   The function which will be called with the result of the API call.
     * @return {Promise} - The promise which resolves when API call finishes.
     *   The promise has a method named "cancel" which cancels the ongoing API
     * call.
     *
     * @example
     * ```
     * const client = longrunning.operationsClient();
     * await client.deleteOperation({name: ''});
     * ```
     */
    deleteOperation(request: protos.google.longrunning.DeleteOperationRequest, options?: gax.CallOptions | Callback<protos.google.protobuf.Empty, protos.google.longrunning.DeleteOperationRequest, {} | null | undefined>, callback?: Callback<protos.google.protobuf.Empty, protos.google.longrunning.DeleteOperationRequest, {} | null | undefined>): Promise<protos.google.protobuf.Empty>;
    /**
     * Return a fully-qualified blueprint resource name string.
     *
     * @param {string} session
     * @param {string} test
     * @param {string} blueprint
     * @returns {string} Resource name string.
     */
    blueprintPath(session: string, test: string, blueprint: string): string;
    /**
     * Parse the session from Blueprint resource.
     *
     * @param {string} blueprintName
     *   A fully-qualified path representing Blueprint resource.
     * @returns {string} A string representing the session.
     */
    matchSessionFromBlueprintName(blueprintName: string): string | number;
    /**
     * Parse the test from Blueprint resource.
     *
     * @param {string} blueprintName
     *   A fully-qualified path representing Blueprint resource.
     * @returns {string} A string representing the test.
     */
    matchTestFromBlueprintName(blueprintName: string): string | number;
    /**
     * Parse the blueprint from Blueprint resource.
     *
     * @param {string} blueprintName
     *   A fully-qualified path representing Blueprint resource.
     * @returns {string} A string representing the blueprint.
     */
    matchBlueprintFromBlueprintName(blueprintName: string): string | number;
    /**
     * Return a fully-qualified room resource name string.
     *
     * @param {string} room_id
     * @returns {string} Resource name string.
     */
    roomPath(roomId: string): string;
    /**
     * Parse the room_id from Room resource.
     *
     * @param {string} roomName
     *   A fully-qualified path representing Room resource.
     * @returns {string} A string representing the room_id.
     */
    matchRoomIdFromRoomName(roomName: string): string | number;
    /**
     * Return a fully-qualified roomIdBlurbId resource name string.
     *
     * @param {string} room_id
     * @param {string} blurb_id
     * @returns {string} Resource name string.
     */
    roomIdBlurbIdPath(roomId: string, blurbId: string): string;
    /**
     * Parse the room_id from RoomIdBlurbId resource.
     *
     * @param {string} roomIdBlurbIdName
     *   A fully-qualified path representing room_id_blurb_id resource.
     * @returns {string} A string representing the room_id.
     */
    matchRoomIdFromRoomIdBlurbIdName(roomIdBlurbIdName: string): string | number;
    /**
     * Parse the blurb_id from RoomIdBlurbId resource.
     *
     * @param {string} roomIdBlurbIdName
     *   A fully-qualified path representing room_id_blurb_id resource.
     * @returns {string} A string representing the blurb_id.
     */
    matchBlurbIdFromRoomIdBlurbIdName(roomIdBlurbIdName: string): string | number;
    /**
     * Return a fully-qualified roomIdBlurbsLegacyRoomIdBlurbId resource name string.
     *
     * @param {string} room_id
     * @param {string} legacy_room_id
     * @param {string} blurb_id
     * @returns {string} Resource name string.
     */
    roomIdBlurbsLegacyRoomIdBlurbIdPath(roomId: string, legacyRoomId: string, blurbId: string): string;
    /**
     * Parse the room_id from RoomIdBlurbsLegacyRoomIdBlurbId resource.
     *
     * @param {string} roomIdBlurbsLegacyRoomIdBlurbIdName
     *   A fully-qualified path representing room_id_blurbs_legacy_room_id_blurb_id resource.
     * @returns {string} A string representing the room_id.
     */
    matchRoomIdFromRoomIdBlurbsLegacyRoomIdBlurbIdName(roomIdBlurbsLegacyRoomIdBlurbIdName: string): string | number;
    /**
     * Parse the legacy_room_id from RoomIdBlurbsLegacyRoomIdBlurbId resource.
     *
     * @param {string} roomIdBlurbsLegacyRoomIdBlurbIdName
     *   A fully-qualified path representing room_id_blurbs_legacy_room_id_blurb_id resource.
     * @returns {string} A string representing the legacy_room_id.
     */
    matchLegacyRoomIdFromRoomIdBlurbsLegacyRoomIdBlurbIdName(roomIdBlurbsLegacyRoomIdBlurbIdName: string): string | number;
    /**
     * Parse the blurb_id from RoomIdBlurbsLegacyRoomIdBlurbId resource.
     *
     * @param {string} roomIdBlurbsLegacyRoomIdBlurbIdName
     *   A fully-qualified path representing room_id_blurbs_legacy_room_id_blurb_id resource.
     * @returns {string} A string representing the blurb_id.
     */
    matchBlurbIdFromRoomIdBlurbsLegacyRoomIdBlurbIdName(roomIdBlurbsLegacyRoomIdBlurbIdName: string): string | number;
    /**
     * Return a fully-qualified session resource name string.
     *
     * @param {string} session
     * @returns {string} Resource name string.
     */
    sessionPath(session: string): string;
    /**
     * Parse the session from Session resource.
     *
     * @param {string} sessionName
     *   A fully-qualified path representing Session resource.
     * @returns {string} A string representing the session.
     */
    matchSessionFromSessionName(sessionName: string): string | number;
    /**
     * Return a fully-qualified test resource name string.
     *
     * @param {string} session
     * @param {string} test
     * @returns {string} Resource name string.
     */
    testPath(session: string, test: string): string;
    /**
     * Parse the session from Test resource.
     *
     * @param {string} testName
     *   A fully-qualified path representing Test resource.
     * @returns {string} A string representing the session.
     */
    matchSessionFromTestName(testName: string): string | number;
    /**
     * Parse the test from Test resource.
     *
     * @param {string} testName
     *   A fully-qualified path representing Test resource.
     * @returns {string} A string representing the test.
     */
    matchTestFromTestName(testName: string): string | number;
    /**
     * Return a fully-qualified user resource name string.
     *
     * @param {string} user_id
     * @returns {string} Resource name string.
     */
    userPath(userId: string): string;
    /**
     * Parse the user_id from User resource.
     *
     * @param {string} userName
     *   A fully-qualified path representing User resource.
     * @returns {string} A string representing the user_id.
     */
    matchUserIdFromUserName(userName: string): string | number;
    /**
     * Return a fully-qualified userIdProfileBlurbId resource name string.
     *
     * @param {string} user_id
     * @param {string} blurb_id
     * @returns {string} Resource name string.
     */
    userIdProfileBlurbIdPath(userId: string, blurbId: string): string;
    /**
     * Parse the user_id from UserIdProfileBlurbId resource.
     *
     * @param {string} userIdProfileBlurbIdName
     *   A fully-qualified path representing user_id_profile_blurb_id resource.
     * @returns {string} A string representing the user_id.
     */
    matchUserIdFromUserIdProfileBlurbIdName(userIdProfileBlurbIdName: string): string | number;
    /**
     * Parse the blurb_id from UserIdProfileBlurbId resource.
     *
     * @param {string} userIdProfileBlurbIdName
     *   A fully-qualified path representing user_id_profile_blurb_id resource.
     * @returns {string} A string representing the blurb_id.
     */
    matchBlurbIdFromUserIdProfileBlurbIdName(userIdProfileBlurbIdName: string): string | number;
    /**
     * Return a fully-qualified userIdProfileBlurbsLegacyUserIdBlurbId resource name string.
     *
     * @param {string} user_id
     * @param {string} legacy_user_id
     * @param {string} blurb_id
     * @returns {string} Resource name string.
     */
    userIdProfileBlurbsLegacyUserIdBlurbIdPath(userId: string, legacyUserId: string, blurbId: string): string;
    /**
     * Parse the user_id from UserIdProfileBlurbsLegacyUserIdBlurbId resource.
     *
     * @param {string} userIdProfileBlurbsLegacyUserIdBlurbIdName
     *   A fully-qualified path representing user_id_profile_blurbs_legacy_user_id_blurb_id resource.
     * @returns {string} A string representing the user_id.
     */
    matchUserIdFromUserIdProfileBlurbsLegacyUserIdBlurbIdName(userIdProfileBlurbsLegacyUserIdBlurbIdName: string): string | number;
    /**
     * Parse the legacy_user_id from UserIdProfileBlurbsLegacyUserIdBlurbId resource.
     *
     * @param {string} userIdProfileBlurbsLegacyUserIdBlurbIdName
     *   A fully-qualified path representing user_id_profile_blurbs_legacy_user_id_blurb_id resource.
     * @returns {string} A string representing the legacy_user_id.
     */
    matchLegacyUserIdFromUserIdProfileBlurbsLegacyUserIdBlurbIdName(userIdProfileBlurbsLegacyUserIdBlurbIdName: string): string | number;
    /**
     * Parse the blurb_id from UserIdProfileBlurbsLegacyUserIdBlurbId resource.
     *
     * @param {string} userIdProfileBlurbsLegacyUserIdBlurbIdName
     *   A fully-qualified path representing user_id_profile_blurbs_legacy_user_id_blurb_id resource.
     * @returns {string} A string representing the blurb_id.
     */
    matchBlurbIdFromUserIdProfileBlurbsLegacyUserIdBlurbIdName(userIdProfileBlurbsLegacyUserIdBlurbIdName: string): string | number;
    /**
     * Terminate the gRPC channel and close the client.
     *
     * The client will no longer be usable and all future behavior is undefined.
     * @returns {Promise} A promise that resolves when the client is closed.
     */
    close(): Promise<void>;
}
