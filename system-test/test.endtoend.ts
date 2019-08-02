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

import * as execa from 'execa';
import * as fs from 'fs';
import {ncp} from 'ncp';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as util from 'util';

import {ShowcaseServer} from './showcase-server';

const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);
const ncpp = util.promisify(ncp);

const testDir = path.join(process.cwd(), '.kitchen-sink');
const gaxDir = path.resolve(__dirname, '..', '..');
const fixturesDir = path.join(gaxDir, 'system-test', 'fixtures');

// We will pack google-gax using `npm pack`, defining some constants to make it
// easier to consume that tarball
const pkg = require('../../package.json');
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
    await execa('npm', ['start'], {cwd: testAppDestination, stdio: 'inherit'});
  });

  after(async () => {
    grpcServer.stop();
  });
});
