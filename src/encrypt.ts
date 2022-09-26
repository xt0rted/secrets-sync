import libsodium from "libsodium-wrappers";

export async function encrypt(publicKey: string, message: string): Promise<string> {
  const messageBytes = Buffer.from(message);
  const keyBytes = Buffer.from(publicKey, "base64");
  
  await libsodium.ready;

  const encryptedBytes = libsodium.crypto_box_seal(messageBytes, keyBytes);

  const encrypted = Buffer.from(encryptedBytes).toString("base64");

  return encrypted;
}
