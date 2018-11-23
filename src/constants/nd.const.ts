/**
 * @internal
 * @module nd.security.constant
 */

import moment = require("moment");
import p from "pjson";

declare let COMPILED_DATE: number;

export class ND {
  public static VERSION = p.version;
  public static PROJECT_NAME = p.name;
  public static TIME = moment(COMPILED_DATE, "x");

  public static ENV = process.env.NODE_ENV;

  public static isDev() {
    return this.ENV === "development";
  }

  public static isProd() {
    return this.ENV === "production";
  }

  public static isTest() {
    return this.ENV === "test";
  }
}
