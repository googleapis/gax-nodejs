#!/usr/bin/env node

// Copyright 2022 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// Minifies proto JSON files under `build/`.

import {promises as fsp} from 'fs';
import * as path from 'path';
import * as uglify from 'uglify-js';
import * as yargs from 'yargs';

interface CliArgs {
  directory?: string;
  minifyJs?: boolean;
}
async function minifyFile(filename: string, isJs: boolean) {
  const content = (await fsp.readFile(filename)).toString();
  let output;
  if (!isJs) {
    output = uglify.minify(content, {
      expression: true,
      compress: false, // we need to keep it valid JSON
      output: {quote_keys: true},
    });
  } else {
    output = uglify.minify(content, {
      expression: false,
    });
  }
  if (output.error) {
    throw output.error;
  }
  await fsp.writeFile(filename, output.code);
}

export async function main(args?: CliArgs | string | undefined) {
  let buildDir;
  if (typeof args === 'object' && args.directory) {
    buildDir = args.directory;
  } else if (typeof args === 'string') {
    buildDir = args;
  } else {
    buildDir = path.join(process.cwd(), 'build', 'protos');
  }
  const files = await fsp.readdir(buildDir);
  const jsonFiles = files.filter(file => file.match(/\.json$/));
  for (const jsonFile of jsonFiles) {
    console.log(`Minifying ${jsonFile}...`);
    await minifyFile(path.join(buildDir, jsonFile), false);
  }
  if (typeof args === 'object' && args?.minifyJs) {
    const jsFiles = files.filter(file => file.match(/\.js$/));
    for (const jsFile of jsFiles) {
      console.log(`Minifying ${jsFile}...`);
      await minifyFile(path.join(buildDir, jsFile), true);
    }
  }
  console.log(
    `Minified all proto ${
      typeof args === 'object' && args?.minifyJs ? 'JS and JSON' : 'JSON'
    } files successfully.`
  );
}

if (require.main === module) {
  let args;
  if (process.argv.length === 3 && !process.argv[2].includes('--directory')) {
    args = process.argv[2] as string;
  } else {
    args = yargs(process.argv.slice(2)).usage(
      `Usage: node ${process.argv[1]} [--directory] [--minifyJs]\nMinifies all JSON files in-place in the given directory (non-recursively).\nIf no directory is given, minifies JSON files in ./build/protos.\nCan minify JS files as well using --minifyJS flag`
    ).argv as unknown as CliArgs;
  }

  main(args);
}
