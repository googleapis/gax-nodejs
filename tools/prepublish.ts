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

import * as fs from 'fs-extra';
import {getProtoPath} from 'google-proto-files';
import * as path from 'path';

const subdirs = [
  'api',
  'iam/v1',
  'logging/type',
  'monitoring/v3',
  'longrunning',
  'protobuf',
  'rpc',
  'type',
];

async function main() {
  await fs.remove(path.join('protos', 'google'));
  await fs.ensureDir(path.join('protos', 'google'));

  subdirs.forEach(async subdir => {
    const src = getProtoPath(subdir);
    const target = path.join('protos', 'google', subdir);
    await fs.copy(src, target);
  });
}

main().catch(console.error);
