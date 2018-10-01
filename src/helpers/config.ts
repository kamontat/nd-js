import Config from "../models/Config";
import { BeColor } from "../constants/default.const";

import { log } from "winston";
import { WrapTMC } from "../models/LoggerWrapper";

export const HELPER_LOAD_CONFIG = () => {
  try {
    let config = Config.Load({ quiet: true, bypass: true });
    BeColor(config.getColor());
  } catch (e) {
    log(WrapTMC("error", "Loading config", e));
  }
};
