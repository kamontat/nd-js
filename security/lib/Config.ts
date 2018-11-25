export interface Json {
  [key: string]: any;
}

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

export class ConfigBuilder {
  private json: Json;
  constructor(json: Json) {
    this.json = json;
  }

  public name() {
    return this.json.name;
  }

  public version() {
    return this.json.version;
  }

  public getConfig(version?: string): ConfigInformationType | undefined {
    if (!version) return;
    return this.json.config.token[version];
  }

  public listVersion() {
    return Object.keys(this.json.config.token);
  }
}
