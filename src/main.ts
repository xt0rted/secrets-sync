// Uncomment when running locally
//import "dotenv/config";

import {
  debug,
  error,
  getInput,
  info,
  setFailed,
} from "@actions/core";

import {
  loadConfig,
  readConfigValue,
} from "./config";
import { setOrDeleteSecret } from "./secrets";
import {
  ignoreCaseCompare,
  loadFilter,
} from "./utils";

const DEFAULT_CONFIG_FILE = "secrets-sync.yml";

async function run(): Promise<void> {
  try {
    const repoFilters = loadFilter("filter_repos");

    if (repoFilters) {
      info(`Only processing repos: ${repoFilters.join(", ")}`);
    }

    const secretFilters = loadFilter("filter_secrets");

    if (secretFilters) {
      info(`Only processing secrets: ${secretFilters.join(", ")}`);
    }

    let configFile = getInput("config", { required: false });

    if (!configFile) {
      debug(`Config file not specified, using default '${DEFAULT_CONFIG_FILE}`);

      configFile = DEFAULT_CONFIG_FILE;
    }

    const { defaults, secrets } = await loadConfig(configFile);

    for await (const { name, value: value, repos, actions, dependabot } of secrets) {
      if (secretFilters && secretFilters.some(ignoreCaseCompare(name))) {
        debug(`Skipping secret ${name}`);

        continue;
      }

      // Secret values can be static or environment variables prefixed with `env/`
      const configValue = readConfigValue(value);

      for await (const repository of repos) {
        if (repoFilters && !repoFilters.some(ignoreCaseCompare(repository))) {
          debug(`Skipping repository ${repository}`);

          continue;
        }

        const [owner, repo] = repository.split("/");

        if (actions ?? defaults?.actions ?? false) {
          await setOrDeleteSecret("actions", owner, repo, name, configValue);
        }

        if (dependabot ?? defaults?.dependabot ?? false) {
          await setOrDeleteSecret("dependabot", owner, repo, name, configValue);
        }
      }
    }
  } catch (error_) {
    error(error_ as Error);
    setFailed((error_ as Error).message);
  }
}

await run();
