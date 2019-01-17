/**
 * @internal
 * @module nd.command.constant
 */

import moment = require("moment");
import p from "pjson";

declare let COMPILED_DATE: number;

/**
 * This class represent the nd command
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since November 25, 2018
 */
export class ND {
  /**
   * command name (get from package.json)
   */
  public static PROJECT_NAME = p.name;

  /**
   * command version (get from package.json)
   */
  public static VERSION = p.version;

  /**
   * compiled datetime (as timestamp), convert to moment object
   */
  public static TIME = moment(COMPILED_DATE, "x");

  /**
   * this is a build number for version command
   */
  public static BUILD_NUMBER = COMPILED_DATE;

  /**
   * command environment, "development" | "test" | "production"
   */
  public static ENV = process.env.NODE_ENV;

  /**
   * checking env method, is development or not
   */
  public static isDev() {
    return this.ENV === "development";
  }

  /**
   * checking env method, is production or not
   */
  public static isProd() {
    return this.ENV === "production";
  }

  /**
   * checking env method, is test or not
   */
  public static isTest() {
    return this.ENV === "test" || this.ENV === "testing";
  }
}
