#!/usr/bin/env node

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

import {getProtoPath} from 'google-proto-files';
import * as path from 'path';
// Note: the following three imports will be all gone when we support Node.js 16+.
// But until then, we'll use these modules.
import * as fs from 'fs/promises';

const subdirs = [
  'api',
  'iam/v1',
  'logging/type',
  'monitoring/v3',
  'longrunning',
  'protobuf',
  'rpc',
  'type',
  'cloud/location',
];

async function main() {
  await fs.rm(path.join('protos', 'google'), { recursive: true, force: true });
  await fs.mkdir(path.join('protos', 'google'), { recursive: true });

  for (const subdir of subdirs) {
    const src = getProtoPath(subdir);
    const target = path.join('protos', 'google', subdir);
    console.log(`Copying protos from ${src} to ${target}`);
    await fs.mkdir(target,  { recursive: true });
    await fs.cp(src, target, { recursive: true, force: true });
  }
  console.log('Protos have been copied successfully');
}

main().catch(console.error);