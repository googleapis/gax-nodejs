#!/bin/sh

major_version=`node --version | grep -o '[0-9]\{1,\}' | head -n1`

if [ -z "$major_version" ]; then
  echo Failed to parse the nodeJS version: `node --version` 1>&2
  exit 1
fi

# ESLint does not support NodeJS 0.12.x, simply skipping.
if [ "$major_version" -lt 4 ]; then
  exit 0
fi

npm run lint
