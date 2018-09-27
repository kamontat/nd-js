import { log } from "winston";
import Config from "../../models/Config";
import { ACTION_SEPERATE_ARGUMENT } from "../../helpers/action";
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

  const { options } = ACTION_SEPERATE_ARGUMENT(a);

  let config = Config.Initial(options.force);
  log(WrapTMC("info", "config", config.configLocation));
};
