// import uuid from "uuid/v1";
import semver from "semver";
import yaml from "js-yaml";
import fs from "fs";

import { resolve } from "path";
import { log } from "winston";

import { DEFAULT_CONFIG_FOLDER } from "../constants/config.const";
process.env["NODE_CONFIG_DIR"] = DEFAULT_CONFIG_FOLDER;
import config from "config";

import { DEFAULT_CONFIG_FILE } from "../constants/config.const";
import Exception from "./Exception";

import { VERSION } from "../constants/nd.const";

import { CreateConfigError } from "../constants/error.const";
import { ConfigFailError } from "../constants/error.const";
import { WrapTM } from "./LoggerWrapper";
import { DEFAULT_LOG_TYPE, DEFAULT_COLOR } from "../constants/default.const";

/**
 * @class
 * Config is a class for management configuration file of nd command
 *
 * @version 1.0
 */
export default class Config {
  static _CONFIG: Config;

  path: string;
  _userid?: string;
  _token?: string;

  _outputType?: "short" | "long";
  _color?: boolean;
  _location?: string;

  _version?: number;

  _option?: { quiet: boolean };

  constructor(path: string, option?: { quiet: boolean }) {
    this.path = path;
    this._option = option;
  }

  _isQuite() {
    return this._option && this._option.quiet;
  }

  updateByOption(option: { [key: string]: string }) {
    if (option.location) this.setLocation(option.location);
  }

  setUserId(id: string) {
    if (!this._isQuite()) log(WrapTM("debug", "update property", `id ${id}`));
    this._userid = id;
  }

  getUserId(): string {
    return this._userid === undefined ? "" : this._userid;
  }

  setToken(token: string) {
    if (!this._isQuite()) log(WrapTM("debug", "update property", `token ${token}`));
    this._token = token;
  }

  getToken(): string {
    return this._token === undefined ? "" : this._token;
  }

  setOutputType(type: "long" | "short") {
    if (!this._isQuite()) log(WrapTM("debug", "update property", `type ${type}`));
    this._outputType = type;
  }

  getOutputType(): "long" | "short" {
    return this._outputType === undefined ? DEFAULT_LOG_TYPE : this._outputType;
  }

  setColor(color: string) {
    if (!this._isQuite()) log(WrapTM("debug", "update property", `color ${color}`));
    this._color = color == "true";
  }

  getColor(): boolean {
    return this._color === undefined ? DEFAULT_COLOR : this._color;
  }

  setLocation(location: string) {
    if (!this._isQuite()) log(WrapTM("debug", "update property", `location ${location}`));
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

  /**
   * Load config file from system and save to memory. This command also valid the correctness of the file.
   * @throws {@link ConfigFailError} exception
   */
  load(bypass?: boolean) {
    if (bypass === false) {
      let err = this.valid();
      if (err) {
        throw err;
      }
    }

    const doc = yaml.safeLoad(fs.readFileSync(this.path, "utf8"));

    this.setVersion(doc.version);

    this.setToken(doc.security.token);
    this.setUserId(doc.security.username);

    this.setColor(doc.setting.color.toString());
    this.setLocation(doc.setting.location);

    this.setOutputType(doc.setting.output);
  }

  /**
   * validate the configuration file.
   * NOT the memory setting
   *
   * @return {@link Exception} or undefined
   */
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

  /**
   * create yml file to {@link DEFAULT_CONFIG_FILE} file by current memory setting
   *
   * @param force force create file, even it exist.
   *
   * @throws {@link CreateConfigError}
   */
  create(force: boolean = false) {
    let yaml = `version: ${this.getVersion()}
security: 
  token: ${this.getToken()}
  username: ${this.getUserId()}
setting:
  output: ${this.getOutputType()}
  color: ${this.getColor()}
  location: ${this.getLocation()}
`;

    if (fs.existsSync(DEFAULT_CONFIG_FILE) && !force) {
      let e = CreateConfigError.clone();
      e.loadString(`${DEFAULT_CONFIG_FILE} is exist.`);
      throw e;
    }

    try {
      fs.writeFileSync(DEFAULT_CONFIG_FILE, yaml);
    } catch (err) {
      let e = CreateConfigError.clone();
      e.loadError(err);
      throw e;
    }
  }

  /**
   * This will force create file by current memory setting.
   *
   * @throws {@link Exception} is saving have problem
   */
  save() {
    this.create(true);
  }

  /**
   * setup {@link Config} and create file to default path
   * @param force force initial config file
   * @return {@link Config}
   *
   * @see {@link Config#Initial}
   */
  static Initial(force: boolean = false): Config {
    let config = new Config(DEFAULT_CONFIG_FILE);
    config.create(force);

    return config;
  }

  /**
   * Load config from default path
   * @return {@link Config}
   *
   * @throws {@link ConfigFailError}
   */
  static Load(option?: { quiet?: boolean; bypass?: boolean }): Config {
    if (!Config._CONFIG) {
      Config._CONFIG = new Config(DEFAULT_CONFIG_FILE, { quiet: option && option.quiet ? option.quiet : false });
      Config._CONFIG.load(option && option.bypass);
    }
    return Config._CONFIG;
  }
}
