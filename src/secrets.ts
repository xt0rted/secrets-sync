import { debug } from "@actions/core";

import { encrypt } from "./encrypt";
import {
  SecretEnvironment,
  deleteSecret,
  getPublicKey,
  setSecret,
} from "./github";

export async function setOrDeleteSecret(environment: SecretEnvironment, owner: string, repo: string, name: string, value?: string) {
  debug(`Processing ${environment} secret ${name} in ${owner}/${repo}`);

  if (value === undefined) {
    debug(`Secret ${name} is undefined or null, deleting`);

    await deleteSecret({
      environment,
      owner,
      repo,
      secret: name,
    });

    return;
  }

  debug(`Secret ${name} is defined, setting`);

  const publicKey = await getPublicKey({
    environment,
    owner,
    repo,
  });
  const encryptedValue = encrypt(publicKey.key, value);

  await setSecret({
    environment,
    owner,
    repo,
    secret: name,
    value: encryptedValue,
    keyId: publicKey.key_id,
  });
}
