/**
 * Copyright 2020 Google LLC
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

// Light-weight wrapper for child-process that will replace `execa` npm
// package.

import * as childProcess from 'child_process';

declare namespace execa {
  interface Result {
    stdout: string;
    stderr: string;
    code: number | null;
    signal: string | null;
  }

  interface ExecaChildProcess extends Promise<Result> {
    kill(signal?: string): void;
  }
}

function execa(
  cmd: string,
  args?: string[],
  options?: childProcess.SpawnOptions
): execa.ExecaChildProcess {
  const cp = childProcess.spawn(cmd, args, options);
  const promise = new Promise<execa.Result>((resolve, reject) => {
    let stdout = '';
    let stderr = '';
    cp.on('error', reject);
    if (cp.stdout) {
      cp.stdout.on('data', (chunk: string) => {
        stdout += chunk;
      });
    }
    if (cp.stderr) {
      cp.stderr.on('data', (chunk: string) => {
        stderr += chunk;
      });
    }
    cp.on('exit', (code: number | null, signal: string | null) => {
      const result = {stdout, stderr, code, signal};
      if (signal) {
        reject(result);
      } else {
        resolve(result);
      }
    });
  }) as execa.ExecaChildProcess;
  promise.kill = (signal?: string) => {
    cp.kill(signal);
  };
  return promise;
}

export = execa;
