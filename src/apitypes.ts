/*
 * Copyright 2019 Google LLC
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

import {Duplex} from 'stream';

import {CancellablePromise} from './call';
import {CallOptions} from './gax';
import {GoogleError} from './googleError';
import {Operation} from './longRunningCalls/longrunning';

// gRPC functions return object with `.cancel()` method that can be used for
// canceling the ongoing call.
export interface GRPCCallResult {
  cancel(): void;
}

// All GAX calls take RequestType and return ResultTuple, which can contain up
// to three elements. The first element is always a response (post-processed for
// special types of call such as pagination or long-running), the second
// parameter is defined for paginated calls and stores the next page request
// object, the third parameter stores raw (unprocessed) response object in cases
// when it might be useful for users.
export type RequestType = {};
export type ResponseType = {}|null;
export type NextPageRequestType = {
  [index: string]: string
}|null;
export type RawResponseType = Operation|{};
export type ResultTuple = [
  ResponseType, NextPageRequestType | undefined, RawResponseType | undefined
];

export interface SimpleCallbackFunction {
  (argument: RequestType, callback: APICallback): GRPCCallResult;
}

export type APICallback =
    (err: GoogleError|null, response?: ResponseType, next?: NextPageRequestType,
     rawResponse?: RawResponseType) => void;

// The following five types mimic various gRPC calls (regular UnaryCall and
// various streaming calls).
export type UnaryCall =
    (argument: {}, metadata: {}, options: {}, callback: APICallback) =>
        GRPCCallResult;
export type ServerStreamingCall = (argument: {}, metadata: {}, options: {}) =>
    Duplex&GRPCCallResult;
export type ClientStreamingCall =
    (metadata: {}, options: {}, callback?: APICallback) =>
        Duplex&GRPCCallResult;
export type BiDiStreamingCall = (metadata: {}, options: {}) =>
    Duplex&GRPCCallResult;
export type GRPCCall =
    UnaryCall|ServerStreamingCall|ClientStreamingCall|BiDiStreamingCall;

// GAX wraps gRPC calls so that the wrapper functions return either a
// cancellable promise, or a stream (also cancellable!)
export type CancellableStream = Duplex&GRPCCallResult;
export type GaxCallResult = CancellablePromise<ResultTuple>|CancellableStream;
export interface GaxCallPromise {
  (argument: {}, callOptions?: CallOptions,
   callback?: APICallback): CancellablePromise<ResultTuple>;
}
export interface GaxCallStream {
  (argument: {}, callOptions?: CallOptions,
   callback?: APICallback): CancellableStream;
}
export interface GaxCall {
  (argument: {}, callOptions?: CallOptions,
   callback?: APICallback): GaxCallResult;
}
export interface GRPCCallOtherArgs {
  options?: {deadline?: Date;};
  headers?: {};
  metadataBuilder: (abTests?: {}, headers?: {}) => {};
}
