/**
 * @internal
 * @module nd.config
 */

// import uuid from "uuid/v1";
import semver, { major } from "semver";
import yaml from "js-yaml";
import fs, { existsSync } from "fs-extra";

import { resolve, dirname } from "path";
import { log } from "winston";

import { CONFIG_FOLDER_PATH } from "../constants/config.const";

process.env["SUPPRESS_NO_CONFIG_WARNING"] = process.env.NODE_ENV === "test" ? "true" : "false";
process.env["NODE_CONFIG_STRICT_MODE"] = "false";
process.env["NODE_CONFIG_DIR"] = CONFIG_FOLDER_PATH;

import config from "config";

import { CONFIG_FILE_PATH } from "../constants/config.const";
import Exception from "./Exception";

import { ND } from "../constants/nd.const";

import { CONFIG_CREATE_ERR, CONFIG_WARN, SECURITY_FAIL_ERR } from "../constants/error.const";
import { CONFIG_FAIL_ERR } from "../constants/error.const";
import { WrapTM, WrapTMC, WrapTMCT } from "./LoggerWrapper";
import { LOG_TYPE, HAS_COLOR } from "../constants/default.const";
import { CheckIsExist } from "../helpers/helper";
import { COLORS } from "../constants/color.const";
import { Security } from "./Security";
import { DecodeToken } from "../apis/token";

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

  _setter(key: "_username" | "_token" | "_outputType" | "_color" | "_novelLocation", value: any | undefined) {
    // log(WrapTM("debug", "setter be called", `key=${key}, value=${value}, quiet=${this._option && this._option.quiet}`));
    if (CheckIsExist(value)) {
      if (!this._isQuite()) log(WrapTM("debug", "update property", `this.${key} will be set to ${value}`));
      this[key] = value;
    }
  }

  setOption(option: { quiet: boolean }) {
    this._option = option;
  }

  showStatus() {
    if (!this._isQuite()) {
      log(WrapTMCT("verbose", "Config.token", this._token, { message: COLORS.Token }));
      log(WrapTMCT("verbose", "Config.username", this._username, { message: COLORS.Name }));
      log(WrapTMCT("debug", "Config.version", this._version));
      log(WrapTMCT("debug", "Config.color", this._color));
      log(WrapTMCT("debug", "Config.type", this._outputType));
      log(WrapTMCT("debug", "Config.location", this._novelLocation));
    }
  }

  _isQuite() {
    return this._option && this._option.quiet;
  }

  updateByOption(option: { [key: string]: string }) {
    if (option.location) this.setNovelLocation(option.location);
  }

  setUsername(id: string | undefined) {
    this._setter("_username", id);
  }

  getUsername(): string {
    return this._username === undefined ? "" : this._username;
  }

  setToken(token: string | undefined) {
    this._setter("_token", token);
  }

  getToken(): string {
    return this._token === undefined ? "" : this._token;
  }

  setOutputType(type: "long" | "short" | undefined) {
    this._setter("_outputType", type);
  }

  getOutputType(): "long" | "short" {
    return this._outputType === undefined ? LOG_TYPE : this._outputType;
  }

  setColor(color: string | undefined) {
    this._setter("_color", color === "true");
  }

  getColor(): boolean {
    return this._color === undefined ? HAS_COLOR : this._color;
  }

  setNovelLocation(location: string | undefined) {
    this._setter("_novelLocation", location);
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
    return this._version === undefined ? major(ND.VERSION) : this._version;
  }

  /**
   * Load config file from system and save to memory. This command also valid the correctness of the file.
   * @throws {@link ConfigFailError} exception
   */
  load(bypass = false) {
    if (!bypass) {
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

    if (!bypass) {
      if (!Security.Checking(this.getToken(), this.getUsername())) {
        throw SECURITY_FAIL_ERR.loadString("unknown error");
      } else {
        const result = DecodeToken(this.getToken());
        log(
          WrapTMCT("info", "Your username", typeof result === "string" ? result : result && result.name, {
            message: COLORS.Name
          })
        );
      }
    }
  }

  /**
   * validate the configuration file.
   * NOT the memory setting
   *
   * @return {@link Exception} or undefined
   */
  valid(): Exception | undefined {
    if (!config.has("version")) {
      return CONFIG_FAIL_ERR.clone().loadString("version key is required.");
    }

    if (!semver.major(ND.VERSION) === config.get("version")) {
      return CONFIG_FAIL_ERR.clone().loadString("version is missing or not matches.");
    }

    if (!config.has("security.token") && !CheckIsExist(config.get("security.token"))) {
      return CONFIG_FAIL_ERR.clone().loadString("token is required.");
    }

    if (!config.has("security.username") && !CheckIsExist(config.get("security.username"))) {
      return CONFIG_FAIL_ERR.clone().loadString("username is required.");
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
      let e = CONFIG_CREATE_ERR.clone();
      e.loadString(`${this.configLocation} is exist.`);
      throw e;
    }

    fs.ensureDirSync(dirname(this.configLocation));
    try {
      fs.writeFileSync(this.configLocation, yaml);
    } catch (err) {
      let e = CONFIG_CREATE_ERR.clone();
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
    let config = new Config(CONFIG_FILE_PATH);
    config.create(force);

    return config;
  }

  /**
   * Load config from default path
   * @return {@link Config}
   *
   * @throws {@link ConfigFailError}, {@link SECURITY_FAIL_ERR}
   */
  static Load(option?: { quiet?: boolean; bypass?: boolean }): Config {
    const quiet = option && option.quiet ? option.quiet : false;
    if (!Config._CONFIG) {
      Config._CONFIG = new Config(CONFIG_FILE_PATH, { quiet: quiet });
      if (existsSync(CONFIG_FILE_PATH)) {
        Config._CONFIG.load(option && option.bypass);
      } else {
        CONFIG_WARN.clone().loadString("config file not exist");
      }
      Config._CONFIG.showStatus();
    }
    Config._CONFIG.setOption({ quiet: quiet });
    return Config._CONFIG;
  }
}
