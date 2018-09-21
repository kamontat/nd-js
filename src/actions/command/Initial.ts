import winston from "winston";
import Config from "../../models/Config";
import { SeperateArgument } from "../../helpers/action";

/**
 * This is initial command.
 *
 * @public
 * @param a argument pass from commandline
 *
 * @version 1.0
 * @see {@link Config}
 */
export default (...a: any[]) => {
  winston.verbose("execute initial");

  const { options } = SeperateArgument(a);

  let config = Config.Initial(options.force === "true");
  winston.info(`config path: ${config.path}`);
};
