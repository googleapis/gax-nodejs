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

const startTime = new Date().getTime();

import * as protobuf from 'protobufjs';
console.log('imported protobufjs', new Date().getTime() - startTime);

export {protobuf};
export * as protobufMinimal from 'protobufjs/minimal';
console.log('imported protobufjs minimal', new Date().getTime() - startTime);

import * as grpc from '@grpc/grpc-js';
export {grpc};
console.log('imported @grpc/grpc-js', new Date().getTime() - startTime);

export {GoogleAuth, GoogleAuthOptions} from 'google-auth-library';
console.log('imported google-auth-library', new Date().getTime() - startTime);

import {GrpcClient, GrpcClientOptions} from './grpc';
console.log('imported grpc.ts', new Date().getTime() - startTime);

import * as IamProtos from '../protos/iam_service';
console.log('imported iam protos', new Date().getTime() - startTime);

import * as operationsProtos from '../protos/operations';
console.log('imported operations protos', new Date().getTime() - startTime);

import * as operationsClient from './operationsClient';
console.log('imported operations client', new Date().getTime() - startTime);

import * as routingHeader from './routingHeader';
console.log('imported routing header', new Date().getTime() - startTime);

export {CancellablePromise, OngoingCall} from './call';
console.log('imported call.ts', new Date().getTime() - startTime);

export {createApiCall} from './createApiCall';
console.log('imported createApiCall.ts', new Date().getTime() - startTime);

export {
  BundleDescriptor,
  LongrunningDescriptor,
  PageDescriptor,
  StreamDescriptor,
} from './descriptor';
console.log('imported descriptor.ts', new Date().getTime() - startTime);

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
console.log('imported gax.ts', new Date().getTime() - startTime);

export {GoogleError} from './googleError';
console.log('imported googleError.ts', new Date().getTime() - startTime);

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
console.log('imported grpc.ts', new Date().getTime() - startTime);

export {Operation, operation} from './longRunningCalls/longrunning';
console.log('imported longrunning.ts', new Date().getTime() - startTime);

export {PathTemplate} from './pathTemplate';
console.log('imported pathTemplate.ts', new Date().getTime() - startTime);

export {Status} from './status';
console.log('imported status.ts', new Date().getTime() - startTime);

export {StreamType} from './streamingCalls/streaming';
console.log('imported streamingCalls.ts', new Date().getTime() - startTime);

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
console.log('imported operationsClient.ts', new Date().getTime() - startTime);

export {IamClient} from './iamService';
console.log('imported iamService.ts', new Date().getTime() - startTime);

export const createByteLengthFunction = GrpcClient.createByteLengthFunction;
export const version = require('../../package.json').version;
console.log('imported package.json', new Date().getTime() - startTime);

import * as fallback from './fallback';
console.log('imported fallback.ts', new Date().getTime() - startTime);
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
console.log('imported apitypes.ts', new Date().getTime() - startTime);

export {
  ClientOptions,
  Descriptors,
  Callback,
  LROperation,
  PaginationCallback,
  PaginationResponse,
} from './clientInterface';
console.log('imported clientInterface.ts', new Date().getTime() - startTime);

export {ServiceError, ChannelCredentials} from '@grpc/grpc-js';
console.log(
  'imported @grpc/grpc-js (again!)',
  new Date().getTime() - startTime
);
