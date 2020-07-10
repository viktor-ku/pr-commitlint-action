#!/bin/sh -l

set -e

if [ -z "$NODE_PATH" ]; then
  export NODE_PATH=/configs/node_modules
else
  export NODE_PATH=$NODE_PATH:/configs/node_modules
fi

node /action/index.js
