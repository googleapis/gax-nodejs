// Copyright 2021 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

import Long = require('long');
import {protobuf as $protobuf} from "../../../../src";
/** Namespace google. */
export namespace google {

    /** Namespace showcase. */
    namespace showcase {

        /** Namespace v1beta1. */
        namespace v1beta1 {

            /** Represents an Echo */
            class Echo extends $protobuf.rpc.Service {

                /**
                 * Constructs a new Echo service.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new Echo service using the specified rpc implementation.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 * @returns RPC service. Useful where requests and/or responses are streamed.
                 */
                public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Echo;

                /**
                 * Calls Echo.
                 * @param request EchoRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and EchoResponse
                 */
                public echo(request: google.showcase.v1beta1.IEchoRequest, callback: google.showcase.v1beta1.Echo.EchoCallback): void;

                /**
                 * Calls Echo.
                 * @param request EchoRequest message or plain object
                 * @returns Promise
                 */
                public echo(request: google.showcase.v1beta1.IEchoRequest): Promise<google.showcase.v1beta1.EchoResponse>;

                /**
                 * Calls Expand.
                 * @param request ExpandRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and EchoResponse
                 */
                public expand(request: google.showcase.v1beta1.IExpandRequest, callback: google.showcase.v1beta1.Echo.ExpandCallback): void;

                /**
                 * Calls Expand.
                 * @param request ExpandRequest message or plain object
                 * @returns Promise
                 */
                public expand(request: google.showcase.v1beta1.IExpandRequest): Promise<google.showcase.v1beta1.EchoResponse>;

                /**
                 * Calls Collect.
                 * @param request EchoRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and EchoResponse
                 */
                public collect(request: google.showcase.v1beta1.IEchoRequest, callback: google.showcase.v1beta1.Echo.CollectCallback): void;

                /**
                 * Calls Collect.
                 * @param request EchoRequest message or plain object
                 * @returns Promise
                 */
                public collect(request: google.showcase.v1beta1.IEchoRequest): Promise<google.showcase.v1beta1.EchoResponse>;

                /**
                 * Calls Chat.
                 * @param request EchoRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and EchoResponse
                 */
                public chat(request: google.showcase.v1beta1.IEchoRequest, callback: google.showcase.v1beta1.Echo.ChatCallback): void;

                /**
                 * Calls Chat.
                 * @param request EchoRequest message or plain object
                 * @returns Promise
                 */
                public chat(request: google.showcase.v1beta1.IEchoRequest): Promise<google.showcase.v1beta1.EchoResponse>;

                /**
                 * Calls PagedExpand.
                 * @param request PagedExpandRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and PagedExpandResponse
                 */
                public pagedExpand(request: google.showcase.v1beta1.IPagedExpandRequest, callback: google.showcase.v1beta1.Echo.PagedExpandCallback): void;

                /**
                 * Calls PagedExpand.
                 * @param request PagedExpandRequest message or plain object
                 * @returns Promise
                 */
                public pagedExpand(request: google.showcase.v1beta1.IPagedExpandRequest): Promise<google.showcase.v1beta1.PagedExpandResponse>;

                /**
                 * Calls Wait.
                 * @param request WaitRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Operation
                 */
                public wait(request: google.showcase.v1beta1.IWaitRequest, callback: google.showcase.v1beta1.Echo.WaitCallback): void;

                /**
                 * Calls Wait.
                 * @param request WaitRequest message or plain object
                 * @returns Promise
                 */
                public wait(request: google.showcase.v1beta1.IWaitRequest): Promise<google.longrunning.Operation>;

                /**
                 * Calls Block.
                 * @param request BlockRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and BlockResponse
                 */
                public block(request: google.showcase.v1beta1.IBlockRequest, callback: google.showcase.v1beta1.Echo.BlockCallback): void;

                /**
                 * Calls Block.
                 * @param request BlockRequest message or plain object
                 * @returns Promise
                 */
                public block(request: google.showcase.v1beta1.IBlockRequest): Promise<google.showcase.v1beta1.BlockResponse>;
            }

