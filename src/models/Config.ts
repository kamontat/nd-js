// import uuid from "uuid/v1";
import { resolve } from "path";

import semver from "semver";
import winston from "winston";
import yaml from "js-yaml";
import fs from "fs";

import { DEFAULT_CONFIG_FOLDER } from "../constants/configConst";
process.env["NODE_CONFIG_DIR"] = DEFAULT_CONFIG_FOLDER;
import config from "config";

import { DEFAULT_CONFIG_FILE } from "../constants/configConst";
import Exception, { NFConfigError, EConfigError, EError } from "./Exception";

import { VERSION } from "../constants/ndConst";

import { CreateConfigError } from "../constants/errorConst";
import { ConfigFailError } from "../constants/errorConst";

export default class Config {
  path: string;
  _userid?: string;
  _token?: string;

  _color?: boolean;
  _location?: string;

  _version?: number;

  constructor(path: string) {
    this.path = path;
  }

  setUserId(id: string) {
    this._userid = id;
  }

  getUserId(): string {
    return this._userid === undefined ? "" : this._userid;
  }

  setToken(token: string) {
    this._token = token;
  }

  getToken(): string {
    return this._token === undefined ? "" : this._token;
  }

  setColor(color: string) {
    this._color = color === "true";
  }

  getColor(): boolean {
    return this._color === undefined ? true : this._color;
  }

  setLocation(location: string) {
    this._location = location;
  }

  getLocation() {
    return this._location === undefined ? resolve(process.env.HOME || "~") : this._location;
  }

  setVersion(version: string) {
    let valid = semver.valid(version);
    if (valid == null) {
      this._version = this.getVersion();
    } else {
      this._version = semver.major(valid);
    }
  }

  getVersion(): number {
    return this._version === undefined ? 1 : this._version;
  }

  load() {
    let err = this.valid();
    if (err) {
      winston.error(err.throw());
      err.exit();
    }

    const doc = yaml.safeLoad(fs.readFileSync(this.path, "utf8"));

    this.setVersion(doc.version);

    this.setToken(doc.security.token);
    this.setUserId(doc.security.username);

    this.setColor(doc.setting.color);
    this.setLocation(doc.setting.location);
    // throw new Error("Something bad happened");
  }

  save() {
    this.create(true);
  }

  valid(): Exception | undefined {
    if (!config.has("version")) {
      return ConfigFailError.clone().loadString("version key is required.");
    }

    if (!semver.major(VERSION) === config.get("version")) {
      return ConfigFailError.clone().loadString("version is missing or not matches.");
    }

    if (
      !config.has("security.token") ||
      config.get("security.token") === "null" ||
      config.get("security.token") === "undefined" ||
      config.get("security.token") === null ||
      config.get("security.token") === undefined
    ) {
      return ConfigFailError.clone().loadString("token is required.");
    }

    if (
      !config.has("security.username") ||
      config.get("security.username") === "null" ||
      config.get("security.username") === "undefined" ||
      config.get("security.username") === null ||
      config.get("security.username") === undefined
    ) {
      return ConfigFailError.clone().loadString("username is required.");
    }

    return undefined;
  }

  create(force: boolean = false) {
    let yaml = `version: ${this.getVersion()}
security: 
  token: ${this.getToken()}
  username: ${this.getUserId()}
setting:
  color: ${this.getColor()}
  location: ${this.getLocation()}
`;

    if (fs.existsSync(DEFAULT_CONFIG_FILE) && !force) {
      CreateConfigError.loadString(`${DEFAULT_CONFIG_FILE} is exist.`);
      winston.error(CreateConfigError.throw());
      CreateConfigError.exit();
    }

    try {
      fs.writeFileSync(DEFAULT_CONFIG_FILE, yaml);
    } catch (e) {
      CreateConfigError.loadError(e);
      winston.error(CreateConfigError.throw());
      CreateConfigError.exit();
    }
  }

  static Initial(force: boolean = false): Config {
    let config = new Config(DEFAULT_CONFIG_FILE);
    config.create(force);

    return config;
  }

  static Load(): Config {
    let config = new Config(DEFAULT_CONFIG_FILE);
    config.load();

    return config;
  }
}
