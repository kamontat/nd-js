/**
 * @internal
 * @module nd.core
 */

import p from "pjson";
import moment = require("moment");

export class ND {
  static VERSION = p.version;
  static PROJECT_NAME = p.name;
  static A = "salt-nd-js";
  static Z = `master-password-${moment().get("dayOfYear")}`;
  static ID = `KC-SKE`;
  static ALGO = "HS256";

  static ENV = process.env.NODE_ENV;

  static isDev() {
    return this.ENV === "development";
  }

  static isProd() {
    return this.ENV === "production";
  }
}
