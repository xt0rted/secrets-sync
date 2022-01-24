// Uncomment when running locally
//import "dotenv/config";

import {
  debug,
  error,
  getInput,
  setFailed,
} from "@actions/core";

import {
  loadConfig,
  readConfigValue,
} from "./config";
import { setOrDeleteSecret } from "./secrets";

const DEFAULT_CONFIG_FILE = "secrets-sync.yml";

async function run(): Promise<void> {
  try {
    let configFile = getInput("config", { required: false });

    if (!configFile) {
      debug(`Config file not specified, using default '${DEFAULT_CONFIG_FILE}`);

      configFile = "secrets-sync.yml";
    }

    const { defaults, secrets } = await loadConfig(configFile);

    for await (const { name, value: value, repos, actions, dependabot } of secrets) {
      // Secret values can be static or environment variables prefixed with `env/`
      const configValue = readConfigValue(value);

      //console.info({
      //  name: name,
      //  value: value,
      //});

      for await (const repository of repos) {
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
