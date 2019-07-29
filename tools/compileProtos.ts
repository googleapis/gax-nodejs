#!/usr/bin/env node

/*
 * Copyright 2019 Google LLC
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

const readdir = util.promisify(fs.readdir);
const readFile = util.promisify(fs.readFile);
const stat = util.promisify(fs.stat);
const pbjsMain = util.promisify(pbjs.main);

const PROTO_LIST_REGEX = /_proto_list.json$/;

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
 * `./protos/protos.json`.
 *
 * @param {string[]} protos List of proto files to compile.
 */
async function compileProtos(protos: string[]): Promise<void> {
  const pbjsArgs = [
    '--target',
    'json',
    '-p',
    path.join('node_modules', 'google-gax', 'protos'),
    '-p',
    'protos',
    '-o',
    path.join('protos', 'protos.json'),
  ];
  pbjsArgs.push(...protos);
  await pbjsMain(pbjsArgs);
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
