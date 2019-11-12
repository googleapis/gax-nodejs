#!/usr/bin/env node

/* Copyright 2019 Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 *     * Redistributions in binary form must reproduce the above
 * copyright notice, this list of conditions and the following disclaimer
 * in the documentation and/or other materials provided with the
 * distribution.
 *     * Neither the name of Google Inc. nor the names of its
 * contributors may be used to endorse or promote products derived from
 * this software without specific prior written permission.
 *
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS
 * "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT
 * LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR
 * A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT
 * OWNER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
 * SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
 * LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 * DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 * THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 * (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
 * OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
 */

import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';
import * as pbjs from 'protobufjs/cli/pbjs';
import * as pbts from 'protobufjs/cli/pbts';

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);
const stat = util.promisify(fs.stat);
const pbjsMain = util.promisify(pbjs.main);
const pbtsMain = util.promisify(pbts.main);

const PROTO_LIST_REGEX = /_proto_list\.json$/;

const apacheLicense = `// Copyright ${new Date().getFullYear()} Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

`;

/**
 * Recursively scans directories starting from `directory` and finds all files
 * matching `PROTO_LIST_REGEX`.
 *
 * @param {string} directory Path to start the scan from.
 * @return {Promise<string[]} Resolves to an array of strings, each element is a full path to a matching file.
 */
async function findProtoJsonFiles(directory: string): Promise<string[]> {
  const result: string[] = [];
  const files = await readdir(directory);
  for (const file of files) {
    const fullPath = path.join(directory, file);
    const fileStat = await stat(fullPath);
    if (fileStat.isFile() && file.match(PROTO_LIST_REGEX)) {
      result.push(fullPath);
    } else if (fileStat.isDirectory()) {
      const nested = await findProtoJsonFiles(fullPath);
      result.push(...nested);
    }
  }
  return result;
}

/**
 * Normalizes the Linux path for the current operating system.
 *
 * @param {string} filePath Linux-style path (with forward slashes)
 * @return {string} Normalized path.
 */
function normalizePath(filePath: string): string {
  return path.join(...filePath.split('/'));
}

/**
 * Returns a combined list of proto files listed in all JSON files given.
 *
 * @param {string[]} protoJsonFiles List of JSON files to parse
 * @return {Promise<string[]>} Resolves to an array of proto files.
 */
async function buildListOfProtos(protoJsonFiles: string[]): Promise<string[]> {
  const result: string[] = [];
  for (const file of protoJsonFiles) {
    const directory = path.dirname(file);
    const content = await readFile(file);
    const list = JSON.parse(content.toString()).map((filePath: string) =>
      path.join(directory, normalizePath(filePath))
    );
    result.push(...list);
  }
  return result;
}

/**
 * Runs `pbjs` to compile the given proto files, placing the result into
 * `./protos/protos.json`. No support for changing output filename for now
 * (but it's a TODO!)
 *
 * @param {string[]} protos List of proto files to compile.
 */
async function compileProtos(protos: string[]): Promise<void> {
  // generate protos.json file from proto list
  const jsonOutput = path.join('protos', 'protos.json');
  if (protos.length === 0) {
    // no input file, just emit an empty object
    await writeFile(jsonOutput, '{}');
    return;
  }
  const pbjsArgs4JSON = [
    '--target',
    'json',
    '-p',
    path.join(__dirname, '..', '..', 'protos'),
    '-p',
    'protos',
    '-o',
    jsonOutput,
  ];
  pbjsArgs4JSON.push(...protos);
  await pbjsMain(pbjsArgs4JSON);

  // generate protos/protos.js from protos.json
  const jsOutput = path.join('protos', 'protos.js');
  const pbjsArgs4js = [
    '--target',
    'static-module',
    '-p',
    path.join(__dirname, '..', '..', 'protos'),
    '-p',
    'protos',
    '-o',
    jsOutput,
  ];
  pbjsArgs4js.push(...protos);
  await pbjsMain(pbjsArgs4js);

  let jsResult = (await readFile(jsOutput)).toString();
  // add Apache license to the generated .js file
  jsResult = apacheLicense + jsResult;
  await writeFile(jsOutput, jsResult);

  // generate protos/protos.d.ts
  const tsOutput = path.join('protos', 'protos.d.ts');
  const pbjsArgs4ts = [jsOutput, '-o', tsOutput];
  await pbtsMain(pbjsArgs4ts);

  let tsResult = (await readFile(tsOutput)).toString();
  // fix for pbts output: the corresponding protobufjs PR
  // https://github.com/protobufjs/protobuf.js/pull/1166
  // is merged but not yet released.
  if (!tsResult.match(/import \* as Long/)) {
    tsResult = 'import * as Long from "long";\n' + tsResult;
  }
  // add Apache license to the generated .d.ts file
  tsResult = apacheLicense + tsResult;
  await writeFile(tsOutput, tsResult);
}

/**
 * Main function. Takes an array of directories to process.
 * Looks for JSON files matching `PROTO_LIST_REGEX`, parses them to get a list of all
 * proto files used by the client library, and calls `pbjs` to compile them all into
 * JSON (`pbjs -t json`).
 *
 * Exported to be called from a test.
 *
 * @param {string[]} directories List of directories to process. Normally, just the
 * `./src` folder of the given client library.
 */
export async function main(directories: string[]): Promise<void> {
  const protoJsonFiles: string[] = [];
  for (const directory of directories) {
    protoJsonFiles.push(...(await findProtoJsonFiles(directory)));
  }
  const protos = await buildListOfProtos(protoJsonFiles);
  await compileProtos(protos);
}

/**
 * Shows the usage information.
 */
function usage() {
  console.log(`Usage: node ${process.argv[1]} directory ...`);
  console.log(
    `Finds all files matching ${PROTO_LIST_REGEX} in the given directories.`
  );
  console.log(
    `Each of those files should contain a JSON array of proto files used by the`
  );
  console.log(
    `client library. Those proto files will be compiled to JSON using pbjs tool`
  );
  console.log(`from protobufjs.`);
}

if (require.main === module) {
  if (process.argv.length <= 2) {
    usage();
    process.exit(1);
  }
  // argv[0] is node.js binary, argv[1] is script path
  main(process.argv.slice(2));
}
