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

import * as cp from 'child_process';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as util from 'util';

const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);

const baseRepoUrl = 'https://github.com/googleapis/';
const testDir = path.join(process.cwd(), '.system-test-run');

interface ExecuteResult {
  stdout: string;
  stderr: string;
}

async function execute(command: string, cwd?: string): Promise<ExecuteResult> {
  cwd = cwd || process.cwd();
  const maxBuffer = 10 * 1024 * 1024;
  console.log(`Execute: ${command} [cwd: ${cwd}]`);
  return new Promise<ExecuteResult>((resolve, reject) => {
    cp.exec(command, {cwd, maxBuffer}, (err, stdout, stderr) => {
      if (err) {
        reject(new Error(`Command ${command} terminated with error ${err}`));
      } else {
        resolve({stdout, stderr});
      }
    });
  });
}

async function spawn(
    command: string, args?: string[], cwd?: string): Promise<void> {
  cwd = cwd || process.cwd();
  args = args || [];
  console.log(`Execute: ${command} ${args.join(' ')} [cwd: ${cwd}]`);
  return new Promise<void>((resolve, reject) => {
    const child = cp.spawn(command, args || [], {
                      cwd,
                      stdio: 'inherit'
                    }).on('close', (code: number|null, signal: string|null) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command ${command} terminated with code ${
            code}, signal ${signal}`));
      }
    });
  });
}

async function latestRelease(cwd: string): Promise<string> {
  const gitTagOutput = (await execute('git tag --list', cwd)).stdout;
  const tags =
      gitTagOutput.split('\n')
          .filter(str => str.match(/^v\d+\.\d+\.\d+$/))
          .sort((tag1: string, tag2: string): number => {
            const match1 = tag1.match(/^v(\d+)\.(\d+)\.(\d+)$/);
            const match2 = tag2.match(/^v(\d+)\.(\d+)\.(\d+)$/);
            if (!match1 || !match2) {
              throw new Error(`Cannot compare git tags ${tag1} and ${tag2}`);
            }
            // compare major version, then minor versions, then patch versions.
            // return positive number, zero, or negative number
            for (let idx = 1; idx <= 3; ++idx) {
              if (match1[idx] !== match2[idx]) {
                return Number(match1[idx]) - Number(match2[idx]);
              }
            }
            return 0;
          });
  // the last tag in the list is the latest release
  return tags[tags.length - 1];
}

async function preparePackage(packageName: string): Promise<void> {
  await spawn(
      'git', ['clone', `${baseRepoUrl}${packageName}.git`, packageName]);
  const tag = await latestRelease(packageName);
  await spawn('git', ['checkout', tag], packageName);
  await spawn('npm', ['link', '../../'], packageName);
  await spawn('npm', ['install'], packageName);
  await spawn('npm', ['link', '../../'], packageName);
}

async function runSystemTest(packageName: string): Promise<void> {
  await spawn('npm', ['run', 'system-test'], packageName);
}

describe('Run system tests for some libraries', () => {
  before(async () => {
    await rmrf(testDir);
    await mkdir(testDir);
    process.chdir(testDir);
    console.log(`Running tests in ${testDir}.`);
  });
  // Video intelligence API has long running operations
  describe('video-intelligence', () => {
    before(async () => {
      await preparePackage('nodejs-video-intelligence');
    });
    it('should pass system tests', async () => {
      await runSystemTest('nodejs-video-intelligence');
    });
  });
  // Pub/Sub has streaming methods and pagination
  describe('pubsub', () => {
    before(async () => {
      await preparePackage('nodejs-pubsub');
    });
    it('should pass system tests', async function() {
      // Pub/Sub tests can be slow since they check packaging
      this.timeout(300000);
      await runSystemTest('nodejs-pubsub');
    });
  });
  // Speech only has smoke tests, but still...
  describe('speech', () => {
    before(async () => {
      await preparePackage('nodejs-speech');
    });
    it('should pass system tests', async () => {
      await runSystemTest('nodejs-speech');
    });
  });
});
