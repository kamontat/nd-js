import * as pjson from "../config.json";

export const NAME = pjson.name;
export const VERSION = pjson.version;

export interface ConfigInformationType {
  jwtAlgo: string;
  iv: number;
  key: string;
  key2: string;
  sal: string;
  jid: string;
}

export interface ConfigType {
  [version: string]: ConfigInformationType | undefined;
}

export class Config {
  private constructor() {
    this.token = pjson.config.token;
  }

  private token: ConfigType;

  public getConfig(version?: string): ConfigInformationType | undefined {
    if (!version) return;
    return this.token[version];
  }

  public listVersion() {
    return Object.keys(this.token);
  }

  public static CONST = new Config();
}
