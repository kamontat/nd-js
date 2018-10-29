/**
 * @external
 * @module commander.command
 */

import { readJSONSync } from "fs-extra";
import { log } from "winston";

import { SeperateArgumentApi, ThrowIf } from "../helpers/action";
import Config from "../models/Config";
import { WrapTMC } from "../models/LoggerWrapper";

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
  const { options } = SeperateArgumentApi(a);

  try {
    const config = Config.Initial(options.force);
    if (options.raw) {
      const json: { token?: string; username?: string } = JSON.parse(options.raw);
      config.setToken(json.token);
      config.setUsername(json.username);
      config.save();
    } else if (options.file) {
      const json: { token?: string; username?: string } = readJSONSync(options.file);
      config.setToken(json.token);
      config.setUsername(json.username);
      config.save();
    }
    log(WrapTMC("info", "config", config.configLocation));
  } catch (e) {
    ThrowIf(e);
  }
};
