import * as core from '@actions/core';
import * as github from '@actions/github';

async function main() {
  const config = core.getInput('config');
  const shouldFailOnWarn = core.getInput('should-fail-on-warn');

  console.log('Config path is', config);
  console.log('Should fail on warn', shouldFailOnWarn);

  console.log('Payload', JSON.stringify(github.context.payload, undefined, 2));

  core.setFailed('Not Implemented!');
}

main()
  .catch(console.error);
