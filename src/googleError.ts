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

import {Status, rpcCodeFromHttpStatusCode} from './status';
import * as protobuf from 'protobufjs';
import {Metadata} from './grpc';
import * as serializer from 'proto3-json-serializer';
import {defaultToObjectOptions} from './fallback';
import {JSONValue} from 'proto3-json-serializer';

export class GoogleError extends Error {
  code?: Status;
  note?: string;
  metadata?: Metadata;
  statusDetails?: string | protobuf.Message<{}>[];
  reason?: string;
  domain?: string;
  errorInfoMetadata?: {string: string};

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
        if (
          statusDetailsObj &&
          statusDetailsObj.details &&
          statusDetailsObj.details.length > 0
        ) {
          err.statusDetails = statusDetailsObj.details;
        }
        if (statusDetailsObj && statusDetailsObj.errorInfo) {
          err.reason = statusDetailsObj.errorInfo.reason;
          err.domain = statusDetailsObj.errorInfo.domain;
          err.errorInfoMetadata = statusDetailsObj.errorInfo.metadata;
        }
      }
    } catch (decodeErr) {
      // ignoring the error
    }
    return err;
  }

  // Parse http JSON error and promote google.rpc.ErrorInfo if exist.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static parseHttpError(json: any): GoogleError {
    if (Array.isArray(json)) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      json = json.find((obj: any) => {
        return 'error' in obj;
      });
    }
    const decoder = new GoogleErrorDecoder();
    const proto3Error = decoder.decodeHTTPError(json['error']);
    const error = Object.assign(
      new GoogleError(json['error']['message']),
      proto3Error
    );
    // Map Http Status Code to gRPC Status Code
    if (json['error']['code']) {
      error.code = rpcCodeFromHttpStatusCode(json['error']['code']);
    } else {
      // If error code is absent, proto3 message default value is 0. We should
      // keep error code as undefined.
      delete error.code;
    }
    // Keep consistency with gRPC statusDetails fields. gRPC details has been occupied before.
    // Rename "detials" to "statusDetails".
    if (error.details) {
      try {
        const statusDetailsObj: GRPCStatusDetailsObject =
          decoder.decodeHttpStatusDetails(error.details);
        if (
          statusDetailsObj &&
          statusDetailsObj.details &&
          statusDetailsObj.details.length > 0
        ) {
          error.statusDetails = statusDetailsObj.details;
        }
        if (statusDetailsObj && statusDetailsObj.errorInfo) {
          error.reason = statusDetailsObj.errorInfo.reason;
          error.domain = statusDetailsObj.errorInfo.domain;
          // error.metadata has been occupied for gRPC metadata, so we use
          // errorInfoMetadata to represent ErrorInfo' metadata field. Keep
          // consistency with gRPC ErrorInfo metadata field name.
          error.errorInfoMetadata = statusDetailsObj.errorInfo.metadata;
        }
      } catch (decodeErr) {
        // ignoring the error
      }
    }
    return error;
  }
}

export type FallbackServiceError = FallbackStatusObject & Error;
interface FallbackStatusObject {
  code: Status;
  message: string;
  statusDetails: Array<{}>;
  reason?: string;
  domain?: string;
  errorInfoMetadata?: {string: string};
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
  errorInfo?: ErrorInfo;
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

  constructor() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const errorProtoJson = require('../../build/protos/status.json');
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
  decodeRpcStatus(buffer: Buffer | ArrayBuffer): FallbackStatusObject {
    const uint8array = new Uint8Array(buffer);
    const status = this.statusType.decode(uint8array) as unknown as RpcStatus;

    // google.rpc.Status contains an array of google.protobuf.Any
    // which need a special treatment
    const details: Array<protobuf.Message> = [];
    let errorInfo;
    for (const detail of status.details) {
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
    const result = {
      code: status.code,
      message: status.message,
      statusDetails: details,
      reason: errorInfo?.reason,
      domain: errorInfo?.domain,
      errorInfoMetadata: errorInfo?.metadata,
    };
    return result;
  }

  // Construct an Error from a StatusObject.
  // Adapted from https://github.com/grpc/grpc-node/blob/main/packages/grpc-js/src/call.ts#L79
  callErrorFromStatus(status: FallbackStatusObject): FallbackServiceError {
    status.message = `${status.code} ${Status[status.code]}: ${status.message}`;
    return Object.assign(new GoogleError(status.message), status);
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

  // Decodes http error which is an instance of google.rpc.Status.
  decodeHTTPError(json: JSONValue) {
    const errorMessage = serializer.fromProto3JSON(this.statusType, json);
    if (!errorMessage) {
      throw new Error(
        `Received error message ${json}, but failed to serialize as proto3 message`
      );
    }
    return this.statusType.toObject(errorMessage, defaultToObjectOptions);
  }

  // Decodes http error details which is an instance of Array<google.protobuf.Any>.
  decodeHttpStatusDetails(
    rawDetails: Array<ProtobufAny>
  ): GRPCStatusDetailsObject {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const details: protobuf.Message<{}>[] = [];
    let errorInfo;
    for (const detail of rawDetails) {
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
    return {details, errorInfo};
  }
}
