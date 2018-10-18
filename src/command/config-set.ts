/**
 * @external
 * @module commander.command
 */

import { SeperateArgumentApi, ThrowIf, ValidList, ByLength, ByMatchSome } from "../helpers/action";
import Config from "../models/Config";

export const CONFIG_SET_LIST = ["token", "username", "color", "location"];

/**
 * This is configuration setting command, This command able to set the value to config file.
 *
 * @public
 * @param a argument pass from commandline
 *
 * @version 1.0
 * @see {@link Config}
 */
export default (a: any) => {
  const { args } = SeperateArgumentApi(a);
  try {
    let config = Config.Load({ bypass: true });

    ThrowIf(ValidList(args, ByMatchSome, CONFIG_SET_LIST));
    ThrowIf(ValidList(args, ByLength, 2));

    if (args.includes("token")) config.setToken(args[1]);
    else if (args.includes("username")) config.setUsername(args[1]);
    else if (args.includes("color")) config.setColor(args[1]);
    else if (args.includes("location")) config.setNovelLocation(args[1]);

    config.save();
  } catch (e) {
    ThrowIf(e);
  }
};
