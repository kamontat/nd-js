import { log } from "winston";

import {
  SeperateArgument,
  WillThrow,
  IfValidate,
  IsSubcommand,
  SubcommandArgument,
  Length,
  MatchSome
} from "../../helpers/action";
import Config from "../../models/Config";

import { Exception } from "../../models/Exception";
import { WrapTM, WrapTMC } from "../../models/LoggerWrapper";

export const ConfigSet = (a: any) => {
  const { args } = SeperateArgument(a);
  try {
    log(WrapTM("debug", "status", "before load config"));
    let config = Config.Load({ bypass: true });
    log(WrapTM("debug", "start command", "set config"));

    WillThrow(IfValidate(args, MatchSome, ["token", "username", "color", "location"]));
    WillThrow(IfValidate(args, Length, 2));

    if (IsSubcommand(args, "token")) config.setToken(args[1]);
    else if (IsSubcommand(args, "username")) config.setUserId(args[1]);
    else if (IsSubcommand(args, "color")) config.setColor(args[1]);
    else if (IsSubcommand(args, "location")) config.setLocation(args[1]);

    try {
      config.save();
    } catch (e) {
      let exception: Exception = e;
      WillThrow(exception);
    }
  } catch (e) {
    let exception: Exception = e;
    WillThrow(exception);
  }
};

export default () => {
  log(WrapTM("debug", "start command", "config"));

  try {
    Config.Load();
    log(WrapTMC("info", "configuration", Config.Load().path));
  } catch (e) {
    let exception: Exception = e;
    WillThrow(exception);
  }
};
