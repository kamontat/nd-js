import crypto from "crypto";
import { sign, verify } from "jsonwebtoken";

import { Config } from "./Config";
import { RequireTokenData, ResultTokenData } from "./data";

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
  const tag = Buffer.from(_tag);
  // console.log(`tag: ${tag.toString(_encode)}`);

  const _token = texts[2];
  const token = Buffer.from(_token, "hex");

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

export const SignToken = (version: string, data: RequireTokenData) => {
  const configData = Config.CONST.getConfig(version);
  if (!configData) throw new Error(`Config data of version ${version} is not exist`);
  if (!Validation.IsFullname(data.fullname))
    throw new Error("Input data is not fullname format (note: 'name surname email')");

  const token = Encrypt(configData.iv, configData.key, data.versionrange);
  const password = data.fullname.concat(" ", configData.sal);

  const result = sign({ version: data.version, token, name: data.username }, password, {
    expiresIn: data.expiredate,
    issuer: "ND-JS admin",
    subject: "ND-JS",
    notBefore: data.notbeforedate,
    algorithm: configData.jwtAlgo,
    jwtid: "ND_ID".concat(configData.jid),
  });

  return Encrypt(configData.iv, configData.key2, result);
};

export const DecodeToken = (version: string, hex: string, fullname: string): ResultTokenData => {
  const configData = Config.CONST.getConfig(version);
  if (!configData) throw new Error(`Config data of version ${version} is not exist`);

  const token = Decrypt(configData.key2, hex);
  const password = fullname.concat(" ", configData.sal);

  const _result = verify(token, password, {
    issuer: "ND-JS admin",
    subject: "ND-JS",
    algorithms: [configData.jwtAlgo],
    jwtid: "ND_ID".concat(configData.jid),
  });
  if (!_result) throw new Error("Impossible exception");
  const result = _result as ResultTokenData;
  // version should only tell which version it made for
  // if (semver.major(version) !== result.version)
  //   throw new Error(`Wrong support version ${version} !== ${result.version}`);
  return result as ResultTokenData;
};

export const ConvertToRequireTokenData = (result: ResultTokenData, fullname: string) => {
  const configData = Config.CONST.getConfig(result.version);
  if (!configData) throw new Error(`Config data of version ${result.version} is not exist`);

  const versionrange = Decrypt(configData.key, result.token);

  return {
    version: result.version,
    versionrange,
    fullname,
    username: result.name,
    issuedate: result.iat.toString(),
    notbeforedate: result.nbf.toString(),
    expiredate: result.exp.toString(),
  };
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
