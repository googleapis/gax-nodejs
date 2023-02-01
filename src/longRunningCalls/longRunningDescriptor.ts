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

import * as protobuf from 'protobufjs';
import {Descriptor} from '../descriptor';
import {OperationsClient} from '../operationsClient';
import {LongrunningApiCaller} from './longRunningApiCaller';

/**
 * A callback to upack a google.protobuf.Any message.
 */
export interface AnyDecoder {
  (reader: protobuf.Reader | Uint8Array, length?: number): protobuf.Message<{}>;
}

export interface DiregapicLROOptions {
  pollingService?: string;
  pollingMethodName: string;
  pollingMethodRequestType: protobuf.Type;
}

/**
 * A descriptor for long-running operations.
 */
export class LongRunningDescriptor implements Descriptor {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  operationsClient: OperationsClient | any;
  responseDecoder: AnyDecoder | null;
  metadataDecoder: AnyDecoder | null;
  diregapic?: DiregapicLROOptions | null;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    operationsClient: OperationsClient | any,
    responseDecoder: AnyDecoder | null,
    metadataDecoder: AnyDecoder | null,
    diregapic?: DiregapicLROOptions | null
  ) {
    this.operationsClient = operationsClient;
    this.responseDecoder = responseDecoder;
    this.metadataDecoder = metadataDecoder;
    this.diregapic = diregapic;
  }

  getApiCaller() {
    return new LongrunningApiCaller(this);
  }
}
