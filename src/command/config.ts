/**
 * @external
 * @module commander.command
 */

import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { SeperateArgumentApi, ThrowIf } from "../helpers/commander";
import Config from "../models/command/Config";

/**
 * This is configuration command, This command able to show the config path
 *
 * @public
 *
 * @version 1.0
 * @see {@link Config}
 */
export default (a: any) => {
  const { options } = SeperateArgumentApi(a);
  try {
    const config = Config.Load();

    if (options.raw) {
      // tslint:disable-next-line
      console.log(config.configLocation);
    } else {
      log(WrapTMC("info", "configuration", config.configLocation));
    }
  } catch (e) {
    ThrowIf(e);
  }
};
