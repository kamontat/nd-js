import crypto from "crypto";
import { sign, verify } from "jsonwebtoken";

import { Config } from "./Config";
import { RequireTokenData, ResultTokenData } from "./data";

export const Encrypt = (_iv: number, key: string, text: string) => {
  const iv = crypto.randomBytes(_iv);
  const cipher = crypto.createCipheriv("aes-192-gcm", new Buffer(key), iv, {
    authTagLength: 16,
  });

  let encrypted = cipher.update(text);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}.${tag.toString("hex")}.${encrypted.toString("hex")}`;
};

export const Decrypt = (key: string, hex: string) => {
  const textParts = hex.split(".");
  const ivString = textParts.shift();
  if (!ivString) return "";
  const iv = new Buffer(ivString, "hex");

  const tagString = textParts.shift();
  if (!tagString) return "";
  const tag = new Buffer(tagString, "hex");

  const decipher = crypto.createDecipheriv("aes-192-gcm", new Buffer(key), iv, {
    authTagLength: 16,
  });
  decipher.setAuthTag(tag);

  const encryptedText = new Buffer(textParts.join("."), "hex");
  const decrypted = decipher.update(encryptedText);

  try {
    const text = decipher.final();
    return Buffer.concat([decrypted, text]).toString();
  } catch (e) {
    throw new Error("Cannot decrypt the result");
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
  if (version !== result.version) throw new Error(`Wrong support version ${version} !== ${result.version}`);
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
