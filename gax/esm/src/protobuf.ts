/**
 * Copyright 2022 Google LLC
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

// This file is here to re-export protobuf.js so that the proto.js files
// produced by tools/compileProtos.ts did not depend on protobuf.js
// directly.
// Usage:
//   const {protobufMinimal} = require('google-gax/build/src/protobuf');

import * as protobuf from 'protobufjs';

export * as protobufMinimal from 'protobufjs/minimal.js';

// The manually-created protobuf types are incorrect. Overriding here.
const protobufFixed: typeof import('protobufjs') =
  'default' in protobuf
    ? (protobuf.default as unknown as typeof import('protobufjs'))
    : protobuf;

export {protobufFixed as protobuf};
