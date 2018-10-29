/**
 * @internal
 * @module nd.core
 */

import moment = require("moment");
import p from "pjson";

export class ND {
  public static VERSION = p.version;
  public static PROJECT_NAME = p.name;
  public static A = "salt-nd-js";
  public static Z = `master-password-${moment().get("dayOfYear")}`;
  public static ID = `KC-SKE`;
  public static ALGO = "HS256";

  public static ENV = process.env.NODE_ENV;

  public static isDev() {
    return this.ENV === "development";
  }

  public static isProd() {
    return this.ENV === "production";
  }
}
