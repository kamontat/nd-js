/**
 * @external
 * @module commander.command
 */

import { log } from "winston";

import { WrapTMCT } from "../apis/loggerWrapper";
import {
  ByMatchSome,
  SeperateArgumentApi,
  ThrowIf,
  ValidList,
} from "../helpers/commander";
import Config from "../models/command/Config";

export const CONFIG_SET_LIST = ["token", "fullname", "color", "location"];

const setup = (config: Config, key: string, value: string) => {
  switch (key) {
    case "token":
      config.setToken(value);
      break;
    case "fullname":
      config.setFullname(value);
      break;
    case "color":
      config.setColor(value);
      break;
    case "location":
      config.setNovelLocation(value);
      break;
    default:
      break;
  }

  return config;
};

/**
 * This is configuration setting command, This command able to set the value to {@link Config} file.
 *
 * @param a argument pass from commandline
 *
 * @version 2.0
 * @since November 29, 2018
 */
export default (a: any) => {
  const { options, args } = SeperateArgumentApi<any>(a);
  try {
    const config = Config.Load({ bypass: true });

    if (options.json) {
      const json = JSON.parse(options.json);
      Object.keys(json).forEach(key => {
        const value = json[key];
        setup(config, key, value);
      });
      config.save();
      log(
        WrapTMCT(
          "info",
          "Setting config (JSON)",
          `Setting ${Object.keys(json)}`,
        ),
      );
    } else {
      ThrowIf(ValidList(args, ByMatchSome, CONFIG_SET_LIST));

      setup(config, args[0], args[1]).save();
      log(
        WrapTMCT(
          "info",
          "Setting config",
          `${args[0]} => ${args[1]} Completed!`,
        ),
      );
    }
  } catch (e) {
    ThrowIf(e);
  }
};
