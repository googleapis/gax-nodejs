const execa = require('execa');
const download = require('download');
const fs = require('fs');
const path = require('path');
const rimraf = require('rimraf');
const tar = require('tar');
const util = require('util');

const mkdir = util.promisify(fs.mkdir);
const rmrf = util.promisify(rimraf);


function sleep(timeout) {
    return new Promise(resolve => {
        setTimeout(resolve, timeout);
    });
}


async function startServer() {
    const testDir = path.join(process.cwd(), '.kitchen-sink');
    const fallbackServerUrl = 'https://github.com/googleapis/gapic-showcase/releases/download/v0.2.4/gapic-showcase-0.2.4-linux-amd64.tar.gz'; 
    const linuxTarFile = 'gapic-showcase-0.2.4-linux-amd64.tar.gz';
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
            file: linuxTarFile,
        },
    );

    await sleep(10000);
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
