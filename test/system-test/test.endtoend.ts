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
import {ncp} from 'ncp';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as util from 'util';
import {describe, it, before, after} from 'mocha';

import {ShowcaseServer} from './showcase-server';

const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);
const ncpp = util.promisify(ncp);

const testDir = path.join(process.cwd(), '.kitchen-sink');
const gaxDir = path.resolve(__dirname, '..', '..', '..');
const buildDir = path.join(process.cwd(), 'build');
const fixturesDir = path.join(buildDir, 'test', 'fixtures');

// We will pack google-gax using `npm pack`, defining some constants to make it
// easier to consume that tarball
// eslint-disable-next-line @typescript-eslint/no-var-requires
const pkg = require('../../../package.json');
const gaxTarball = path.join(gaxDir, `${pkg.name}-${pkg.version}.tgz`);

// We have a test gRPC client in `system-test/fixtures` that we'll copy to a
// temporary folder and use it from there
const testAppName = 'google-gax-packaging-test-app';
const testAppSource = path.join(fixturesDir, testAppName);
const testAppDestination = path.join(testDir, testAppName);

describe('Run end-to-end test', () => {
  const grpcServer = new ShowcaseServer();
  before(async () => {
    await execa('npm', ['pack'], {cwd: gaxDir, stdio: 'inherit'});
    if (!fs.existsSync(gaxTarball)) {
      throw new Error(`npm pack tarball ${gaxTarball} does not exist`);
    }
    await rmrf(testDir);
    await mkdir(testDir);
    process.chdir(testDir);
    await grpcServer.start();
  });

  it('should be able to prepare test app', async () => {
    await ncpp(testAppSource, testAppDestination);
    await ncpp(gaxTarball, path.join(testAppDestination, 'google-gax.tgz'));
    await execa('npm', ['install'], {
      cwd: testAppDestination,
      stdio: 'inherit',
    });
  });

  it('should be able to run unit tests of test app', async () => {
    await execa('npm', ['test'], {cwd: testAppDestination, stdio: 'inherit'});
  });

  it('should be able to run tests against gRPC server', async () => {
    await execa('npm', ['start'], {
      cwd: testAppDestination,
      stdio: 'inherit',
    });
  });

  after(async () => {
    grpcServer.stop();
  });
});
