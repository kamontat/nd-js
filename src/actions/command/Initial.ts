/**
 * @external
 * @module commander.command
 */

import { log } from "winston";
import Config from "../../models/Config";
import { SeperateArgumentApi } from "../../helpers/action";
import { WrapTMC, WrapTM } from "../../models/LoggerWrapper";

/**
 * This is initial command.
 *
 * @public
 * @param a argument pass from commandline
 *
 * @version 1.0
 * @see {@link Config}
 */
export default (a: any) => {
  log(WrapTM("debug", "start command", "initial"));

  const { options } = SeperateArgumentApi(a);

  let config = Config.Initial(options.force);
  log(WrapTMC("info", "config", config.configLocation));
};
