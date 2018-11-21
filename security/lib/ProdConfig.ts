import * as pjson from "../config-prod.json";

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

export class Config {
  private constructor() {
    this.token = pjson.config.token;
  }

  private token: ConfigInformationType;

  public getConfig(_?: string): ConfigInformationType | undefined {
    return this.token;
  }

  public listVersion(): string[] {
    return [];
  }

  public static CONST = new Config();
}
