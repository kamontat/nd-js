/**
 * @internal
 * @module nd.config
 */

import config from "config";
import fs, { existsSync } from "fs-extra";
import yaml from "js-yaml";
import { dirname, resolve } from "path";
import semver, { major } from "semver";
import { log } from "winston";

import { Security } from "../../apis/security";
import { DecodeToken } from "../../apis/token";
import { COLORS } from "../../constants/color.const";
import { CONFIG_FILE_PATH } from "../../constants/config.const";
import { HAS_COLOR, LOG_TYPE } from "../../constants/default.const";
import { CONFIG_CREATE_ERR, CONFIG_WARN, SECURITY_FAIL_ERR } from "../../constants/error.const";
import { CONFIG_FAIL_ERR } from "../../constants/error.const";
import { ND } from "../../constants/nd.const";
import { CheckIsExist } from "../../helpers/helper";
import Exception from "../error/Exception";
import { WrapTM, WrapTMC, WrapTMCT } from "../output/LoggerWrapper";

import { ConfigFileType, DEFAULT_CONFIG_YAML } from "./ConfigType";

/**
 * @class
 * Config is a class for management configuration file of nd command
 *
 * @version 1.0
 */
export default class Config {
  constructor(path: string, option?: { quiet: boolean }) {
    this.configLocation = path;
    this._option = option;
  }

  // config location
  public configLocation: string;
  public _username?: string;
  public _token?: string;

  public _outputType?: "short" | "long";
  public _color?: boolean;
  // novel default location
  public _novelLocation?: string;

  public _version?: number;

  public _option?: { quiet: boolean };

  public _setter(key: "_username" | "_token" | "_outputType" | "_color" | "_novelLocation", value: any | undefined) {
    // log(WrapTM("debug", "setter be called", `key=${key}, value=${value}, quiet=${this._option && this._option.quiet}`));
    if (CheckIsExist(value)) {
      if (!this._isQuite()) {
        log(WrapTM("debug", "update property", `this.${key} will be set to ${value}`));
      }
      this[key] = value;
    }
  }

  public setOption(option: { quiet: boolean }) {
    this._option = option;
  }

  public showStatus(options?: { console?: boolean; all?: boolean }) {
    if (!options) options = { console: false, all: false };
    if (options.console === undefined) options.console = false;
    if (options.all === undefined) options.all = false;

    if (!this._isQuite()) {
      let out: "error" | "warn" | "info" | "verbose" | "debug" | "silly" = "verbose";
      if (options.console === true) out = "info";

      log(WrapTMCT("info", "Config.username", this._username, { message: COLORS.Name }));

      if (options.all === true) {
        log(WrapTMCT(out, "Config.token", this._token, { message: COLORS.Token }));
        log(WrapTMCT(out, "Config.version", this._version));
        log(WrapTMCT(out, "Config.color", this._color));
        log(WrapTMCT(out, "Config.type", this._outputType));
        log(WrapTMCT(out, "Config.location", this._novelLocation));
      }

      if (options.console) Security.Printer(this.getToken(), this.getUsername());
    }
  }

  public _isQuite() {
    return this._option && this._option.quiet;
  }

  public updateByOption(option: { [key: string]: string }) {
    if (option.location) {
      this.setNovelLocation(option.location);
    }
  }

  public setUsername(id: string | undefined) {
    this._setter("_username", id);
  }

  public getUsername(): string {
    return this._username === undefined ? "" : this._username;
  }

  public setToken(token: string | undefined) {
    this._setter("_token", token);
  }

  public getToken(): string {
    return this._token === undefined ? "" : this._token;
  }

  public setOutputType(type: "long" | "short" | undefined) {
    this._setter("_outputType", type);
  }

  public getOutputType(): "long" | "short" {
    return this._outputType === undefined ? LOG_TYPE : this._outputType;
  }

  public setColor(color: string | undefined) {
    this._setter("_color", color === "true");
  }

  public getColor(): boolean {
    return this._color === undefined ? HAS_COLOR : this._color;
  }

  public setNovelLocation(location: string | undefined) {
    this._setter("_novelLocation", location);
  }

