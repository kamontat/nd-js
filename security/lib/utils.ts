/**
 * @external
 * @module nd.security.api
 */

import crypto from "crypto";

export const Encrypt = (_iv: number, _key: string, _text: string) => {
  const _encode = "hex";

  const iv = crypto.randomBytes(_iv);
  // console.log(`iv: ${iv.toString(_encode)}`);

  const key = Buffer.from(_key);
  // console.log(`key: ${key.toString()}`);

  const text = Buffer.from(_text);
  // console.log(`text: ${text.toString()}`);

  const cipher = crypto.createCipheriv("aes-192-gcm", key, iv.toString(_encode), { authTagLength: 16 });

  const _encrypted = cipher.update(text);
  const encrypted = Buffer.concat([_encrypted, cipher.final()]);
  // console.log(`encrypted: ${encrypted.toString(_encode)}`);

  const tag = cipher.getAuthTag();
  // console.log(`tag: ${tag.toString(_encode)}`);

  // [iv (as hex)].[tag (as hex)].[token (as hex)]
  return `${iv.toString(_encode)}.${tag.toString(_encode)}.${encrypted.toString(_encode)}`;
};

export const Decrypt = (_key: string, hex: string) => {
  const _encode = "hex";

  const texts = hex.split(".");
  if (texts.length !== 3) return "";

  const key = Buffer.from(_key);
  // console.log(`key: ${_key}`);

  const _iv = texts[0];
  const iv = Buffer.from(_iv);
  // console.log(`iv: ${iv.toString(_encode)}`);

  const _tag = texts[1];
  const tag = Buffer.from(_tag, _encode);
  // console.log(`tag: ${tag.toString(_encode)}`);

  const _token = texts[2];
  const token = Buffer.from(_token, _encode);

  const decipher = crypto.createDecipheriv("aes-192-gcm", key, iv, { authTagLength: 16 });
  decipher.setAuthTag(tag);

  try {
    const decrypted = decipher.update(token);
    const result = decipher.final();

    return Buffer.concat([decrypted, result]).toString();
  } catch (e) {
    throw new Error(`Cannot decrypted the result cause by ${e}`);
  }
};

export class Validation {
  public static IsFullname(_fullname: string, dev?: boolean) {
    const nameList = _fullname.split(" ");
    if (nameList.length !== 3) throw new Error("Username must stay in form of 'name surname email'");
    const name = nameList[0];
    if (name.match(/^\\w+$/)) throw new Error("Name must contains only english character");
    const surname = nameList[1];
    if (surname.match(/^\\w+$/)) throw new Error("Surname must contains only english character");
    const email = nameList[2];
    if (
      !email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      )
    )
      throw new Error("Invalid email format");

    if (dev == undefined) dev = process.env.NODE_ENV !== "production";
    if (!dev && (_fullname.includes("nd.com") || _fullname.includes("admin")))
      throw new Error("fullname have 2 thing that cannot be, 'nd.com' and 'admin'");
    return true;
  }
}
