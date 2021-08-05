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

import {defaultToObjectOptions} from './fallback';
import {FetchParameters} from './fallbackServiceStub';
import {GoogleErrorDecoder} from './googleError';

export function encodeRequest(
  rpc: protobuf.Method,
  protocol: string,
  servicePath: string,
  servicePort: number,
  request: {}
): FetchParameters {
  const protoNamespaces: string[] = [];
  let currNamespace = rpc.parent!;
  while (currNamespace.name !== '') {
    protoNamespaces.unshift(currNamespace.name);
    currNamespace = currNamespace.parent!;
  }
  const protoServiceName = protoNamespaces.join('.');
  const rpcName = rpc.name;

  const headers: {[key: string]: string} = {
    'Content-Type': 'application/x-protobuf',
  };

  const method = 'post';
  const requestMessage = rpc.resolvedRequestType!.fromObject(request);
  const body = rpc.resolvedRequestType!.encode(requestMessage).finish();
  const url = `${protocol}://${servicePath}:${servicePort}/$rpc/${protoServiceName}/${rpcName}`;

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
  if (!ok) {
    const statusDecoder = new GoogleErrorDecoder();
    const error = statusDecoder.decodeErrorFromBuffer(response);
    throw error;
  }

  const buffer =
    response instanceof ArrayBuffer ? new Uint8Array(response) : response;
  const message = rpc.resolvedResponseType!.decode(buffer);
  return rpc.resolvedResponseType!.toObject(message, defaultToObjectOptions);
}
