import {
  debug,
  getInput,
  info,
  warning,
} from "@actions/core";
import {
  GitHub,
  getOctokitOptions,
} from "@actions/github/lib/utils";
import memoize from "@github/memoize";
import { retry } from "@octokit/plugin-retry";
import { throttling } from "@octokit/plugin-throttling";
import { RequestError } from "@octokit/request-error";

/* eslint-disable import/order */
import type { components } from "@octokit/openapi-types";
import type { OctokitResponse } from "@octokit/types";
/* eslint-enable import/order */

const octokit = GitHub.plugin(
  retry,
  throttling,
);
const github = new octokit(
  getOctokitOptions(
    getInput("repo_token", { required: true }),
    {
      throttle: {
        onRateLimit: () => true,
        onAbuseLimit: () => true,
      },
    },
  ),
);

export type SecretEnvironment =
  | "actions"
  | "dependabot"
  ;

export interface DeleteSecretOptions {
  environment: SecretEnvironment;
  owner: string;
  repo: string;
  secret: string;
}

export async function deleteSecret({ environment, owner, repo, secret }: DeleteSecretOptions) {
  info(`Deleting ${secret} for ${environment} in ${owner}/${repo}`);

  try {
    await github.request("DELETE /repos/{owner}/{repo}/{environment}/secrets/{secret_name}", {
      environment,
      owner,
      repo,
      secret_name: secret,
    });
  } catch (error_) {
    const { status, message } = error_ as RequestError;

    if (status === 404) {
      warning(`Secret ${secret} for ${environment} does not exist in ${owner}/${repo}`);

      return;
    }

    throw new Error(`Error deleting ${environment} secret ${secret} in ${owner}/${repo}; ${status} ${message}`);
  }
}

export interface SetSecretOptions {
  environment: SecretEnvironment;
  owner: string;
  repo: string;
  secret: string;
  value: string;
  keyId: string;
}

export async function setSecret({ environment, owner, repo, secret, value, keyId }: SetSecretOptions): Promise<void> {
  info(`Setting ${secret} for ${environment} in ${owner}/${repo}`);

  try {
    await github.request("PUT /repos/{owner}/{repo}/{environment}/secrets/{secret_name}", {
      environment,
      owner,
      repo,
      secret_name: secret,
      encrypted_value: value,
      key_id: keyId,
    });
  } catch (error_) {
    const { status, message } = error_ as RequestError;

    throw new Error(`Error setting ${environment} secret ${secret} in ${owner}/${repo}; ${status} ${message}`);
  }
}

type GitHubSecretKeyResponse = components["schemas"]["actions-public-key"];

export interface GetPublicKeyOptions {
  environment: SecretEnvironment;
  owner: string;
  repo: string;
}

export const getPublicKey = memoize(async ({ environment, owner, repo }: GetPublicKeyOptions): Promise<GitHubSecretKeyResponse> => {
  debug(`Getting ${environment} private key for ${owner}/${repo}`);

  const result = await github.request("GET /repos/{owner}/{repo}/{environment}/secrets/public-key", {
    environment,
    owner,
    repo,
  }) as OctokitResponse<GitHubSecretKeyResponse, number>;

  return result.data;
});
