/**
 * @external
 * @module nd.security.model
 */

import * as pjson from "../config-prod.json";

import { ConfigBuilder } from "./Config";

export class Config {
  public static CONST = new ConfigBuilder(pjson);
}

export const NAME = Config.CONST.name();
export const VERSION = Config.CONST.version();
