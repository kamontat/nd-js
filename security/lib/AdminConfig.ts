/**
 * @external
 * @module nd.security.model.admin
 */

import * as pjson from "../config-all.json";

import { ConfigBuilder } from "./Config";

export class Config {
  public static CONST = new ConfigBuilder(pjson);
}

export const NAME = Config.CONST.name();
export const VERSION = Config.CONST.version();
