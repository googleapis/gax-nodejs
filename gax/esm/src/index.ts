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
import {GrpcClient, GrpcClientOptions} from './grpc.js';
import * as IamProtos from '../../protos/iam_service.js';
import * as LocationProtos from '../../protos/locations.js';
import * as operationsProtos from '../../protos/operations.js';
import * as operationsClient from './operationsClient.js';
import * as routingHeader from './routingHeader.js';

export {GoogleAuth} from 'google-auth-library';
export type {GoogleAuthOptions} from 'google-auth-library';
export {grpc};
export {OngoingCall} from './call.js';
export type {CancellablePromise} from './call.js';
export {createApiCall} from './createApiCall.js';
export {
  BundleDescriptor,
  LongrunningDescriptor,
  PageDescriptor,
  StreamDescriptor,
} from './descriptor.js';
export {
  CallSettings,
  constructSettings,
  RetryOptions,
  createRetryOptions,
  createBundleOptions,
  createBackoffSettings,
  createDefaultBackoffSettings,
  createMaxRetriesBackoffSettings,
} from './gax.js';
export type {CallOptions, ClientConfig, ServiceConfig} from './gax.js';
export {GoogleError} from './googleError.js';
export {ClientStub, GoogleProtoFilesRoot, GrpcClient} from './grpc.js';
export type {
  ClientStubOptions,
  GrpcClientOptions,
  GrpcModule,
  Metadata,
  MetadataValue,
} from './grpc.js';
export {Operation, operation} from './longRunningCalls/longrunning.js';
export {PathTemplate} from './pathTemplate.js';
export {Status} from './status.js';
export {StreamType} from './streamingCalls/streaming.js';
export {routingHeader};

function lro(options: GrpcClientOptions) {
  options = Object.assign({scopes: lro.ALL_SCOPES}, options);
  const gaxGrpc = new GrpcClient(options);
  return new operationsClient.OperationsClientBuilder(gaxGrpc);
}

lro.SERVICE_ADDRESS = operationsClient.SERVICE_ADDRESS;
lro.ALL_SCOPES = operationsClient.ALL_SCOPES;

export {lro, operationsProtos, IamProtos, LocationProtos};
export {OperationsClient} from './operationsClient.js';
export {IamClient} from './iamService.js';
export {LocationsClient} from './locationService.js';

export const createByteLengthFunction = GrpcClient.createByteLengthFunction;
//@ts-ignore
import pkg from '../../../package.json' with {type: 'json'};
export const version = (pkg as any).version;

import protobuf from 'protobufjs';
export {protobuf};
export * as protobufMinimal from 'protobufjs/minimal.js';

import * as fallback from './fallback.js';
export {fallback};

export type {
  APICallback,
  GRPCCallResult,
  ServerStreamingCall,
  ClientStreamingCall,
  BiDiStreamingCall,
  UnaryCall,
  GRPCCall,
  GaxCall,
  CancellableStream,
} from './apitypes.js';

export type {
  ClientOptions,
  Descriptors,
  Callback,
  LROperation,
  PaginationCallback,
  PaginationResponse,
} from './clientInterface.js';

export {makeUUID} from './util.js';

export {ChannelCredentials} from '@grpc/grpc-js';
export type {ServiceError} from '@grpc/grpc-js';
export {warn} from './warnings.js';

import * as serializer from 'proto3-json-serializer';
export {serializer};
