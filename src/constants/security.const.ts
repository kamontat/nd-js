/**
 * @internal
 * @module nd.security
 */

import crypto from "crypto";
import pjson from "pjson";

import { SECURITY_FAIL_ERR } from "./error.const";

const config = pjson.config as { key: string; sal: string; jid: string };

const K = config.key;
const A = config.sal;
const B = config.jid;

const IV_LENGTH = 12;

function encrypt(text: string) {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv("aes-192-gcm", new Buffer(K), iv, {
    authTagLength: 16
  });

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

function decrypt(text: string) {
  const textParts = text.split(":");
  const ivString = textParts.shift();
  if (!ivString) return "";
  const iv = new Buffer(ivString, "hex");

  const tagString = textParts.shift();
  if (!tagString) return "";
  const tag = new Buffer(tagString, "hex");

  const decipher = crypto.createDecipheriv("aes-192-gcm", new Buffer(K), iv, {
    authTagLength: 16
  });
  decipher.setAuthTag(tag);

  const encryptedText = new Buffer(textParts.join(":"), "hex");
  const decrypted = decipher.update(encryptedText);

  try {
    const text = decipher.final();
    return Buffer.concat([decrypted, text]).toString();
  } catch (e) {
    throw SECURITY_FAIL_ERR.loadString("Your key is invalid");
  }
}

export const S = (versionRange: string) => {
  return encrypt(versionRange);
};
export const IS_S = (hash: string) => {
  return decrypt(hash);
};

export const AAA = A;
export const BBB = B;
