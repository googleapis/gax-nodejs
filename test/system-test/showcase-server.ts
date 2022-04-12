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
import * as download from 'download';
import * as fs from 'fs';
import * as path from 'path';
import * as rimraf from 'rimraf';
import * as util from 'util';

const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);

export class ShowcaseServer {
  server: execa.ExecaChildProcess | undefined;

  async start() {
    const testDir = path.join(process.cwd(), '.showcase-server-dir');
    const platform = process.platform;
    const arch = process.arch === 'x64' ? 'amd64' : process.arch;
    const showcaseVersion = process.env['SHOWCASE_VERSION'] || '0.17.0';
    const tarballFilename = `gapic-showcase-${showcaseVersion}-${platform}-${arch}.tar.gz`;
    const fallbackServerUrl = `https://github.com/googleapis/gapic-showcase/releases/download/v${showcaseVersion}/${tarballFilename}`;
    const binaryName = './gapic-showcase';

    await rmrf(testDir);
    await mkdir(testDir);
    process.chdir(testDir);
    console.log(`Server will be run from ${testDir}.`);

    await download(fallbackServerUrl, testDir);
    await execa('tar', ['xzf', tarballFilename]);
    const childProcess = execa(binaryName, ['run'], {
      cwd: testDir,
      stdio: 'inherit',
    });

    console.log('gRPC/gRPC-fallback server is started.');

    childProcess.then(
      () => {
        throw new Error(
          'gRPC server is not supposed to exit normally - just kill it from the test!'
        );
      },
      () => {
        console.log('gRPC server is terminated.');
      }
    );

    this.server = childProcess;
  }

  stop() {
    if (!this.server) {
      throw new Error("Cannot kill the server, it's not started.");
    }
    this.server.kill();
  }
}

if (require.main === module) {
  const server = new ShowcaseServer();
  server.start();
}
