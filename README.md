# pr-commitlint-action

> A GitHub Action that checks Pull Request name with commitlint config, aiming to be consistent with commit names

## Inputs

### `config`

> Type: string

> Default: "commitlint.config.js"

Sets specific file to look for a config.

### `strict`

> Type: boolean

> Default: true

Action will fail even if commitlint warnings are detected when in strict mode.

### `verbose`

> Type: boolean

> Default: false

Whether commitlint output shoud be verbose when failing.

## Outputs

It does not output anything at the moment.

## Example usage

```yaml
name: PR
on:
  pull_request:
    branches:
      - "*"
jobs:
  pr-lint:
    name: Lint PR name
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: viktor-ku/pr-commitlint-action@v1
        with:
          config: .commitlintrc.yml
          verbose: true
```

## About `extends` in your config file

> This section is copied from [wagoid/commitlint-github-action](https://github.com/wagoid/commitlint-github-action#about-extends-in-your-config-file)
> because this github action works in a simillar way. For details, see [Credits](#Credits)

This is a [`Docker` action](https://github.com/actions/toolkit/blob/e2adf403d6d14a9ca7474976ccaca20f72ff8209/docs/action-types.md#why-would-i-choose-a-docker-action), and was made like this so that you can run it with minimum setup, regardless of your repo's environment. It comes packed with the most famous shared configurations that you can use in your commitlint config's `extends` field:

- [@commitlint/config-angular](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-angular)
- [@commitlint/config-conventional](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-conventional)
- [@commitlint/config-lerna-scopes](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-lerna-scopes)
- [@commitlint/config-patternplate](https://github.com/conventional-changelog/commitlint/tree/master/%40commitlint/config-patternplate)
- [conventional-changelog-lint-config-canonical](https://github.com/gajus/conventional-changelog-lint-config-canonical)
- [commitlint-config-jira](https://github.com/Gherciu/commitlint-jira)

Apart from the shared configurations that are included by default, you can also include extra dependencies for other configs and plugins that you want to use.

In order to do so, you can use `NODE_PATH` env var to make the action take those dependencies into account. Below is an example workflow that does that.

```yaml
name: Commitlint
on: [pull_request]

jobs:
  lint:
    runs-on: ubuntu-latest
    env:
      GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
    steps:
      - uses: actions/checkout@v2
        with:
          fetch-depth: 0
      - uses: actions/setup-node@v1
        with:
          node-version: '10.x'
      - run: npm install
      - name: Add dependencies for commitlint action
        # $GITHUB_WORKSPACE is the path to your repository
        run: echo "::set-env name=NODE_PATH::$GITHUB_WORKSPACE/node_modules"
      # Now the commitlint action will run considering its own dependencies and yours as well 🚀
      - uses: wagoid/commitlint-github-action@v1
```

💡 You can see other ways to install your dependencies (including private ones) in [the Setup Node action's docs](https://github.com/actions/setup-node).

## Credits

Many thanks to the author of this project [wagoid/commitlint-github-action](https://github.com/wagoid/commitlint-github-action)! Now, you can have both
your PR name and commits to that PR checked with `commitlint` in a similar fashion, reusing the same config!
