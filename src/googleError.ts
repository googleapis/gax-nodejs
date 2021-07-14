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

 import {Status} from './status';
 import * as protobuf from 'protobufjs';
 import { Metadata } from '@google-cloud/common';
 export class GoogleError extends Error {
   code?: Status;
   note?: string;
   metadata?: Metadata;
   statusDetails?: protobuf.Message<{}> | protobuf.Message<{}>[];
 }
  
 interface ProtobufAny {
   type_url: string;
   value: Uint8Array;
 }
  
 interface RpcStatus {
   code: number;
   message: string;
   details: ProtobufAny[];
 }
  
 export class GoogleErrorDecoder {
   root: protobuf.Root;
   anyType: protobuf.Type;
   statusType: protobuf.Type;
  
   constructor() {
     // eslint-disable-next-line @typescript-eslint/no-var-requires
     const errorProtoJson = require('../../protos/status.json');
     this.root = protobuf.Root.fromJSON(errorProtoJson);
     this.anyType = this.root.lookupType('google.protobuf.Any');
     this.statusType = this.root.lookupType('google.rpc.Status');
   }
  
   decodeProtobufAny(anyValue: ProtobufAny): protobuf.Message<{}> {
     const match = anyValue.type_url.match(/^type.googleapis.com\/(.*)/);
     if (!match) {
       throw new Error(
         `Unknown type encoded in google.protobuf.any: ${anyValue.type_url}`
       );
     }
     const typeName = match[1];
     const type = this.root.lookupType(typeName);
     if (!type) {
       throw new Error(`Cannot lookup type ${typeName}`);
     }
     return type.decode(anyValue.value);
   }
  
   // Decodes gRPC-fallback error which is an instance of google.rpc.Status.
   decodeRpcStatusDetails(bufferArr: Buffer[] | ArrayBuffer[]): protobuf.Message<{}>[] {
     let status: protobuf.Message<{}>[] = [];
      bufferArr.forEach(buffer => {
        const uint8array = new Uint8Array(buffer);
        const error_status = this.statusType.decode(uint8array) as unknown as RpcStatus;
        const status_details_array = error_status.details.map(detail => this.decodeProtobufAny(detail));
        status.push(status_details_array[0]);
      });
     return status;
   }
 }
