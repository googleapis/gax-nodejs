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

import * as execa from 'execa';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as util from 'util';
import {describe, it, before} from 'mocha';

const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);
const readFile = util.promisify(fs.readFile);
const writeFile = util.promisify(fs.writeFile);

const baseRepoUrl = 'https://github.com/googleapis/';
const testDir = path.join(process.cwd(), '.system-test-run');
const gaxDir = path.resolve(__dirname, '..', '..', '..');

// We will pack google-gax using `npm pack`, defining some constants to make it
// easier to consume that tarball
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json');
const gaxTarball = path.join(gaxDir, `${pkg.name}-${pkg.version}.tgz`);

async function latestRelease(cwd: string): Promise<string> {
  const {stdout} = await execa('git', ['tag', '--list'], {cwd});
  const tags = stdout
    .split('\n')
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
  await execa(
    'git',
    ['clone', `${baseRepoUrl}${packageName}.git`, packageName],
    {stdio: 'inherit'}
  );
  const tag = await latestRelease(packageName);
  await execa('git', ['checkout', tag], {cwd: packageName, stdio: 'inherit'});

  const packageJson = path.join(packageName, 'package.json');
  const packageJsonStr = (await readFile(packageJson)).toString();
  const packageJsonObj = JSON.parse(packageJsonStr);
  packageJsonObj['dependencies']['google-gax'] = `file:${gaxTarball}`;
  await writeFile(packageJson, JSON.stringify(packageJsonObj, null, '  '));
  await execa('npm', ['install'], {cwd: packageName, stdio: 'inherit'});
}

async function runSystemTest(packageName: string): Promise<void> {
  await execa('npm', ['run', 'system-test'], {
    cwd: packageName,
    stdio: 'inherit',
  });
}
// nodejs-kms does not have system test.
async function runSamplesTest(packageName: string): Promise<void> {
  await execa('npm', ['run', 'samples-test'], {
    cwd: packageName,
    stdio: 'inherit',
  });
}

describe('Run system tests for some libraries', () => {
  before(async () => {
    console.log('Packing google-gax...');
    await execa('npm', ['pack'], {cwd: gaxDir, stdio: 'inherit'});

    if (!fs.existsSync(gaxTarball)) {
      throw new Error(`npm pack tarball ${gaxTarball} does not exist`);
    }

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
  // Speech only has smoke tests, but still...
  describe('speech', () => {
    before(async () => {
      await preparePackage('nodejs-speech');
    });
    it('should pass system tests', async () => {
      await runSystemTest('nodejs-speech');
    });
  });

  // KMS api has IAM service injected from gax. All its IAM related test are in samples-test.
  describe('kms', () => {
    before(async () => {
      await preparePackage('nodejs-kms');
    });
    it('should pass samples tests', async () => {
      await runSamplesTest('nodejs-kms');
    });
  });
});
