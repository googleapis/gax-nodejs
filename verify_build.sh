#!/bin/sh

# This script verifies the google-gax package can be
# loaded after it's published.
# This script was added because it failed to load for
# normal installations due to devDependencies of chai.

set -x

current_dir=`pwd`
tmpdir=`mktemp -d`

cd ${tmpdir}
npm install "file://${current_dir}"
exitcode=$?
if [ ${exitcode} -eq 0 ]; then
  node -e 'require("google-gax")'
  exitcode=$?
fi

cd ${current_dir}
rm -rf ${tmpdir}
exit ${exitcode}
