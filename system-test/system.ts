/**
 * Copyright 2018 Google LLC. All Rights Reserved.
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
