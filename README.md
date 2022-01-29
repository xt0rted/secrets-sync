# secrets-sync

[![CI](https://github.com/xt0rted/secrets-sync/actions/workflows/ci.yml/badge.svg)](https://github.com/xt0rted/secrets-sync/actions/workflows/ci.yml)

A GitHub Action to sync secrets across multiple repositories.

Since this is a security centric action the dependencies used are all first party libraries, or ones that GitHub themselves use in their own actions.

Curently only [GitHub Actions](https://docs.github.com/en/actions/security-guides/encrypted-secrets) and [Dependabot](https://docs.github.com/en/code-security/supply-chain-security/keeping-your-dependencies-updated-automatically/managing-encrypted-secrets-for-dependabot) secrets are supported.
[CodeSpaces](https://docs.github.com/en/codespaces/managing-your-codespaces/managing-encrypted-secrets-for-your-codespaces) supports secrets but there isn't an API to manage them right now.
[Environment secrets](https://docs.github.com/en/actions/deployment/targeting-different-environments/using-environments-for-deployment#environment-secrets) have an API but aren't supported at the moment.
If there's demand for this then support can be added.

Get started quickly by forking [xt0rted/secrets-sync-template](https://github.com/xt0rted/secrets-sync-template).

## Usage

Anything can be used to trigger a workflow, but manually triggering is probably the best option.
You won't be able to use the provided [`GITHUB_TOKEN`](https://docs.github.com/en/actions/security-guides/automatic-token-authentication) since it won't have access to your other repositories.
Because of this a [Personal Access Token](https://github.com/settings/tokens/new?scopes=repo) with the `repo` scope or a [GitHub App Token](https://docs.github.com/en/developers/apps) with the appropriate access will need to be used.

By default the config file is named `secrets-sync.yml` and will be loaded from the root of the repository.

### Example workflow

```yaml
on: workflow_dispatch

jobs:
  sync:
    runs-on: ubuntu-latest

    steps:
      - name: Check out repo
        uses: actions/checkout@v2

      - name: Sync secrets
        uses: xt0rted/secrets-sync@v1
        with:
          repo_token: ${{ secrets.SECRET_SYNC_TOKEN }}
        env:
          APP_ID: ${{ secrets.APP_ID }}
          PRIVATE_KEY: ${{ secrets.PRIVATE_KEY }}
```

### Example config

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/xt0rted/secrets-sync/main/settings.schema.json
defaults:
  actions: true
  dependabot: true

secrets:
  - name: APP_ID
    value: env/APP_ID
    repos:
      - test-user/test-repo-1
      - test-user-test-repo-2

  - name: PRIVATE_KEY
    value: env/PRIVATE_KEY
    repos:
      - test-user/test-repo-1
      - test-user-test-repo-2
```

## Options

Name | Description
-- | --
`repo_token` | A `repo` scoped Personal Access Token or GitHub App Token.
`config` | The path of the config file to use.

## Config format

```yaml
# yaml-language-server: $schema=https://raw.githubusercontent.com/xt0rted/secrets-sync/main/settings.schema.json
defaults:
  actions: true
  dependabot: false

secrets:
  - name: APP_ID
    value: abc123
    actions: false
    dependabot: true
    repos:
      - test-user/test-repo

  - name: PRIVATE_KEY
    value: env/PRIVATE_KEY
    repos:
      - test-user/test-repo
```

>ℹ️ A schema file [is available](settings.schema.json) to verify your config format.

### Defaults

```yaml
defaults:
  actions: true
  dependabot: true
```

This section lets you set the default environments that secrets are added to.
These are opt-in so if you don't set them here you'll need to set them on each individual secret.

### Secrets

```yaml
- name: APP_ID # Name of the secret in the destination repository
  value: env/APP_ID # Value to use for the secret
  actions: true # Optional
  dependabot: true # Optional
  repos: # List of repositories the secret should be added to
    - test-user/test-repo-1
    - test-user-test-repo-2
```

The value of a secret can be static or dynamic.
A static secret will use the value in the file as-is, while a dynamic secret will be loaded from an environment variable.

To use dynamic secrets prefix any environment variable name with `env/`.
For example, if the environment variable name is `APP_ID` the config value would be `env/APP_ID`.
Then add an environment variable to the step in your workflow with that name.

If a secret's value is left blank it's treated as an empty string, but if it's excluded from the file then it will be deleted from the repository.
This is useful if you're going to rename a secret or no longer need it.

```yaml
# Removes the APP_ID secret from the test-user/test-repo-1 repo
- name: APP_ID
  repos:
    - test-user/test-repo-1
```

Environments can be enabled or disabled on a per secret basis.
This way if you've set `actions: true` as the default but don't want a secret to be set for actions you can add `actions: false` to it and it'll be skipped.

## License

The scripts and documentation in this project are released under the [MIT License](LICENSE)
