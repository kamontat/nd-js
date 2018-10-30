/**
 * @internal
 * @module nd.config
 */

import { log } from "winston";

import { BeColor } from "../constants/default.const";
import Config from "../models/Config";
import { WrapTMC } from "../models/output/LoggerWrapper";

export const HELPER_LOAD_CONFIG = () => {
  try {
    const config = Config.Load({ quiet: true, bypass: true });
    BeColor(config.getColor());
  } catch (e) {
    log(WrapTMC("error", "Loading config", e));
  }
};
