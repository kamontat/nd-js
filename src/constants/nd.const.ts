/**
 * @internal
 * @module nd.core
 */

import moment = require("moment");
import p from "pjson";

import { AAA, BBB } from "./security.const";

export class ND {
  public static VERSION = p.version;
  public static PROJECT_NAME = p.name;
  public static TIME = moment();

  public static ALGO = "HS256";

  public static ENV = process.env.NODE_ENV;

  public static ID() {
    return `ND_ID_${BBB}`;
  }

  public static A() {
    return `ND_JS_${AAA}`;
  }

  public static Z() {
    return `master-password-${moment().get("dayOfYear")}`;
  }

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
