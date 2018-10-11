/**
 * @external
 * @module commander.command
 */

import { log } from "winston";

import { SeperateArgumentApi, ThrowIf, ValidList, ByLength, ByMatchSome } from "../../helpers/action";

import Config from "../../models/Config";

import { Exception } from "../../models/Exception";
import { WrapTM, WrapTMC } from "../../models/LoggerWrapper";

export const ConfigSet = (a: any) => {
  const { args } = SeperateArgumentApi(a);
  try {
    log(WrapTM("debug", "status", "before load config"));
    let config = Config.Load({ bypass: true });
    log(WrapTM("debug", "start command", "set config"));

    ThrowIf(ValidList(args, ByMatchSome, ["token", "username", "color", "location"]));
    ThrowIf(ValidList(args, ByLength, 2));

    if (args.includes("token")) config.setToken(args[1]);
    else if (args.includes("username")) config.setUsername(args[1]);
    else if (args.includes("color")) config.setColor(args[1]);
    else if (args.includes("location")) config.setNovelLocation(args[1]);

    try {
      config.save();
    } catch (e) {
      ThrowIf(e);
    }
  } catch (e) {
    ThrowIf(e);
  }
};

export default () => {
  log(WrapTM("debug", "start command", "config"));

  try {
    Config.Load();
    log(WrapTMC("info", "configuration", Config.Load().configLocation));
  } catch (e) {
    ThrowIf(e);
  }
};
