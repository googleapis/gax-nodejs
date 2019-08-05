/**
 * Copyright 2019 Google LLC
 * All rights reserved.
 *
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are
 * met:
 *
 *     * Redistributions of source code must retain the above copyright
 * notice, this list of conditions and the following disclaimer.
 * Redistributions in binary form must reproduce the above
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

const execa = require('execa');
const download = require('download');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const tar = require('tar');
const util = require('util');

const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);

async function startServer() {
    const testDir = path.join(process.cwd(), '.kitchen-sink');
    const platform = process.platform;
    const arch = process.arch === 'x64' ? 'amd64' : process.arch;
    const showcaseVersion = process.env['SHOWCASE_VERSION'] || '0.2.4';
    const tarballFilename = `gapic-showcase-${showcaseVersion}-${platform}-${arch}.tar.gz`;
    const fallbackServerUrl = `https://github.com/googleapis/gapic-showcase/releases/download/v${showcaseVersion}/${tarballFilename}`;
    const binaryName = './gapic-showcase';

    await rmrf(testDir);
    await mkdir(testDir);
    process.chdir(testDir);
    console.log(`Server will be run from ${testDir}.`);

    // Downloading the fallback tar file and extracting the binary,
    // assuming that we're running tests on Linux
    await download(fallbackServerUrl, testDir);
    await tar.extract(
        {
            file: tarballFilename,
        },
    );

    grpcServer = execa(binaryName, ['run'], {
        cwd: testDir,
        stdio: 'inherit',
    });

    console.log('gRPC server is started.');

    grpcServer.then(
        () => {
            throw new Error('gRPC server is not supposed to exit normally!');
        },
        () => {
            console.log('gRPC server is terminated.');
        }
    );
}

startServer();
