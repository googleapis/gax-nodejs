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

import {APICaller} from '../apiCaller';
import {Descriptor} from '../descriptor';
import {CallSettings} from '../gax';

import {StreamType} from './streaming';
import {StreamingApiCaller} from './streamingApiCaller';

/**
 * A descriptor for streaming calls.
 */
export class StreamDescriptor implements Descriptor {
  type: StreamType;
  streaming: boolean; // needed for browser support

  constructor(streamType: StreamType) {
    this.type = streamType;
    this.streaming = true;
  }

  getApiCaller(settings: CallSettings): APICaller {
    // Right now retrying does not work with gRPC-streaming, because retryable
    // assumes an API call returns an event emitter while gRPC-streaming methods
    // return Stream.
    // TODO: support retrying.
    settings.retry = null;
    return new StreamingApiCaller(this);
  }
}