  public getNovelLocation() {
    return this._novelLocation === undefined ? resolve(process.env.HOME || "~") : this._novelLocation;
  }

  public setVersion(version: string) {
    const valid = semver.valid(version);
    if (valid == null) {
      this._version = this.getVersion();
    } else {
      this._version = semver.major(valid);
    }
  }

  public getVersion(): number {
    return this._version === undefined ? major(ND.VERSION) : this._version;
  }

  /**
   * Load config file from system and save to memory. This command also valid the correctness of the file.
   * @throws {@link ConfigFailError} exception
   */
  public load(bypass = false) {
    if (!bypass) {
      const err = this.valid();
      if (err) throw err;
    }

    const doc: ConfigFileType | undefined = yaml.safeLoad(fs.readFileSync(this.configLocation, "utf8"));
    if (doc === undefined) throw CONFIG_FAIL_ERR.loadString(`Config is not exist at ${this.configLocation}`);

    this.setVersion(doc.version.toString() || this.getVersion().toString());

    this.setToken(doc.security.token || this.getToken());
    this.setUsername(doc.security.username || this.getUsername());

    this.setColor(doc.setting.color.toString() || this.getColor().toString());
    this.setNovelLocation(doc.setting.location || this.getNovelLocation());

    this.setOutputType(doc.setting.output || this.getOutputType());

    if (!bypass) {
      if (!Security.Checking(this.getToken(), this.getUsername()).isValid()) {
        throw SECURITY_FAIL_ERR.loadString("unknown error");
      } else {
        const result = DecodeToken(this.getToken());
        log(
          WrapTMCT("info", "Your username", typeof result === "string" ? result : result && result.name, {
            message: COLORS.Name,
          }),
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
  public valid(): Exception | undefined {
    if (!config.has("version")) {
      return CONFIG_FAIL_ERR.clone().loadString("version key is required.");
    }

    if (!semver.major(ND.VERSION) === config.get("version")) {
      return CONFIG_FAIL_ERR.clone().loadString("version is missing or not matches.");
    }

    const checklist = ["token", "username"];
    for (const v of checklist) {
      if (!config.has(`security.${v}`) && !CheckIsExist(config.get(`security.${v}`))) {
        return CONFIG_FAIL_ERR.clone().loadString(`${v} is required.`);
      }
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
  public create(force: boolean = false) {
    log(WrapTMC("debug", "Config location", this.configLocation));

    // throw exist
    if (fs.existsSync(this.configLocation) && !force) {
      const e = CONFIG_CREATE_ERR.clone();
      e.loadString(`${this.configLocation} is exist.`);
      throw e;
    }

    // create dir
    fs.ensureDirSync(dirname(this.configLocation));

    // try to save result
    try {
      fs.writeFileSync(this.configLocation, DEFAULT_CONFIG_YAML(this));
    } catch (err) {
      const e = CONFIG_CREATE_ERR.clone();
      e.loadError(err);
      throw e;
    }
  }

  /**
   * This will force create file by current memory setting.
   *
   * @throws {@link Exception} is saving have problem
   */
  public save() {
    this.create(true);
  }

  public static _CONFIG: Config;

  /**
   * setup {@link Config} and create file to default path
   * @param force force initial config file
   * @return {@link Config}
   *
   * @see {@link Config#Initial}
   */
  public static Initial(force: boolean = false): Config {
    const result = new Config(CONFIG_FILE_PATH);
    result.create(force);
    return result;
  }

  /**
   * Load config from default path
   * @return {@link Config}
   *
   * @throws {@link ConfigFailError}, {@link SECURITY_FAIL_ERR}
   */
  public static Load(option?: { quiet?: boolean; bypass?: boolean }): Config {
    const quiet = option && option.quiet ? option.quiet : false;
    if (!Config._CONFIG) {
      Config._CONFIG = new Config(CONFIG_FILE_PATH, { quiet });
      if (existsSync(CONFIG_FILE_PATH)) {
        Config._CONFIG.load(option && option.bypass);
      } else {
        CONFIG_WARN.clone().loadString("config file not exist");
      }
      Config._CONFIG.showStatus();
    }
    Config._CONFIG.setOption({ quiet });
    return Config._CONFIG;
  }
}
