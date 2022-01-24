import tweetsodium from "tweetsodium"; // eslint-disable-line import/default

export function encrypt(publicKey: string, message: string) {
  const messageBytes = Buffer.from(message);
  const keyBytes = Buffer.from(publicKey, "base64");

  const encryptedBytes = tweetsodium.seal(messageBytes, keyBytes);

  const encrypted = Buffer.from(encryptedBytes).toString("base64");

  return encrypted;
}
