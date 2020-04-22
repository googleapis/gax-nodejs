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

import * as grpc from '@grpc/grpc-js';
import {GrpcClient, GrpcClientOptions} from './grpc';
import * as IamProtos from '../protos/iam_service';
import * as operationsProtos from '../protos/operations';
import * as operationsClient from './operationsClient';
import * as routingHeader from './routingHeader';

export {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';
export {grpc};
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
  ServiceConfig,
  createRetryOptions,
  createBundleOptions,
  createBackoffSettings,
  createDefaultBackoffSettings,
  createMaxRetriesBackoffSettings,
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

export {lro, operationsProtos, IamProtos};
export {OperationsClient} from './operationsClient';
export {IamClient} from './iamService';
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

export {
  ClientOptions,
  Descriptors,
  Callback,
  LROperation,
  PaginationCallback,
  PaginationResponse,
} from './clientInterface';

export {ServiceError, ChannelCredentials} from '@grpc/grpc-js';
