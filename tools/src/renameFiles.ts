#!/usr/bin/env node

// Copyright 2023 Google LLC
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

import * as fs from 'fs';
import * as path from 'path';
const fsp = fs.promises;

async function modifyCJSDir(dirNameReadAbsolute: string, searchPattern: string, resultString: string) {
    const files = fs.readdirSync(dirNameReadAbsolute);
    for (const file of files) {
      const fileName = file.toString();
  
      const readName = path.join(dirNameReadAbsolute, fileName);
  
      if (fs.statSync(readName).isFile()) {
        await fsp.rename(readName, readName.replace(new RegExp(searchPattern), resultString));
      } else if (fs.statSync(readName).isDirectory()) {
        modifyCJSDir(readName, searchPattern, resultString);
      }
    }
  }

/**
 * Main function. Renames files in a directory recursively matching one regex to another
 */
export async function main(parameters: string[]): Promise<void> {
    const searchPattern = parameters[0];
    const changePattern = parameters[1];
    const directory = parameters[2];

    modifyCJSDir(directory, searchPattern, changePattern);
  }
  
  /**
   * Shows the usage information.
   */
  function usage() {
    console.log(
      `Usage: node ${process.argv[1]} [regexSearchPattern] [resultString] directory ...`
    );
    console.log(
      `Finds all files matching regexSearchPattern and changes it to the resultString in the given directory.`
    );
  }
  
  if (require.main === module) {
    if (process.argv.length <= 2) {
      usage();
      // eslint-disable-next-line no-process-exit
      process.exit(1);
    }
    // argv[0] is node.js binary, argv[1] is script path
    main(process.argv.slice(2));
  }
  