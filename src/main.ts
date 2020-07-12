import * as core from '@actions/core';
import * as github from '@actions/github';
import lint from '@commitlint/lint';
import load from '@commitlint/load';
import { format } from '@commitlint/format';
import { QualifiedConfig, LintRuleConfig } from '@commitlint/types';
import { Option } from './Option';

async function findConfig({ file, cwd }: {file: string, cwd: string}):
  Promise<Option<QualifiedConfig>> {
  try {
    return Option.some(await load({}, { file, cwd }));
  } catch {
    return Option.none();
  }
}

const fmt = (val: Record<string, unknown>, verbose: boolean) => format({ results: [val] }, {
  color: true,
  helpUrl: 'https://github.com/conventional-changelog/commitlint/#what-is-commitlint',
  verbose,
});

const bool = (val: string): boolean => (val === 'true');

async function main() {
  const { context: cx } = github;
  const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE as string;

  const input = {
    config: core.getInput('config'),
    strict: bool(core.getInput('strict')),
    verbose: bool(core.getInput('verbose')),
  };

  if (!cx.payload.pull_request) {
    throw new Error('Make sure this action is being triggered by a pull request');
  }

  const maybeConfig = await findConfig({ file: input.config, cwd: GITHUB_WORKSPACE });

  if (maybeConfig.isNone()) {
    throw new Error('No config found, please add commitlint config to your project!');
  }

  const config = maybeConfig.unwrap();

  const pr = cx.payload.pull_request.title as string;
  const res = await lint(pr, config.rules as LintRuleConfig, config);

  if (res.errors.length) {
    console.error('Failed due to the following errors:');
    console.error(fmt(res, input.verbose));
    process.exit(1);
  }

  if (input.strict && res.warnings.length) {
    console.error('Failed due to the following warnings:');
    console.error(fmt(res, input.verbose));
    process.exit(1);
  }

  console.log('All good! 🎉');
}

main()
  .catch((e) => {
    core.setFailed(e.message);
  });
