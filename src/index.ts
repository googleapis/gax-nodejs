/**
 * Copyright 2019 Google LLC
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

import {GrpcClient, GrpcClientOptions, ClientStubOptions} from './grpc';
import {GoogleAuthOptions} from 'google-auth-library';
import {
  LongrunningDescriptor,
  PageDescriptor,
  StreamDescriptor,
} from './descriptor';
import * as longrunning from './longRunningCalls/longrunning';
import * as operationProtos from '../protos/operations';
import * as operationsClient from './operationsClient';
import * as routingHeader from './routingHeader';
import * as gax from './gax';

export {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';
export {CancellablePromise, OngoingCall} from './call';
export {createApiCall} from './createApiCall';
export {
  BundleDescriptor,
  LongrunningDescriptor,
  PageDescriptor,
  StreamDescriptor,
} from './descriptor';
export {
  CallOptions,
  CallSettings,
  ClientConfig,
  constructSettings,
  RetryOptions,
} from './gax';
export {GoogleError} from './googleError';
export {
  ClientStub,
  ClientStubOptions,
  GoogleProtoFilesRoot,
  GrpcClient,
  GrpcClientOptions,
  GrpcModule,
  Metadata,
  MetadataValue,
} from './grpc';
export {Operation, operation} from './longRunningCalls/longrunning';
export {PathTemplate} from './pathTemplate';
export {Status} from './status';
export {StreamType} from './streamingCalls/streaming';
export {routingHeader};

function lro(options: GrpcClientOptions) {
  options = Object.assign({scopes: lro.ALL_SCOPES}, options);
  const gaxGrpc = new GrpcClient(options);
  return new operationsClient.OperationsClientBuilder(gaxGrpc);
}

lro.SERVICE_ADDRESS = operationsClient.SERVICE_ADDRESS;
lro.ALL_SCOPES = operationsClient.ALL_SCOPES;

export {lro};
export {OperationsClient} from './operationsClient';
export const createByteLengthFunction = GrpcClient.createByteLengthFunction;
export const version = require('../../package.json').version;

import * as protobuf from 'protobufjs';
export {protobuf};

import * as fallback from './fallback';
export {fallback};

export {
  APICallback,
  GRPCCallResult,
  ServerStreamingCall,
  ClientStreamingCall,
  BiDiStreamingCall,
  UnaryCall,
  GRPCCall,
  GaxCall,
  CancellableStream,
} from './apitypes';

export interface ClientOptions
  extends GrpcClientOptions,
    GoogleAuthOptions,
    ClientStubOptions {
  libName?: string;
  libVersion?: string;
  clientConfig?: gax.ClientConfig;
  fallback?: boolean;
  apiEndpoint?: string;
}

export interface Descriptors {
  page: {[name: string]: PageDescriptor};
  stream: {[name: string]: StreamDescriptor};
  longrunning: {[name: string]: LongrunningDescriptor};
}

export interface Callback<
  ResponseObject,
  NextRequestObject,
  RawResponseObject
> {
  (
    err: Error | null | undefined,
    value?: ResponseObject | null,
    nextRequest?: NextRequestObject,
    rawResponse?: RawResponseObject
  ): void;
}

export interface LROperation<ResultType, MetadataType>
  extends longrunning.Operation {
  promise(): Promise<
    [ResultType, MetadataType, operationProtos.google.longrunning.Operation]
  >;
}

export interface PaginationCallback<
  RequestObject,
  ResponseObject,
  ResponseType
> {
  (
    err: Error | null,
    values?: ResponseType[],
    nextPageRequest?: RequestObject,
    rawResponse?: ResponseObject
  ): void;
}

export interface PaginationResponse<
  RequestObject,
  ResponseObject,
  ResponseType
> {
  values?: ResponseType[];
  nextPageRequest?: RequestObject;
  rawResponse?: ResponseObject;
}
