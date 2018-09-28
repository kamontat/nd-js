// import uuid from "uuid/v1";
import semver, { major } from "semver";
import yaml from "js-yaml";
import fs from "fs-extra";

import { resolve, dirname } from "path";
import { log } from "winston";

import { DEFAULT_CONFIG_FOLDER } from "../constants/config.const";

process.env["SUPPRESS_NO_CONFIG_WARNING"] = process.env.NODE_ENV === "test" ? "true" : "false";
process.env["NODE_CONFIG_STRICT_MODE"] = "false";
process.env["NODE_CONFIG_DIR"] = DEFAULT_CONFIG_FOLDER;

import config from "config";

import { DEFAULT_CONFIG_FILE } from "../constants/config.const";
import Exception from "./Exception";

import { VERSION } from "../constants/nd.const";

import { CreateConfigError } from "../constants/error.const";
import { ConfigFailError } from "../constants/error.const";
import { WrapTM, WrapTMC } from "./LoggerWrapper";
import { DEFAULT_LOG_TYPE, DEFAULT_COLOR } from "../constants/default.const";
import { Server } from "net";
import { CheckIsExist } from "../helpers/helper";

/**
 * @class
 * Config is a class for management configuration file of nd command
 *
 * @version 1.0
 */
export default class Config {
  static _CONFIG: Config;

  // config location
  configLocation: string;
  _username?: string;
  _token?: string;

  _outputType?: "short" | "long";
  _color?: boolean;
  // novel default location
  _novelLocation?: string;

  _version?: number;

  _option?: { quiet: boolean };

  constructor(path: string, option?: { quiet: boolean }) {
    this.configLocation = path;
    this._option = option;
  }

  _isQuite() {
    return this._option && this._option.quiet;
  }

  updateByOption(option: { [key: string]: string }) {
    if (option.location) this.setNovelLocation(option.location);
  }

  setUsername(id: string) {
    if (!this._isQuite()) log(WrapTM("debug", "update property", `id ${id}`));
    this._username = id;
  }

  getUsername(): string {
    return this._username === undefined ? "" : this._username;
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

  setNovelLocation(location: string) {
    if (!this._isQuite()) log(WrapTM("debug", "update property", `location ${location}`));
    this._novelLocation = location;
  }

  getNovelLocation() {
    return this._novelLocation === undefined ? resolve(process.env.HOME || "~") : this._novelLocation;
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
    return this._version === undefined ? major(VERSION) : this._version;
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

    const doc = yaml.safeLoad(fs.readFileSync(this.configLocation, "utf8"));

    this.setVersion(doc.version || this.getVersion());

    this.setToken(doc.security.token || this.getToken());
    this.setUsername(doc.security.username || this.getUsername());

    this.setColor(doc.setting.color.toString() || this.getColor());
    this.setNovelLocation(doc.setting.location || this.getNovelLocation());

    this.setOutputType(doc.setting.output || this.getOutputType());
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

    if (!config.has("security.token") && !CheckIsExist(config.get("security.token"))) {
      return ConfigFailError.clone().loadString("token is required.");
    }

    if (!config.has("security.username") && !CheckIsExist(config.get("security.username"))) {
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
  username: ${this.getUsername()}
setting:
  output: ${this.getOutputType()}
  color: ${this.getColor()}
  location: ${this.getNovelLocation()}
`;

    log(WrapTMC("debug", "Config location", this.configLocation));
    if (fs.existsSync(this.configLocation) && !force) {
      let e = CreateConfigError.clone();
      e.loadString(`${this.configLocation} is exist.`);
      throw e;
    }

    fs.ensureDirSync(dirname(this.configLocation));
    try {
      fs.writeFileSync(this.configLocation, yaml);
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
