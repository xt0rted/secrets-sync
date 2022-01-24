import { readFile } from "node:fs/promises";

import { load as loadYaml } from "js-yaml";

export interface Settings {
  defaults?: SecretEnvironments;
  secrets: Secret[];
}

export interface SecretEnvironments {
  actions?: boolean;
  dependabot?: boolean;
}

export interface Secret extends SecretEnvironments{
  name: string;
  value?: string;
  repos: string[];
}

export async function loadConfig(fileName: string): Promise<Settings> {
  const fileContents = await readFile(fileName, { encoding: "utf8" });
  const settings = loadYaml(fileContents) as Settings;

  return settings;
}

export function readConfigValue(value: string | undefined): string | undefined {
  if (value?.startsWith("env/")){
    return process.env[value.slice(4)];
  }

  return value;
}
