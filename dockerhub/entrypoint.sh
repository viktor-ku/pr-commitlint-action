#!/bin/sh -l

set -e

node ./index.js
job_exit_code=$?

echo Exit code: $job_exit_code
