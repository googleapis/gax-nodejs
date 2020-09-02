#!/bin/bash

# Copyright 2020 Google LLC
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#      http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.


set -eo pipefail

## Make Chrome work: install missing things - to be moved to Docker image
DIRNAME=`pwd`
mkdir -p ~/libxss1
cd ~/libxss1
wget http://http.us.debian.org/debian/pool/main/libx/libxss/libxss1_1.2.3-1_amd64.deb
ar x libxss1_1.2.3-1_amd64.deb
tar xJf data.tar.xz
export LD_LIBRARY_PATH=`pwd`/usr/lib/x86_64-linux-gnu:$LD_LIBRARY_PATH
cd $DIRNAME
## End of Chrome fix

export NPM_CONFIG_PREFIX=/home/node/.npm-global

# Setup service account credentials.
export GOOGLE_APPLICATION_CREDENTIALS=${KOKORO_GFILE_DIR}/service-account.json
export GCLOUD_PROJECT=long-door-651

cd $(dirname $0)/..

npm install

npm run browser-test
