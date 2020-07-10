import * as core from '@actions/core';
import * as github from '@actions/github';
import lint from '@commitlint/lint';
import load from '@commitlint/load';
import { QualifiedConfig, LintRuleConfig } from '@commitlint/types';

enum OptionEnum {
  Some,
  None,
}

class Option<T> {
  private val?: T

  private status: OptionEnum

  static none<T>() {
    return new Option<T>(OptionEnum.None);
  }

  static some<T>(val: T) {
    return new Option<T>(OptionEnum.Some, val);
  }

  constructor(status: OptionEnum, val?: T) {
    this.status = status;
    this.val = val;
  }

  unwrap(): T {
    return this.val!;
  }

  isNone(): boolean {
    return this.status === OptionEnum.None;
  }
}

async function findConfig({ file, cwd }: {file: string, cwd: string}):
  Promise<Option<QualifiedConfig>> {
  try {
    return Option.some(await load({}, { file, cwd }));
  } catch {
    return Option.none();
  }
}

async function main() {
  console.time('Done');

  const { context: cx } = github;
  const GITHUB_WORKSPACE = process.env.GITHUB_WORKSPACE as string;

  const input = {
    config: core.getInput('config'),
    shouldFailOnWarn: core.getInput('should-fail-on-warn'),
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

  console.log(JSON.stringify(res, null, 2));
}

main()
  .catch((e) => {
    core.setFailed(` ${e.message}`);
  })
  .finally(() => {
    console.timeEnd('Done');
  });
