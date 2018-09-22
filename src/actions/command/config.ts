import { info, verbose } from "winston";
import {
  SeperateArgument,
  WillThrow,
  IfValidate,
  IsSubcommand,
  SubcommandArgument,
  Length,
  MatchSome
} from "../../apis/action";
import Config from "../../models/Config";

import { Exception } from "../../models/Exception";

export const ConfigSet = (a: any[]) => {
  const { args } = SeperateArgument(a);
  try {
    let config = Config.Load();

    verbose("set config", { start: true });

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

export const ConfigPath = () => {
  try {
    Config.Load();

    info(Config.Load().path);
  } catch (e) {
    let exception: Exception = e;
    WillThrow(exception);
  }
};

export default (a: any) => {
  const { args } = SeperateArgument(a);
  verbose("config", { start: true });

  // this of validate subcommand
  WillThrow(IfValidate(args, MatchSome, ["set", ""]));

  if (IsSubcommand(args, "set")) ConfigSet(SubcommandArgument(a));
  else ConfigPath();
};