            namespace Echo {

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Echo#echo}.
                 * @param error Error, if any
                 * @param [response] EchoResponse
                 */
                type EchoCallback = (error: (Error|null), response?: google.showcase.v1beta1.EchoResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Echo#expand}.
                 * @param error Error, if any
                 * @param [response] EchoResponse
                 */
                type ExpandCallback = (error: (Error|null), response?: google.showcase.v1beta1.EchoResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Echo#collect}.
                 * @param error Error, if any
                 * @param [response] EchoResponse
                 */
                type CollectCallback = (error: (Error|null), response?: google.showcase.v1beta1.EchoResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Echo#chat}.
                 * @param error Error, if any
                 * @param [response] EchoResponse
                 */
                type ChatCallback = (error: (Error|null), response?: google.showcase.v1beta1.EchoResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Echo#pagedExpand}.
                 * @param error Error, if any
                 * @param [response] PagedExpandResponse
                 */
                type PagedExpandCallback = (error: (Error|null), response?: google.showcase.v1beta1.PagedExpandResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Echo#wait}.
                 * @param error Error, if any
                 * @param [response] Operation
                 */
                type WaitCallback = (error: (Error|null), response?: google.longrunning.Operation) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Echo#block}.
                 * @param error Error, if any
                 * @param [response] BlockResponse
                 */
                type BlockCallback = (error: (Error|null), response?: google.showcase.v1beta1.BlockResponse) => void;
            }

            /** Properties of an EchoRequest. */
            interface IEchoRequest {

                /** EchoRequest content */
                content?: (string|null);

                /** EchoRequest error */
                error?: (google.rpc.IStatus|null);
            }

            /** Represents an EchoRequest. */
            class EchoRequest implements IEchoRequest {

                /**
                 * Constructs a new EchoRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IEchoRequest);

                /** EchoRequest content. */
                public content?: (string|null);

                /** EchoRequest error. */
                public error?: (google.rpc.IStatus|null);

                /** EchoRequest response. */
                public response?: ("content"|"error");

                /**
                 * Creates a new EchoRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EchoRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IEchoRequest): google.showcase.v1beta1.EchoRequest;

                /**
                 * Encodes the specified EchoRequest message. Does not implicitly {@link google.showcase.v1beta1.EchoRequest.verify|verify} messages.
                 * @param message EchoRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IEchoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EchoRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.EchoRequest.verify|verify} messages.
                 * @param message EchoRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IEchoRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EchoRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EchoRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.EchoRequest;

                /**
                 * Decodes an EchoRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EchoRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.EchoRequest;

                /**
                 * Verifies an EchoRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EchoRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EchoRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.EchoRequest;

                /**
                 * Creates a plain object from an EchoRequest message. Also converts values to other types if specified.
                 * @param message EchoRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.EchoRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EchoRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an EchoResponse. */
            interface IEchoResponse {

                /** EchoResponse content */
                content?: (string|null);
            }

            /** Represents an EchoResponse. */
            class EchoResponse implements IEchoResponse {

                /**
                 * Constructs a new EchoResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IEchoResponse);

                /** EchoResponse content. */
                public content: string;

                /**
                 * Creates a new EchoResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EchoResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IEchoResponse): google.showcase.v1beta1.EchoResponse;

                /**
                 * Encodes the specified EchoResponse message. Does not implicitly {@link google.showcase.v1beta1.EchoResponse.verify|verify} messages.
                 * @param message EchoResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IEchoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EchoResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.EchoResponse.verify|verify} messages.
                 * @param message EchoResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IEchoResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EchoResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EchoResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.EchoResponse;

                /**
                 * Decodes an EchoResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EchoResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.EchoResponse;

                /**
                 * Verifies an EchoResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EchoResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EchoResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.EchoResponse;

                /**
                 * Creates a plain object from an EchoResponse message. Also converts values to other types if specified.
                 * @param message EchoResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.EchoResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EchoResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an ExpandRequest. */
            interface IExpandRequest {

                /** ExpandRequest content */
                content?: (string|null);

                /** ExpandRequest error */
                error?: (google.rpc.IStatus|null);
            }

            /** Represents an ExpandRequest. */
            class ExpandRequest implements IExpandRequest {

                /**
                 * Constructs a new ExpandRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IExpandRequest);

                /** ExpandRequest content. */
                public content: string;

                /** ExpandRequest error. */
                public error?: (google.rpc.IStatus|null);

                /**
                 * Creates a new ExpandRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ExpandRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IExpandRequest): google.showcase.v1beta1.ExpandRequest;

                /**
                 * Encodes the specified ExpandRequest message. Does not implicitly {@link google.showcase.v1beta1.ExpandRequest.verify|verify} messages.
                 * @param message ExpandRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IExpandRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExpandRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ExpandRequest.verify|verify} messages.
                 * @param message ExpandRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IExpandRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExpandRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ExpandRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ExpandRequest;

                /**
                 * Decodes an ExpandRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ExpandRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ExpandRequest;

                /**
                 * Verifies an ExpandRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ExpandRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ExpandRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ExpandRequest;

                /**
                 * Creates a plain object from an ExpandRequest message. Also converts values to other types if specified.
                 * @param message ExpandRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ExpandRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExpandRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PagedExpandRequest. */
            interface IPagedExpandRequest {

                /** PagedExpandRequest content */
                content?: (string|null);

                /** PagedExpandRequest pageSize */
                pageSize?: (number|null);

                /** PagedExpandRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a PagedExpandRequest. */
            class PagedExpandRequest implements IPagedExpandRequest {

                /**
                 * Constructs a new PagedExpandRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IPagedExpandRequest);

                /** PagedExpandRequest content. */
                public content: string;

                /** PagedExpandRequest pageSize. */
                public pageSize: number;

                /** PagedExpandRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new PagedExpandRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PagedExpandRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IPagedExpandRequest): google.showcase.v1beta1.PagedExpandRequest;

                /**
                 * Encodes the specified PagedExpandRequest message. Does not implicitly {@link google.showcase.v1beta1.PagedExpandRequest.verify|verify} messages.
                 * @param message PagedExpandRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IPagedExpandRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PagedExpandRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.PagedExpandRequest.verify|verify} messages.
                 * @param message PagedExpandRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IPagedExpandRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PagedExpandRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PagedExpandRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.PagedExpandRequest;

                /**
                 * Decodes a PagedExpandRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PagedExpandRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.PagedExpandRequest;

                /**
                 * Verifies a PagedExpandRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PagedExpandRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PagedExpandRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.PagedExpandRequest;

                /**
                 * Creates a plain object from a PagedExpandRequest message. Also converts values to other types if specified.
                 * @param message PagedExpandRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.PagedExpandRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PagedExpandRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a PagedExpandResponse. */
            interface IPagedExpandResponse {

                /** PagedExpandResponse responses */
                responses?: (google.showcase.v1beta1.IEchoResponse[]|null);

                /** PagedExpandResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a PagedExpandResponse. */
            class PagedExpandResponse implements IPagedExpandResponse {

                /**
                 * Constructs a new PagedExpandResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IPagedExpandResponse);

                /** PagedExpandResponse responses. */
                public responses: google.showcase.v1beta1.IEchoResponse[];

                /** PagedExpandResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new PagedExpandResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns PagedExpandResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IPagedExpandResponse): google.showcase.v1beta1.PagedExpandResponse;

                /**
                 * Encodes the specified PagedExpandResponse message. Does not implicitly {@link google.showcase.v1beta1.PagedExpandResponse.verify|verify} messages.
                 * @param message PagedExpandResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IPagedExpandResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified PagedExpandResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.PagedExpandResponse.verify|verify} messages.
                 * @param message PagedExpandResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IPagedExpandResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a PagedExpandResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns PagedExpandResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.PagedExpandResponse;

                /**
                 * Decodes a PagedExpandResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns PagedExpandResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.PagedExpandResponse;

                /**
                 * Verifies a PagedExpandResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a PagedExpandResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns PagedExpandResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.PagedExpandResponse;

                /**
                 * Creates a plain object from a PagedExpandResponse message. Also converts values to other types if specified.
                 * @param message PagedExpandResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.PagedExpandResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this PagedExpandResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a WaitRequest. */
            interface IWaitRequest {

                /** WaitRequest endTime */
                endTime?: (google.protobuf.ITimestamp|null);

                /** WaitRequest ttl */
                ttl?: (google.protobuf.IDuration|null);

                /** WaitRequest error */
                error?: (google.rpc.IStatus|null);

                /** WaitRequest success */
                success?: (google.showcase.v1beta1.IWaitResponse|null);
            }

            /** Represents a WaitRequest. */
            class WaitRequest implements IWaitRequest {

                /**
                 * Constructs a new WaitRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IWaitRequest);

                /** WaitRequest endTime. */
                public endTime?: (google.protobuf.ITimestamp|null);

                /** WaitRequest ttl. */
                public ttl?: (google.protobuf.IDuration|null);

                /** WaitRequest error. */
                public error?: (google.rpc.IStatus|null);

                /** WaitRequest success. */
                public success?: (google.showcase.v1beta1.IWaitResponse|null);

                /** WaitRequest end. */
                public end?: ("endTime"|"ttl");

                /** WaitRequest response. */
                public response?: ("error"|"success");

                /**
                 * Creates a new WaitRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns WaitRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IWaitRequest): google.showcase.v1beta1.WaitRequest;

                /**
                 * Encodes the specified WaitRequest message. Does not implicitly {@link google.showcase.v1beta1.WaitRequest.verify|verify} messages.
                 * @param message WaitRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IWaitRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified WaitRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.WaitRequest.verify|verify} messages.
                 * @param message WaitRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IWaitRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a WaitRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns WaitRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.WaitRequest;

                /**
                 * Decodes a WaitRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns WaitRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.WaitRequest;

                /**
                 * Verifies a WaitRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a WaitRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns WaitRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.WaitRequest;

                /**
                 * Creates a plain object from a WaitRequest message. Also converts values to other types if specified.
                 * @param message WaitRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.WaitRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this WaitRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a WaitResponse. */
            interface IWaitResponse {

                /** WaitResponse content */
                content?: (string|null);
            }

            /** Represents a WaitResponse. */
            class WaitResponse implements IWaitResponse {

                /**
                 * Constructs a new WaitResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IWaitResponse);

                /** WaitResponse content. */
                public content: string;

                /**
                 * Creates a new WaitResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns WaitResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IWaitResponse): google.showcase.v1beta1.WaitResponse;

                /**
                 * Encodes the specified WaitResponse message. Does not implicitly {@link google.showcase.v1beta1.WaitResponse.verify|verify} messages.
                 * @param message WaitResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IWaitResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified WaitResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.WaitResponse.verify|verify} messages.
                 * @param message WaitResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IWaitResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a WaitResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns WaitResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.WaitResponse;

                /**
                 * Decodes a WaitResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns WaitResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.WaitResponse;

                /**
                 * Verifies a WaitResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a WaitResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns WaitResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.WaitResponse;

                /**
                 * Creates a plain object from a WaitResponse message. Also converts values to other types if specified.
                 * @param message WaitResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.WaitResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this WaitResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a WaitMetadata. */
            interface IWaitMetadata {

                /** WaitMetadata endTime */
                endTime?: (google.protobuf.ITimestamp|null);
            }

            /** Represents a WaitMetadata. */
            class WaitMetadata implements IWaitMetadata {

                /**
                 * Constructs a new WaitMetadata.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IWaitMetadata);

                /** WaitMetadata endTime. */
                public endTime?: (google.protobuf.ITimestamp|null);

                /**
                 * Creates a new WaitMetadata instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns WaitMetadata instance
                 */
                public static create(properties?: google.showcase.v1beta1.IWaitMetadata): google.showcase.v1beta1.WaitMetadata;

                /**
                 * Encodes the specified WaitMetadata message. Does not implicitly {@link google.showcase.v1beta1.WaitMetadata.verify|verify} messages.
                 * @param message WaitMetadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IWaitMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified WaitMetadata message, length delimited. Does not implicitly {@link google.showcase.v1beta1.WaitMetadata.verify|verify} messages.
                 * @param message WaitMetadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IWaitMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a WaitMetadata message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns WaitMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.WaitMetadata;

                /**
                 * Decodes a WaitMetadata message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns WaitMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.WaitMetadata;

                /**
                 * Verifies a WaitMetadata message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a WaitMetadata message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns WaitMetadata
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.WaitMetadata;

                /**
                 * Creates a plain object from a WaitMetadata message. Also converts values to other types if specified.
                 * @param message WaitMetadata
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.WaitMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this WaitMetadata to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a BlockRequest. */
            interface IBlockRequest {

                /** BlockRequest responseDelay */
                responseDelay?: (google.protobuf.IDuration|null);

                /** BlockRequest error */
                error?: (google.rpc.IStatus|null);

                /** BlockRequest success */
                success?: (google.showcase.v1beta1.IBlockResponse|null);
            }

            /** Represents a BlockRequest. */
            class BlockRequest implements IBlockRequest {

                /**
                 * Constructs a new BlockRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IBlockRequest);

                /** BlockRequest responseDelay. */
                public responseDelay?: (google.protobuf.IDuration|null);

                /** BlockRequest error. */
                public error?: (google.rpc.IStatus|null);

                /** BlockRequest success. */
                public success?: (google.showcase.v1beta1.IBlockResponse|null);

                /** BlockRequest response. */
                public response?: ("error"|"success");

                /**
                 * Creates a new BlockRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BlockRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IBlockRequest): google.showcase.v1beta1.BlockRequest;

                /**
                 * Encodes the specified BlockRequest message. Does not implicitly {@link google.showcase.v1beta1.BlockRequest.verify|verify} messages.
                 * @param message BlockRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IBlockRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BlockRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.BlockRequest.verify|verify} messages.
                 * @param message BlockRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IBlockRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BlockRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BlockRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.BlockRequest;

                /**
                 * Decodes a BlockRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BlockRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.BlockRequest;

                /**
                 * Verifies a BlockRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a BlockRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns BlockRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.BlockRequest;

                /**
                 * Creates a plain object from a BlockRequest message. Also converts values to other types if specified.
                 * @param message BlockRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.BlockRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this BlockRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a BlockResponse. */
            interface IBlockResponse {

                /** BlockResponse content */
                content?: (string|null);
            }

            /** Represents a BlockResponse. */
            class BlockResponse implements IBlockResponse {

                /**
                 * Constructs a new BlockResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IBlockResponse);

                /** BlockResponse content. */
                public content: string;

                /**
                 * Creates a new BlockResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns BlockResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IBlockResponse): google.showcase.v1beta1.BlockResponse;

                /**
                 * Encodes the specified BlockResponse message. Does not implicitly {@link google.showcase.v1beta1.BlockResponse.verify|verify} messages.
                 * @param message BlockResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IBlockResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified BlockResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.BlockResponse.verify|verify} messages.
                 * @param message BlockResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IBlockResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a BlockResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns BlockResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.BlockResponse;

                /**
                 * Decodes a BlockResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns BlockResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.BlockResponse;

                /**
                 * Verifies a BlockResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a BlockResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns BlockResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.BlockResponse;

                /**
                 * Creates a plain object from a BlockResponse message. Also converts values to other types if specified.
                 * @param message BlockResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.BlockResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this BlockResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Represents an Identity */
            class Identity extends $protobuf.rpc.Service {

                /**
                 * Constructs a new Identity service.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new Identity service using the specified rpc implementation.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 * @returns RPC service. Useful where requests and/or responses are streamed.
                 */
                public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Identity;

                /**
                 * Calls CreateUser.
                 * @param request CreateUserRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and User
                 */
                public createUser(request: google.showcase.v1beta1.ICreateUserRequest, callback: google.showcase.v1beta1.Identity.CreateUserCallback): void;

                /**
                 * Calls CreateUser.
                 * @param request CreateUserRequest message or plain object
                 * @returns Promise
                 */
                public createUser(request: google.showcase.v1beta1.ICreateUserRequest): Promise<google.showcase.v1beta1.User>;

                /**
                 * Calls GetUser.
                 * @param request GetUserRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and User
                 */
                public getUser(request: google.showcase.v1beta1.IGetUserRequest, callback: google.showcase.v1beta1.Identity.GetUserCallback): void;

                /**
                 * Calls GetUser.
                 * @param request GetUserRequest message or plain object
                 * @returns Promise
                 */
                public getUser(request: google.showcase.v1beta1.IGetUserRequest): Promise<google.showcase.v1beta1.User>;

                /**
                 * Calls UpdateUser.
                 * @param request UpdateUserRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and User
                 */
                public updateUser(request: google.showcase.v1beta1.IUpdateUserRequest, callback: google.showcase.v1beta1.Identity.UpdateUserCallback): void;

                /**
                 * Calls UpdateUser.
                 * @param request UpdateUserRequest message or plain object
                 * @returns Promise
                 */
                public updateUser(request: google.showcase.v1beta1.IUpdateUserRequest): Promise<google.showcase.v1beta1.User>;

                /**
                 * Calls DeleteUser.
                 * @param request DeleteUserRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteUser(request: google.showcase.v1beta1.IDeleteUserRequest, callback: google.showcase.v1beta1.Identity.DeleteUserCallback): void;

                /**
                 * Calls DeleteUser.
                 * @param request DeleteUserRequest message or plain object
                 * @returns Promise
                 */
                public deleteUser(request: google.showcase.v1beta1.IDeleteUserRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls ListUsers.
                 * @param request ListUsersRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListUsersResponse
                 */
                public listUsers(request: google.showcase.v1beta1.IListUsersRequest, callback: google.showcase.v1beta1.Identity.ListUsersCallback): void;

                /**
                 * Calls ListUsers.
                 * @param request ListUsersRequest message or plain object
                 * @returns Promise
                 */
                public listUsers(request: google.showcase.v1beta1.IListUsersRequest): Promise<google.showcase.v1beta1.ListUsersResponse>;
            }

            namespace Identity {

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Identity#createUser}.
                 * @param error Error, if any
                 * @param [response] User
                 */
                type CreateUserCallback = (error: (Error|null), response?: google.showcase.v1beta1.User) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Identity#getUser}.
                 * @param error Error, if any
                 * @param [response] User
                 */
                type GetUserCallback = (error: (Error|null), response?: google.showcase.v1beta1.User) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Identity#updateUser}.
                 * @param error Error, if any
                 * @param [response] User
                 */
                type UpdateUserCallback = (error: (Error|null), response?: google.showcase.v1beta1.User) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Identity#deleteUser}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteUserCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Identity#listUsers}.
                 * @param error Error, if any
                 * @param [response] ListUsersResponse
                 */
                type ListUsersCallback = (error: (Error|null), response?: google.showcase.v1beta1.ListUsersResponse) => void;
            }

            /** Properties of a User. */
            interface IUser {

                /** User name */
                name?: (string|null);

                /** User displayName */
                displayName?: (string|null);

                /** User email */
                email?: (string|null);

                /** User createTime */
                createTime?: (google.protobuf.ITimestamp|null);

                /** User updateTime */
                updateTime?: (google.protobuf.ITimestamp|null);
            }

            /** Represents a User. */
            class User implements IUser {

                /**
                 * Constructs a new User.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IUser);

                /** User name. */
                public name: string;

                /** User displayName. */
                public displayName: string;

                /** User email. */
                public email: string;

                /** User createTime. */
                public createTime?: (google.protobuf.ITimestamp|null);

                /** User updateTime. */
                public updateTime?: (google.protobuf.ITimestamp|null);

                /**
                 * Creates a new User instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns User instance
                 */
                public static create(properties?: google.showcase.v1beta1.IUser): google.showcase.v1beta1.User;

                /**
                 * Encodes the specified User message. Does not implicitly {@link google.showcase.v1beta1.User.verify|verify} messages.
                 * @param message User message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified User message, length delimited. Does not implicitly {@link google.showcase.v1beta1.User.verify|verify} messages.
                 * @param message User message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IUser, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a User message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.User;

                /**
                 * Decodes a User message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns User
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.User;

                /**
                 * Verifies a User message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a User message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns User
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.User;

                /**
                 * Creates a plain object from a User message. Also converts values to other types if specified.
                 * @param message User
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.User, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this User to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a CreateUserRequest. */
            interface ICreateUserRequest {

                /** CreateUserRequest user */
                user?: (google.showcase.v1beta1.IUser|null);
            }

            /** Represents a CreateUserRequest. */
            class CreateUserRequest implements ICreateUserRequest {

                /**
                 * Constructs a new CreateUserRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ICreateUserRequest);

                /** CreateUserRequest user. */
                public user?: (google.showcase.v1beta1.IUser|null);

                /**
                 * Creates a new CreateUserRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CreateUserRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.ICreateUserRequest): google.showcase.v1beta1.CreateUserRequest;

                /**
                 * Encodes the specified CreateUserRequest message. Does not implicitly {@link google.showcase.v1beta1.CreateUserRequest.verify|verify} messages.
                 * @param message CreateUserRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ICreateUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CreateUserRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.CreateUserRequest.verify|verify} messages.
                 * @param message CreateUserRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ICreateUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CreateUserRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CreateUserRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.CreateUserRequest;

                /**
                 * Decodes a CreateUserRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CreateUserRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.CreateUserRequest;

                /**
                 * Verifies a CreateUserRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CreateUserRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CreateUserRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.CreateUserRequest;

                /**
                 * Creates a plain object from a CreateUserRequest message. Also converts values to other types if specified.
                 * @param message CreateUserRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.CreateUserRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CreateUserRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a GetUserRequest. */
            interface IGetUserRequest {

                /** GetUserRequest name */
                name?: (string|null);
            }

            /** Represents a GetUserRequest. */
            class GetUserRequest implements IGetUserRequest {

                /**
                 * Constructs a new GetUserRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IGetUserRequest);

                /** GetUserRequest name. */
                public name: string;

                /**
                 * Creates a new GetUserRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetUserRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IGetUserRequest): google.showcase.v1beta1.GetUserRequest;

                /**
                 * Encodes the specified GetUserRequest message. Does not implicitly {@link google.showcase.v1beta1.GetUserRequest.verify|verify} messages.
                 * @param message GetUserRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IGetUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetUserRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.GetUserRequest.verify|verify} messages.
                 * @param message GetUserRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IGetUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetUserRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetUserRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.GetUserRequest;

                /**
                 * Decodes a GetUserRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetUserRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.GetUserRequest;

                /**
                 * Verifies a GetUserRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetUserRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetUserRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.GetUserRequest;

                /**
                 * Creates a plain object from a GetUserRequest message. Also converts values to other types if specified.
                 * @param message GetUserRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.GetUserRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetUserRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an UpdateUserRequest. */
            interface IUpdateUserRequest {

                /** UpdateUserRequest user */
                user?: (google.showcase.v1beta1.IUser|null);

                /** UpdateUserRequest updateMask */
                updateMask?: (google.protobuf.IFieldMask|null);
            }

            /** Represents an UpdateUserRequest. */
            class UpdateUserRequest implements IUpdateUserRequest {

                /**
                 * Constructs a new UpdateUserRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IUpdateUserRequest);

                /** UpdateUserRequest user. */
                public user?: (google.showcase.v1beta1.IUser|null);

                /** UpdateUserRequest updateMask. */
                public updateMask?: (google.protobuf.IFieldMask|null);

                /**
                 * Creates a new UpdateUserRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns UpdateUserRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IUpdateUserRequest): google.showcase.v1beta1.UpdateUserRequest;

                /**
                 * Encodes the specified UpdateUserRequest message. Does not implicitly {@link google.showcase.v1beta1.UpdateUserRequest.verify|verify} messages.
                 * @param message UpdateUserRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IUpdateUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified UpdateUserRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.UpdateUserRequest.verify|verify} messages.
                 * @param message UpdateUserRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IUpdateUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an UpdateUserRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns UpdateUserRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.UpdateUserRequest;

                /**
                 * Decodes an UpdateUserRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns UpdateUserRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.UpdateUserRequest;

                /**
                 * Verifies an UpdateUserRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an UpdateUserRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns UpdateUserRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.UpdateUserRequest;

                /**
                 * Creates a plain object from an UpdateUserRequest message. Also converts values to other types if specified.
                 * @param message UpdateUserRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.UpdateUserRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this UpdateUserRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteUserRequest. */
            interface IDeleteUserRequest {

                /** DeleteUserRequest name */
                name?: (string|null);
            }

            /** Represents a DeleteUserRequest. */
            class DeleteUserRequest implements IDeleteUserRequest {

                /**
                 * Constructs a new DeleteUserRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IDeleteUserRequest);

                /** DeleteUserRequest name. */
                public name: string;

                /**
                 * Creates a new DeleteUserRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteUserRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IDeleteUserRequest): google.showcase.v1beta1.DeleteUserRequest;

                /**
                 * Encodes the specified DeleteUserRequest message. Does not implicitly {@link google.showcase.v1beta1.DeleteUserRequest.verify|verify} messages.
                 * @param message DeleteUserRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IDeleteUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteUserRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.DeleteUserRequest.verify|verify} messages.
                 * @param message DeleteUserRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IDeleteUserRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteUserRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteUserRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.DeleteUserRequest;

                /**
                 * Decodes a DeleteUserRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteUserRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.DeleteUserRequest;

                /**
                 * Verifies a DeleteUserRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteUserRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteUserRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.DeleteUserRequest;

                /**
                 * Creates a plain object from a DeleteUserRequest message. Also converts values to other types if specified.
                 * @param message DeleteUserRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.DeleteUserRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteUserRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListUsersRequest. */
            interface IListUsersRequest {

                /** ListUsersRequest pageSize */
                pageSize?: (number|null);

                /** ListUsersRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListUsersRequest. */
            class ListUsersRequest implements IListUsersRequest {

                /**
                 * Constructs a new ListUsersRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListUsersRequest);

                /** ListUsersRequest pageSize. */
                public pageSize: number;

                /** ListUsersRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListUsersRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListUsersRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListUsersRequest): google.showcase.v1beta1.ListUsersRequest;

                /**
                 * Encodes the specified ListUsersRequest message. Does not implicitly {@link google.showcase.v1beta1.ListUsersRequest.verify|verify} messages.
                 * @param message ListUsersRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListUsersRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListUsersRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListUsersRequest.verify|verify} messages.
                 * @param message ListUsersRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListUsersRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListUsersRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListUsersRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListUsersRequest;

                /**
                 * Decodes a ListUsersRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListUsersRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListUsersRequest;

                /**
                 * Verifies a ListUsersRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListUsersRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListUsersRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListUsersRequest;

                /**
                 * Creates a plain object from a ListUsersRequest message. Also converts values to other types if specified.
                 * @param message ListUsersRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListUsersRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListUsersRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListUsersResponse. */
            interface IListUsersResponse {

                /** ListUsersResponse users */
                users?: (google.showcase.v1beta1.IUser[]|null);

                /** ListUsersResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListUsersResponse. */
            class ListUsersResponse implements IListUsersResponse {

                /**
                 * Constructs a new ListUsersResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListUsersResponse);

                /** ListUsersResponse users. */
                public users: google.showcase.v1beta1.IUser[];

                /** ListUsersResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListUsersResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListUsersResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListUsersResponse): google.showcase.v1beta1.ListUsersResponse;

                /**
                 * Encodes the specified ListUsersResponse message. Does not implicitly {@link google.showcase.v1beta1.ListUsersResponse.verify|verify} messages.
                 * @param message ListUsersResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListUsersResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListUsersResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListUsersResponse.verify|verify} messages.
                 * @param message ListUsersResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListUsersResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListUsersResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListUsersResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListUsersResponse;

                /**
                 * Decodes a ListUsersResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListUsersResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListUsersResponse;

                /**
                 * Verifies a ListUsersResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListUsersResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListUsersResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListUsersResponse;

                /**
                 * Creates a plain object from a ListUsersResponse message. Also converts values to other types if specified.
                 * @param message ListUsersResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListUsersResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListUsersResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Represents a Messaging */
            class Messaging extends $protobuf.rpc.Service {

                /**
                 * Constructs a new Messaging service.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new Messaging service using the specified rpc implementation.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 * @returns RPC service. Useful where requests and/or responses are streamed.
                 */
                public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Messaging;

                /**
                 * Calls CreateRoom.
                 * @param request CreateRoomRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Room
                 */
                public createRoom(request: google.showcase.v1beta1.ICreateRoomRequest, callback: google.showcase.v1beta1.Messaging.CreateRoomCallback): void;

                /**
                 * Calls CreateRoom.
                 * @param request CreateRoomRequest message or plain object
                 * @returns Promise
                 */
                public createRoom(request: google.showcase.v1beta1.ICreateRoomRequest): Promise<google.showcase.v1beta1.Room>;

                /**
                 * Calls GetRoom.
                 * @param request GetRoomRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Room
                 */
                public getRoom(request: google.showcase.v1beta1.IGetRoomRequest, callback: google.showcase.v1beta1.Messaging.GetRoomCallback): void;

                /**
                 * Calls GetRoom.
                 * @param request GetRoomRequest message or plain object
                 * @returns Promise
                 */
                public getRoom(request: google.showcase.v1beta1.IGetRoomRequest): Promise<google.showcase.v1beta1.Room>;

                /**
                 * Calls UpdateRoom.
                 * @param request UpdateRoomRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Room
                 */
                public updateRoom(request: google.showcase.v1beta1.IUpdateRoomRequest, callback: google.showcase.v1beta1.Messaging.UpdateRoomCallback): void;

                /**
                 * Calls UpdateRoom.
                 * @param request UpdateRoomRequest message or plain object
                 * @returns Promise
                 */
                public updateRoom(request: google.showcase.v1beta1.IUpdateRoomRequest): Promise<google.showcase.v1beta1.Room>;

                /**
                 * Calls DeleteRoom.
                 * @param request DeleteRoomRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteRoom(request: google.showcase.v1beta1.IDeleteRoomRequest, callback: google.showcase.v1beta1.Messaging.DeleteRoomCallback): void;

                /**
                 * Calls DeleteRoom.
                 * @param request DeleteRoomRequest message or plain object
                 * @returns Promise
                 */
                public deleteRoom(request: google.showcase.v1beta1.IDeleteRoomRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls ListRooms.
                 * @param request ListRoomsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListRoomsResponse
                 */
                public listRooms(request: google.showcase.v1beta1.IListRoomsRequest, callback: google.showcase.v1beta1.Messaging.ListRoomsCallback): void;

                /**
                 * Calls ListRooms.
                 * @param request ListRoomsRequest message or plain object
                 * @returns Promise
                 */
                public listRooms(request: google.showcase.v1beta1.IListRoomsRequest): Promise<google.showcase.v1beta1.ListRoomsResponse>;

                /**
                 * Calls CreateBlurb.
                 * @param request CreateBlurbRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Blurb
                 */
                public createBlurb(request: google.showcase.v1beta1.ICreateBlurbRequest, callback: google.showcase.v1beta1.Messaging.CreateBlurbCallback): void;

                /**
                 * Calls CreateBlurb.
                 * @param request CreateBlurbRequest message or plain object
                 * @returns Promise
                 */
                public createBlurb(request: google.showcase.v1beta1.ICreateBlurbRequest): Promise<google.showcase.v1beta1.Blurb>;

                /**
                 * Calls GetBlurb.
                 * @param request GetBlurbRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Blurb
                 */
                public getBlurb(request: google.showcase.v1beta1.IGetBlurbRequest, callback: google.showcase.v1beta1.Messaging.GetBlurbCallback): void;

                /**
                 * Calls GetBlurb.
                 * @param request GetBlurbRequest message or plain object
                 * @returns Promise
                 */
                public getBlurb(request: google.showcase.v1beta1.IGetBlurbRequest): Promise<google.showcase.v1beta1.Blurb>;

                /**
                 * Calls UpdateBlurb.
                 * @param request UpdateBlurbRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Blurb
                 */
                public updateBlurb(request: google.showcase.v1beta1.IUpdateBlurbRequest, callback: google.showcase.v1beta1.Messaging.UpdateBlurbCallback): void;

                /**
                 * Calls UpdateBlurb.
                 * @param request UpdateBlurbRequest message or plain object
                 * @returns Promise
                 */
                public updateBlurb(request: google.showcase.v1beta1.IUpdateBlurbRequest): Promise<google.showcase.v1beta1.Blurb>;

                /**
                 * Calls DeleteBlurb.
                 * @param request DeleteBlurbRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteBlurb(request: google.showcase.v1beta1.IDeleteBlurbRequest, callback: google.showcase.v1beta1.Messaging.DeleteBlurbCallback): void;

                /**
                 * Calls DeleteBlurb.
                 * @param request DeleteBlurbRequest message or plain object
                 * @returns Promise
                 */
                public deleteBlurb(request: google.showcase.v1beta1.IDeleteBlurbRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls ListBlurbs.
                 * @param request ListBlurbsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListBlurbsResponse
                 */
                public listBlurbs(request: google.showcase.v1beta1.IListBlurbsRequest, callback: google.showcase.v1beta1.Messaging.ListBlurbsCallback): void;

                /**
                 * Calls ListBlurbs.
                 * @param request ListBlurbsRequest message or plain object
                 * @returns Promise
                 */
                public listBlurbs(request: google.showcase.v1beta1.IListBlurbsRequest): Promise<google.showcase.v1beta1.ListBlurbsResponse>;

                /**
                 * Calls SearchBlurbs.
                 * @param request SearchBlurbsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Operation
                 */
                public searchBlurbs(request: google.showcase.v1beta1.ISearchBlurbsRequest, callback: google.showcase.v1beta1.Messaging.SearchBlurbsCallback): void;

                /**
                 * Calls SearchBlurbs.
                 * @param request SearchBlurbsRequest message or plain object
                 * @returns Promise
                 */
                public searchBlurbs(request: google.showcase.v1beta1.ISearchBlurbsRequest): Promise<google.longrunning.Operation>;

                /**
                 * Calls StreamBlurbs.
                 * @param request StreamBlurbsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and StreamBlurbsResponse
                 */
                public streamBlurbs(request: google.showcase.v1beta1.IStreamBlurbsRequest, callback: google.showcase.v1beta1.Messaging.StreamBlurbsCallback): void;

                /**
                 * Calls StreamBlurbs.
                 * @param request StreamBlurbsRequest message or plain object
                 * @returns Promise
                 */
                public streamBlurbs(request: google.showcase.v1beta1.IStreamBlurbsRequest): Promise<google.showcase.v1beta1.StreamBlurbsResponse>;

                /**
                 * Calls SendBlurbs.
                 * @param request CreateBlurbRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and SendBlurbsResponse
                 */
                public sendBlurbs(request: google.showcase.v1beta1.ICreateBlurbRequest, callback: google.showcase.v1beta1.Messaging.SendBlurbsCallback): void;

                /**
                 * Calls SendBlurbs.
                 * @param request CreateBlurbRequest message or plain object
                 * @returns Promise
                 */
                public sendBlurbs(request: google.showcase.v1beta1.ICreateBlurbRequest): Promise<google.showcase.v1beta1.SendBlurbsResponse>;

                /**
                 * Calls Connect.
                 * @param request ConnectRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and StreamBlurbsResponse
                 */
                public connect(request: google.showcase.v1beta1.IConnectRequest, callback: google.showcase.v1beta1.Messaging.ConnectCallback): void;

                /**
                 * Calls Connect.
                 * @param request ConnectRequest message or plain object
                 * @returns Promise
                 */
                public connect(request: google.showcase.v1beta1.IConnectRequest): Promise<google.showcase.v1beta1.StreamBlurbsResponse>;
            }

            namespace Messaging {

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#createRoom}.
                 * @param error Error, if any
                 * @param [response] Room
                 */
                type CreateRoomCallback = (error: (Error|null), response?: google.showcase.v1beta1.Room) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#getRoom}.
                 * @param error Error, if any
                 * @param [response] Room
                 */
                type GetRoomCallback = (error: (Error|null), response?: google.showcase.v1beta1.Room) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#updateRoom}.
                 * @param error Error, if any
                 * @param [response] Room
                 */
                type UpdateRoomCallback = (error: (Error|null), response?: google.showcase.v1beta1.Room) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#deleteRoom}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteRoomCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#listRooms}.
                 * @param error Error, if any
                 * @param [response] ListRoomsResponse
                 */
                type ListRoomsCallback = (error: (Error|null), response?: google.showcase.v1beta1.ListRoomsResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#createBlurb}.
                 * @param error Error, if any
                 * @param [response] Blurb
                 */
                type CreateBlurbCallback = (error: (Error|null), response?: google.showcase.v1beta1.Blurb) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#getBlurb}.
                 * @param error Error, if any
                 * @param [response] Blurb
                 */
                type GetBlurbCallback = (error: (Error|null), response?: google.showcase.v1beta1.Blurb) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#updateBlurb}.
                 * @param error Error, if any
                 * @param [response] Blurb
                 */
                type UpdateBlurbCallback = (error: (Error|null), response?: google.showcase.v1beta1.Blurb) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#deleteBlurb}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteBlurbCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#listBlurbs}.
                 * @param error Error, if any
                 * @param [response] ListBlurbsResponse
                 */
                type ListBlurbsCallback = (error: (Error|null), response?: google.showcase.v1beta1.ListBlurbsResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#searchBlurbs}.
                 * @param error Error, if any
                 * @param [response] Operation
                 */
                type SearchBlurbsCallback = (error: (Error|null), response?: google.longrunning.Operation) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#streamBlurbs}.
                 * @param error Error, if any
                 * @param [response] StreamBlurbsResponse
                 */
                type StreamBlurbsCallback = (error: (Error|null), response?: google.showcase.v1beta1.StreamBlurbsResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#sendBlurbs}.
                 * @param error Error, if any
                 * @param [response] SendBlurbsResponse
                 */
                type SendBlurbsCallback = (error: (Error|null), response?: google.showcase.v1beta1.SendBlurbsResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Messaging#connect}.
                 * @param error Error, if any
                 * @param [response] StreamBlurbsResponse
                 */
                type ConnectCallback = (error: (Error|null), response?: google.showcase.v1beta1.StreamBlurbsResponse) => void;
            }

            /** Properties of a Room. */
            interface IRoom {

                /** Room name */
                name?: (string|null);

                /** Room displayName */
                displayName?: (string|null);

                /** Room description */
                description?: (string|null);

                /** Room createTime */
                createTime?: (google.protobuf.ITimestamp|null);

                /** Room updateTime */
                updateTime?: (google.protobuf.ITimestamp|null);
            }

            /** Represents a Room. */
            class Room implements IRoom {

                /**
                 * Constructs a new Room.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IRoom);

                /** Room name. */
                public name: string;

                /** Room displayName. */
                public displayName: string;

                /** Room description. */
                public description: string;

                /** Room createTime. */
                public createTime?: (google.protobuf.ITimestamp|null);

                /** Room updateTime. */
                public updateTime?: (google.protobuf.ITimestamp|null);

                /**
                 * Creates a new Room instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Room instance
                 */
                public static create(properties?: google.showcase.v1beta1.IRoom): google.showcase.v1beta1.Room;

                /**
                 * Encodes the specified Room message. Does not implicitly {@link google.showcase.v1beta1.Room.verify|verify} messages.
                 * @param message Room message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IRoom, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Room message, length delimited. Does not implicitly {@link google.showcase.v1beta1.Room.verify|verify} messages.
                 * @param message Room message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IRoom, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Room message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Room
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.Room;

                /**
                 * Decodes a Room message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Room
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.Room;

                /**
                 * Verifies a Room message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Room message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Room
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.Room;

                /**
                 * Creates a plain object from a Room message. Also converts values to other types if specified.
                 * @param message Room
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.Room, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Room to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a CreateRoomRequest. */
            interface ICreateRoomRequest {

                /** CreateRoomRequest room */
                room?: (google.showcase.v1beta1.IRoom|null);
            }

            /** Represents a CreateRoomRequest. */
            class CreateRoomRequest implements ICreateRoomRequest {

                /**
                 * Constructs a new CreateRoomRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ICreateRoomRequest);

                /** CreateRoomRequest room. */
                public room?: (google.showcase.v1beta1.IRoom|null);

                /**
                 * Creates a new CreateRoomRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CreateRoomRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.ICreateRoomRequest): google.showcase.v1beta1.CreateRoomRequest;

                /**
                 * Encodes the specified CreateRoomRequest message. Does not implicitly {@link google.showcase.v1beta1.CreateRoomRequest.verify|verify} messages.
                 * @param message CreateRoomRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ICreateRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CreateRoomRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.CreateRoomRequest.verify|verify} messages.
                 * @param message CreateRoomRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ICreateRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CreateRoomRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CreateRoomRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.CreateRoomRequest;

                /**
                 * Decodes a CreateRoomRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CreateRoomRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.CreateRoomRequest;

                /**
                 * Verifies a CreateRoomRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CreateRoomRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CreateRoomRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.CreateRoomRequest;

                /**
                 * Creates a plain object from a CreateRoomRequest message. Also converts values to other types if specified.
                 * @param message CreateRoomRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.CreateRoomRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CreateRoomRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a GetRoomRequest. */
            interface IGetRoomRequest {

                /** GetRoomRequest name */
                name?: (string|null);
            }

            /** Represents a GetRoomRequest. */
            class GetRoomRequest implements IGetRoomRequest {

                /**
                 * Constructs a new GetRoomRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IGetRoomRequest);

                /** GetRoomRequest name. */
                public name: string;

                /**
                 * Creates a new GetRoomRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetRoomRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IGetRoomRequest): google.showcase.v1beta1.GetRoomRequest;

                /**
                 * Encodes the specified GetRoomRequest message. Does not implicitly {@link google.showcase.v1beta1.GetRoomRequest.verify|verify} messages.
                 * @param message GetRoomRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IGetRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetRoomRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.GetRoomRequest.verify|verify} messages.
                 * @param message GetRoomRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IGetRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetRoomRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetRoomRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.GetRoomRequest;

                /**
                 * Decodes a GetRoomRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetRoomRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.GetRoomRequest;

                /**
                 * Verifies a GetRoomRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetRoomRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetRoomRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.GetRoomRequest;

                /**
                 * Creates a plain object from a GetRoomRequest message. Also converts values to other types if specified.
                 * @param message GetRoomRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.GetRoomRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetRoomRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an UpdateRoomRequest. */
            interface IUpdateRoomRequest {

                /** UpdateRoomRequest room */
                room?: (google.showcase.v1beta1.IRoom|null);

                /** UpdateRoomRequest updateMask */
                updateMask?: (google.protobuf.IFieldMask|null);
            }

            /** Represents an UpdateRoomRequest. */
            class UpdateRoomRequest implements IUpdateRoomRequest {

                /**
                 * Constructs a new UpdateRoomRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IUpdateRoomRequest);

                /** UpdateRoomRequest room. */
                public room?: (google.showcase.v1beta1.IRoom|null);

                /** UpdateRoomRequest updateMask. */
                public updateMask?: (google.protobuf.IFieldMask|null);

                /**
                 * Creates a new UpdateRoomRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns UpdateRoomRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IUpdateRoomRequest): google.showcase.v1beta1.UpdateRoomRequest;

                /**
                 * Encodes the specified UpdateRoomRequest message. Does not implicitly {@link google.showcase.v1beta1.UpdateRoomRequest.verify|verify} messages.
                 * @param message UpdateRoomRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IUpdateRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified UpdateRoomRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.UpdateRoomRequest.verify|verify} messages.
                 * @param message UpdateRoomRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IUpdateRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an UpdateRoomRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns UpdateRoomRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.UpdateRoomRequest;

                /**
                 * Decodes an UpdateRoomRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns UpdateRoomRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.UpdateRoomRequest;

                /**
                 * Verifies an UpdateRoomRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an UpdateRoomRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns UpdateRoomRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.UpdateRoomRequest;

                /**
                 * Creates a plain object from an UpdateRoomRequest message. Also converts values to other types if specified.
                 * @param message UpdateRoomRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.UpdateRoomRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this UpdateRoomRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteRoomRequest. */
            interface IDeleteRoomRequest {

                /** DeleteRoomRequest name */
                name?: (string|null);
            }

            /** Represents a DeleteRoomRequest. */
            class DeleteRoomRequest implements IDeleteRoomRequest {

                /**
                 * Constructs a new DeleteRoomRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IDeleteRoomRequest);

                /** DeleteRoomRequest name. */
                public name: string;

                /**
                 * Creates a new DeleteRoomRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteRoomRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IDeleteRoomRequest): google.showcase.v1beta1.DeleteRoomRequest;

                /**
                 * Encodes the specified DeleteRoomRequest message. Does not implicitly {@link google.showcase.v1beta1.DeleteRoomRequest.verify|verify} messages.
                 * @param message DeleteRoomRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IDeleteRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteRoomRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.DeleteRoomRequest.verify|verify} messages.
                 * @param message DeleteRoomRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IDeleteRoomRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteRoomRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteRoomRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.DeleteRoomRequest;

                /**
                 * Decodes a DeleteRoomRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteRoomRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.DeleteRoomRequest;

                /**
                 * Verifies a DeleteRoomRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteRoomRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteRoomRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.DeleteRoomRequest;

                /**
                 * Creates a plain object from a DeleteRoomRequest message. Also converts values to other types if specified.
                 * @param message DeleteRoomRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.DeleteRoomRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteRoomRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListRoomsRequest. */
            interface IListRoomsRequest {

                /** ListRoomsRequest pageSize */
                pageSize?: (number|null);

                /** ListRoomsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListRoomsRequest. */
            class ListRoomsRequest implements IListRoomsRequest {

                /**
                 * Constructs a new ListRoomsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListRoomsRequest);

                /** ListRoomsRequest pageSize. */
                public pageSize: number;

                /** ListRoomsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListRoomsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListRoomsRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListRoomsRequest): google.showcase.v1beta1.ListRoomsRequest;

                /**
                 * Encodes the specified ListRoomsRequest message. Does not implicitly {@link google.showcase.v1beta1.ListRoomsRequest.verify|verify} messages.
                 * @param message ListRoomsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListRoomsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListRoomsRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListRoomsRequest.verify|verify} messages.
                 * @param message ListRoomsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListRoomsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListRoomsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListRoomsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListRoomsRequest;

                /**
                 * Decodes a ListRoomsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListRoomsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListRoomsRequest;

                /**
                 * Verifies a ListRoomsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListRoomsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListRoomsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListRoomsRequest;

                /**
                 * Creates a plain object from a ListRoomsRequest message. Also converts values to other types if specified.
                 * @param message ListRoomsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListRoomsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListRoomsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListRoomsResponse. */
            interface IListRoomsResponse {

                /** ListRoomsResponse rooms */
                rooms?: (google.showcase.v1beta1.IRoom[]|null);

                /** ListRoomsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListRoomsResponse. */
            class ListRoomsResponse implements IListRoomsResponse {

                /**
                 * Constructs a new ListRoomsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListRoomsResponse);

                /** ListRoomsResponse rooms. */
                public rooms: google.showcase.v1beta1.IRoom[];

                /** ListRoomsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListRoomsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListRoomsResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListRoomsResponse): google.showcase.v1beta1.ListRoomsResponse;

                /**
                 * Encodes the specified ListRoomsResponse message. Does not implicitly {@link google.showcase.v1beta1.ListRoomsResponse.verify|verify} messages.
                 * @param message ListRoomsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListRoomsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListRoomsResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListRoomsResponse.verify|verify} messages.
                 * @param message ListRoomsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListRoomsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListRoomsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListRoomsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListRoomsResponse;

                /**
                 * Decodes a ListRoomsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListRoomsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListRoomsResponse;

                /**
                 * Verifies a ListRoomsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListRoomsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListRoomsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListRoomsResponse;

                /**
                 * Creates a plain object from a ListRoomsResponse message. Also converts values to other types if specified.
                 * @param message ListRoomsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListRoomsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListRoomsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a Blurb. */
            interface IBlurb {

                /** Blurb name */
                name?: (string|null);

                /** Blurb user */
                user?: (string|null);

                /** Blurb text */
                text?: (string|null);

                /** Blurb image */
                image?: (Uint8Array|string|null);

                /** Blurb createTime */
                createTime?: (google.protobuf.ITimestamp|null);

                /** Blurb updateTime */
                updateTime?: (google.protobuf.ITimestamp|null);
            }

            /** Represents a Blurb. */
            class Blurb implements IBlurb {

                /**
                 * Constructs a new Blurb.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IBlurb);

                /** Blurb name. */
                public name: string;

                /** Blurb user. */
                public user: string;

                /** Blurb text. */
                public text?: (string|null);

                /** Blurb image. */
                public image?: (Uint8Array|string|null);

                /** Blurb createTime. */
                public createTime?: (google.protobuf.ITimestamp|null);

                /** Blurb updateTime. */
                public updateTime?: (google.protobuf.ITimestamp|null);

                /** Blurb content. */
                public content?: ("text"|"image");

                /**
                 * Creates a new Blurb instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Blurb instance
                 */
                public static create(properties?: google.showcase.v1beta1.IBlurb): google.showcase.v1beta1.Blurb;

                /**
                 * Encodes the specified Blurb message. Does not implicitly {@link google.showcase.v1beta1.Blurb.verify|verify} messages.
                 * @param message Blurb message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IBlurb, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Blurb message, length delimited. Does not implicitly {@link google.showcase.v1beta1.Blurb.verify|verify} messages.
                 * @param message Blurb message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IBlurb, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Blurb message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Blurb
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.Blurb;

                /**
                 * Decodes a Blurb message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Blurb
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.Blurb;

                /**
                 * Verifies a Blurb message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Blurb message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Blurb
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.Blurb;

                /**
                 * Creates a plain object from a Blurb message. Also converts values to other types if specified.
                 * @param message Blurb
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.Blurb, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Blurb to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a CreateBlurbRequest. */
            interface ICreateBlurbRequest {

                /** CreateBlurbRequest parent */
                parent?: (string|null);

                /** CreateBlurbRequest blurb */
                blurb?: (google.showcase.v1beta1.IBlurb|null);
            }

            /** Represents a CreateBlurbRequest. */
            class CreateBlurbRequest implements ICreateBlurbRequest {

                /**
                 * Constructs a new CreateBlurbRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ICreateBlurbRequest);

                /** CreateBlurbRequest parent. */
                public parent: string;

                /** CreateBlurbRequest blurb. */
                public blurb?: (google.showcase.v1beta1.IBlurb|null);

                /**
                 * Creates a new CreateBlurbRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CreateBlurbRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.ICreateBlurbRequest): google.showcase.v1beta1.CreateBlurbRequest;

                /**
                 * Encodes the specified CreateBlurbRequest message. Does not implicitly {@link google.showcase.v1beta1.CreateBlurbRequest.verify|verify} messages.
                 * @param message CreateBlurbRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ICreateBlurbRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CreateBlurbRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.CreateBlurbRequest.verify|verify} messages.
                 * @param message CreateBlurbRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ICreateBlurbRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CreateBlurbRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CreateBlurbRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.CreateBlurbRequest;

                /**
                 * Decodes a CreateBlurbRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CreateBlurbRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.CreateBlurbRequest;

                /**
                 * Verifies a CreateBlurbRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CreateBlurbRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CreateBlurbRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.CreateBlurbRequest;

                /**
                 * Creates a plain object from a CreateBlurbRequest message. Also converts values to other types if specified.
                 * @param message CreateBlurbRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.CreateBlurbRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CreateBlurbRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a GetBlurbRequest. */
            interface IGetBlurbRequest {

                /** GetBlurbRequest name */
                name?: (string|null);
            }

            /** Represents a GetBlurbRequest. */
            class GetBlurbRequest implements IGetBlurbRequest {

                /**
                 * Constructs a new GetBlurbRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IGetBlurbRequest);

                /** GetBlurbRequest name. */
                public name: string;

                /**
                 * Creates a new GetBlurbRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetBlurbRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IGetBlurbRequest): google.showcase.v1beta1.GetBlurbRequest;

                /**
                 * Encodes the specified GetBlurbRequest message. Does not implicitly {@link google.showcase.v1beta1.GetBlurbRequest.verify|verify} messages.
                 * @param message GetBlurbRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IGetBlurbRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetBlurbRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.GetBlurbRequest.verify|verify} messages.
                 * @param message GetBlurbRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IGetBlurbRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetBlurbRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetBlurbRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.GetBlurbRequest;

                /**
                 * Decodes a GetBlurbRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetBlurbRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.GetBlurbRequest;

                /**
                 * Verifies a GetBlurbRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetBlurbRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetBlurbRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.GetBlurbRequest;

                /**
                 * Creates a plain object from a GetBlurbRequest message. Also converts values to other types if specified.
                 * @param message GetBlurbRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.GetBlurbRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetBlurbRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of an UpdateBlurbRequest. */
            interface IUpdateBlurbRequest {

                /** UpdateBlurbRequest blurb */
                blurb?: (google.showcase.v1beta1.IBlurb|null);

                /** UpdateBlurbRequest updateMask */
                updateMask?: (google.protobuf.IFieldMask|null);
            }

            /** Represents an UpdateBlurbRequest. */
            class UpdateBlurbRequest implements IUpdateBlurbRequest {

                /**
                 * Constructs a new UpdateBlurbRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IUpdateBlurbRequest);

                /** UpdateBlurbRequest blurb. */
                public blurb?: (google.showcase.v1beta1.IBlurb|null);

                /** UpdateBlurbRequest updateMask. */
                public updateMask?: (google.protobuf.IFieldMask|null);

                /**
                 * Creates a new UpdateBlurbRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns UpdateBlurbRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IUpdateBlurbRequest): google.showcase.v1beta1.UpdateBlurbRequest;

                /**
                 * Encodes the specified UpdateBlurbRequest message. Does not implicitly {@link google.showcase.v1beta1.UpdateBlurbRequest.verify|verify} messages.
                 * @param message UpdateBlurbRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IUpdateBlurbRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified UpdateBlurbRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.UpdateBlurbRequest.verify|verify} messages.
                 * @param message UpdateBlurbRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IUpdateBlurbRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an UpdateBlurbRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns UpdateBlurbRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.UpdateBlurbRequest;

                /**
                 * Decodes an UpdateBlurbRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns UpdateBlurbRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.UpdateBlurbRequest;

                /**
                 * Verifies an UpdateBlurbRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an UpdateBlurbRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns UpdateBlurbRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.UpdateBlurbRequest;

                /**
                 * Creates a plain object from an UpdateBlurbRequest message. Also converts values to other types if specified.
                 * @param message UpdateBlurbRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.UpdateBlurbRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this UpdateBlurbRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteBlurbRequest. */
            interface IDeleteBlurbRequest {

                /** DeleteBlurbRequest name */
                name?: (string|null);
            }

            /** Represents a DeleteBlurbRequest. */
            class DeleteBlurbRequest implements IDeleteBlurbRequest {

                /**
                 * Constructs a new DeleteBlurbRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IDeleteBlurbRequest);

                /** DeleteBlurbRequest name. */
                public name: string;

                /**
                 * Creates a new DeleteBlurbRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteBlurbRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IDeleteBlurbRequest): google.showcase.v1beta1.DeleteBlurbRequest;

                /**
                 * Encodes the specified DeleteBlurbRequest message. Does not implicitly {@link google.showcase.v1beta1.DeleteBlurbRequest.verify|verify} messages.
                 * @param message DeleteBlurbRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IDeleteBlurbRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteBlurbRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.DeleteBlurbRequest.verify|verify} messages.
                 * @param message DeleteBlurbRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IDeleteBlurbRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteBlurbRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteBlurbRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.DeleteBlurbRequest;

                /**
                 * Decodes a DeleteBlurbRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteBlurbRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.DeleteBlurbRequest;

                /**
                 * Verifies a DeleteBlurbRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteBlurbRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteBlurbRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.DeleteBlurbRequest;

                /**
                 * Creates a plain object from a DeleteBlurbRequest message. Also converts values to other types if specified.
                 * @param message DeleteBlurbRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.DeleteBlurbRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteBlurbRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListBlurbsRequest. */
            interface IListBlurbsRequest {

                /** ListBlurbsRequest parent */
                parent?: (string|null);

                /** ListBlurbsRequest pageSize */
                pageSize?: (number|null);

                /** ListBlurbsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListBlurbsRequest. */
            class ListBlurbsRequest implements IListBlurbsRequest {

                /**
                 * Constructs a new ListBlurbsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListBlurbsRequest);

                /** ListBlurbsRequest parent. */
                public parent: string;

                /** ListBlurbsRequest pageSize. */
                public pageSize: number;

                /** ListBlurbsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListBlurbsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListBlurbsRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListBlurbsRequest): google.showcase.v1beta1.ListBlurbsRequest;

                /**
                 * Encodes the specified ListBlurbsRequest message. Does not implicitly {@link google.showcase.v1beta1.ListBlurbsRequest.verify|verify} messages.
                 * @param message ListBlurbsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListBlurbsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListBlurbsRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListBlurbsRequest.verify|verify} messages.
                 * @param message ListBlurbsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListBlurbsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListBlurbsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListBlurbsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListBlurbsRequest;

                /**
                 * Decodes a ListBlurbsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListBlurbsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListBlurbsRequest;

                /**
                 * Verifies a ListBlurbsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListBlurbsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListBlurbsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListBlurbsRequest;

                /**
                 * Creates a plain object from a ListBlurbsRequest message. Also converts values to other types if specified.
                 * @param message ListBlurbsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListBlurbsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListBlurbsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListBlurbsResponse. */
            interface IListBlurbsResponse {

                /** ListBlurbsResponse blurbs */
                blurbs?: (google.showcase.v1beta1.IBlurb[]|null);

                /** ListBlurbsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListBlurbsResponse. */
            class ListBlurbsResponse implements IListBlurbsResponse {

                /**
                 * Constructs a new ListBlurbsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListBlurbsResponse);

                /** ListBlurbsResponse blurbs. */
                public blurbs: google.showcase.v1beta1.IBlurb[];

                /** ListBlurbsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListBlurbsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListBlurbsResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListBlurbsResponse): google.showcase.v1beta1.ListBlurbsResponse;

                /**
                 * Encodes the specified ListBlurbsResponse message. Does not implicitly {@link google.showcase.v1beta1.ListBlurbsResponse.verify|verify} messages.
                 * @param message ListBlurbsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListBlurbsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListBlurbsResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListBlurbsResponse.verify|verify} messages.
                 * @param message ListBlurbsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListBlurbsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListBlurbsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListBlurbsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListBlurbsResponse;

                /**
                 * Decodes a ListBlurbsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListBlurbsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListBlurbsResponse;

                /**
                 * Verifies a ListBlurbsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListBlurbsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListBlurbsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListBlurbsResponse;

                /**
                 * Creates a plain object from a ListBlurbsResponse message. Also converts values to other types if specified.
                 * @param message ListBlurbsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListBlurbsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListBlurbsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a SearchBlurbsRequest. */
            interface ISearchBlurbsRequest {

                /** SearchBlurbsRequest query */
                query?: (string|null);

                /** SearchBlurbsRequest parent */
                parent?: (string|null);

                /** SearchBlurbsRequest pageSize */
                pageSize?: (number|null);

                /** SearchBlurbsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a SearchBlurbsRequest. */
            class SearchBlurbsRequest implements ISearchBlurbsRequest {

                /**
                 * Constructs a new SearchBlurbsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ISearchBlurbsRequest);

                /** SearchBlurbsRequest query. */
                public query: string;

                /** SearchBlurbsRequest parent. */
                public parent: string;

                /** SearchBlurbsRequest pageSize. */
                public pageSize: number;

                /** SearchBlurbsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new SearchBlurbsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SearchBlurbsRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.ISearchBlurbsRequest): google.showcase.v1beta1.SearchBlurbsRequest;

                /**
                 * Encodes the specified SearchBlurbsRequest message. Does not implicitly {@link google.showcase.v1beta1.SearchBlurbsRequest.verify|verify} messages.
                 * @param message SearchBlurbsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ISearchBlurbsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SearchBlurbsRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.SearchBlurbsRequest.verify|verify} messages.
                 * @param message SearchBlurbsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ISearchBlurbsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SearchBlurbsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SearchBlurbsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.SearchBlurbsRequest;

                /**
                 * Decodes a SearchBlurbsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SearchBlurbsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.SearchBlurbsRequest;

                /**
                 * Verifies a SearchBlurbsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SearchBlurbsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SearchBlurbsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.SearchBlurbsRequest;

                /**
                 * Creates a plain object from a SearchBlurbsRequest message. Also converts values to other types if specified.
                 * @param message SearchBlurbsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.SearchBlurbsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SearchBlurbsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a SearchBlurbsMetadata. */
            interface ISearchBlurbsMetadata {

                /** SearchBlurbsMetadata retryInfo */
                retryInfo?: (google.rpc.IRetryInfo|null);
            }

            /** Represents a SearchBlurbsMetadata. */
            class SearchBlurbsMetadata implements ISearchBlurbsMetadata {

                /**
                 * Constructs a new SearchBlurbsMetadata.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ISearchBlurbsMetadata);

                /** SearchBlurbsMetadata retryInfo. */
                public retryInfo?: (google.rpc.IRetryInfo|null);

                /**
                 * Creates a new SearchBlurbsMetadata instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SearchBlurbsMetadata instance
                 */
                public static create(properties?: google.showcase.v1beta1.ISearchBlurbsMetadata): google.showcase.v1beta1.SearchBlurbsMetadata;

                /**
                 * Encodes the specified SearchBlurbsMetadata message. Does not implicitly {@link google.showcase.v1beta1.SearchBlurbsMetadata.verify|verify} messages.
                 * @param message SearchBlurbsMetadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ISearchBlurbsMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SearchBlurbsMetadata message, length delimited. Does not implicitly {@link google.showcase.v1beta1.SearchBlurbsMetadata.verify|verify} messages.
                 * @param message SearchBlurbsMetadata message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ISearchBlurbsMetadata, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SearchBlurbsMetadata message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SearchBlurbsMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.SearchBlurbsMetadata;

                /**
                 * Decodes a SearchBlurbsMetadata message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SearchBlurbsMetadata
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.SearchBlurbsMetadata;

                /**
                 * Verifies a SearchBlurbsMetadata message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SearchBlurbsMetadata message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SearchBlurbsMetadata
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.SearchBlurbsMetadata;

                /**
                 * Creates a plain object from a SearchBlurbsMetadata message. Also converts values to other types if specified.
                 * @param message SearchBlurbsMetadata
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.SearchBlurbsMetadata, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SearchBlurbsMetadata to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a SearchBlurbsResponse. */
            interface ISearchBlurbsResponse {

                /** SearchBlurbsResponse blurbs */
                blurbs?: (google.showcase.v1beta1.IBlurb[]|null);

                /** SearchBlurbsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a SearchBlurbsResponse. */
            class SearchBlurbsResponse implements ISearchBlurbsResponse {

                /**
                 * Constructs a new SearchBlurbsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ISearchBlurbsResponse);

                /** SearchBlurbsResponse blurbs. */
                public blurbs: google.showcase.v1beta1.IBlurb[];

                /** SearchBlurbsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new SearchBlurbsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SearchBlurbsResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.ISearchBlurbsResponse): google.showcase.v1beta1.SearchBlurbsResponse;

                /**
                 * Encodes the specified SearchBlurbsResponse message. Does not implicitly {@link google.showcase.v1beta1.SearchBlurbsResponse.verify|verify} messages.
                 * @param message SearchBlurbsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ISearchBlurbsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SearchBlurbsResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.SearchBlurbsResponse.verify|verify} messages.
                 * @param message SearchBlurbsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ISearchBlurbsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SearchBlurbsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SearchBlurbsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.SearchBlurbsResponse;

                /**
                 * Decodes a SearchBlurbsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SearchBlurbsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.SearchBlurbsResponse;

                /**
                 * Verifies a SearchBlurbsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SearchBlurbsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SearchBlurbsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.SearchBlurbsResponse;

                /**
                 * Creates a plain object from a SearchBlurbsResponse message. Also converts values to other types if specified.
                 * @param message SearchBlurbsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.SearchBlurbsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SearchBlurbsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a StreamBlurbsRequest. */
            interface IStreamBlurbsRequest {

                /** StreamBlurbsRequest name */
                name?: (string|null);

                /** StreamBlurbsRequest expireTime */
                expireTime?: (google.protobuf.ITimestamp|null);
            }

            /** Represents a StreamBlurbsRequest. */
            class StreamBlurbsRequest implements IStreamBlurbsRequest {

                /**
                 * Constructs a new StreamBlurbsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IStreamBlurbsRequest);

                /** StreamBlurbsRequest name. */
                public name: string;

                /** StreamBlurbsRequest expireTime. */
                public expireTime?: (google.protobuf.ITimestamp|null);

                /**
                 * Creates a new StreamBlurbsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StreamBlurbsRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IStreamBlurbsRequest): google.showcase.v1beta1.StreamBlurbsRequest;

                /**
                 * Encodes the specified StreamBlurbsRequest message. Does not implicitly {@link google.showcase.v1beta1.StreamBlurbsRequest.verify|verify} messages.
                 * @param message StreamBlurbsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IStreamBlurbsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StreamBlurbsRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.StreamBlurbsRequest.verify|verify} messages.
                 * @param message StreamBlurbsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IStreamBlurbsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StreamBlurbsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StreamBlurbsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.StreamBlurbsRequest;

                /**
                 * Decodes a StreamBlurbsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StreamBlurbsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.StreamBlurbsRequest;

                /**
                 * Verifies a StreamBlurbsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StreamBlurbsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StreamBlurbsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.StreamBlurbsRequest;

                /**
                 * Creates a plain object from a StreamBlurbsRequest message. Also converts values to other types if specified.
                 * @param message StreamBlurbsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.StreamBlurbsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StreamBlurbsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a StreamBlurbsResponse. */
            interface IStreamBlurbsResponse {

                /** StreamBlurbsResponse blurb */
                blurb?: (google.showcase.v1beta1.IBlurb|null);

                /** StreamBlurbsResponse action */
                action?: (google.showcase.v1beta1.StreamBlurbsResponse.Action|keyof typeof google.showcase.v1beta1.StreamBlurbsResponse.Action|null);
            }

            /** Represents a StreamBlurbsResponse. */
            class StreamBlurbsResponse implements IStreamBlurbsResponse {

                /**
                 * Constructs a new StreamBlurbsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IStreamBlurbsResponse);

                /** StreamBlurbsResponse blurb. */
                public blurb?: (google.showcase.v1beta1.IBlurb|null);

                /** StreamBlurbsResponse action. */
                public action: (google.showcase.v1beta1.StreamBlurbsResponse.Action|keyof typeof google.showcase.v1beta1.StreamBlurbsResponse.Action);

                /**
                 * Creates a new StreamBlurbsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns StreamBlurbsResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IStreamBlurbsResponse): google.showcase.v1beta1.StreamBlurbsResponse;

                /**
                 * Encodes the specified StreamBlurbsResponse message. Does not implicitly {@link google.showcase.v1beta1.StreamBlurbsResponse.verify|verify} messages.
                 * @param message StreamBlurbsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IStreamBlurbsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified StreamBlurbsResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.StreamBlurbsResponse.verify|verify} messages.
                 * @param message StreamBlurbsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IStreamBlurbsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a StreamBlurbsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns StreamBlurbsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.StreamBlurbsResponse;

                /**
                 * Decodes a StreamBlurbsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns StreamBlurbsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.StreamBlurbsResponse;

                /**
                 * Verifies a StreamBlurbsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a StreamBlurbsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns StreamBlurbsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.StreamBlurbsResponse;

                /**
                 * Creates a plain object from a StreamBlurbsResponse message. Also converts values to other types if specified.
                 * @param message StreamBlurbsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.StreamBlurbsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this StreamBlurbsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace StreamBlurbsResponse {

                /** Action enum. */
                enum Action {
                    ACTION_UNSPECIFIED = 0,
                    CREATE = 1,
                    UPDATE = 2,
                    DELETE = 3
                }
            }

            /** Properties of a SendBlurbsResponse. */
            interface ISendBlurbsResponse {

                /** SendBlurbsResponse names */
                names?: (string[]|null);
            }

            /** Represents a SendBlurbsResponse. */
            class SendBlurbsResponse implements ISendBlurbsResponse {

                /**
                 * Constructs a new SendBlurbsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ISendBlurbsResponse);

                /** SendBlurbsResponse names. */
                public names: string[];

                /**
                 * Creates a new SendBlurbsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns SendBlurbsResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.ISendBlurbsResponse): google.showcase.v1beta1.SendBlurbsResponse;

                /**
                 * Encodes the specified SendBlurbsResponse message. Does not implicitly {@link google.showcase.v1beta1.SendBlurbsResponse.verify|verify} messages.
                 * @param message SendBlurbsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ISendBlurbsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified SendBlurbsResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.SendBlurbsResponse.verify|verify} messages.
                 * @param message SendBlurbsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ISendBlurbsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a SendBlurbsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns SendBlurbsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.SendBlurbsResponse;

                /**
                 * Decodes a SendBlurbsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns SendBlurbsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.SendBlurbsResponse;

                /**
                 * Verifies a SendBlurbsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a SendBlurbsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns SendBlurbsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.SendBlurbsResponse;

                /**
                 * Creates a plain object from a SendBlurbsResponse message. Also converts values to other types if specified.
                 * @param message SendBlurbsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.SendBlurbsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this SendBlurbsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ConnectRequest. */
            interface IConnectRequest {

                /** ConnectRequest config */
                config?: (google.showcase.v1beta1.ConnectRequest.IConnectConfig|null);

                /** ConnectRequest blurb */
                blurb?: (google.showcase.v1beta1.IBlurb|null);
            }

            /** Represents a ConnectRequest. */
            class ConnectRequest implements IConnectRequest {

                /**
                 * Constructs a new ConnectRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IConnectRequest);

                /** ConnectRequest config. */
                public config?: (google.showcase.v1beta1.ConnectRequest.IConnectConfig|null);

                /** ConnectRequest blurb. */
                public blurb?: (google.showcase.v1beta1.IBlurb|null);

                /** ConnectRequest request. */
                public request?: ("config"|"blurb");

                /**
                 * Creates a new ConnectRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ConnectRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IConnectRequest): google.showcase.v1beta1.ConnectRequest;

                /**
                 * Encodes the specified ConnectRequest message. Does not implicitly {@link google.showcase.v1beta1.ConnectRequest.verify|verify} messages.
                 * @param message ConnectRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IConnectRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ConnectRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ConnectRequest.verify|verify} messages.
                 * @param message ConnectRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IConnectRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ConnectRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ConnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ConnectRequest;

                /**
                 * Decodes a ConnectRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ConnectRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ConnectRequest;

                /**
                 * Verifies a ConnectRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ConnectRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ConnectRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ConnectRequest;

                /**
                 * Creates a plain object from a ConnectRequest message. Also converts values to other types if specified.
                 * @param message ConnectRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ConnectRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ConnectRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace ConnectRequest {

                /** Properties of a ConnectConfig. */
                interface IConnectConfig {

                    /** ConnectConfig parent */
                    parent?: (string|null);
                }

                /** Represents a ConnectConfig. */
                class ConnectConfig implements IConnectConfig {

                    /**
                     * Constructs a new ConnectConfig.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: google.showcase.v1beta1.ConnectRequest.IConnectConfig);

                    /** ConnectConfig parent. */
                    public parent: string;

                    /**
                     * Creates a new ConnectConfig instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns ConnectConfig instance
                     */
                    public static create(properties?: google.showcase.v1beta1.ConnectRequest.IConnectConfig): google.showcase.v1beta1.ConnectRequest.ConnectConfig;

                    /**
                     * Encodes the specified ConnectConfig message. Does not implicitly {@link google.showcase.v1beta1.ConnectRequest.ConnectConfig.verify|verify} messages.
                     * @param message ConnectConfig message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: google.showcase.v1beta1.ConnectRequest.IConnectConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified ConnectConfig message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ConnectRequest.ConnectConfig.verify|verify} messages.
                     * @param message ConnectConfig message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: google.showcase.v1beta1.ConnectRequest.IConnectConfig, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a ConnectConfig message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns ConnectConfig
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ConnectRequest.ConnectConfig;

                    /**
                     * Decodes a ConnectConfig message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns ConnectConfig
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ConnectRequest.ConnectConfig;

                    /**
                     * Verifies a ConnectConfig message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a ConnectConfig message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns ConnectConfig
                     */
                    public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ConnectRequest.ConnectConfig;

                    /**
                     * Creates a plain object from a ConnectConfig message. Also converts values to other types if specified.
                     * @param message ConnectConfig
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: google.showcase.v1beta1.ConnectRequest.ConnectConfig, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this ConnectConfig to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }
            }

            /** Represents a Testing */
            class Testing extends $protobuf.rpc.Service {

                /**
                 * Constructs a new Testing service.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 */
                constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

                /**
                 * Creates new Testing service using the specified rpc implementation.
                 * @param rpcImpl RPC implementation
                 * @param [requestDelimited=false] Whether requests are length-delimited
                 * @param [responseDelimited=false] Whether responses are length-delimited
                 * @returns RPC service. Useful where requests and/or responses are streamed.
                 */
                public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Testing;

                /**
                 * Calls CreateSession.
                 * @param request CreateSessionRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Session
                 */
                public createSession(request: google.showcase.v1beta1.ICreateSessionRequest, callback: google.showcase.v1beta1.Testing.CreateSessionCallback): void;

                /**
                 * Calls CreateSession.
                 * @param request CreateSessionRequest message or plain object
                 * @returns Promise
                 */
                public createSession(request: google.showcase.v1beta1.ICreateSessionRequest): Promise<google.showcase.v1beta1.Session>;

                /**
                 * Calls GetSession.
                 * @param request GetSessionRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Session
                 */
                public getSession(request: google.showcase.v1beta1.IGetSessionRequest, callback: google.showcase.v1beta1.Testing.GetSessionCallback): void;

                /**
                 * Calls GetSession.
                 * @param request GetSessionRequest message or plain object
                 * @returns Promise
                 */
                public getSession(request: google.showcase.v1beta1.IGetSessionRequest): Promise<google.showcase.v1beta1.Session>;

                /**
                 * Calls ListSessions.
                 * @param request ListSessionsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListSessionsResponse
                 */
                public listSessions(request: google.showcase.v1beta1.IListSessionsRequest, callback: google.showcase.v1beta1.Testing.ListSessionsCallback): void;

                /**
                 * Calls ListSessions.
                 * @param request ListSessionsRequest message or plain object
                 * @returns Promise
                 */
                public listSessions(request: google.showcase.v1beta1.IListSessionsRequest): Promise<google.showcase.v1beta1.ListSessionsResponse>;

                /**
                 * Calls DeleteSession.
                 * @param request DeleteSessionRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteSession(request: google.showcase.v1beta1.IDeleteSessionRequest, callback: google.showcase.v1beta1.Testing.DeleteSessionCallback): void;

                /**
                 * Calls DeleteSession.
                 * @param request DeleteSessionRequest message or plain object
                 * @returns Promise
                 */
                public deleteSession(request: google.showcase.v1beta1.IDeleteSessionRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls ReportSession.
                 * @param request ReportSessionRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ReportSessionResponse
                 */
                public reportSession(request: google.showcase.v1beta1.IReportSessionRequest, callback: google.showcase.v1beta1.Testing.ReportSessionCallback): void;

                /**
                 * Calls ReportSession.
                 * @param request ReportSessionRequest message or plain object
                 * @returns Promise
                 */
                public reportSession(request: google.showcase.v1beta1.IReportSessionRequest): Promise<google.showcase.v1beta1.ReportSessionResponse>;

                /**
                 * Calls ListTests.
                 * @param request ListTestsRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and ListTestsResponse
                 */
                public listTests(request: google.showcase.v1beta1.IListTestsRequest, callback: google.showcase.v1beta1.Testing.ListTestsCallback): void;

                /**
                 * Calls ListTests.
                 * @param request ListTestsRequest message or plain object
                 * @returns Promise
                 */
                public listTests(request: google.showcase.v1beta1.IListTestsRequest): Promise<google.showcase.v1beta1.ListTestsResponse>;

                /**
                 * Calls DeleteTest.
                 * @param request DeleteTestRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and Empty
                 */
                public deleteTest(request: google.showcase.v1beta1.IDeleteTestRequest, callback: google.showcase.v1beta1.Testing.DeleteTestCallback): void;

                /**
                 * Calls DeleteTest.
                 * @param request DeleteTestRequest message or plain object
                 * @returns Promise
                 */
                public deleteTest(request: google.showcase.v1beta1.IDeleteTestRequest): Promise<google.protobuf.Empty>;

                /**
                 * Calls VerifyTest.
                 * @param request VerifyTestRequest message or plain object
                 * @param callback Node-style callback called with the error, if any, and VerifyTestResponse
                 */
                public verifyTest(request: google.showcase.v1beta1.IVerifyTestRequest, callback: google.showcase.v1beta1.Testing.VerifyTestCallback): void;

                /**
                 * Calls VerifyTest.
                 * @param request VerifyTestRequest message or plain object
                 * @returns Promise
                 */
                public verifyTest(request: google.showcase.v1beta1.IVerifyTestRequest): Promise<google.showcase.v1beta1.VerifyTestResponse>;
            }

            namespace Testing {

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Testing#createSession}.
                 * @param error Error, if any
                 * @param [response] Session
                 */
                type CreateSessionCallback = (error: (Error|null), response?: google.showcase.v1beta1.Session) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Testing#getSession}.
                 * @param error Error, if any
                 * @param [response] Session
                 */
                type GetSessionCallback = (error: (Error|null), response?: google.showcase.v1beta1.Session) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Testing#listSessions}.
                 * @param error Error, if any
                 * @param [response] ListSessionsResponse
                 */
                type ListSessionsCallback = (error: (Error|null), response?: google.showcase.v1beta1.ListSessionsResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Testing#deleteSession}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteSessionCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Testing#reportSession}.
                 * @param error Error, if any
                 * @param [response] ReportSessionResponse
                 */
                type ReportSessionCallback = (error: (Error|null), response?: google.showcase.v1beta1.ReportSessionResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Testing#listTests}.
                 * @param error Error, if any
                 * @param [response] ListTestsResponse
                 */
                type ListTestsCallback = (error: (Error|null), response?: google.showcase.v1beta1.ListTestsResponse) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Testing#deleteTest}.
                 * @param error Error, if any
                 * @param [response] Empty
                 */
                type DeleteTestCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

                /**
                 * Callback as used by {@link google.showcase.v1beta1.Testing#verifyTest}.
                 * @param error Error, if any
                 * @param [response] VerifyTestResponse
                 */
                type VerifyTestCallback = (error: (Error|null), response?: google.showcase.v1beta1.VerifyTestResponse) => void;
            }

            /** Properties of a Session. */
            interface ISession {

                /** Session name */
                name?: (string|null);

                /** Session version */
                version?: (google.showcase.v1beta1.Session.Version|keyof typeof google.showcase.v1beta1.Session.Version|null);
            }

            /** Represents a Session. */
            class Session implements ISession {

                /**
                 * Constructs a new Session.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ISession);

                /** Session name. */
                public name: string;

                /** Session version. */
                public version: (google.showcase.v1beta1.Session.Version|keyof typeof google.showcase.v1beta1.Session.Version);

                /**
                 * Creates a new Session instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Session instance
                 */
                public static create(properties?: google.showcase.v1beta1.ISession): google.showcase.v1beta1.Session;

                /**
                 * Encodes the specified Session message. Does not implicitly {@link google.showcase.v1beta1.Session.verify|verify} messages.
                 * @param message Session message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ISession, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Session message, length delimited. Does not implicitly {@link google.showcase.v1beta1.Session.verify|verify} messages.
                 * @param message Session message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ISession, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Session message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Session
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.Session;

                /**
                 * Decodes a Session message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Session
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.Session;

                /**
                 * Verifies a Session message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Session message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Session
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.Session;

                /**
                 * Creates a plain object from a Session message. Also converts values to other types if specified.
                 * @param message Session
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.Session, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Session to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Session {

                /** Version enum. */
                enum Version {
                    VERSION_UNSPECIFIED = 0,
                    V1_LATEST = 1,
                    V1_0 = 2
                }
            }

            /** Properties of a CreateSessionRequest. */
            interface ICreateSessionRequest {

                /** CreateSessionRequest session */
                session?: (google.showcase.v1beta1.ISession|null);
            }

            /** Represents a CreateSessionRequest. */
            class CreateSessionRequest implements ICreateSessionRequest {

                /**
                 * Constructs a new CreateSessionRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ICreateSessionRequest);

                /** CreateSessionRequest session. */
                public session?: (google.showcase.v1beta1.ISession|null);

                /**
                 * Creates a new CreateSessionRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns CreateSessionRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.ICreateSessionRequest): google.showcase.v1beta1.CreateSessionRequest;

                /**
                 * Encodes the specified CreateSessionRequest message. Does not implicitly {@link google.showcase.v1beta1.CreateSessionRequest.verify|verify} messages.
                 * @param message CreateSessionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ICreateSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified CreateSessionRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.CreateSessionRequest.verify|verify} messages.
                 * @param message CreateSessionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ICreateSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a CreateSessionRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns CreateSessionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.CreateSessionRequest;

                /**
                 * Decodes a CreateSessionRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns CreateSessionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.CreateSessionRequest;

                /**
                 * Verifies a CreateSessionRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a CreateSessionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns CreateSessionRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.CreateSessionRequest;

                /**
                 * Creates a plain object from a CreateSessionRequest message. Also converts values to other types if specified.
                 * @param message CreateSessionRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.CreateSessionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this CreateSessionRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a GetSessionRequest. */
            interface IGetSessionRequest {

                /** GetSessionRequest name */
                name?: (string|null);
            }

            /** Represents a GetSessionRequest. */
            class GetSessionRequest implements IGetSessionRequest {

                /**
                 * Constructs a new GetSessionRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IGetSessionRequest);

                /** GetSessionRequest name. */
                public name: string;

                /**
                 * Creates a new GetSessionRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns GetSessionRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IGetSessionRequest): google.showcase.v1beta1.GetSessionRequest;

                /**
                 * Encodes the specified GetSessionRequest message. Does not implicitly {@link google.showcase.v1beta1.GetSessionRequest.verify|verify} messages.
                 * @param message GetSessionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IGetSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified GetSessionRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.GetSessionRequest.verify|verify} messages.
                 * @param message GetSessionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IGetSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a GetSessionRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns GetSessionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.GetSessionRequest;

                /**
                 * Decodes a GetSessionRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns GetSessionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.GetSessionRequest;

                /**
                 * Verifies a GetSessionRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a GetSessionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns GetSessionRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.GetSessionRequest;

                /**
                 * Creates a plain object from a GetSessionRequest message. Also converts values to other types if specified.
                 * @param message GetSessionRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.GetSessionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this GetSessionRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListSessionsRequest. */
            interface IListSessionsRequest {

                /** ListSessionsRequest pageSize */
                pageSize?: (number|null);

                /** ListSessionsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListSessionsRequest. */
            class ListSessionsRequest implements IListSessionsRequest {

                /**
                 * Constructs a new ListSessionsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListSessionsRequest);

                /** ListSessionsRequest pageSize. */
                public pageSize: number;

                /** ListSessionsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListSessionsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListSessionsRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListSessionsRequest): google.showcase.v1beta1.ListSessionsRequest;

                /**
                 * Encodes the specified ListSessionsRequest message. Does not implicitly {@link google.showcase.v1beta1.ListSessionsRequest.verify|verify} messages.
                 * @param message ListSessionsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListSessionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListSessionsRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListSessionsRequest.verify|verify} messages.
                 * @param message ListSessionsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListSessionsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListSessionsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListSessionsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListSessionsRequest;

                /**
                 * Decodes a ListSessionsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListSessionsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListSessionsRequest;

                /**
                 * Verifies a ListSessionsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListSessionsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListSessionsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListSessionsRequest;

                /**
                 * Creates a plain object from a ListSessionsRequest message. Also converts values to other types if specified.
                 * @param message ListSessionsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListSessionsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListSessionsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListSessionsResponse. */
            interface IListSessionsResponse {

                /** ListSessionsResponse sessions */
                sessions?: (google.showcase.v1beta1.ISession[]|null);

                /** ListSessionsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListSessionsResponse. */
            class ListSessionsResponse implements IListSessionsResponse {

                /**
                 * Constructs a new ListSessionsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListSessionsResponse);

                /** ListSessionsResponse sessions. */
                public sessions: google.showcase.v1beta1.ISession[];

                /** ListSessionsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListSessionsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListSessionsResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListSessionsResponse): google.showcase.v1beta1.ListSessionsResponse;

                /**
                 * Encodes the specified ListSessionsResponse message. Does not implicitly {@link google.showcase.v1beta1.ListSessionsResponse.verify|verify} messages.
                 * @param message ListSessionsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListSessionsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListSessionsResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListSessionsResponse.verify|verify} messages.
                 * @param message ListSessionsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListSessionsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListSessionsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListSessionsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListSessionsResponse;

                /**
                 * Decodes a ListSessionsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListSessionsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListSessionsResponse;

                /**
                 * Verifies a ListSessionsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListSessionsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListSessionsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListSessionsResponse;

                /**
                 * Creates a plain object from a ListSessionsResponse message. Also converts values to other types if specified.
                 * @param message ListSessionsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListSessionsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListSessionsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteSessionRequest. */
            interface IDeleteSessionRequest {

                /** DeleteSessionRequest name */
                name?: (string|null);
            }

            /** Represents a DeleteSessionRequest. */
            class DeleteSessionRequest implements IDeleteSessionRequest {

                /**
                 * Constructs a new DeleteSessionRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IDeleteSessionRequest);

                /** DeleteSessionRequest name. */
                public name: string;

                /**
                 * Creates a new DeleteSessionRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteSessionRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IDeleteSessionRequest): google.showcase.v1beta1.DeleteSessionRequest;

                /**
                 * Encodes the specified DeleteSessionRequest message. Does not implicitly {@link google.showcase.v1beta1.DeleteSessionRequest.verify|verify} messages.
                 * @param message DeleteSessionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IDeleteSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteSessionRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.DeleteSessionRequest.verify|verify} messages.
                 * @param message DeleteSessionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IDeleteSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteSessionRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteSessionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.DeleteSessionRequest;

                /**
                 * Decodes a DeleteSessionRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteSessionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.DeleteSessionRequest;

                /**
                 * Verifies a DeleteSessionRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteSessionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteSessionRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.DeleteSessionRequest;

                /**
                 * Creates a plain object from a DeleteSessionRequest message. Also converts values to other types if specified.
                 * @param message DeleteSessionRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.DeleteSessionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteSessionRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ReportSessionRequest. */
            interface IReportSessionRequest {

                /** ReportSessionRequest name */
                name?: (string|null);
            }

            /** Represents a ReportSessionRequest. */
            class ReportSessionRequest implements IReportSessionRequest {

                /**
                 * Constructs a new ReportSessionRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IReportSessionRequest);

                /** ReportSessionRequest name. */
                public name: string;

                /**
                 * Creates a new ReportSessionRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ReportSessionRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IReportSessionRequest): google.showcase.v1beta1.ReportSessionRequest;

                /**
                 * Encodes the specified ReportSessionRequest message. Does not implicitly {@link google.showcase.v1beta1.ReportSessionRequest.verify|verify} messages.
                 * @param message ReportSessionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IReportSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReportSessionRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ReportSessionRequest.verify|verify} messages.
                 * @param message ReportSessionRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IReportSessionRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReportSessionRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ReportSessionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ReportSessionRequest;

                /**
                 * Decodes a ReportSessionRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ReportSessionRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ReportSessionRequest;

                /**
                 * Verifies a ReportSessionRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ReportSessionRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ReportSessionRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ReportSessionRequest;

                /**
                 * Creates a plain object from a ReportSessionRequest message. Also converts values to other types if specified.
                 * @param message ReportSessionRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ReportSessionRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReportSessionRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ReportSessionResponse. */
            interface IReportSessionResponse {

                /** ReportSessionResponse result */
                result?: (google.showcase.v1beta1.ReportSessionResponse.Result|keyof typeof google.showcase.v1beta1.ReportSessionResponse.Result|null);

                /** ReportSessionResponse testRuns */
                testRuns?: (google.showcase.v1beta1.ITestRun[]|null);
            }

            /** Represents a ReportSessionResponse. */
            class ReportSessionResponse implements IReportSessionResponse {

                /**
                 * Constructs a new ReportSessionResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IReportSessionResponse);

                /** ReportSessionResponse result. */
                public result: (google.showcase.v1beta1.ReportSessionResponse.Result|keyof typeof google.showcase.v1beta1.ReportSessionResponse.Result);

                /** ReportSessionResponse testRuns. */
                public testRuns: google.showcase.v1beta1.ITestRun[];

                /**
                 * Creates a new ReportSessionResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ReportSessionResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IReportSessionResponse): google.showcase.v1beta1.ReportSessionResponse;

                /**
                 * Encodes the specified ReportSessionResponse message. Does not implicitly {@link google.showcase.v1beta1.ReportSessionResponse.verify|verify} messages.
                 * @param message ReportSessionResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IReportSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReportSessionResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ReportSessionResponse.verify|verify} messages.
                 * @param message ReportSessionResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IReportSessionResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReportSessionResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ReportSessionResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ReportSessionResponse;

                /**
                 * Decodes a ReportSessionResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ReportSessionResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ReportSessionResponse;

                /**
                 * Verifies a ReportSessionResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ReportSessionResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ReportSessionResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ReportSessionResponse;

                /**
                 * Creates a plain object from a ReportSessionResponse message. Also converts values to other types if specified.
                 * @param message ReportSessionResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ReportSessionResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReportSessionResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace ReportSessionResponse {

                /** Result enum. */
                enum Result {
                    RESULT_UNSPECIFIED = 0,
                    PASSED = 1,
                    FAILED = 2,
                    INCOMPLETE = 3
                }
            }

            /** Properties of a Test. */
            interface ITest {

                /** Test name */
                name?: (string|null);

                /** Test expectationLevel */
                expectationLevel?: (google.showcase.v1beta1.Test.ExpectationLevel|keyof typeof google.showcase.v1beta1.Test.ExpectationLevel|null);

                /** Test description */
                description?: (string|null);

                /** Test blueprints */
                blueprints?: (google.showcase.v1beta1.Test.IBlueprint[]|null);
            }

            /** Represents a Test. */
            class Test implements ITest {

                /**
                 * Constructs a new Test.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ITest);

                /** Test name. */
                public name: string;

                /** Test expectationLevel. */
                public expectationLevel: (google.showcase.v1beta1.Test.ExpectationLevel|keyof typeof google.showcase.v1beta1.Test.ExpectationLevel);

                /** Test description. */
                public description: string;

                /** Test blueprints. */
                public blueprints: google.showcase.v1beta1.Test.IBlueprint[];

                /**
                 * Creates a new Test instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Test instance
                 */
                public static create(properties?: google.showcase.v1beta1.ITest): google.showcase.v1beta1.Test;

                /**
                 * Encodes the specified Test message. Does not implicitly {@link google.showcase.v1beta1.Test.verify|verify} messages.
                 * @param message Test message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ITest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Test message, length delimited. Does not implicitly {@link google.showcase.v1beta1.Test.verify|verify} messages.
                 * @param message Test message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ITest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Test message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Test
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.Test;

                /**
                 * Decodes a Test message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Test
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.Test;

                /**
                 * Verifies a Test message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Test message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Test
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.Test;

                /**
                 * Creates a plain object from a Test message. Also converts values to other types if specified.
                 * @param message Test
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.Test, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Test to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Test {

                /** ExpectationLevel enum. */
                enum ExpectationLevel {
                    EXPECTATION_LEVEL_UNSPECIFIED = 0,
                    REQUIRED = 1,
                    RECOMMENDED = 2,
                    OPTIONAL = 3
                }

                /** Properties of a Blueprint. */
                interface IBlueprint {

                    /** Blueprint name */
                    name?: (string|null);

                    /** Blueprint description */
                    description?: (string|null);

                    /** Blueprint request */
                    request?: (google.showcase.v1beta1.Test.Blueprint.IInvocation|null);

                    /** Blueprint additionalRequests */
                    additionalRequests?: (google.showcase.v1beta1.Test.Blueprint.IInvocation[]|null);
                }

                /** Represents a Blueprint. */
                class Blueprint implements IBlueprint {

                    /**
                     * Constructs a new Blueprint.
                     * @param [properties] Properties to set
                     */
                    constructor(properties?: google.showcase.v1beta1.Test.IBlueprint);

                    /** Blueprint name. */
                    public name: string;

                    /** Blueprint description. */
                    public description: string;

                    /** Blueprint request. */
                    public request?: (google.showcase.v1beta1.Test.Blueprint.IInvocation|null);

                    /** Blueprint additionalRequests. */
                    public additionalRequests: google.showcase.v1beta1.Test.Blueprint.IInvocation[];

                    /**
                     * Creates a new Blueprint instance using the specified properties.
                     * @param [properties] Properties to set
                     * @returns Blueprint instance
                     */
                    public static create(properties?: google.showcase.v1beta1.Test.IBlueprint): google.showcase.v1beta1.Test.Blueprint;

                    /**
                     * Encodes the specified Blueprint message. Does not implicitly {@link google.showcase.v1beta1.Test.Blueprint.verify|verify} messages.
                     * @param message Blueprint message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encode(message: google.showcase.v1beta1.Test.IBlueprint, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Encodes the specified Blueprint message, length delimited. Does not implicitly {@link google.showcase.v1beta1.Test.Blueprint.verify|verify} messages.
                     * @param message Blueprint message or plain object to encode
                     * @param [writer] Writer to encode to
                     * @returns Writer
                     */
                    public static encodeDelimited(message: google.showcase.v1beta1.Test.IBlueprint, writer?: $protobuf.Writer): $protobuf.Writer;

                    /**
                     * Decodes a Blueprint message from the specified reader or buffer.
                     * @param reader Reader or buffer to decode from
                     * @param [length] Message length if known beforehand
                     * @returns Blueprint
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.Test.Blueprint;

                    /**
                     * Decodes a Blueprint message from the specified reader or buffer, length delimited.
                     * @param reader Reader or buffer to decode from
                     * @returns Blueprint
                     * @throws {Error} If the payload is not a reader or valid buffer
                     * @throws {$protobuf.util.ProtocolError} If required fields are missing
                     */
                    public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.Test.Blueprint;

                    /**
                     * Verifies a Blueprint message.
                     * @param message Plain object to verify
                     * @returns `null` if valid, otherwise the reason why it is not
                     */
                    public static verify(message: { [k: string]: any }): (string|null);

                    /**
                     * Creates a Blueprint message from a plain object. Also converts values to their respective internal types.
                     * @param object Plain object
                     * @returns Blueprint
                     */
                    public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.Test.Blueprint;

                    /**
                     * Creates a plain object from a Blueprint message. Also converts values to other types if specified.
                     * @param message Blueprint
                     * @param [options] Conversion options
                     * @returns Plain object
                     */
                    public static toObject(message: google.showcase.v1beta1.Test.Blueprint, options?: $protobuf.IConversionOptions): { [k: string]: any };

                    /**
                     * Converts this Blueprint to JSON.
                     * @returns JSON object
                     */
                    public toJSON(): { [k: string]: any };
                }

                namespace Blueprint {

                    /** Properties of an Invocation. */
                    interface IInvocation {

                        /** Invocation method */
                        method?: (string|null);

                        /** Invocation serializedRequest */
                        serializedRequest?: (Uint8Array|string|null);
                    }

                    /** Represents an Invocation. */
                    class Invocation implements IInvocation {

                        /**
                         * Constructs a new Invocation.
                         * @param [properties] Properties to set
                         */
                        constructor(properties?: google.showcase.v1beta1.Test.Blueprint.IInvocation);

                        /** Invocation method. */
                        public method: string;

                        /** Invocation serializedRequest. */
                        public serializedRequest: (Uint8Array|string);

                        /**
                         * Creates a new Invocation instance using the specified properties.
                         * @param [properties] Properties to set
                         * @returns Invocation instance
                         */
                        public static create(properties?: google.showcase.v1beta1.Test.Blueprint.IInvocation): google.showcase.v1beta1.Test.Blueprint.Invocation;

                        /**
                         * Encodes the specified Invocation message. Does not implicitly {@link google.showcase.v1beta1.Test.Blueprint.Invocation.verify|verify} messages.
                         * @param message Invocation message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encode(message: google.showcase.v1beta1.Test.Blueprint.IInvocation, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Encodes the specified Invocation message, length delimited. Does not implicitly {@link google.showcase.v1beta1.Test.Blueprint.Invocation.verify|verify} messages.
                         * @param message Invocation message or plain object to encode
                         * @param [writer] Writer to encode to
                         * @returns Writer
                         */
                        public static encodeDelimited(message: google.showcase.v1beta1.Test.Blueprint.IInvocation, writer?: $protobuf.Writer): $protobuf.Writer;

                        /**
                         * Decodes an Invocation message from the specified reader or buffer.
                         * @param reader Reader or buffer to decode from
                         * @param [length] Message length if known beforehand
                         * @returns Invocation
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.Test.Blueprint.Invocation;

                        /**
                         * Decodes an Invocation message from the specified reader or buffer, length delimited.
                         * @param reader Reader or buffer to decode from
                         * @returns Invocation
                         * @throws {Error} If the payload is not a reader or valid buffer
                         * @throws {$protobuf.util.ProtocolError} If required fields are missing
                         */
                        public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.Test.Blueprint.Invocation;

                        /**
                         * Verifies an Invocation message.
                         * @param message Plain object to verify
                         * @returns `null` if valid, otherwise the reason why it is not
                         */
                        public static verify(message: { [k: string]: any }): (string|null);

                        /**
                         * Creates an Invocation message from a plain object. Also converts values to their respective internal types.
                         * @param object Plain object
                         * @returns Invocation
                         */
                        public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.Test.Blueprint.Invocation;

                        /**
                         * Creates a plain object from an Invocation message. Also converts values to other types if specified.
                         * @param message Invocation
                         * @param [options] Conversion options
                         * @returns Plain object
                         */
                        public static toObject(message: google.showcase.v1beta1.Test.Blueprint.Invocation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                        /**
                         * Converts this Invocation to JSON.
                         * @returns JSON object
                         */
                        public toJSON(): { [k: string]: any };
                    }
                }
            }

            /** Properties of an Issue. */
            interface IIssue {

                /** Issue type */
                type?: (google.showcase.v1beta1.Issue.Type|keyof typeof google.showcase.v1beta1.Issue.Type|null);

                /** Issue severity */
                severity?: (google.showcase.v1beta1.Issue.Severity|keyof typeof google.showcase.v1beta1.Issue.Severity|null);

                /** Issue description */
                description?: (string|null);
            }

            /** Represents an Issue. */
            class Issue implements IIssue {

                /**
                 * Constructs a new Issue.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IIssue);

                /** Issue type. */
                public type: (google.showcase.v1beta1.Issue.Type|keyof typeof google.showcase.v1beta1.Issue.Type);

                /** Issue severity. */
                public severity: (google.showcase.v1beta1.Issue.Severity|keyof typeof google.showcase.v1beta1.Issue.Severity);

                /** Issue description. */
                public description: string;

                /**
                 * Creates a new Issue instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Issue instance
                 */
                public static create(properties?: google.showcase.v1beta1.IIssue): google.showcase.v1beta1.Issue;

                /**
                 * Encodes the specified Issue message. Does not implicitly {@link google.showcase.v1beta1.Issue.verify|verify} messages.
                 * @param message Issue message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IIssue, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Issue message, length delimited. Does not implicitly {@link google.showcase.v1beta1.Issue.verify|verify} messages.
                 * @param message Issue message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IIssue, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Issue message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Issue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.Issue;

                /**
                 * Decodes an Issue message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Issue
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.Issue;

                /**
                 * Verifies an Issue message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Issue message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Issue
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.Issue;

                /**
                 * Creates a plain object from an Issue message. Also converts values to other types if specified.
                 * @param message Issue
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.Issue, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Issue to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            namespace Issue {

                /** Type enum. */
                enum Type {
                    TYPE_UNSPECIFIED = 0,
                    SKIPPED = 1,
                    PENDING = 2,
                    INCORRECT_CONFIRMATION = 3
                }

                /** Severity enum. */
                enum Severity {
                    SEVERITY_UNSPECIFIED = 0,
                    ERROR = 1,
                    WARNING = 2
                }
            }

            /** Properties of a ListTestsRequest. */
            interface IListTestsRequest {

                /** ListTestsRequest parent */
                parent?: (string|null);

                /** ListTestsRequest pageSize */
                pageSize?: (number|null);

                /** ListTestsRequest pageToken */
                pageToken?: (string|null);
            }

            /** Represents a ListTestsRequest. */
            class ListTestsRequest implements IListTestsRequest {

                /**
                 * Constructs a new ListTestsRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListTestsRequest);

                /** ListTestsRequest parent. */
                public parent: string;

                /** ListTestsRequest pageSize. */
                public pageSize: number;

                /** ListTestsRequest pageToken. */
                public pageToken: string;

                /**
                 * Creates a new ListTestsRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListTestsRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListTestsRequest): google.showcase.v1beta1.ListTestsRequest;

                /**
                 * Encodes the specified ListTestsRequest message. Does not implicitly {@link google.showcase.v1beta1.ListTestsRequest.verify|verify} messages.
                 * @param message ListTestsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListTestsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListTestsRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListTestsRequest.verify|verify} messages.
                 * @param message ListTestsRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListTestsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListTestsRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListTestsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListTestsRequest;

                /**
                 * Decodes a ListTestsRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListTestsRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListTestsRequest;

                /**
                 * Verifies a ListTestsRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListTestsRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListTestsRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListTestsRequest;

                /**
                 * Creates a plain object from a ListTestsRequest message. Also converts values to other types if specified.
                 * @param message ListTestsRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListTestsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListTestsRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ListTestsResponse. */
            interface IListTestsResponse {

                /** ListTestsResponse tests */
                tests?: (google.showcase.v1beta1.ITest[]|null);

                /** ListTestsResponse nextPageToken */
                nextPageToken?: (string|null);
            }

            /** Represents a ListTestsResponse. */
            class ListTestsResponse implements IListTestsResponse {

                /**
                 * Constructs a new ListTestsResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IListTestsResponse);

                /** ListTestsResponse tests. */
                public tests: google.showcase.v1beta1.ITest[];

                /** ListTestsResponse nextPageToken. */
                public nextPageToken: string;

                /**
                 * Creates a new ListTestsResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ListTestsResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IListTestsResponse): google.showcase.v1beta1.ListTestsResponse;

                /**
                 * Encodes the specified ListTestsResponse message. Does not implicitly {@link google.showcase.v1beta1.ListTestsResponse.verify|verify} messages.
                 * @param message ListTestsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IListTestsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ListTestsResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.ListTestsResponse.verify|verify} messages.
                 * @param message ListTestsResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IListTestsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ListTestsResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ListTestsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.ListTestsResponse;

                /**
                 * Decodes a ListTestsResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ListTestsResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.ListTestsResponse;

                /**
                 * Verifies a ListTestsResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ListTestsResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ListTestsResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.ListTestsResponse;

                /**
                 * Creates a plain object from a ListTestsResponse message. Also converts values to other types if specified.
                 * @param message ListTestsResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.ListTestsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ListTestsResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a TestRun. */
            interface ITestRun {

                /** TestRun test */
                test?: (string|null);

                /** TestRun issue */
                issue?: (google.showcase.v1beta1.IIssue|null);
            }

            /** Represents a TestRun. */
            class TestRun implements ITestRun {

                /**
                 * Constructs a new TestRun.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.ITestRun);

                /** TestRun test. */
                public test: string;

                /** TestRun issue. */
                public issue?: (google.showcase.v1beta1.IIssue|null);

                /**
                 * Creates a new TestRun instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns TestRun instance
                 */
                public static create(properties?: google.showcase.v1beta1.ITestRun): google.showcase.v1beta1.TestRun;

                /**
                 * Encodes the specified TestRun message. Does not implicitly {@link google.showcase.v1beta1.TestRun.verify|verify} messages.
                 * @param message TestRun message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.ITestRun, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified TestRun message, length delimited. Does not implicitly {@link google.showcase.v1beta1.TestRun.verify|verify} messages.
                 * @param message TestRun message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.ITestRun, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a TestRun message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns TestRun
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.TestRun;

                /**
                 * Decodes a TestRun message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns TestRun
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.TestRun;

                /**
                 * Verifies a TestRun message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a TestRun message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns TestRun
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.TestRun;

                /**
                 * Creates a plain object from a TestRun message. Also converts values to other types if specified.
                 * @param message TestRun
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.TestRun, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this TestRun to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a DeleteTestRequest. */
            interface IDeleteTestRequest {

                /** DeleteTestRequest name */
                name?: (string|null);
            }

            /** Represents a DeleteTestRequest. */
            class DeleteTestRequest implements IDeleteTestRequest {

                /**
                 * Constructs a new DeleteTestRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IDeleteTestRequest);

                /** DeleteTestRequest name. */
                public name: string;

                /**
                 * Creates a new DeleteTestRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns DeleteTestRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IDeleteTestRequest): google.showcase.v1beta1.DeleteTestRequest;

                /**
                 * Encodes the specified DeleteTestRequest message. Does not implicitly {@link google.showcase.v1beta1.DeleteTestRequest.verify|verify} messages.
                 * @param message DeleteTestRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IDeleteTestRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified DeleteTestRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.DeleteTestRequest.verify|verify} messages.
                 * @param message DeleteTestRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IDeleteTestRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a DeleteTestRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns DeleteTestRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.DeleteTestRequest;

                /**
                 * Decodes a DeleteTestRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns DeleteTestRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.DeleteTestRequest;

                /**
                 * Verifies a DeleteTestRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a DeleteTestRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns DeleteTestRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.DeleteTestRequest;

                /**
                 * Creates a plain object from a DeleteTestRequest message. Also converts values to other types if specified.
                 * @param message DeleteTestRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.DeleteTestRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this DeleteTestRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a VerifyTestRequest. */
            interface IVerifyTestRequest {

                /** VerifyTestRequest name */
                name?: (string|null);

                /** VerifyTestRequest answer */
                answer?: (Uint8Array|string|null);

                /** VerifyTestRequest answers */
                answers?: (Uint8Array[]|null);
            }

            /** Represents a VerifyTestRequest. */
            class VerifyTestRequest implements IVerifyTestRequest {

                /**
                 * Constructs a new VerifyTestRequest.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IVerifyTestRequest);

                /** VerifyTestRequest name. */
                public name: string;

                /** VerifyTestRequest answer. */
                public answer: (Uint8Array|string);

                /** VerifyTestRequest answers. */
                public answers: Uint8Array[];

                /**
                 * Creates a new VerifyTestRequest instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns VerifyTestRequest instance
                 */
                public static create(properties?: google.showcase.v1beta1.IVerifyTestRequest): google.showcase.v1beta1.VerifyTestRequest;

                /**
                 * Encodes the specified VerifyTestRequest message. Does not implicitly {@link google.showcase.v1beta1.VerifyTestRequest.verify|verify} messages.
                 * @param message VerifyTestRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IVerifyTestRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified VerifyTestRequest message, length delimited. Does not implicitly {@link google.showcase.v1beta1.VerifyTestRequest.verify|verify} messages.
                 * @param message VerifyTestRequest message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IVerifyTestRequest, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a VerifyTestRequest message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns VerifyTestRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.VerifyTestRequest;

                /**
                 * Decodes a VerifyTestRequest message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns VerifyTestRequest
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.VerifyTestRequest;

                /**
                 * Verifies a VerifyTestRequest message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a VerifyTestRequest message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns VerifyTestRequest
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.VerifyTestRequest;

                /**
                 * Creates a plain object from a VerifyTestRequest message. Also converts values to other types if specified.
                 * @param message VerifyTestRequest
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.VerifyTestRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this VerifyTestRequest to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a VerifyTestResponse. */
            interface IVerifyTestResponse {

                /** VerifyTestResponse issue */
                issue?: (google.showcase.v1beta1.IIssue|null);
            }

            /** Represents a VerifyTestResponse. */
            class VerifyTestResponse implements IVerifyTestResponse {

                /**
                 * Constructs a new VerifyTestResponse.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.showcase.v1beta1.IVerifyTestResponse);

                /** VerifyTestResponse issue. */
                public issue?: (google.showcase.v1beta1.IIssue|null);

                /**
                 * Creates a new VerifyTestResponse instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns VerifyTestResponse instance
                 */
                public static create(properties?: google.showcase.v1beta1.IVerifyTestResponse): google.showcase.v1beta1.VerifyTestResponse;

                /**
                 * Encodes the specified VerifyTestResponse message. Does not implicitly {@link google.showcase.v1beta1.VerifyTestResponse.verify|verify} messages.
                 * @param message VerifyTestResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.showcase.v1beta1.IVerifyTestResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified VerifyTestResponse message, length delimited. Does not implicitly {@link google.showcase.v1beta1.VerifyTestResponse.verify|verify} messages.
                 * @param message VerifyTestResponse message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.showcase.v1beta1.IVerifyTestResponse, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a VerifyTestResponse message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns VerifyTestResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.showcase.v1beta1.VerifyTestResponse;

                /**
                 * Decodes a VerifyTestResponse message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns VerifyTestResponse
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.showcase.v1beta1.VerifyTestResponse;

                /**
                 * Verifies a VerifyTestResponse message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a VerifyTestResponse message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns VerifyTestResponse
                 */
                public static fromObject(object: { [k: string]: any }): google.showcase.v1beta1.VerifyTestResponse;

                /**
                 * Creates a plain object from a VerifyTestResponse message. Also converts values to other types if specified.
                 * @param message VerifyTestResponse
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.showcase.v1beta1.VerifyTestResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this VerifyTestResponse to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }
    }

    /** Namespace api. */
    namespace api {

        /** Properties of a Http. */
        interface IHttp {

            /** Http rules */
            rules?: (google.api.IHttpRule[]|null);

            /** Http fullyDecodeReservedExpansion */
            fullyDecodeReservedExpansion?: (boolean|null);
        }

        /** Represents a Http. */
        class Http implements IHttp {

            /**
             * Constructs a new Http.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.IHttp);

            /** Http rules. */
            public rules: google.api.IHttpRule[];

            /** Http fullyDecodeReservedExpansion. */
            public fullyDecodeReservedExpansion: boolean;

            /**
             * Creates a new Http instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Http instance
             */
            public static create(properties?: google.api.IHttp): google.api.Http;

            /**
             * Encodes the specified Http message. Does not implicitly {@link google.api.Http.verify|verify} messages.
             * @param message Http message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.IHttp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Http message, length delimited. Does not implicitly {@link google.api.Http.verify|verify} messages.
             * @param message Http message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.IHttp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Http message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Http
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.Http;

            /**
             * Decodes a Http message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Http
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.Http;

            /**
             * Verifies a Http message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Http message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Http
             */
            public static fromObject(object: { [k: string]: any }): google.api.Http;

            /**
             * Creates a plain object from a Http message. Also converts values to other types if specified.
             * @param message Http
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.Http, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Http to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a HttpRule. */
        interface IHttpRule {

            /** HttpRule selector */
            selector?: (string|null);

            /** HttpRule get */
            get?: (string|null);

            /** HttpRule put */
            put?: (string|null);

            /** HttpRule post */
            post?: (string|null);

            /** HttpRule delete */
            "delete"?: (string|null);

            /** HttpRule patch */
            patch?: (string|null);

            /** HttpRule custom */
            custom?: (google.api.ICustomHttpPattern|null);

            /** HttpRule body */
            body?: (string|null);

            /** HttpRule responseBody */
            responseBody?: (string|null);

            /** HttpRule additionalBindings */
            additionalBindings?: (google.api.IHttpRule[]|null);
        }

        /** Represents a HttpRule. */
        class HttpRule implements IHttpRule {

            /**
             * Constructs a new HttpRule.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.IHttpRule);

            /** HttpRule selector. */
            public selector: string;

            /** HttpRule get. */
            public get?: (string|null);

            /** HttpRule put. */
            public put?: (string|null);

            /** HttpRule post. */
            public post?: (string|null);

            /** HttpRule delete. */
            public delete?: (string|null);

            /** HttpRule patch. */
            public patch?: (string|null);

            /** HttpRule custom. */
            public custom?: (google.api.ICustomHttpPattern|null);

            /** HttpRule body. */
            public body: string;

            /** HttpRule responseBody. */
            public responseBody: string;

            /** HttpRule additionalBindings. */
            public additionalBindings: google.api.IHttpRule[];

            /** HttpRule pattern. */
            public pattern?: ("get"|"put"|"post"|"delete"|"patch"|"custom");

            /**
             * Creates a new HttpRule instance using the specified properties.
             * @param [properties] Properties to set
             * @returns HttpRule instance
             */
            public static create(properties?: google.api.IHttpRule): google.api.HttpRule;

            /**
             * Encodes the specified HttpRule message. Does not implicitly {@link google.api.HttpRule.verify|verify} messages.
             * @param message HttpRule message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.IHttpRule, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified HttpRule message, length delimited. Does not implicitly {@link google.api.HttpRule.verify|verify} messages.
             * @param message HttpRule message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.IHttpRule, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a HttpRule message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns HttpRule
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.HttpRule;

            /**
             * Decodes a HttpRule message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns HttpRule
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.HttpRule;

            /**
             * Verifies a HttpRule message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a HttpRule message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns HttpRule
             */
            public static fromObject(object: { [k: string]: any }): google.api.HttpRule;

            /**
             * Creates a plain object from a HttpRule message. Also converts values to other types if specified.
             * @param message HttpRule
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.HttpRule, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this HttpRule to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a CustomHttpPattern. */
        interface ICustomHttpPattern {

            /** CustomHttpPattern kind */
            kind?: (string|null);

            /** CustomHttpPattern path */
            path?: (string|null);
        }

        /** Represents a CustomHttpPattern. */
        class CustomHttpPattern implements ICustomHttpPattern {

            /**
             * Constructs a new CustomHttpPattern.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.ICustomHttpPattern);

            /** CustomHttpPattern kind. */
            public kind: string;

            /** CustomHttpPattern path. */
            public path: string;

            /**
             * Creates a new CustomHttpPattern instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CustomHttpPattern instance
             */
            public static create(properties?: google.api.ICustomHttpPattern): google.api.CustomHttpPattern;

            /**
             * Encodes the specified CustomHttpPattern message. Does not implicitly {@link google.api.CustomHttpPattern.verify|verify} messages.
             * @param message CustomHttpPattern message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.ICustomHttpPattern, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CustomHttpPattern message, length delimited. Does not implicitly {@link google.api.CustomHttpPattern.verify|verify} messages.
             * @param message CustomHttpPattern message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.ICustomHttpPattern, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CustomHttpPattern message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CustomHttpPattern
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.CustomHttpPattern;

            /**
             * Decodes a CustomHttpPattern message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CustomHttpPattern
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.CustomHttpPattern;

            /**
             * Verifies a CustomHttpPattern message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CustomHttpPattern message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CustomHttpPattern
             */
            public static fromObject(object: { [k: string]: any }): google.api.CustomHttpPattern;

            /**
             * Creates a plain object from a CustomHttpPattern message. Also converts values to other types if specified.
             * @param message CustomHttpPattern
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.CustomHttpPattern, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CustomHttpPattern to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** FieldBehavior enum. */
        enum FieldBehavior {
            FIELD_BEHAVIOR_UNSPECIFIED = 0,
            OPTIONAL = 1,
            REQUIRED = 2,
            OUTPUT_ONLY = 3,
            INPUT_ONLY = 4,
            IMMUTABLE = 5,
            UNORDERED_LIST = 6,
            NON_EMPTY_DEFAULT = 7
        }

        /** Properties of a ResourceDescriptor. */
        interface IResourceDescriptor {

            /** ResourceDescriptor type */
            type?: (string|null);

            /** ResourceDescriptor pattern */
            pattern?: (string[]|null);

            /** ResourceDescriptor nameField */
            nameField?: (string|null);

            /** ResourceDescriptor history */
            history?: (google.api.ResourceDescriptor.History|keyof typeof google.api.ResourceDescriptor.History|null);

            /** ResourceDescriptor plural */
            plural?: (string|null);

            /** ResourceDescriptor singular */
            singular?: (string|null);

            /** ResourceDescriptor style */
            style?: (google.api.ResourceDescriptor.Style[]|null);
        }

        /** Represents a ResourceDescriptor. */
        class ResourceDescriptor implements IResourceDescriptor {

            /**
             * Constructs a new ResourceDescriptor.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.IResourceDescriptor);

            /** ResourceDescriptor type. */
            public type: string;

            /** ResourceDescriptor pattern. */
            public pattern: string[];

            /** ResourceDescriptor nameField. */
            public nameField: string;

            /** ResourceDescriptor history. */
            public history: (google.api.ResourceDescriptor.History|keyof typeof google.api.ResourceDescriptor.History);

            /** ResourceDescriptor plural. */
            public plural: string;

            /** ResourceDescriptor singular. */
            public singular: string;

            /** ResourceDescriptor style. */
            public style: google.api.ResourceDescriptor.Style[];

            /**
             * Creates a new ResourceDescriptor instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResourceDescriptor instance
             */
            public static create(properties?: google.api.IResourceDescriptor): google.api.ResourceDescriptor;

            /**
             * Encodes the specified ResourceDescriptor message. Does not implicitly {@link google.api.ResourceDescriptor.verify|verify} messages.
             * @param message ResourceDescriptor message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.IResourceDescriptor, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResourceDescriptor message, length delimited. Does not implicitly {@link google.api.ResourceDescriptor.verify|verify} messages.
             * @param message ResourceDescriptor message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.IResourceDescriptor, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResourceDescriptor message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResourceDescriptor
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.ResourceDescriptor;

            /**
             * Decodes a ResourceDescriptor message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResourceDescriptor
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.ResourceDescriptor;

            /**
             * Verifies a ResourceDescriptor message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResourceDescriptor message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResourceDescriptor
             */
            public static fromObject(object: { [k: string]: any }): google.api.ResourceDescriptor;

            /**
             * Creates a plain object from a ResourceDescriptor message. Also converts values to other types if specified.
             * @param message ResourceDescriptor
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.ResourceDescriptor, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResourceDescriptor to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace ResourceDescriptor {

            /** History enum. */
            enum History {
                HISTORY_UNSPECIFIED = 0,
                ORIGINALLY_SINGLE_PATTERN = 1,
                FUTURE_MULTI_PATTERN = 2
            }

            /** Style enum. */
            enum Style {
                STYLE_UNSPECIFIED = 0,
                DECLARATIVE_FRIENDLY = 1
            }
        }

        /** Properties of a ResourceReference. */
        interface IResourceReference {

            /** ResourceReference type */
            type?: (string|null);

            /** ResourceReference childType */
            childType?: (string|null);
        }

        /** Represents a ResourceReference. */
        class ResourceReference implements IResourceReference {

            /**
             * Constructs a new ResourceReference.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.api.IResourceReference);

            /** ResourceReference type. */
            public type: string;

            /** ResourceReference childType. */
            public childType: string;

            /**
             * Creates a new ResourceReference instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResourceReference instance
             */
            public static create(properties?: google.api.IResourceReference): google.api.ResourceReference;

            /**
             * Encodes the specified ResourceReference message. Does not implicitly {@link google.api.ResourceReference.verify|verify} messages.
             * @param message ResourceReference message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.api.IResourceReference, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResourceReference message, length delimited. Does not implicitly {@link google.api.ResourceReference.verify|verify} messages.
             * @param message ResourceReference message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.api.IResourceReference, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResourceReference message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResourceReference
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.api.ResourceReference;

            /**
             * Decodes a ResourceReference message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResourceReference
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.api.ResourceReference;

            /**
             * Verifies a ResourceReference message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResourceReference message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResourceReference
             */
            public static fromObject(object: { [k: string]: any }): google.api.ResourceReference;

            /**
             * Creates a plain object from a ResourceReference message. Also converts values to other types if specified.
             * @param message ResourceReference
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.api.ResourceReference, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResourceReference to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Namespace protobuf. */
    namespace protobuf {

        /** Properties of a FileDescriptorSet. */
        interface IFileDescriptorSet {

            /** FileDescriptorSet file */
            file?: (google.protobuf.IFileDescriptorProto[]|null);
        }

        /** Represents a FileDescriptorSet. */
        class FileDescriptorSet implements IFileDescriptorSet {

            /**
             * Constructs a new FileDescriptorSet.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileDescriptorSet);

            /** FileDescriptorSet file. */
            public file: google.protobuf.IFileDescriptorProto[];

            /**
             * Creates a new FileDescriptorSet instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileDescriptorSet instance
             */
            public static create(properties?: google.protobuf.IFileDescriptorSet): google.protobuf.FileDescriptorSet;

            /**
             * Encodes the specified FileDescriptorSet message. Does not implicitly {@link google.protobuf.FileDescriptorSet.verify|verify} messages.
             * @param message FileDescriptorSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileDescriptorSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorSet message, length delimited. Does not implicitly {@link google.protobuf.FileDescriptorSet.verify|verify} messages.
             * @param message FileDescriptorSet message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileDescriptorSet, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileDescriptorSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorSet;

            /**
             * Decodes a FileDescriptorSet message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileDescriptorSet
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorSet;

            /**
             * Verifies a FileDescriptorSet message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileDescriptorSet message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileDescriptorSet
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorSet;

            /**
             * Creates a plain object from a FileDescriptorSet message. Also converts values to other types if specified.
             * @param message FileDescriptorSet
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileDescriptorSet, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorSet to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FileDescriptorProto. */
        interface IFileDescriptorProto {

            /** FileDescriptorProto name */
            name?: (string|null);

            /** FileDescriptorProto package */
            "package"?: (string|null);

            /** FileDescriptorProto dependency */
            dependency?: (string[]|null);

            /** FileDescriptorProto publicDependency */
            publicDependency?: (number[]|null);

            /** FileDescriptorProto weakDependency */
            weakDependency?: (number[]|null);

            /** FileDescriptorProto messageType */
            messageType?: (google.protobuf.IDescriptorProto[]|null);

            /** FileDescriptorProto enumType */
            enumType?: (google.protobuf.IEnumDescriptorProto[]|null);

            /** FileDescriptorProto service */
            service?: (google.protobuf.IServiceDescriptorProto[]|null);

            /** FileDescriptorProto extension */
            extension?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** FileDescriptorProto options */
            options?: (google.protobuf.IFileOptions|null);

            /** FileDescriptorProto sourceCodeInfo */
            sourceCodeInfo?: (google.protobuf.ISourceCodeInfo|null);

            /** FileDescriptorProto syntax */
            syntax?: (string|null);
        }

        /** Represents a FileDescriptorProto. */
        class FileDescriptorProto implements IFileDescriptorProto {

            /**
             * Constructs a new FileDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileDescriptorProto);

            /** FileDescriptorProto name. */
            public name: string;

            /** FileDescriptorProto package. */
            public package: string;

            /** FileDescriptorProto dependency. */
            public dependency: string[];

            /** FileDescriptorProto publicDependency. */
            public publicDependency: number[];

            /** FileDescriptorProto weakDependency. */
            public weakDependency: number[];

            /** FileDescriptorProto messageType. */
            public messageType: google.protobuf.IDescriptorProto[];

            /** FileDescriptorProto enumType. */
            public enumType: google.protobuf.IEnumDescriptorProto[];

            /** FileDescriptorProto service. */
            public service: google.protobuf.IServiceDescriptorProto[];

            /** FileDescriptorProto extension. */
            public extension: google.protobuf.IFieldDescriptorProto[];

            /** FileDescriptorProto options. */
            public options?: (google.protobuf.IFileOptions|null);

            /** FileDescriptorProto sourceCodeInfo. */
            public sourceCodeInfo?: (google.protobuf.ISourceCodeInfo|null);

            /** FileDescriptorProto syntax. */
            public syntax: string;

            /**
             * Creates a new FileDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IFileDescriptorProto): google.protobuf.FileDescriptorProto;

            /**
             * Encodes the specified FileDescriptorProto message. Does not implicitly {@link google.protobuf.FileDescriptorProto.verify|verify} messages.
             * @param message FileDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.FileDescriptorProto.verify|verify} messages.
             * @param message FileDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileDescriptorProto;

            /**
             * Decodes a FileDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileDescriptorProto;

            /**
             * Verifies a FileDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileDescriptorProto;

            /**
             * Creates a plain object from a FileDescriptorProto message. Also converts values to other types if specified.
             * @param message FileDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DescriptorProto. */
        interface IDescriptorProto {

            /** DescriptorProto name */
            name?: (string|null);

            /** DescriptorProto field */
            field?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** DescriptorProto extension */
            extension?: (google.protobuf.IFieldDescriptorProto[]|null);

            /** DescriptorProto nestedType */
            nestedType?: (google.protobuf.IDescriptorProto[]|null);

            /** DescriptorProto enumType */
            enumType?: (google.protobuf.IEnumDescriptorProto[]|null);

            /** DescriptorProto extensionRange */
            extensionRange?: (google.protobuf.DescriptorProto.IExtensionRange[]|null);

            /** DescriptorProto oneofDecl */
            oneofDecl?: (google.protobuf.IOneofDescriptorProto[]|null);

            /** DescriptorProto options */
            options?: (google.protobuf.IMessageOptions|null);

            /** DescriptorProto reservedRange */
            reservedRange?: (google.protobuf.DescriptorProto.IReservedRange[]|null);

            /** DescriptorProto reservedName */
            reservedName?: (string[]|null);
        }

        /** Represents a DescriptorProto. */
        class DescriptorProto implements IDescriptorProto {

            /**
             * Constructs a new DescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDescriptorProto);

            /** DescriptorProto name. */
            public name: string;

            /** DescriptorProto field. */
            public field: google.protobuf.IFieldDescriptorProto[];

            /** DescriptorProto extension. */
            public extension: google.protobuf.IFieldDescriptorProto[];

            /** DescriptorProto nestedType. */
            public nestedType: google.protobuf.IDescriptorProto[];

            /** DescriptorProto enumType. */
            public enumType: google.protobuf.IEnumDescriptorProto[];

            /** DescriptorProto extensionRange. */
            public extensionRange: google.protobuf.DescriptorProto.IExtensionRange[];

            /** DescriptorProto oneofDecl. */
            public oneofDecl: google.protobuf.IOneofDescriptorProto[];

            /** DescriptorProto options. */
            public options?: (google.protobuf.IMessageOptions|null);

            /** DescriptorProto reservedRange. */
            public reservedRange: google.protobuf.DescriptorProto.IReservedRange[];

            /** DescriptorProto reservedName. */
            public reservedName: string[];

            /**
             * Creates a new DescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DescriptorProto instance
             */
            public static create(properties?: google.protobuf.IDescriptorProto): google.protobuf.DescriptorProto;

            /**
             * Encodes the specified DescriptorProto message. Does not implicitly {@link google.protobuf.DescriptorProto.verify|verify} messages.
             * @param message DescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.verify|verify} messages.
             * @param message DescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto;

            /**
             * Decodes a DescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto;

            /**
             * Verifies a DescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto;

            /**
             * Creates a plain object from a DescriptorProto message. Also converts values to other types if specified.
             * @param message DescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.DescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace DescriptorProto {

            /** Properties of an ExtensionRange. */
            interface IExtensionRange {

                /** ExtensionRange start */
                start?: (number|null);

                /** ExtensionRange end */
                end?: (number|null);

                /** ExtensionRange options */
                options?: (google.protobuf.IExtensionRangeOptions|null);
            }

            /** Represents an ExtensionRange. */
            class ExtensionRange implements IExtensionRange {

                /**
                 * Constructs a new ExtensionRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.DescriptorProto.IExtensionRange);

                /** ExtensionRange start. */
                public start: number;

                /** ExtensionRange end. */
                public end: number;

                /** ExtensionRange options. */
                public options?: (google.protobuf.IExtensionRangeOptions|null);

                /**
                 * Creates a new ExtensionRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ExtensionRange instance
                 */
                public static create(properties?: google.protobuf.DescriptorProto.IExtensionRange): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Encodes the specified ExtensionRange message. Does not implicitly {@link google.protobuf.DescriptorProto.ExtensionRange.verify|verify} messages.
                 * @param message ExtensionRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.DescriptorProto.IExtensionRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ExtensionRange message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.ExtensionRange.verify|verify} messages.
                 * @param message ExtensionRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.DescriptorProto.IExtensionRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ExtensionRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Decodes an ExtensionRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ExtensionRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Verifies an ExtensionRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an ExtensionRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ExtensionRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ExtensionRange;

                /**
                 * Creates a plain object from an ExtensionRange message. Also converts values to other types if specified.
                 * @param message ExtensionRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.DescriptorProto.ExtensionRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ExtensionRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }

            /** Properties of a ReservedRange. */
            interface IReservedRange {

                /** ReservedRange start */
                start?: (number|null);

                /** ReservedRange end */
                end?: (number|null);
            }

            /** Represents a ReservedRange. */
            class ReservedRange implements IReservedRange {

                /**
                 * Constructs a new ReservedRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.DescriptorProto.IReservedRange);

                /** ReservedRange start. */
                public start: number;

                /** ReservedRange end. */
                public end: number;

                /**
                 * Creates a new ReservedRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns ReservedRange instance
                 */
                public static create(properties?: google.protobuf.DescriptorProto.IReservedRange): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Encodes the specified ReservedRange message. Does not implicitly {@link google.protobuf.DescriptorProto.ReservedRange.verify|verify} messages.
                 * @param message ReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.DescriptorProto.IReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified ReservedRange message, length delimited. Does not implicitly {@link google.protobuf.DescriptorProto.ReservedRange.verify|verify} messages.
                 * @param message ReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.DescriptorProto.IReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns ReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Decodes a ReservedRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns ReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Verifies a ReservedRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a ReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns ReservedRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.DescriptorProto.ReservedRange;

                /**
                 * Creates a plain object from a ReservedRange message. Also converts values to other types if specified.
                 * @param message ReservedRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.DescriptorProto.ReservedRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this ReservedRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of an ExtensionRangeOptions. */
        interface IExtensionRangeOptions {

            /** ExtensionRangeOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an ExtensionRangeOptions. */
        class ExtensionRangeOptions implements IExtensionRangeOptions {

            /**
             * Constructs a new ExtensionRangeOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IExtensionRangeOptions);

            /** ExtensionRangeOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new ExtensionRangeOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ExtensionRangeOptions instance
             */
            public static create(properties?: google.protobuf.IExtensionRangeOptions): google.protobuf.ExtensionRangeOptions;

            /**
             * Encodes the specified ExtensionRangeOptions message. Does not implicitly {@link google.protobuf.ExtensionRangeOptions.verify|verify} messages.
             * @param message ExtensionRangeOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IExtensionRangeOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ExtensionRangeOptions message, length delimited. Does not implicitly {@link google.protobuf.ExtensionRangeOptions.verify|verify} messages.
             * @param message ExtensionRangeOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IExtensionRangeOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ExtensionRangeOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ExtensionRangeOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ExtensionRangeOptions;

            /**
             * Decodes an ExtensionRangeOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ExtensionRangeOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ExtensionRangeOptions;

            /**
             * Verifies an ExtensionRangeOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ExtensionRangeOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ExtensionRangeOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ExtensionRangeOptions;

            /**
             * Creates a plain object from an ExtensionRangeOptions message. Also converts values to other types if specified.
             * @param message ExtensionRangeOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ExtensionRangeOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ExtensionRangeOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FieldDescriptorProto. */
        interface IFieldDescriptorProto {

            /** FieldDescriptorProto name */
            name?: (string|null);

            /** FieldDescriptorProto number */
            number?: (number|null);

            /** FieldDescriptorProto label */
            label?: (google.protobuf.FieldDescriptorProto.Label|keyof typeof google.protobuf.FieldDescriptorProto.Label|null);

            /** FieldDescriptorProto type */
            type?: (google.protobuf.FieldDescriptorProto.Type|keyof typeof google.protobuf.FieldDescriptorProto.Type|null);

            /** FieldDescriptorProto typeName */
            typeName?: (string|null);

            /** FieldDescriptorProto extendee */
            extendee?: (string|null);

            /** FieldDescriptorProto defaultValue */
            defaultValue?: (string|null);

            /** FieldDescriptorProto oneofIndex */
            oneofIndex?: (number|null);

            /** FieldDescriptorProto jsonName */
            jsonName?: (string|null);

            /** FieldDescriptorProto options */
            options?: (google.protobuf.IFieldOptions|null);

            /** FieldDescriptorProto proto3Optional */
            proto3Optional?: (boolean|null);
        }

        /** Represents a FieldDescriptorProto. */
        class FieldDescriptorProto implements IFieldDescriptorProto {

            /**
             * Constructs a new FieldDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldDescriptorProto);

            /** FieldDescriptorProto name. */
            public name: string;

            /** FieldDescriptorProto number. */
            public number: number;

            /** FieldDescriptorProto label. */
            public label: (google.protobuf.FieldDescriptorProto.Label|keyof typeof google.protobuf.FieldDescriptorProto.Label);

            /** FieldDescriptorProto type. */
            public type: (google.protobuf.FieldDescriptorProto.Type|keyof typeof google.protobuf.FieldDescriptorProto.Type);

            /** FieldDescriptorProto typeName. */
            public typeName: string;

            /** FieldDescriptorProto extendee. */
            public extendee: string;

            /** FieldDescriptorProto defaultValue. */
            public defaultValue: string;

            /** FieldDescriptorProto oneofIndex. */
            public oneofIndex: number;

            /** FieldDescriptorProto jsonName. */
            public jsonName: string;

            /** FieldDescriptorProto options. */
            public options?: (google.protobuf.IFieldOptions|null);

            /** FieldDescriptorProto proto3Optional. */
            public proto3Optional: boolean;

            /**
             * Creates a new FieldDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IFieldDescriptorProto): google.protobuf.FieldDescriptorProto;

            /**
             * Encodes the specified FieldDescriptorProto message. Does not implicitly {@link google.protobuf.FieldDescriptorProto.verify|verify} messages.
             * @param message FieldDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.FieldDescriptorProto.verify|verify} messages.
             * @param message FieldDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldDescriptorProto;

            /**
             * Decodes a FieldDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldDescriptorProto;

            /**
             * Verifies a FieldDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldDescriptorProto;

            /**
             * Creates a plain object from a FieldDescriptorProto message. Also converts values to other types if specified.
             * @param message FieldDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace FieldDescriptorProto {

            /** Type enum. */
            enum Type {
                TYPE_DOUBLE = 1,
                TYPE_FLOAT = 2,
                TYPE_INT64 = 3,
                TYPE_UINT64 = 4,
                TYPE_INT32 = 5,
                TYPE_FIXED64 = 6,
                TYPE_FIXED32 = 7,
                TYPE_BOOL = 8,
                TYPE_STRING = 9,
                TYPE_GROUP = 10,
                TYPE_MESSAGE = 11,
                TYPE_BYTES = 12,
                TYPE_UINT32 = 13,
                TYPE_ENUM = 14,
                TYPE_SFIXED32 = 15,
                TYPE_SFIXED64 = 16,
                TYPE_SINT32 = 17,
                TYPE_SINT64 = 18
            }

            /** Label enum. */
            enum Label {
                LABEL_OPTIONAL = 1,
                LABEL_REQUIRED = 2,
                LABEL_REPEATED = 3
            }
        }

        /** Properties of an OneofDescriptorProto. */
        interface IOneofDescriptorProto {

            /** OneofDescriptorProto name */
            name?: (string|null);

            /** OneofDescriptorProto options */
            options?: (google.protobuf.IOneofOptions|null);
        }

        /** Represents an OneofDescriptorProto. */
        class OneofDescriptorProto implements IOneofDescriptorProto {

            /**
             * Constructs a new OneofDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IOneofDescriptorProto);

            /** OneofDescriptorProto name. */
            public name: string;

            /** OneofDescriptorProto options. */
            public options?: (google.protobuf.IOneofOptions|null);

            /**
             * Creates a new OneofDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OneofDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IOneofDescriptorProto): google.protobuf.OneofDescriptorProto;

            /**
             * Encodes the specified OneofDescriptorProto message. Does not implicitly {@link google.protobuf.OneofDescriptorProto.verify|verify} messages.
             * @param message OneofDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IOneofDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.OneofDescriptorProto.verify|verify} messages.
             * @param message OneofDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IOneofDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OneofDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofDescriptorProto;

            /**
             * Decodes an OneofDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OneofDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofDescriptorProto;

            /**
             * Verifies an OneofDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OneofDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OneofDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.OneofDescriptorProto;

            /**
             * Creates a plain object from an OneofDescriptorProto message. Also converts values to other types if specified.
             * @param message OneofDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.OneofDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EnumDescriptorProto. */
        interface IEnumDescriptorProto {

            /** EnumDescriptorProto name */
            name?: (string|null);

            /** EnumDescriptorProto value */
            value?: (google.protobuf.IEnumValueDescriptorProto[]|null);

            /** EnumDescriptorProto options */
            options?: (google.protobuf.IEnumOptions|null);

            /** EnumDescriptorProto reservedRange */
            reservedRange?: (google.protobuf.EnumDescriptorProto.IEnumReservedRange[]|null);

            /** EnumDescriptorProto reservedName */
            reservedName?: (string[]|null);
        }

        /** Represents an EnumDescriptorProto. */
        class EnumDescriptorProto implements IEnumDescriptorProto {

            /**
             * Constructs a new EnumDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumDescriptorProto);

            /** EnumDescriptorProto name. */
            public name: string;

            /** EnumDescriptorProto value. */
            public value: google.protobuf.IEnumValueDescriptorProto[];

            /** EnumDescriptorProto options. */
            public options?: (google.protobuf.IEnumOptions|null);

            /** EnumDescriptorProto reservedRange. */
            public reservedRange: google.protobuf.EnumDescriptorProto.IEnumReservedRange[];

            /** EnumDescriptorProto reservedName. */
            public reservedName: string[];

            /**
             * Creates a new EnumDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IEnumDescriptorProto): google.protobuf.EnumDescriptorProto;

            /**
             * Encodes the specified EnumDescriptorProto message. Does not implicitly {@link google.protobuf.EnumDescriptorProto.verify|verify} messages.
             * @param message EnumDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.EnumDescriptorProto.verify|verify} messages.
             * @param message EnumDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumDescriptorProto;

            /**
             * Decodes an EnumDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumDescriptorProto;

            /**
             * Verifies an EnumDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto;

            /**
             * Creates a plain object from an EnumDescriptorProto message. Also converts values to other types if specified.
             * @param message EnumDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace EnumDescriptorProto {

            /** Properties of an EnumReservedRange. */
            interface IEnumReservedRange {

                /** EnumReservedRange start */
                start?: (number|null);

                /** EnumReservedRange end */
                end?: (number|null);
            }

            /** Represents an EnumReservedRange. */
            class EnumReservedRange implements IEnumReservedRange {

                /**
                 * Constructs a new EnumReservedRange.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.EnumDescriptorProto.IEnumReservedRange);

                /** EnumReservedRange start. */
                public start: number;

                /** EnumReservedRange end. */
                public end: number;

                /**
                 * Creates a new EnumReservedRange instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns EnumReservedRange instance
                 */
                public static create(properties?: google.protobuf.EnumDescriptorProto.IEnumReservedRange): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Encodes the specified EnumReservedRange message. Does not implicitly {@link google.protobuf.EnumDescriptorProto.EnumReservedRange.verify|verify} messages.
                 * @param message EnumReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.EnumDescriptorProto.IEnumReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified EnumReservedRange message, length delimited. Does not implicitly {@link google.protobuf.EnumDescriptorProto.EnumReservedRange.verify|verify} messages.
                 * @param message EnumReservedRange message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.EnumDescriptorProto.IEnumReservedRange, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an EnumReservedRange message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns EnumReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Decodes an EnumReservedRange message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns EnumReservedRange
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Verifies an EnumReservedRange message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an EnumReservedRange message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns EnumReservedRange
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.EnumDescriptorProto.EnumReservedRange;

                /**
                 * Creates a plain object from an EnumReservedRange message. Also converts values to other types if specified.
                 * @param message EnumReservedRange
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.EnumDescriptorProto.EnumReservedRange, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this EnumReservedRange to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of an EnumValueDescriptorProto. */
        interface IEnumValueDescriptorProto {

            /** EnumValueDescriptorProto name */
            name?: (string|null);

            /** EnumValueDescriptorProto number */
            number?: (number|null);

            /** EnumValueDescriptorProto options */
            options?: (google.protobuf.IEnumValueOptions|null);
        }

        /** Represents an EnumValueDescriptorProto. */
        class EnumValueDescriptorProto implements IEnumValueDescriptorProto {

            /**
             * Constructs a new EnumValueDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumValueDescriptorProto);

            /** EnumValueDescriptorProto name. */
            public name: string;

            /** EnumValueDescriptorProto number. */
            public number: number;

            /** EnumValueDescriptorProto options. */
            public options?: (google.protobuf.IEnumValueOptions|null);

            /**
             * Creates a new EnumValueDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumValueDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IEnumValueDescriptorProto): google.protobuf.EnumValueDescriptorProto;

            /**
             * Encodes the specified EnumValueDescriptorProto message. Does not implicitly {@link google.protobuf.EnumValueDescriptorProto.verify|verify} messages.
             * @param message EnumValueDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumValueDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.EnumValueDescriptorProto.verify|verify} messages.
             * @param message EnumValueDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumValueDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValueDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueDescriptorProto;

            /**
             * Decodes an EnumValueDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValueDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueDescriptorProto;

            /**
             * Verifies an EnumValueDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValueDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValueDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueDescriptorProto;

            /**
             * Creates a plain object from an EnumValueDescriptorProto message. Also converts values to other types if specified.
             * @param message EnumValueDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumValueDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ServiceDescriptorProto. */
        interface IServiceDescriptorProto {

            /** ServiceDescriptorProto name */
            name?: (string|null);

            /** ServiceDescriptorProto method */
            method?: (google.protobuf.IMethodDescriptorProto[]|null);

            /** ServiceDescriptorProto options */
            options?: (google.protobuf.IServiceOptions|null);
        }

        /** Represents a ServiceDescriptorProto. */
        class ServiceDescriptorProto implements IServiceDescriptorProto {

            /**
             * Constructs a new ServiceDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IServiceDescriptorProto);

            /** ServiceDescriptorProto name. */
            public name: string;

            /** ServiceDescriptorProto method. */
            public method: google.protobuf.IMethodDescriptorProto[];

            /** ServiceDescriptorProto options. */
            public options?: (google.protobuf.IServiceOptions|null);

            /**
             * Creates a new ServiceDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServiceDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IServiceDescriptorProto): google.protobuf.ServiceDescriptorProto;

            /**
             * Encodes the specified ServiceDescriptorProto message. Does not implicitly {@link google.protobuf.ServiceDescriptorProto.verify|verify} messages.
             * @param message ServiceDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IServiceDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.ServiceDescriptorProto.verify|verify} messages.
             * @param message ServiceDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IServiceDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServiceDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceDescriptorProto;

            /**
             * Decodes a ServiceDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServiceDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceDescriptorProto;

            /**
             * Verifies a ServiceDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServiceDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServiceDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ServiceDescriptorProto;

            /**
             * Creates a plain object from a ServiceDescriptorProto message. Also converts values to other types if specified.
             * @param message ServiceDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ServiceDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MethodDescriptorProto. */
        interface IMethodDescriptorProto {

            /** MethodDescriptorProto name */
            name?: (string|null);

            /** MethodDescriptorProto inputType */
            inputType?: (string|null);

            /** MethodDescriptorProto outputType */
            outputType?: (string|null);

            /** MethodDescriptorProto options */
            options?: (google.protobuf.IMethodOptions|null);

            /** MethodDescriptorProto clientStreaming */
            clientStreaming?: (boolean|null);

            /** MethodDescriptorProto serverStreaming */
            serverStreaming?: (boolean|null);
        }

        /** Represents a MethodDescriptorProto. */
        class MethodDescriptorProto implements IMethodDescriptorProto {

            /**
             * Constructs a new MethodDescriptorProto.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMethodDescriptorProto);

            /** MethodDescriptorProto name. */
            public name: string;

            /** MethodDescriptorProto inputType. */
            public inputType: string;

            /** MethodDescriptorProto outputType. */
            public outputType: string;

            /** MethodDescriptorProto options. */
            public options?: (google.protobuf.IMethodOptions|null);

            /** MethodDescriptorProto clientStreaming. */
            public clientStreaming: boolean;

            /** MethodDescriptorProto serverStreaming. */
            public serverStreaming: boolean;

            /**
             * Creates a new MethodDescriptorProto instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MethodDescriptorProto instance
             */
            public static create(properties?: google.protobuf.IMethodDescriptorProto): google.protobuf.MethodDescriptorProto;

            /**
             * Encodes the specified MethodDescriptorProto message. Does not implicitly {@link google.protobuf.MethodDescriptorProto.verify|verify} messages.
             * @param message MethodDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMethodDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodDescriptorProto message, length delimited. Does not implicitly {@link google.protobuf.MethodDescriptorProto.verify|verify} messages.
             * @param message MethodDescriptorProto message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMethodDescriptorProto, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MethodDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodDescriptorProto;

            /**
             * Decodes a MethodDescriptorProto message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MethodDescriptorProto
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodDescriptorProto;

            /**
             * Verifies a MethodDescriptorProto message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MethodDescriptorProto message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MethodDescriptorProto
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MethodDescriptorProto;

            /**
             * Creates a plain object from a MethodDescriptorProto message. Also converts values to other types if specified.
             * @param message MethodDescriptorProto
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MethodDescriptorProto, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodDescriptorProto to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FileOptions. */
        interface IFileOptions {

            /** FileOptions javaPackage */
            javaPackage?: (string|null);

            /** FileOptions javaOuterClassname */
            javaOuterClassname?: (string|null);

            /** FileOptions javaMultipleFiles */
            javaMultipleFiles?: (boolean|null);

            /** FileOptions javaGenerateEqualsAndHash */
            javaGenerateEqualsAndHash?: (boolean|null);

            /** FileOptions javaStringCheckUtf8 */
            javaStringCheckUtf8?: (boolean|null);

            /** FileOptions optimizeFor */
            optimizeFor?: (google.protobuf.FileOptions.OptimizeMode|keyof typeof google.protobuf.FileOptions.OptimizeMode|null);

            /** FileOptions goPackage */
            goPackage?: (string|null);

            /** FileOptions ccGenericServices */
            ccGenericServices?: (boolean|null);

            /** FileOptions javaGenericServices */
            javaGenericServices?: (boolean|null);

            /** FileOptions pyGenericServices */
            pyGenericServices?: (boolean|null);

            /** FileOptions phpGenericServices */
            phpGenericServices?: (boolean|null);

            /** FileOptions deprecated */
            deprecated?: (boolean|null);

            /** FileOptions ccEnableArenas */
            ccEnableArenas?: (boolean|null);

            /** FileOptions objcClassPrefix */
            objcClassPrefix?: (string|null);

            /** FileOptions csharpNamespace */
            csharpNamespace?: (string|null);

            /** FileOptions swiftPrefix */
            swiftPrefix?: (string|null);

            /** FileOptions phpClassPrefix */
            phpClassPrefix?: (string|null);

            /** FileOptions phpNamespace */
            phpNamespace?: (string|null);

            /** FileOptions phpMetadataNamespace */
            phpMetadataNamespace?: (string|null);

            /** FileOptions rubyPackage */
            rubyPackage?: (string|null);

            /** FileOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** FileOptions .google.api.resourceDefinition */
            ".google.api.resourceDefinition"?: (google.api.IResourceDescriptor[]|null);
        }

        /** Represents a FileOptions. */
        class FileOptions implements IFileOptions {

            /**
             * Constructs a new FileOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFileOptions);

            /** FileOptions javaPackage. */
            public javaPackage: string;

            /** FileOptions javaOuterClassname. */
            public javaOuterClassname: string;

            /** FileOptions javaMultipleFiles. */
            public javaMultipleFiles: boolean;

            /** FileOptions javaGenerateEqualsAndHash. */
            public javaGenerateEqualsAndHash: boolean;

            /** FileOptions javaStringCheckUtf8. */
            public javaStringCheckUtf8: boolean;

            /** FileOptions optimizeFor. */
            public optimizeFor: (google.protobuf.FileOptions.OptimizeMode|keyof typeof google.protobuf.FileOptions.OptimizeMode);

            /** FileOptions goPackage. */
            public goPackage: string;

            /** FileOptions ccGenericServices. */
            public ccGenericServices: boolean;

            /** FileOptions javaGenericServices. */
            public javaGenericServices: boolean;

            /** FileOptions pyGenericServices. */
            public pyGenericServices: boolean;

            /** FileOptions phpGenericServices. */
            public phpGenericServices: boolean;

            /** FileOptions deprecated. */
            public deprecated: boolean;

            /** FileOptions ccEnableArenas. */
            public ccEnableArenas: boolean;

            /** FileOptions objcClassPrefix. */
            public objcClassPrefix: string;

            /** FileOptions csharpNamespace. */
            public csharpNamespace: string;

            /** FileOptions swiftPrefix. */
            public swiftPrefix: string;

            /** FileOptions phpClassPrefix. */
            public phpClassPrefix: string;

            /** FileOptions phpNamespace. */
            public phpNamespace: string;

            /** FileOptions phpMetadataNamespace. */
            public phpMetadataNamespace: string;

            /** FileOptions rubyPackage. */
            public rubyPackage: string;

            /** FileOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new FileOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FileOptions instance
             */
            public static create(properties?: google.protobuf.IFileOptions): google.protobuf.FileOptions;

            /**
             * Encodes the specified FileOptions message. Does not implicitly {@link google.protobuf.FileOptions.verify|verify} messages.
             * @param message FileOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFileOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FileOptions message, length delimited. Does not implicitly {@link google.protobuf.FileOptions.verify|verify} messages.
             * @param message FileOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFileOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FileOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FileOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FileOptions;

            /**
             * Decodes a FileOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FileOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FileOptions;

            /**
             * Verifies a FileOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FileOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FileOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FileOptions;

            /**
             * Creates a plain object from a FileOptions message. Also converts values to other types if specified.
             * @param message FileOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FileOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FileOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace FileOptions {

            /** OptimizeMode enum. */
            enum OptimizeMode {
                SPEED = 1,
                CODE_SIZE = 2,
                LITE_RUNTIME = 3
            }
        }

        /** Properties of a MessageOptions. */
        interface IMessageOptions {

            /** MessageOptions messageSetWireFormat */
            messageSetWireFormat?: (boolean|null);

            /** MessageOptions noStandardDescriptorAccessor */
            noStandardDescriptorAccessor?: (boolean|null);

            /** MessageOptions deprecated */
            deprecated?: (boolean|null);

            /** MessageOptions mapEntry */
            mapEntry?: (boolean|null);

            /** MessageOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** MessageOptions .google.api.resource */
            ".google.api.resource"?: (google.api.IResourceDescriptor|null);
        }

        /** Represents a MessageOptions. */
        class MessageOptions implements IMessageOptions {

            /**
             * Constructs a new MessageOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMessageOptions);

            /** MessageOptions messageSetWireFormat. */
            public messageSetWireFormat: boolean;

            /** MessageOptions noStandardDescriptorAccessor. */
            public noStandardDescriptorAccessor: boolean;

            /** MessageOptions deprecated. */
            public deprecated: boolean;

            /** MessageOptions mapEntry. */
            public mapEntry: boolean;

            /** MessageOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new MessageOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MessageOptions instance
             */
            public static create(properties?: google.protobuf.IMessageOptions): google.protobuf.MessageOptions;

            /**
             * Encodes the specified MessageOptions message. Does not implicitly {@link google.protobuf.MessageOptions.verify|verify} messages.
             * @param message MessageOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMessageOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MessageOptions message, length delimited. Does not implicitly {@link google.protobuf.MessageOptions.verify|verify} messages.
             * @param message MessageOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMessageOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MessageOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MessageOptions;

            /**
             * Decodes a MessageOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MessageOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MessageOptions;

            /**
             * Verifies a MessageOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MessageOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MessageOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MessageOptions;

            /**
             * Creates a plain object from a MessageOptions message. Also converts values to other types if specified.
             * @param message MessageOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MessageOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MessageOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FieldOptions. */
        interface IFieldOptions {

            /** FieldOptions ctype */
            ctype?: (google.protobuf.FieldOptions.CType|keyof typeof google.protobuf.FieldOptions.CType|null);

            /** FieldOptions packed */
            packed?: (boolean|null);

            /** FieldOptions jstype */
            jstype?: (google.protobuf.FieldOptions.JSType|keyof typeof google.protobuf.FieldOptions.JSType|null);

            /** FieldOptions lazy */
            lazy?: (boolean|null);

            /** FieldOptions deprecated */
            deprecated?: (boolean|null);

            /** FieldOptions weak */
            weak?: (boolean|null);

            /** FieldOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** FieldOptions .google.api.fieldBehavior */
            ".google.api.fieldBehavior"?: (google.api.FieldBehavior[]|null);

            /** FieldOptions .google.api.resourceReference */
            ".google.api.resourceReference"?: (google.api.IResourceReference|null);
        }

        /** Represents a FieldOptions. */
        class FieldOptions implements IFieldOptions {

            /**
             * Constructs a new FieldOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldOptions);

            /** FieldOptions ctype. */
            public ctype: (google.protobuf.FieldOptions.CType|keyof typeof google.protobuf.FieldOptions.CType);

            /** FieldOptions packed. */
            public packed: boolean;

            /** FieldOptions jstype. */
            public jstype: (google.protobuf.FieldOptions.JSType|keyof typeof google.protobuf.FieldOptions.JSType);

            /** FieldOptions lazy. */
            public lazy: boolean;

            /** FieldOptions deprecated. */
            public deprecated: boolean;

            /** FieldOptions weak. */
            public weak: boolean;

            /** FieldOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new FieldOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldOptions instance
             */
            public static create(properties?: google.protobuf.IFieldOptions): google.protobuf.FieldOptions;

            /**
             * Encodes the specified FieldOptions message. Does not implicitly {@link google.protobuf.FieldOptions.verify|verify} messages.
             * @param message FieldOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldOptions message, length delimited. Does not implicitly {@link google.protobuf.FieldOptions.verify|verify} messages.
             * @param message FieldOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldOptions;

            /**
             * Decodes a FieldOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldOptions;

            /**
             * Verifies a FieldOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldOptions;

            /**
             * Creates a plain object from a FieldOptions message. Also converts values to other types if specified.
             * @param message FieldOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace FieldOptions {

            /** CType enum. */
            enum CType {
                STRING = 0,
                CORD = 1,
                STRING_PIECE = 2
            }

            /** JSType enum. */
            enum JSType {
                JS_NORMAL = 0,
                JS_STRING = 1,
                JS_NUMBER = 2
            }
        }

        /** Properties of an OneofOptions. */
        interface IOneofOptions {

            /** OneofOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an OneofOptions. */
        class OneofOptions implements IOneofOptions {

            /**
             * Constructs a new OneofOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IOneofOptions);

            /** OneofOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new OneofOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OneofOptions instance
             */
            public static create(properties?: google.protobuf.IOneofOptions): google.protobuf.OneofOptions;

            /**
             * Encodes the specified OneofOptions message. Does not implicitly {@link google.protobuf.OneofOptions.verify|verify} messages.
             * @param message OneofOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IOneofOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OneofOptions message, length delimited. Does not implicitly {@link google.protobuf.OneofOptions.verify|verify} messages.
             * @param message OneofOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IOneofOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OneofOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OneofOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.OneofOptions;

            /**
             * Decodes an OneofOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OneofOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.OneofOptions;

            /**
             * Verifies an OneofOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OneofOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OneofOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.OneofOptions;

            /**
             * Creates a plain object from an OneofOptions message. Also converts values to other types if specified.
             * @param message OneofOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.OneofOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OneofOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EnumOptions. */
        interface IEnumOptions {

            /** EnumOptions allowAlias */
            allowAlias?: (boolean|null);

            /** EnumOptions deprecated */
            deprecated?: (boolean|null);

            /** EnumOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an EnumOptions. */
        class EnumOptions implements IEnumOptions {

            /**
             * Constructs a new EnumOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumOptions);

            /** EnumOptions allowAlias. */
            public allowAlias: boolean;

            /** EnumOptions deprecated. */
            public deprecated: boolean;

            /** EnumOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new EnumOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumOptions instance
             */
            public static create(properties?: google.protobuf.IEnumOptions): google.protobuf.EnumOptions;

            /**
             * Encodes the specified EnumOptions message. Does not implicitly {@link google.protobuf.EnumOptions.verify|verify} messages.
             * @param message EnumOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumOptions message, length delimited. Does not implicitly {@link google.protobuf.EnumOptions.verify|verify} messages.
             * @param message EnumOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumOptions;

            /**
             * Decodes an EnumOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumOptions;

            /**
             * Verifies an EnumOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumOptions;

            /**
             * Creates a plain object from an EnumOptions message. Also converts values to other types if specified.
             * @param message EnumOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an EnumValueOptions. */
        interface IEnumValueOptions {

            /** EnumValueOptions deprecated */
            deprecated?: (boolean|null);

            /** EnumValueOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);
        }

        /** Represents an EnumValueOptions. */
        class EnumValueOptions implements IEnumValueOptions {

            /**
             * Constructs a new EnumValueOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEnumValueOptions);

            /** EnumValueOptions deprecated. */
            public deprecated: boolean;

            /** EnumValueOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new EnumValueOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns EnumValueOptions instance
             */
            public static create(properties?: google.protobuf.IEnumValueOptions): google.protobuf.EnumValueOptions;

            /**
             * Encodes the specified EnumValueOptions message. Does not implicitly {@link google.protobuf.EnumValueOptions.verify|verify} messages.
             * @param message EnumValueOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEnumValueOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified EnumValueOptions message, length delimited. Does not implicitly {@link google.protobuf.EnumValueOptions.verify|verify} messages.
             * @param message EnumValueOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEnumValueOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns EnumValueOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.EnumValueOptions;

            /**
             * Decodes an EnumValueOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns EnumValueOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.EnumValueOptions;

            /**
             * Verifies an EnumValueOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an EnumValueOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns EnumValueOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.EnumValueOptions;

            /**
             * Creates a plain object from an EnumValueOptions message. Also converts values to other types if specified.
             * @param message EnumValueOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.EnumValueOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this EnumValueOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ServiceOptions. */
        interface IServiceOptions {

            /** ServiceOptions deprecated */
            deprecated?: (boolean|null);

            /** ServiceOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** ServiceOptions .google.api.defaultHost */
            ".google.api.defaultHost"?: (string|null);

            /** ServiceOptions .google.api.oauthScopes */
            ".google.api.oauthScopes"?: (string|null);
        }

        /** Represents a ServiceOptions. */
        class ServiceOptions implements IServiceOptions {

            /**
             * Constructs a new ServiceOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IServiceOptions);

            /** ServiceOptions deprecated. */
            public deprecated: boolean;

            /** ServiceOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new ServiceOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ServiceOptions instance
             */
            public static create(properties?: google.protobuf.IServiceOptions): google.protobuf.ServiceOptions;

            /**
             * Encodes the specified ServiceOptions message. Does not implicitly {@link google.protobuf.ServiceOptions.verify|verify} messages.
             * @param message ServiceOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IServiceOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ServiceOptions message, length delimited. Does not implicitly {@link google.protobuf.ServiceOptions.verify|verify} messages.
             * @param message ServiceOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IServiceOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ServiceOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.ServiceOptions;

            /**
             * Decodes a ServiceOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ServiceOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.ServiceOptions;

            /**
             * Verifies a ServiceOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ServiceOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ServiceOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.ServiceOptions;

            /**
             * Creates a plain object from a ServiceOptions message. Also converts values to other types if specified.
             * @param message ServiceOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.ServiceOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ServiceOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a MethodOptions. */
        interface IMethodOptions {

            /** MethodOptions deprecated */
            deprecated?: (boolean|null);

            /** MethodOptions idempotencyLevel */
            idempotencyLevel?: (google.protobuf.MethodOptions.IdempotencyLevel|keyof typeof google.protobuf.MethodOptions.IdempotencyLevel|null);

            /** MethodOptions uninterpretedOption */
            uninterpretedOption?: (google.protobuf.IUninterpretedOption[]|null);

            /** MethodOptions .google.api.http */
            ".google.api.http"?: (google.api.IHttpRule|null);

            /** MethodOptions .google.api.methodSignature */
            ".google.api.methodSignature"?: (string[]|null);

            /** MethodOptions .google.longrunning.operationInfo */
            ".google.longrunning.operationInfo"?: (google.longrunning.IOperationInfo|null);
        }

        /** Represents a MethodOptions. */
        class MethodOptions implements IMethodOptions {

            /**
             * Constructs a new MethodOptions.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IMethodOptions);

            /** MethodOptions deprecated. */
            public deprecated: boolean;

            /** MethodOptions idempotencyLevel. */
            public idempotencyLevel: (google.protobuf.MethodOptions.IdempotencyLevel|keyof typeof google.protobuf.MethodOptions.IdempotencyLevel);

            /** MethodOptions uninterpretedOption. */
            public uninterpretedOption: google.protobuf.IUninterpretedOption[];

            /**
             * Creates a new MethodOptions instance using the specified properties.
             * @param [properties] Properties to set
             * @returns MethodOptions instance
             */
            public static create(properties?: google.protobuf.IMethodOptions): google.protobuf.MethodOptions;

            /**
             * Encodes the specified MethodOptions message. Does not implicitly {@link google.protobuf.MethodOptions.verify|verify} messages.
             * @param message MethodOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IMethodOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified MethodOptions message, length delimited. Does not implicitly {@link google.protobuf.MethodOptions.verify|verify} messages.
             * @param message MethodOptions message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IMethodOptions, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns MethodOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.MethodOptions;

            /**
             * Decodes a MethodOptions message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns MethodOptions
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.MethodOptions;

            /**
             * Verifies a MethodOptions message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a MethodOptions message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns MethodOptions
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.MethodOptions;

            /**
             * Creates a plain object from a MethodOptions message. Also converts values to other types if specified.
             * @param message MethodOptions
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.MethodOptions, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this MethodOptions to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace MethodOptions {

            /** IdempotencyLevel enum. */
            enum IdempotencyLevel {
                IDEMPOTENCY_UNKNOWN = 0,
                NO_SIDE_EFFECTS = 1,
                IDEMPOTENT = 2
            }
        }

        /** Properties of an UninterpretedOption. */
        interface IUninterpretedOption {

            /** UninterpretedOption name */
            name?: (google.protobuf.UninterpretedOption.INamePart[]|null);

            /** UninterpretedOption identifierValue */
            identifierValue?: (string|null);

            /** UninterpretedOption positiveIntValue */
            positiveIntValue?: (number|Long|string|null);

            /** UninterpretedOption negativeIntValue */
            negativeIntValue?: (number|Long|string|null);

            /** UninterpretedOption doubleValue */
            doubleValue?: (number|null);

            /** UninterpretedOption stringValue */
            stringValue?: (Uint8Array|string|null);

            /** UninterpretedOption aggregateValue */
            aggregateValue?: (string|null);
        }

        /** Represents an UninterpretedOption. */
        class UninterpretedOption implements IUninterpretedOption {

            /**
             * Constructs a new UninterpretedOption.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IUninterpretedOption);

            /** UninterpretedOption name. */
            public name: google.protobuf.UninterpretedOption.INamePart[];

            /** UninterpretedOption identifierValue. */
            public identifierValue: string;

            /** UninterpretedOption positiveIntValue. */
            public positiveIntValue: (number|Long|string);

            /** UninterpretedOption negativeIntValue. */
            public negativeIntValue: (number|Long|string);

            /** UninterpretedOption doubleValue. */
            public doubleValue: number;

            /** UninterpretedOption stringValue. */
            public stringValue: (Uint8Array|string);

            /** UninterpretedOption aggregateValue. */
            public aggregateValue: string;

            /**
             * Creates a new UninterpretedOption instance using the specified properties.
             * @param [properties] Properties to set
             * @returns UninterpretedOption instance
             */
            public static create(properties?: google.protobuf.IUninterpretedOption): google.protobuf.UninterpretedOption;

            /**
             * Encodes the specified UninterpretedOption message. Does not implicitly {@link google.protobuf.UninterpretedOption.verify|verify} messages.
             * @param message UninterpretedOption message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IUninterpretedOption, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified UninterpretedOption message, length delimited. Does not implicitly {@link google.protobuf.UninterpretedOption.verify|verify} messages.
             * @param message UninterpretedOption message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IUninterpretedOption, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns UninterpretedOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption;

            /**
             * Decodes an UninterpretedOption message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns UninterpretedOption
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption;

            /**
             * Verifies an UninterpretedOption message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an UninterpretedOption message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns UninterpretedOption
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption;

            /**
             * Creates a plain object from an UninterpretedOption message. Also converts values to other types if specified.
             * @param message UninterpretedOption
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.UninterpretedOption, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this UninterpretedOption to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace UninterpretedOption {

            /** Properties of a NamePart. */
            interface INamePart {

                /** NamePart namePart */
                namePart: string;

                /** NamePart isExtension */
                isExtension: boolean;
            }

            /** Represents a NamePart. */
            class NamePart implements INamePart {

                /**
                 * Constructs a new NamePart.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.UninterpretedOption.INamePart);

                /** NamePart namePart. */
                public namePart: string;

                /** NamePart isExtension. */
                public isExtension: boolean;

                /**
                 * Creates a new NamePart instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns NamePart instance
                 */
                public static create(properties?: google.protobuf.UninterpretedOption.INamePart): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Encodes the specified NamePart message. Does not implicitly {@link google.protobuf.UninterpretedOption.NamePart.verify|verify} messages.
                 * @param message NamePart message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.UninterpretedOption.INamePart, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified NamePart message, length delimited. Does not implicitly {@link google.protobuf.UninterpretedOption.NamePart.verify|verify} messages.
                 * @param message NamePart message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.UninterpretedOption.INamePart, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a NamePart message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns NamePart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Decodes a NamePart message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns NamePart
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Verifies a NamePart message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a NamePart message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns NamePart
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.UninterpretedOption.NamePart;

                /**
                 * Creates a plain object from a NamePart message. Also converts values to other types if specified.
                 * @param message NamePart
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.UninterpretedOption.NamePart, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this NamePart to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a SourceCodeInfo. */
        interface ISourceCodeInfo {

            /** SourceCodeInfo location */
            location?: (google.protobuf.SourceCodeInfo.ILocation[]|null);
        }

        /** Represents a SourceCodeInfo. */
        class SourceCodeInfo implements ISourceCodeInfo {

            /**
             * Constructs a new SourceCodeInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ISourceCodeInfo);

            /** SourceCodeInfo location. */
            public location: google.protobuf.SourceCodeInfo.ILocation[];

            /**
             * Creates a new SourceCodeInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns SourceCodeInfo instance
             */
            public static create(properties?: google.protobuf.ISourceCodeInfo): google.protobuf.SourceCodeInfo;

            /**
             * Encodes the specified SourceCodeInfo message. Does not implicitly {@link google.protobuf.SourceCodeInfo.verify|verify} messages.
             * @param message SourceCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ISourceCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified SourceCodeInfo message, length delimited. Does not implicitly {@link google.protobuf.SourceCodeInfo.verify|verify} messages.
             * @param message SourceCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ISourceCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns SourceCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo;

            /**
             * Decodes a SourceCodeInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns SourceCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo;

            /**
             * Verifies a SourceCodeInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a SourceCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns SourceCodeInfo
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo;

            /**
             * Creates a plain object from a SourceCodeInfo message. Also converts values to other types if specified.
             * @param message SourceCodeInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.SourceCodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this SourceCodeInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace SourceCodeInfo {

            /** Properties of a Location. */
            interface ILocation {

                /** Location path */
                path?: (number[]|null);

                /** Location span */
                span?: (number[]|null);

                /** Location leadingComments */
                leadingComments?: (string|null);

                /** Location trailingComments */
                trailingComments?: (string|null);

                /** Location leadingDetachedComments */
                leadingDetachedComments?: (string[]|null);
            }

            /** Represents a Location. */
            class Location implements ILocation {

                /**
                 * Constructs a new Location.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.SourceCodeInfo.ILocation);

                /** Location path. */
                public path: number[];

                /** Location span. */
                public span: number[];

                /** Location leadingComments. */
                public leadingComments: string;

                /** Location trailingComments. */
                public trailingComments: string;

                /** Location leadingDetachedComments. */
                public leadingDetachedComments: string[];

                /**
                 * Creates a new Location instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Location instance
                 */
                public static create(properties?: google.protobuf.SourceCodeInfo.ILocation): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Encodes the specified Location message. Does not implicitly {@link google.protobuf.SourceCodeInfo.Location.verify|verify} messages.
                 * @param message Location message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.SourceCodeInfo.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Location message, length delimited. Does not implicitly {@link google.protobuf.SourceCodeInfo.Location.verify|verify} messages.
                 * @param message Location message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.SourceCodeInfo.ILocation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Location message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Location
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Decodes a Location message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Location
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Verifies a Location message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Location message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Location
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.SourceCodeInfo.Location;

                /**
                 * Creates a plain object from a Location message. Also converts values to other types if specified.
                 * @param message Location
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.SourceCodeInfo.Location, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Location to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a GeneratedCodeInfo. */
        interface IGeneratedCodeInfo {

            /** GeneratedCodeInfo annotation */
            annotation?: (google.protobuf.GeneratedCodeInfo.IAnnotation[]|null);
        }

        /** Represents a GeneratedCodeInfo. */
        class GeneratedCodeInfo implements IGeneratedCodeInfo {

            /**
             * Constructs a new GeneratedCodeInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IGeneratedCodeInfo);

            /** GeneratedCodeInfo annotation. */
            public annotation: google.protobuf.GeneratedCodeInfo.IAnnotation[];

            /**
             * Creates a new GeneratedCodeInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GeneratedCodeInfo instance
             */
            public static create(properties?: google.protobuf.IGeneratedCodeInfo): google.protobuf.GeneratedCodeInfo;

            /**
             * Encodes the specified GeneratedCodeInfo message. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.verify|verify} messages.
             * @param message GeneratedCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IGeneratedCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GeneratedCodeInfo message, length delimited. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.verify|verify} messages.
             * @param message GeneratedCodeInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IGeneratedCodeInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GeneratedCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo;

            /**
             * Decodes a GeneratedCodeInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GeneratedCodeInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo;

            /**
             * Verifies a GeneratedCodeInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GeneratedCodeInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GeneratedCodeInfo
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo;

            /**
             * Creates a plain object from a GeneratedCodeInfo message. Also converts values to other types if specified.
             * @param message GeneratedCodeInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.GeneratedCodeInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GeneratedCodeInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace GeneratedCodeInfo {

            /** Properties of an Annotation. */
            interface IAnnotation {

                /** Annotation path */
                path?: (number[]|null);

                /** Annotation sourceFile */
                sourceFile?: (string|null);

                /** Annotation begin */
                begin?: (number|null);

                /** Annotation end */
                end?: (number|null);
            }

            /** Represents an Annotation. */
            class Annotation implements IAnnotation {

                /**
                 * Constructs a new Annotation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.protobuf.GeneratedCodeInfo.IAnnotation);

                /** Annotation path. */
                public path: number[];

                /** Annotation sourceFile. */
                public sourceFile: string;

                /** Annotation begin. */
                public begin: number;

                /** Annotation end. */
                public end: number;

                /**
                 * Creates a new Annotation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Annotation instance
                 */
                public static create(properties?: google.protobuf.GeneratedCodeInfo.IAnnotation): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Encodes the specified Annotation message. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.Annotation.verify|verify} messages.
                 * @param message Annotation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.protobuf.GeneratedCodeInfo.IAnnotation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Annotation message, length delimited. Does not implicitly {@link google.protobuf.GeneratedCodeInfo.Annotation.verify|verify} messages.
                 * @param message Annotation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.protobuf.GeneratedCodeInfo.IAnnotation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes an Annotation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Annotation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Decodes an Annotation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Annotation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Verifies an Annotation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates an Annotation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Annotation
                 */
                public static fromObject(object: { [k: string]: any }): google.protobuf.GeneratedCodeInfo.Annotation;

                /**
                 * Creates a plain object from an Annotation message. Also converts values to other types if specified.
                 * @param message Annotation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.protobuf.GeneratedCodeInfo.Annotation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Annotation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of an Any. */
        interface IAny {

            /** Any type_url */
            type_url?: (string|null);

            /** Any value */
            value?: (Uint8Array|string|null);
        }

        /** Represents an Any. */
        class Any implements IAny {

            /**
             * Constructs a new Any.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IAny);

            /** Any type_url. */
            public type_url: string;

            /** Any value. */
            public value: (Uint8Array|string);

            /**
             * Creates a new Any instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Any instance
             */
            public static create(properties?: google.protobuf.IAny): google.protobuf.Any;

            /**
             * Encodes the specified Any message. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Any message, length delimited. Does not implicitly {@link google.protobuf.Any.verify|verify} messages.
             * @param message Any message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IAny, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Any message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Any;

            /**
             * Decodes an Any message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Any
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Any;

            /**
             * Verifies an Any message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Any message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Any
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Any;

            /**
             * Creates a plain object from an Any message. Also converts values to other types if specified.
             * @param message Any
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Any, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Any to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Duration. */
        interface IDuration {

            /** Duration seconds */
            seconds?: (number|Long|string|null);

            /** Duration nanos */
            nanos?: (number|null);
        }

        /** Represents a Duration. */
        class Duration implements IDuration {

            /**
             * Constructs a new Duration.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IDuration);

            /** Duration seconds. */
            public seconds: (number|Long|string);

            /** Duration nanos. */
            public nanos: number;

            /**
             * Creates a new Duration instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Duration instance
             */
            public static create(properties?: google.protobuf.IDuration): google.protobuf.Duration;

            /**
             * Encodes the specified Duration message. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
             * @param message Duration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IDuration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Duration message, length delimited. Does not implicitly {@link google.protobuf.Duration.verify|verify} messages.
             * @param message Duration message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IDuration, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Duration message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Duration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Duration;

            /**
             * Decodes a Duration message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Duration
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Duration;

            /**
             * Verifies a Duration message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Duration message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Duration
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Duration;

            /**
             * Creates a plain object from a Duration message. Also converts values to other types if specified.
             * @param message Duration
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Duration, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Duration to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an Empty. */
        interface IEmpty {
        }

        /** Represents an Empty. */
        class Empty implements IEmpty {

            /**
             * Constructs a new Empty.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IEmpty);

            /**
             * Creates a new Empty instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Empty instance
             */
            public static create(properties?: google.protobuf.IEmpty): google.protobuf.Empty;

            /**
             * Encodes the specified Empty message. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Empty message, length delimited. Does not implicitly {@link google.protobuf.Empty.verify|verify} messages.
             * @param message Empty message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IEmpty, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Empty message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Empty;

            /**
             * Decodes an Empty message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Empty
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Empty;

            /**
             * Verifies an Empty message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Empty message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Empty
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Empty;

            /**
             * Creates a plain object from an Empty message. Also converts values to other types if specified.
             * @param message Empty
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Empty, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Empty to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Timestamp. */
        interface ITimestamp {

            /** Timestamp seconds */
            seconds?: (number|Long|string|null);

            /** Timestamp nanos */
            nanos?: (number|null);
        }

        /** Represents a Timestamp. */
        class Timestamp implements ITimestamp {

            /**
             * Constructs a new Timestamp.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.ITimestamp);

            /** Timestamp seconds. */
            public seconds: (number|Long|string);

            /** Timestamp nanos. */
            public nanos: number;

            /**
             * Creates a new Timestamp instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Timestamp instance
             */
            public static create(properties?: google.protobuf.ITimestamp): google.protobuf.Timestamp;

            /**
             * Encodes the specified Timestamp message. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Timestamp message, length delimited. Does not implicitly {@link google.protobuf.Timestamp.verify|verify} messages.
             * @param message Timestamp message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.ITimestamp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Timestamp message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.Timestamp;

            /**
             * Decodes a Timestamp message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Timestamp
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.Timestamp;

            /**
             * Verifies a Timestamp message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Timestamp message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Timestamp
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.Timestamp;

            /**
             * Creates a plain object from a Timestamp message. Also converts values to other types if specified.
             * @param message Timestamp
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.Timestamp, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Timestamp to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a FieldMask. */
        interface IFieldMask {

            /** FieldMask paths */
            paths?: (string[]|null);
        }

        /** Represents a FieldMask. */
        class FieldMask implements IFieldMask {

            /**
             * Constructs a new FieldMask.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.protobuf.IFieldMask);

            /** FieldMask paths. */
            public paths: string[];

            /**
             * Creates a new FieldMask instance using the specified properties.
             * @param [properties] Properties to set
             * @returns FieldMask instance
             */
            public static create(properties?: google.protobuf.IFieldMask): google.protobuf.FieldMask;

            /**
             * Encodes the specified FieldMask message. Does not implicitly {@link google.protobuf.FieldMask.verify|verify} messages.
             * @param message FieldMask message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.protobuf.IFieldMask, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified FieldMask message, length delimited. Does not implicitly {@link google.protobuf.FieldMask.verify|verify} messages.
             * @param message FieldMask message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.protobuf.IFieldMask, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a FieldMask message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns FieldMask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.protobuf.FieldMask;

            /**
             * Decodes a FieldMask message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns FieldMask
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.protobuf.FieldMask;

            /**
             * Verifies a FieldMask message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a FieldMask message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns FieldMask
             */
            public static fromObject(object: { [k: string]: any }): google.protobuf.FieldMask;

            /**
             * Creates a plain object from a FieldMask message. Also converts values to other types if specified.
             * @param message FieldMask
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.protobuf.FieldMask, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this FieldMask to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Namespace longrunning. */
    namespace longrunning {

        /** Represents an Operations */
        class Operations extends $protobuf.rpc.Service {

            /**
             * Constructs a new Operations service.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             */
            constructor(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean);

            /**
             * Creates new Operations service using the specified rpc implementation.
             * @param rpcImpl RPC implementation
             * @param [requestDelimited=false] Whether requests are length-delimited
             * @param [responseDelimited=false] Whether responses are length-delimited
             * @returns RPC service. Useful where requests and/or responses are streamed.
             */
            public static create(rpcImpl: $protobuf.RPCImpl, requestDelimited?: boolean, responseDelimited?: boolean): Operations;

            /**
             * Calls ListOperations.
             * @param request ListOperationsRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and ListOperationsResponse
             */
            public listOperations(request: google.longrunning.IListOperationsRequest, callback: google.longrunning.Operations.ListOperationsCallback): void;

            /**
             * Calls ListOperations.
             * @param request ListOperationsRequest message or plain object
             * @returns Promise
             */
            public listOperations(request: google.longrunning.IListOperationsRequest): Promise<google.longrunning.ListOperationsResponse>;

            /**
             * Calls GetOperation.
             * @param request GetOperationRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and Operation
             */
            public getOperation(request: google.longrunning.IGetOperationRequest, callback: google.longrunning.Operations.GetOperationCallback): void;

            /**
             * Calls GetOperation.
             * @param request GetOperationRequest message or plain object
             * @returns Promise
             */
            public getOperation(request: google.longrunning.IGetOperationRequest): Promise<google.longrunning.Operation>;

            /**
             * Calls DeleteOperation.
             * @param request DeleteOperationRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and Empty
             */
            public deleteOperation(request: google.longrunning.IDeleteOperationRequest, callback: google.longrunning.Operations.DeleteOperationCallback): void;

            /**
             * Calls DeleteOperation.
             * @param request DeleteOperationRequest message or plain object
             * @returns Promise
             */
            public deleteOperation(request: google.longrunning.IDeleteOperationRequest): Promise<google.protobuf.Empty>;

            /**
             * Calls CancelOperation.
             * @param request CancelOperationRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and Empty
             */
            public cancelOperation(request: google.longrunning.ICancelOperationRequest, callback: google.longrunning.Operations.CancelOperationCallback): void;

            /**
             * Calls CancelOperation.
             * @param request CancelOperationRequest message or plain object
             * @returns Promise
             */
            public cancelOperation(request: google.longrunning.ICancelOperationRequest): Promise<google.protobuf.Empty>;

            /**
             * Calls WaitOperation.
             * @param request WaitOperationRequest message or plain object
             * @param callback Node-style callback called with the error, if any, and Operation
             */
            public waitOperation(request: google.longrunning.IWaitOperationRequest, callback: google.longrunning.Operations.WaitOperationCallback): void;

            /**
             * Calls WaitOperation.
             * @param request WaitOperationRequest message or plain object
             * @returns Promise
             */
            public waitOperation(request: google.longrunning.IWaitOperationRequest): Promise<google.longrunning.Operation>;
        }

        namespace Operations {

            /**
             * Callback as used by {@link google.longrunning.Operations#listOperations}.
             * @param error Error, if any
             * @param [response] ListOperationsResponse
             */
            type ListOperationsCallback = (error: (Error|null), response?: google.longrunning.ListOperationsResponse) => void;

            /**
             * Callback as used by {@link google.longrunning.Operations#getOperation}.
             * @param error Error, if any
             * @param [response] Operation
             */
            type GetOperationCallback = (error: (Error|null), response?: google.longrunning.Operation) => void;

            /**
             * Callback as used by {@link google.longrunning.Operations#deleteOperation}.
             * @param error Error, if any
             * @param [response] Empty
             */
            type DeleteOperationCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

            /**
             * Callback as used by {@link google.longrunning.Operations#cancelOperation}.
             * @param error Error, if any
             * @param [response] Empty
             */
            type CancelOperationCallback = (error: (Error|null), response?: google.protobuf.Empty) => void;

            /**
             * Callback as used by {@link google.longrunning.Operations#waitOperation}.
             * @param error Error, if any
             * @param [response] Operation
             */
            type WaitOperationCallback = (error: (Error|null), response?: google.longrunning.Operation) => void;
        }

        /** Properties of an Operation. */
        interface IOperation {

            /** Operation name */
            name?: (string|null);

            /** Operation metadata */
            metadata?: (google.protobuf.IAny|null);

            /** Operation done */
            done?: (boolean|null);

            /** Operation error */
            error?: (google.rpc.IStatus|null);

            /** Operation response */
            response?: (google.protobuf.IAny|null);
        }

        /** Represents an Operation. */
        class Operation implements IOperation {

            /**
             * Constructs a new Operation.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.longrunning.IOperation);

            /** Operation name. */
            public name: string;

            /** Operation metadata. */
            public metadata?: (google.protobuf.IAny|null);

            /** Operation done. */
            public done: boolean;

            /** Operation error. */
            public error?: (google.rpc.IStatus|null);

            /** Operation response. */
            public response?: (google.protobuf.IAny|null);

            /** Operation result. */
            public result?: ("error"|"response");

            /**
             * Creates a new Operation instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Operation instance
             */
            public static create(properties?: google.longrunning.IOperation): google.longrunning.Operation;

            /**
             * Encodes the specified Operation message. Does not implicitly {@link google.longrunning.Operation.verify|verify} messages.
             * @param message Operation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.longrunning.IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Operation message, length delimited. Does not implicitly {@link google.longrunning.Operation.verify|verify} messages.
             * @param message Operation message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.longrunning.IOperation, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an Operation message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.longrunning.Operation;

            /**
             * Decodes an Operation message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Operation
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.longrunning.Operation;

            /**
             * Verifies an Operation message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an Operation message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Operation
             */
            public static fromObject(object: { [k: string]: any }): google.longrunning.Operation;

            /**
             * Creates a plain object from an Operation message. Also converts values to other types if specified.
             * @param message Operation
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.longrunning.Operation, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Operation to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a GetOperationRequest. */
        interface IGetOperationRequest {

            /** GetOperationRequest name */
            name?: (string|null);
        }

        /** Represents a GetOperationRequest. */
        class GetOperationRequest implements IGetOperationRequest {

            /**
             * Constructs a new GetOperationRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.longrunning.IGetOperationRequest);

            /** GetOperationRequest name. */
            public name: string;

            /**
             * Creates a new GetOperationRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns GetOperationRequest instance
             */
            public static create(properties?: google.longrunning.IGetOperationRequest): google.longrunning.GetOperationRequest;

            /**
             * Encodes the specified GetOperationRequest message. Does not implicitly {@link google.longrunning.GetOperationRequest.verify|verify} messages.
             * @param message GetOperationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.longrunning.IGetOperationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified GetOperationRequest message, length delimited. Does not implicitly {@link google.longrunning.GetOperationRequest.verify|verify} messages.
             * @param message GetOperationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.longrunning.IGetOperationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a GetOperationRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns GetOperationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.longrunning.GetOperationRequest;

            /**
             * Decodes a GetOperationRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns GetOperationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.longrunning.GetOperationRequest;

            /**
             * Verifies a GetOperationRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a GetOperationRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns GetOperationRequest
             */
            public static fromObject(object: { [k: string]: any }): google.longrunning.GetOperationRequest;

            /**
             * Creates a plain object from a GetOperationRequest message. Also converts values to other types if specified.
             * @param message GetOperationRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.longrunning.GetOperationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this GetOperationRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ListOperationsRequest. */
        interface IListOperationsRequest {

            /** ListOperationsRequest name */
            name?: (string|null);

            /** ListOperationsRequest filter */
            filter?: (string|null);

            /** ListOperationsRequest pageSize */
            pageSize?: (number|null);

            /** ListOperationsRequest pageToken */
            pageToken?: (string|null);
        }

        /** Represents a ListOperationsRequest. */
        class ListOperationsRequest implements IListOperationsRequest {

            /**
             * Constructs a new ListOperationsRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.longrunning.IListOperationsRequest);

            /** ListOperationsRequest name. */
            public name: string;

            /** ListOperationsRequest filter. */
            public filter: string;

            /** ListOperationsRequest pageSize. */
            public pageSize: number;

            /** ListOperationsRequest pageToken. */
            public pageToken: string;

            /**
             * Creates a new ListOperationsRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListOperationsRequest instance
             */
            public static create(properties?: google.longrunning.IListOperationsRequest): google.longrunning.ListOperationsRequest;

            /**
             * Encodes the specified ListOperationsRequest message. Does not implicitly {@link google.longrunning.ListOperationsRequest.verify|verify} messages.
             * @param message ListOperationsRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.longrunning.IListOperationsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListOperationsRequest message, length delimited. Does not implicitly {@link google.longrunning.ListOperationsRequest.verify|verify} messages.
             * @param message ListOperationsRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.longrunning.IListOperationsRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListOperationsRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListOperationsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.longrunning.ListOperationsRequest;

            /**
             * Decodes a ListOperationsRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListOperationsRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.longrunning.ListOperationsRequest;

            /**
             * Verifies a ListOperationsRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListOperationsRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListOperationsRequest
             */
            public static fromObject(object: { [k: string]: any }): google.longrunning.ListOperationsRequest;

            /**
             * Creates a plain object from a ListOperationsRequest message. Also converts values to other types if specified.
             * @param message ListOperationsRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.longrunning.ListOperationsRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListOperationsRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ListOperationsResponse. */
        interface IListOperationsResponse {

            /** ListOperationsResponse operations */
            operations?: (google.longrunning.IOperation[]|null);

            /** ListOperationsResponse nextPageToken */
            nextPageToken?: (string|null);
        }

        /** Represents a ListOperationsResponse. */
        class ListOperationsResponse implements IListOperationsResponse {

            /**
             * Constructs a new ListOperationsResponse.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.longrunning.IListOperationsResponse);

            /** ListOperationsResponse operations. */
            public operations: google.longrunning.IOperation[];

            /** ListOperationsResponse nextPageToken. */
            public nextPageToken: string;

            /**
             * Creates a new ListOperationsResponse instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ListOperationsResponse instance
             */
            public static create(properties?: google.longrunning.IListOperationsResponse): google.longrunning.ListOperationsResponse;

            /**
             * Encodes the specified ListOperationsResponse message. Does not implicitly {@link google.longrunning.ListOperationsResponse.verify|verify} messages.
             * @param message ListOperationsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.longrunning.IListOperationsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ListOperationsResponse message, length delimited. Does not implicitly {@link google.longrunning.ListOperationsResponse.verify|verify} messages.
             * @param message ListOperationsResponse message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.longrunning.IListOperationsResponse, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ListOperationsResponse message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ListOperationsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.longrunning.ListOperationsResponse;

            /**
             * Decodes a ListOperationsResponse message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ListOperationsResponse
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.longrunning.ListOperationsResponse;

            /**
             * Verifies a ListOperationsResponse message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ListOperationsResponse message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ListOperationsResponse
             */
            public static fromObject(object: { [k: string]: any }): google.longrunning.ListOperationsResponse;

            /**
             * Creates a plain object from a ListOperationsResponse message. Also converts values to other types if specified.
             * @param message ListOperationsResponse
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.longrunning.ListOperationsResponse, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ListOperationsResponse to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a CancelOperationRequest. */
        interface ICancelOperationRequest {

            /** CancelOperationRequest name */
            name?: (string|null);
        }

        /** Represents a CancelOperationRequest. */
        class CancelOperationRequest implements ICancelOperationRequest {

            /**
             * Constructs a new CancelOperationRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.longrunning.ICancelOperationRequest);

            /** CancelOperationRequest name. */
            public name: string;

            /**
             * Creates a new CancelOperationRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns CancelOperationRequest instance
             */
            public static create(properties?: google.longrunning.ICancelOperationRequest): google.longrunning.CancelOperationRequest;

            /**
             * Encodes the specified CancelOperationRequest message. Does not implicitly {@link google.longrunning.CancelOperationRequest.verify|verify} messages.
             * @param message CancelOperationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.longrunning.ICancelOperationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified CancelOperationRequest message, length delimited. Does not implicitly {@link google.longrunning.CancelOperationRequest.verify|verify} messages.
             * @param message CancelOperationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.longrunning.ICancelOperationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a CancelOperationRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns CancelOperationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.longrunning.CancelOperationRequest;

            /**
             * Decodes a CancelOperationRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns CancelOperationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.longrunning.CancelOperationRequest;

            /**
             * Verifies a CancelOperationRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a CancelOperationRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns CancelOperationRequest
             */
            public static fromObject(object: { [k: string]: any }): google.longrunning.CancelOperationRequest;

            /**
             * Creates a plain object from a CancelOperationRequest message. Also converts values to other types if specified.
             * @param message CancelOperationRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.longrunning.CancelOperationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this CancelOperationRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DeleteOperationRequest. */
        interface IDeleteOperationRequest {

            /** DeleteOperationRequest name */
            name?: (string|null);
        }

        /** Represents a DeleteOperationRequest. */
        class DeleteOperationRequest implements IDeleteOperationRequest {

            /**
             * Constructs a new DeleteOperationRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.longrunning.IDeleteOperationRequest);

            /** DeleteOperationRequest name. */
            public name: string;

            /**
             * Creates a new DeleteOperationRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DeleteOperationRequest instance
             */
            public static create(properties?: google.longrunning.IDeleteOperationRequest): google.longrunning.DeleteOperationRequest;

            /**
             * Encodes the specified DeleteOperationRequest message. Does not implicitly {@link google.longrunning.DeleteOperationRequest.verify|verify} messages.
             * @param message DeleteOperationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.longrunning.IDeleteOperationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DeleteOperationRequest message, length delimited. Does not implicitly {@link google.longrunning.DeleteOperationRequest.verify|verify} messages.
             * @param message DeleteOperationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.longrunning.IDeleteOperationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DeleteOperationRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DeleteOperationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.longrunning.DeleteOperationRequest;

            /**
             * Decodes a DeleteOperationRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DeleteOperationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.longrunning.DeleteOperationRequest;

            /**
             * Verifies a DeleteOperationRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DeleteOperationRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DeleteOperationRequest
             */
            public static fromObject(object: { [k: string]: any }): google.longrunning.DeleteOperationRequest;

            /**
             * Creates a plain object from a DeleteOperationRequest message. Also converts values to other types if specified.
             * @param message DeleteOperationRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.longrunning.DeleteOperationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DeleteOperationRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a WaitOperationRequest. */
        interface IWaitOperationRequest {

            /** WaitOperationRequest name */
            name?: (string|null);

            /** WaitOperationRequest timeout */
            timeout?: (google.protobuf.IDuration|null);
        }

        /** Represents a WaitOperationRequest. */
        class WaitOperationRequest implements IWaitOperationRequest {

            /**
             * Constructs a new WaitOperationRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.longrunning.IWaitOperationRequest);

            /** WaitOperationRequest name. */
            public name: string;

            /** WaitOperationRequest timeout. */
            public timeout?: (google.protobuf.IDuration|null);

            /**
             * Creates a new WaitOperationRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns WaitOperationRequest instance
             */
            public static create(properties?: google.longrunning.IWaitOperationRequest): google.longrunning.WaitOperationRequest;

            /**
             * Encodes the specified WaitOperationRequest message. Does not implicitly {@link google.longrunning.WaitOperationRequest.verify|verify} messages.
             * @param message WaitOperationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.longrunning.IWaitOperationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified WaitOperationRequest message, length delimited. Does not implicitly {@link google.longrunning.WaitOperationRequest.verify|verify} messages.
             * @param message WaitOperationRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.longrunning.IWaitOperationRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a WaitOperationRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns WaitOperationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.longrunning.WaitOperationRequest;

            /**
             * Decodes a WaitOperationRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns WaitOperationRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.longrunning.WaitOperationRequest;

            /**
             * Verifies a WaitOperationRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a WaitOperationRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns WaitOperationRequest
             */
            public static fromObject(object: { [k: string]: any }): google.longrunning.WaitOperationRequest;

            /**
             * Creates a plain object from a WaitOperationRequest message. Also converts values to other types if specified.
             * @param message WaitOperationRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.longrunning.WaitOperationRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this WaitOperationRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of an OperationInfo. */
        interface IOperationInfo {

            /** OperationInfo responseType */
            responseType?: (string|null);

            /** OperationInfo metadataType */
            metadataType?: (string|null);
        }

        /** Represents an OperationInfo. */
        class OperationInfo implements IOperationInfo {

            /**
             * Constructs a new OperationInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.longrunning.IOperationInfo);

            /** OperationInfo responseType. */
            public responseType: string;

            /** OperationInfo metadataType. */
            public metadataType: string;

            /**
             * Creates a new OperationInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns OperationInfo instance
             */
            public static create(properties?: google.longrunning.IOperationInfo): google.longrunning.OperationInfo;

            /**
             * Encodes the specified OperationInfo message. Does not implicitly {@link google.longrunning.OperationInfo.verify|verify} messages.
             * @param message OperationInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.longrunning.IOperationInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified OperationInfo message, length delimited. Does not implicitly {@link google.longrunning.OperationInfo.verify|verify} messages.
             * @param message OperationInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.longrunning.IOperationInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an OperationInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns OperationInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.longrunning.OperationInfo;

            /**
             * Decodes an OperationInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns OperationInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.longrunning.OperationInfo;

            /**
             * Verifies an OperationInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an OperationInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns OperationInfo
             */
            public static fromObject(object: { [k: string]: any }): google.longrunning.OperationInfo;

            /**
             * Creates a plain object from an OperationInfo message. Also converts values to other types if specified.
             * @param message OperationInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.longrunning.OperationInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this OperationInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }

    /** Namespace rpc. */
    namespace rpc {

        /** Properties of a Status. */
        interface IStatus {

            /** Status code */
            code?: (number|null);

            /** Status message */
            message?: (string|null);

            /** Status details */
            details?: (google.protobuf.IAny[]|null);
        }

        /** Represents a Status. */
        class Status implements IStatus {

            /**
             * Constructs a new Status.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IStatus);

            /** Status code. */
            public code: number;

            /** Status message. */
            public message: string;

            /** Status details. */
            public details: google.protobuf.IAny[];

            /**
             * Creates a new Status instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Status instance
             */
            public static create(properties?: google.rpc.IStatus): google.rpc.Status;

            /**
             * Encodes the specified Status message. Does not implicitly {@link google.rpc.Status.verify|verify} messages.
             * @param message Status message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IStatus, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Status message, length delimited. Does not implicitly {@link google.rpc.Status.verify|verify} messages.
             * @param message Status message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IStatus, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Status message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Status
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.Status;

            /**
             * Decodes a Status message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Status
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.Status;

            /**
             * Verifies a Status message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Status message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Status
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.Status;

            /**
             * Creates a plain object from a Status message. Also converts values to other types if specified.
             * @param message Status
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.Status, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Status to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a RetryInfo. */
        interface IRetryInfo {

            /** RetryInfo retryDelay */
            retryDelay?: (google.protobuf.IDuration|null);
        }

        /** Represents a RetryInfo. */
        class RetryInfo implements IRetryInfo {

            /**
             * Constructs a new RetryInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IRetryInfo);

            /** RetryInfo retryDelay. */
            public retryDelay?: (google.protobuf.IDuration|null);

            /**
             * Creates a new RetryInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RetryInfo instance
             */
            public static create(properties?: google.rpc.IRetryInfo): google.rpc.RetryInfo;

            /**
             * Encodes the specified RetryInfo message. Does not implicitly {@link google.rpc.RetryInfo.verify|verify} messages.
             * @param message RetryInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IRetryInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RetryInfo message, length delimited. Does not implicitly {@link google.rpc.RetryInfo.verify|verify} messages.
             * @param message RetryInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IRetryInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RetryInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RetryInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.RetryInfo;

            /**
             * Decodes a RetryInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RetryInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.RetryInfo;

            /**
             * Verifies a RetryInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RetryInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RetryInfo
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.RetryInfo;

            /**
             * Creates a plain object from a RetryInfo message. Also converts values to other types if specified.
             * @param message RetryInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.RetryInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RetryInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a DebugInfo. */
        interface IDebugInfo {

            /** DebugInfo stackEntries */
            stackEntries?: (string[]|null);

            /** DebugInfo detail */
            detail?: (string|null);
        }

        /** Represents a DebugInfo. */
        class DebugInfo implements IDebugInfo {

            /**
             * Constructs a new DebugInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IDebugInfo);

            /** DebugInfo stackEntries. */
            public stackEntries: string[];

            /** DebugInfo detail. */
            public detail: string;

            /**
             * Creates a new DebugInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns DebugInfo instance
             */
            public static create(properties?: google.rpc.IDebugInfo): google.rpc.DebugInfo;

            /**
             * Encodes the specified DebugInfo message. Does not implicitly {@link google.rpc.DebugInfo.verify|verify} messages.
             * @param message DebugInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IDebugInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified DebugInfo message, length delimited. Does not implicitly {@link google.rpc.DebugInfo.verify|verify} messages.
             * @param message DebugInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IDebugInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a DebugInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns DebugInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.DebugInfo;

            /**
             * Decodes a DebugInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns DebugInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.DebugInfo;

            /**
             * Verifies a DebugInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a DebugInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns DebugInfo
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.DebugInfo;

            /**
             * Creates a plain object from a DebugInfo message. Also converts values to other types if specified.
             * @param message DebugInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.DebugInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this DebugInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a QuotaFailure. */
        interface IQuotaFailure {

            /** QuotaFailure violations */
            violations?: (google.rpc.QuotaFailure.IViolation[]|null);
        }

        /** Represents a QuotaFailure. */
        class QuotaFailure implements IQuotaFailure {

            /**
             * Constructs a new QuotaFailure.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IQuotaFailure);

            /** QuotaFailure violations. */
            public violations: google.rpc.QuotaFailure.IViolation[];

            /**
             * Creates a new QuotaFailure instance using the specified properties.
             * @param [properties] Properties to set
             * @returns QuotaFailure instance
             */
            public static create(properties?: google.rpc.IQuotaFailure): google.rpc.QuotaFailure;

            /**
             * Encodes the specified QuotaFailure message. Does not implicitly {@link google.rpc.QuotaFailure.verify|verify} messages.
             * @param message QuotaFailure message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IQuotaFailure, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified QuotaFailure message, length delimited. Does not implicitly {@link google.rpc.QuotaFailure.verify|verify} messages.
             * @param message QuotaFailure message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IQuotaFailure, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a QuotaFailure message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns QuotaFailure
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.QuotaFailure;

            /**
             * Decodes a QuotaFailure message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns QuotaFailure
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.QuotaFailure;

            /**
             * Verifies a QuotaFailure message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a QuotaFailure message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns QuotaFailure
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.QuotaFailure;

            /**
             * Creates a plain object from a QuotaFailure message. Also converts values to other types if specified.
             * @param message QuotaFailure
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.QuotaFailure, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this QuotaFailure to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace QuotaFailure {

            /** Properties of a Violation. */
            interface IViolation {

                /** Violation subject */
                subject?: (string|null);

                /** Violation description */
                description?: (string|null);
            }

            /** Represents a Violation. */
            class Violation implements IViolation {

                /**
                 * Constructs a new Violation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.rpc.QuotaFailure.IViolation);

                /** Violation subject. */
                public subject: string;

                /** Violation description. */
                public description: string;

                /**
                 * Creates a new Violation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Violation instance
                 */
                public static create(properties?: google.rpc.QuotaFailure.IViolation): google.rpc.QuotaFailure.Violation;

                /**
                 * Encodes the specified Violation message. Does not implicitly {@link google.rpc.QuotaFailure.Violation.verify|verify} messages.
                 * @param message Violation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.rpc.QuotaFailure.IViolation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Violation message, length delimited. Does not implicitly {@link google.rpc.QuotaFailure.Violation.verify|verify} messages.
                 * @param message Violation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.rpc.QuotaFailure.IViolation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Violation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Violation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.QuotaFailure.Violation;

                /**
                 * Decodes a Violation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Violation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.QuotaFailure.Violation;

                /**
                 * Verifies a Violation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Violation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Violation
                 */
                public static fromObject(object: { [k: string]: any }): google.rpc.QuotaFailure.Violation;

                /**
                 * Creates a plain object from a Violation message. Also converts values to other types if specified.
                 * @param message Violation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.rpc.QuotaFailure.Violation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Violation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of an ErrorInfo. */
        interface IErrorInfo {

            /** ErrorInfo reason */
            reason?: (string|null);

            /** ErrorInfo domain */
            domain?: (string|null);

            /** ErrorInfo metadata */
            metadata?: ({ [k: string]: string }|null);
        }

        /** Represents an ErrorInfo. */
        class ErrorInfo implements IErrorInfo {

            /**
             * Constructs a new ErrorInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IErrorInfo);

            /** ErrorInfo reason. */
            public reason: string;

            /** ErrorInfo domain. */
            public domain: string;

            /** ErrorInfo metadata. */
            public metadata: { [k: string]: string };

            /**
             * Creates a new ErrorInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ErrorInfo instance
             */
            public static create(properties?: google.rpc.IErrorInfo): google.rpc.ErrorInfo;

            /**
             * Encodes the specified ErrorInfo message. Does not implicitly {@link google.rpc.ErrorInfo.verify|verify} messages.
             * @param message ErrorInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IErrorInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ErrorInfo message, length delimited. Does not implicitly {@link google.rpc.ErrorInfo.verify|verify} messages.
             * @param message ErrorInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IErrorInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes an ErrorInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ErrorInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.ErrorInfo;

            /**
             * Decodes an ErrorInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ErrorInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.ErrorInfo;

            /**
             * Verifies an ErrorInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates an ErrorInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ErrorInfo
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.ErrorInfo;

            /**
             * Creates a plain object from an ErrorInfo message. Also converts values to other types if specified.
             * @param message ErrorInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.ErrorInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ErrorInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a PreconditionFailure. */
        interface IPreconditionFailure {

            /** PreconditionFailure violations */
            violations?: (google.rpc.PreconditionFailure.IViolation[]|null);
        }

        /** Represents a PreconditionFailure. */
        class PreconditionFailure implements IPreconditionFailure {

            /**
             * Constructs a new PreconditionFailure.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IPreconditionFailure);

            /** PreconditionFailure violations. */
            public violations: google.rpc.PreconditionFailure.IViolation[];

            /**
             * Creates a new PreconditionFailure instance using the specified properties.
             * @param [properties] Properties to set
             * @returns PreconditionFailure instance
             */
            public static create(properties?: google.rpc.IPreconditionFailure): google.rpc.PreconditionFailure;

            /**
             * Encodes the specified PreconditionFailure message. Does not implicitly {@link google.rpc.PreconditionFailure.verify|verify} messages.
             * @param message PreconditionFailure message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IPreconditionFailure, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified PreconditionFailure message, length delimited. Does not implicitly {@link google.rpc.PreconditionFailure.verify|verify} messages.
             * @param message PreconditionFailure message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IPreconditionFailure, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a PreconditionFailure message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns PreconditionFailure
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.PreconditionFailure;

            /**
             * Decodes a PreconditionFailure message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns PreconditionFailure
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.PreconditionFailure;

            /**
             * Verifies a PreconditionFailure message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a PreconditionFailure message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns PreconditionFailure
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.PreconditionFailure;

            /**
             * Creates a plain object from a PreconditionFailure message. Also converts values to other types if specified.
             * @param message PreconditionFailure
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.PreconditionFailure, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this PreconditionFailure to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace PreconditionFailure {

            /** Properties of a Violation. */
            interface IViolation {

                /** Violation type */
                type?: (string|null);

                /** Violation subject */
                subject?: (string|null);

                /** Violation description */
                description?: (string|null);
            }

            /** Represents a Violation. */
            class Violation implements IViolation {

                /**
                 * Constructs a new Violation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.rpc.PreconditionFailure.IViolation);

                /** Violation type. */
                public type: string;

                /** Violation subject. */
                public subject: string;

                /** Violation description. */
                public description: string;

                /**
                 * Creates a new Violation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Violation instance
                 */
                public static create(properties?: google.rpc.PreconditionFailure.IViolation): google.rpc.PreconditionFailure.Violation;

                /**
                 * Encodes the specified Violation message. Does not implicitly {@link google.rpc.PreconditionFailure.Violation.verify|verify} messages.
                 * @param message Violation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.rpc.PreconditionFailure.IViolation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Violation message, length delimited. Does not implicitly {@link google.rpc.PreconditionFailure.Violation.verify|verify} messages.
                 * @param message Violation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.rpc.PreconditionFailure.IViolation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Violation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Violation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.PreconditionFailure.Violation;

                /**
                 * Decodes a Violation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Violation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.PreconditionFailure.Violation;

                /**
                 * Verifies a Violation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Violation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Violation
                 */
                public static fromObject(object: { [k: string]: any }): google.rpc.PreconditionFailure.Violation;

                /**
                 * Creates a plain object from a Violation message. Also converts values to other types if specified.
                 * @param message Violation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.rpc.PreconditionFailure.Violation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Violation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a BadRequest. */
        interface IBadRequest {

            /** BadRequest fieldViolations */
            fieldViolations?: (google.rpc.BadRequest.IFieldViolation[]|null);
        }

        /** Represents a BadRequest. */
        class BadRequest implements IBadRequest {

            /**
             * Constructs a new BadRequest.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IBadRequest);

            /** BadRequest fieldViolations. */
            public fieldViolations: google.rpc.BadRequest.IFieldViolation[];

            /**
             * Creates a new BadRequest instance using the specified properties.
             * @param [properties] Properties to set
             * @returns BadRequest instance
             */
            public static create(properties?: google.rpc.IBadRequest): google.rpc.BadRequest;

            /**
             * Encodes the specified BadRequest message. Does not implicitly {@link google.rpc.BadRequest.verify|verify} messages.
             * @param message BadRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IBadRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified BadRequest message, length delimited. Does not implicitly {@link google.rpc.BadRequest.verify|verify} messages.
             * @param message BadRequest message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IBadRequest, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a BadRequest message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns BadRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.BadRequest;

            /**
             * Decodes a BadRequest message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns BadRequest
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.BadRequest;

            /**
             * Verifies a BadRequest message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a BadRequest message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns BadRequest
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.BadRequest;

            /**
             * Creates a plain object from a BadRequest message. Also converts values to other types if specified.
             * @param message BadRequest
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.BadRequest, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this BadRequest to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace BadRequest {

            /** Properties of a FieldViolation. */
            interface IFieldViolation {

                /** FieldViolation field */
                field?: (string|null);

                /** FieldViolation description */
                description?: (string|null);
            }

            /** Represents a FieldViolation. */
            class FieldViolation implements IFieldViolation {

                /**
                 * Constructs a new FieldViolation.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.rpc.BadRequest.IFieldViolation);

                /** FieldViolation field. */
                public field: string;

                /** FieldViolation description. */
                public description: string;

                /**
                 * Creates a new FieldViolation instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns FieldViolation instance
                 */
                public static create(properties?: google.rpc.BadRequest.IFieldViolation): google.rpc.BadRequest.FieldViolation;

                /**
                 * Encodes the specified FieldViolation message. Does not implicitly {@link google.rpc.BadRequest.FieldViolation.verify|verify} messages.
                 * @param message FieldViolation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.rpc.BadRequest.IFieldViolation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified FieldViolation message, length delimited. Does not implicitly {@link google.rpc.BadRequest.FieldViolation.verify|verify} messages.
                 * @param message FieldViolation message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.rpc.BadRequest.IFieldViolation, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a FieldViolation message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns FieldViolation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.BadRequest.FieldViolation;

                /**
                 * Decodes a FieldViolation message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns FieldViolation
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.BadRequest.FieldViolation;

                /**
                 * Verifies a FieldViolation message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a FieldViolation message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns FieldViolation
                 */
                public static fromObject(object: { [k: string]: any }): google.rpc.BadRequest.FieldViolation;

                /**
                 * Creates a plain object from a FieldViolation message. Also converts values to other types if specified.
                 * @param message FieldViolation
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.rpc.BadRequest.FieldViolation, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this FieldViolation to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a RequestInfo. */
        interface IRequestInfo {

            /** RequestInfo requestId */
            requestId?: (string|null);

            /** RequestInfo servingData */
            servingData?: (string|null);
        }

        /** Represents a RequestInfo. */
        class RequestInfo implements IRequestInfo {

            /**
             * Constructs a new RequestInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IRequestInfo);

            /** RequestInfo requestId. */
            public requestId: string;

            /** RequestInfo servingData. */
            public servingData: string;

            /**
             * Creates a new RequestInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns RequestInfo instance
             */
            public static create(properties?: google.rpc.IRequestInfo): google.rpc.RequestInfo;

            /**
             * Encodes the specified RequestInfo message. Does not implicitly {@link google.rpc.RequestInfo.verify|verify} messages.
             * @param message RequestInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IRequestInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified RequestInfo message, length delimited. Does not implicitly {@link google.rpc.RequestInfo.verify|verify} messages.
             * @param message RequestInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IRequestInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a RequestInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns RequestInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.RequestInfo;

            /**
             * Decodes a RequestInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns RequestInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.RequestInfo;

            /**
             * Verifies a RequestInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a RequestInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns RequestInfo
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.RequestInfo;

            /**
             * Creates a plain object from a RequestInfo message. Also converts values to other types if specified.
             * @param message RequestInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.RequestInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this RequestInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a ResourceInfo. */
        interface IResourceInfo {

            /** ResourceInfo resourceType */
            resourceType?: (string|null);

            /** ResourceInfo resourceName */
            resourceName?: (string|null);

            /** ResourceInfo owner */
            owner?: (string|null);

            /** ResourceInfo description */
            description?: (string|null);
        }

        /** Represents a ResourceInfo. */
        class ResourceInfo implements IResourceInfo {

            /**
             * Constructs a new ResourceInfo.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IResourceInfo);

            /** ResourceInfo resourceType. */
            public resourceType: string;

            /** ResourceInfo resourceName. */
            public resourceName: string;

            /** ResourceInfo owner. */
            public owner: string;

            /** ResourceInfo description. */
            public description: string;

            /**
             * Creates a new ResourceInfo instance using the specified properties.
             * @param [properties] Properties to set
             * @returns ResourceInfo instance
             */
            public static create(properties?: google.rpc.IResourceInfo): google.rpc.ResourceInfo;

            /**
             * Encodes the specified ResourceInfo message. Does not implicitly {@link google.rpc.ResourceInfo.verify|verify} messages.
             * @param message ResourceInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IResourceInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified ResourceInfo message, length delimited. Does not implicitly {@link google.rpc.ResourceInfo.verify|verify} messages.
             * @param message ResourceInfo message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IResourceInfo, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a ResourceInfo message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns ResourceInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.ResourceInfo;

            /**
             * Decodes a ResourceInfo message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns ResourceInfo
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.ResourceInfo;

            /**
             * Verifies a ResourceInfo message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a ResourceInfo message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns ResourceInfo
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.ResourceInfo;

            /**
             * Creates a plain object from a ResourceInfo message. Also converts values to other types if specified.
             * @param message ResourceInfo
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.ResourceInfo, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this ResourceInfo to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        /** Properties of a Help. */
        interface IHelp {

            /** Help links */
            links?: (google.rpc.Help.ILink[]|null);
        }

        /** Represents a Help. */
        class Help implements IHelp {

            /**
             * Constructs a new Help.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.IHelp);

            /** Help links. */
            public links: google.rpc.Help.ILink[];

            /**
             * Creates a new Help instance using the specified properties.
             * @param [properties] Properties to set
             * @returns Help instance
             */
            public static create(properties?: google.rpc.IHelp): google.rpc.Help;

            /**
             * Encodes the specified Help message. Does not implicitly {@link google.rpc.Help.verify|verify} messages.
             * @param message Help message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.IHelp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified Help message, length delimited. Does not implicitly {@link google.rpc.Help.verify|verify} messages.
             * @param message Help message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.IHelp, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a Help message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns Help
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.Help;

            /**
             * Decodes a Help message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns Help
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.Help;

            /**
             * Verifies a Help message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a Help message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns Help
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.Help;

            /**
             * Creates a plain object from a Help message. Also converts values to other types if specified.
             * @param message Help
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.Help, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this Help to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }

        namespace Help {

            /** Properties of a Link. */
            interface ILink {

                /** Link description */
                description?: (string|null);

                /** Link url */
                url?: (string|null);
            }

            /** Represents a Link. */
            class Link implements ILink {

                /**
                 * Constructs a new Link.
                 * @param [properties] Properties to set
                 */
                constructor(properties?: google.rpc.Help.ILink);

                /** Link description. */
                public description: string;

                /** Link url. */
                public url: string;

                /**
                 * Creates a new Link instance using the specified properties.
                 * @param [properties] Properties to set
                 * @returns Link instance
                 */
                public static create(properties?: google.rpc.Help.ILink): google.rpc.Help.Link;

                /**
                 * Encodes the specified Link message. Does not implicitly {@link google.rpc.Help.Link.verify|verify} messages.
                 * @param message Link message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encode(message: google.rpc.Help.ILink, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Encodes the specified Link message, length delimited. Does not implicitly {@link google.rpc.Help.Link.verify|verify} messages.
                 * @param message Link message or plain object to encode
                 * @param [writer] Writer to encode to
                 * @returns Writer
                 */
                public static encodeDelimited(message: google.rpc.Help.ILink, writer?: $protobuf.Writer): $protobuf.Writer;

                /**
                 * Decodes a Link message from the specified reader or buffer.
                 * @param reader Reader or buffer to decode from
                 * @param [length] Message length if known beforehand
                 * @returns Link
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.Help.Link;

                /**
                 * Decodes a Link message from the specified reader or buffer, length delimited.
                 * @param reader Reader or buffer to decode from
                 * @returns Link
                 * @throws {Error} If the payload is not a reader or valid buffer
                 * @throws {$protobuf.util.ProtocolError} If required fields are missing
                 */
                public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.Help.Link;

                /**
                 * Verifies a Link message.
                 * @param message Plain object to verify
                 * @returns `null` if valid, otherwise the reason why it is not
                 */
                public static verify(message: { [k: string]: any }): (string|null);

                /**
                 * Creates a Link message from a plain object. Also converts values to their respective internal types.
                 * @param object Plain object
                 * @returns Link
                 */
                public static fromObject(object: { [k: string]: any }): google.rpc.Help.Link;

                /**
                 * Creates a plain object from a Link message. Also converts values to other types if specified.
                 * @param message Link
                 * @param [options] Conversion options
                 * @returns Plain object
                 */
                public static toObject(message: google.rpc.Help.Link, options?: $protobuf.IConversionOptions): { [k: string]: any };

                /**
                 * Converts this Link to JSON.
                 * @returns JSON object
                 */
                public toJSON(): { [k: string]: any };
            }
        }

        /** Properties of a LocalizedMessage. */
        interface ILocalizedMessage {

            /** LocalizedMessage locale */
            locale?: (string|null);

            /** LocalizedMessage message */
            message?: (string|null);
        }

        /** Represents a LocalizedMessage. */
        class LocalizedMessage implements ILocalizedMessage {

            /**
             * Constructs a new LocalizedMessage.
             * @param [properties] Properties to set
             */
            constructor(properties?: google.rpc.ILocalizedMessage);

            /** LocalizedMessage locale. */
            public locale: string;

            /** LocalizedMessage message. */
            public message: string;

            /**
             * Creates a new LocalizedMessage instance using the specified properties.
             * @param [properties] Properties to set
             * @returns LocalizedMessage instance
             */
            public static create(properties?: google.rpc.ILocalizedMessage): google.rpc.LocalizedMessage;

            /**
             * Encodes the specified LocalizedMessage message. Does not implicitly {@link google.rpc.LocalizedMessage.verify|verify} messages.
             * @param message LocalizedMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encode(message: google.rpc.ILocalizedMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Encodes the specified LocalizedMessage message, length delimited. Does not implicitly {@link google.rpc.LocalizedMessage.verify|verify} messages.
             * @param message LocalizedMessage message or plain object to encode
             * @param [writer] Writer to encode to
             * @returns Writer
             */
            public static encodeDelimited(message: google.rpc.ILocalizedMessage, writer?: $protobuf.Writer): $protobuf.Writer;

            /**
             * Decodes a LocalizedMessage message from the specified reader or buffer.
             * @param reader Reader or buffer to decode from
             * @param [length] Message length if known beforehand
             * @returns LocalizedMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decode(reader: ($protobuf.Reader|Uint8Array), length?: number): google.rpc.LocalizedMessage;

            /**
             * Decodes a LocalizedMessage message from the specified reader or buffer, length delimited.
             * @param reader Reader or buffer to decode from
             * @returns LocalizedMessage
             * @throws {Error} If the payload is not a reader or valid buffer
             * @throws {$protobuf.util.ProtocolError} If required fields are missing
             */
            public static decodeDelimited(reader: ($protobuf.Reader|Uint8Array)): google.rpc.LocalizedMessage;

            /**
             * Verifies a LocalizedMessage message.
             * @param message Plain object to verify
             * @returns `null` if valid, otherwise the reason why it is not
             */
            public static verify(message: { [k: string]: any }): (string|null);

            /**
             * Creates a LocalizedMessage message from a plain object. Also converts values to their respective internal types.
             * @param object Plain object
             * @returns LocalizedMessage
             */
            public static fromObject(object: { [k: string]: any }): google.rpc.LocalizedMessage;

            /**
             * Creates a plain object from a LocalizedMessage message. Also converts values to other types if specified.
             * @param message LocalizedMessage
             * @param [options] Conversion options
             * @returns Plain object
             */
            public static toObject(message: google.rpc.LocalizedMessage, options?: $protobuf.IConversionOptions): { [k: string]: any };

            /**
             * Converts this LocalizedMessage to JSON.
             * @returns JSON object
             */
            public toJSON(): { [k: string]: any };
        }
    }
}
