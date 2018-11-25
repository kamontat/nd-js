import { sign, verify } from "jsonwebtoken";

import { ConfigBuilder } from "./Config";
import { RequireTokenData, ResultTokenData } from "./data";
import { Decrypt, Encrypt, Validation } from "./utils";

export class TokenManagement {
  private config: ConfigBuilder;

  constructor(config: ConfigBuilder) {
    this.config = config;
  }

  public signToken(version: string, data: RequireTokenData) {
    const configData = this.config.getConfig(version);
    if (!configData) throw TokenManagement.ERR_VERSION_NOT_EXIST(version);

    if (!Validation.IsFullname(data.fullname)) throw TokenManagement.ERR_FULLNAME_FORMAT;

    const token = Encrypt(configData.iv, configData.key, data.versionrange);
    const password = data.fullname.concat(" ", configData.sal);

    const result = sign({ version: data.version, token, name: data.username }, password, {
      expiresIn: data.expiredate,
      issuer: TokenManagement.JWT_ISSUER,
      subject: TokenManagement.JWT_SUBJECT,
      notBefore: data.notbeforedate,
      algorithm: configData.jwtAlgo,
      jwtid: TokenManagement.JWT_ID(configData.jid),
    });

    return Encrypt(configData.iv, configData.key2, result);
  }

  public decodeToken(version: string, hex: string, fullname: string): ResultTokenData {
    const configData = this.config.getConfig(version);
    if (!configData) throw TokenManagement.ERR_VERSION_NOT_EXIST(version);

    const token = Decrypt(configData.key2, hex);
    const password = fullname.concat(" ", configData.sal);

    const _result = verify(token, password, {
      issuer: TokenManagement.JWT_ISSUER,
      subject: TokenManagement.JWT_SUBJECT,
      algorithms: [configData.jwtAlgo],
      jwtid: TokenManagement.JWT_ID(configData.jid),
    });
    if (!_result) throw TokenManagement.ERR_UNKNOWN;
    const result = _result as ResultTokenData;
    // version should only tell which version it made for
    // if (semver.major(version) !== result.version)
    //   throw new Error(`Wrong support version ${version} !== ${result.version}`);
    return result as ResultTokenData;
  }

  public convertToRequireTokenData(result: ResultTokenData, fullname: string) {
    const configData = this.config.getConfig(result.version);
    if (!configData) throw TokenManagement.ERR_VERSION_NOT_EXIST(result.version);

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
  }
  public static ERR_UNKNOWN = new Error("Unknown error");
  public static ERR_FULLNAME_FORMAT = new Error("Input fullname isn't match our format: 'name surname email'");

  public static JWT_ISSUER = "ND-JS admin";
  public static JWT_SUBJECT = "ND-JS";

  public static ERR_VERSION_NOT_EXIST = (version: string) =>
    new Error(`Config data is not exist on version: ${version}`);
  public static JWT_ID = (salt: string) => "ND_ID".concat(salt);
}
