/**
 * @external
 * @module commander.command
 */

import { log } from "winston";
import { ThrowIf } from "../helpers/action";
import Config from "../models/Config";
import { WrapTM, WrapTMC } from "../models/LoggerWrapper";

/**
 * This is configuration command, This command able to show the config path
 *
 * @public
 *
 * @version 1.0
 * @see {@link Config}
 */
export default () => {
  try {
    const config = Config.Load();
    log(WrapTMC("info", "configuration", config.configLocation));
  } catch (e) {
    ThrowIf(e);
  }
};
