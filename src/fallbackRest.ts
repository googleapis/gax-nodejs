/**
 * Copyright 2021 Google LLC
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

// proto-over-HTTP request encoding and decoding

import * as serializer from 'proto3-json-serializer';
import {defaultToObjectOptions} from './fallback';
import {FetchParameters} from './fallbackServiceStub';
import {hasTextDecoder, hasTextEncoder, isNodeJS} from './featureDetection';
import {GoogleError} from './googleError';
import {transcode} from './transcoding';

if (!hasTextEncoder() || !hasTextDecoder()) {
  if (isNodeJS()) {
    // Node.js 10 does not have global TextDecoder
    // TODO(@alexander-fenster): remove this logic after Node.js 10 is EOL.
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const util = require('util');
    Object.assign(global, {
      TextDecoder: util.TextDecoder,
      TextEncoder: util.TextEncoder,
    });
  } else {
    require('fast-text-encoding');
  }
}

export function encodeRequest(
  rpc: protobuf.Method,
  protocol: string,
  servicePath: string,
  servicePort: number,
  request: {}
): FetchParameters {
  const headers: {[key: string]: string} = {
    'Content-Type': 'application/json',
  };
  const message = rpc.resolvedRequestType!.fromObject(request);
  const json = serializer.toProto3JSON(message);
  if (!json) {
    throw new Error(`Cannot send null request to RPC ${rpc.name}.`);
  }
  if (typeof json !== 'object' || Array.isArray(json)) {
    throw new Error(`Request to RPC ${rpc.name} must be an object.`);
  }
  const transcoded = transcode(
    json,
    rpc.parsedOptions,
    rpc.resolvedRequestType!.fields
  );
  if (!transcoded) {
    throw new Error(
      `Cannot build HTTP request for ${JSON.stringify(json)}, method: ${
        rpc.name
      }`
    );
  }
  const method = transcoded.httpMethod;
  const body = JSON.stringify(transcoded.data);
  const url = `${protocol}://${servicePath}:${servicePort}/${transcoded.url.replace(
    /^\//,
    ''
  )}?${transcoded.queryString}`;

  return {
    method,
    url,
    headers,
    body,
  };
}

export function decodeResponse(
  rpc: protobuf.Method,
  ok: boolean,
  response: Buffer | ArrayBuffer
): {} {
  // eslint-disable-next-line node/no-unsupported-features/node-builtins
  const decodedString = new TextDecoder().decode(response);
  const json = JSON.parse(decodedString);
  if (!ok) {
    const error = GoogleError.parseHttpError(json);
    throw error;
  }
  const message = serializer.fromProto3JSON(rpc.resolvedResponseType!, json);
  if (!message) {
    throw new Error(`Received null response from RPC ${rpc.name}`);
  }
  return rpc.resolvedResponseType!.toObject(message, defaultToObjectOptions);
}
