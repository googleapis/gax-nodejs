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
import {Metadata} from './grpc';

export class GoogleError extends Error {
  code?: Status;
  note?: string;
  metadata?: Metadata;
  statusDetails?: string | protobuf.Message<{}>[];
  reason?: string;
  domain?: string;

  // Parse details field in google.rpc.status wire over gRPC medatadata.
  // Promote google.rpc.ErrorInfo if exist.
  static parseGRPCStatusDetails(err: GoogleError): GoogleError {
    const decoder = new GoogleErrorDecoder();
    try {
      if (err.metadata && err.metadata.get('grpc-status-details-bin')) {
        const statusDetailsObj: GRPCStatusDetailsObject =
          decoder.decodeGRPCStatusDetails(
            err.metadata.get('grpc-status-details-bin') as []
          );
        if (statusDetailsObj && statusDetailsObj.details.length > 0) {
          err.statusDetails = statusDetailsObj.details;
        }
        if (statusDetailsObj && statusDetailsObj.errorInfo) {
          err.reason = statusDetailsObj.errorInfo.reason;
          err.domain = statusDetailsObj.errorInfo.domain;
          for (const [key, value] of Object.entries(
            statusDetailsObj.errorInfo.metadata
          )) {
            err.metadata.set(key, value);
          }
        }
      }
    } catch (decodeErr) {
      return err;
    }
    return err;
  }
}

export type FallbackServiceError = FallbackStatusObject & Error;
interface FallbackStatusObject {
  code: Status;
  message: string;
  details: Array<{}>;
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

interface GRPCStatusDetailsObject {
  details: protobuf.Message<{}>[];
  errorInfo: ErrorInfo | undefined;
}

interface ErrorInfo {
  reason: string;
  domain: string;
  metadata: {string: string};
}

export class GoogleErrorDecoder {
  root: protobuf.Root;
  anyType: protobuf.Type;
  statusType: protobuf.Type;
  errorInfoType: protobuf.Type;

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const errorProtoJson = require('../../protos/status.json');
    this.root = protobuf.Root.fromJSON(errorProtoJson);
    this.anyType = this.root.lookupType('google.protobuf.Any');
    this.statusType = this.root.lookupType('google.rpc.Status');
    this.errorInfoType = this.root.lookupType('google.rpc.ErrorInfo');
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
  decodeRpcStatus(buffer: Buffer | ArrayBuffer): FallbackStatusObject {
    const uint8array = new Uint8Array(buffer);
    const status = this.statusType.decode(uint8array) as unknown as RpcStatus;

    // google.rpc.Status contains an array of google.protobuf.Any
    // which need a special treatment
    const details: Array<protobuf.Message> = [];
    for (const detail of status.details) {
      try {
        const decodedDetail = this.decodeProtobufAny(detail);
        details.push(decodedDetail);
      } catch (err) {
        // cannot decode detail, likely because of the unknown type - just skip it
      }
    }
    const result = {
      code: status.code,
      message: status.message,
      details,
    };
    return result;
  }

  // Construct an Error from a StatusObject.
  // Adapted from https://github.com/grpc/grpc-node/blob/main/packages/grpc-js/src/call.ts#L79
  callErrorFromStatus(status: FallbackStatusObject): FallbackServiceError {
    status.message = `${status.code} ${Status[status.code]}: ${status.message}`;
    return Object.assign(new Error(status.message), status);
  }

  // Decodes gRPC-fallback error which is an instance of google.rpc.Status,
  // and puts it into the object similar to gRPC ServiceError object.
  decodeErrorFromBuffer(buffer: Buffer | ArrayBuffer): Error {
    return this.callErrorFromStatus(this.decodeRpcStatus(buffer));
  }

  // Decodes gRPC metadata error details which is an instance of google.rpc.Status.
  decodeGRPCStatusDetails(
    bufferArr: Buffer[] | ArrayBuffer[]
  ): GRPCStatusDetailsObject {
    const details: protobuf.Message<{}>[] = [];
    let errorInfo;
    bufferArr.forEach(buffer => {
      const uint8array = new Uint8Array(buffer);
      const rpcStatus = this.statusType.decode(
        uint8array
      ) as unknown as RpcStatus;
      for (const detail of rpcStatus.details) {
        try {
          const decodedDetail = this.decodeProtobufAny(detail);
          details.push(decodedDetail);
          if (detail.type_url === 'type.googleapis.com/google.rpc.ErrorInfo') {
            errorInfo = decodedDetail as unknown as ErrorInfo;
          }
        } catch (err) {
          // cannot decode detail, likely because of the unknown type - just skip it
        }
      }
    });
    const result = {
      details,
      errorInfo,
    };
    return result;
  }
}
