import { log } from "winston";

import {
  ACTION_SEPERATE_ARGUMENT,
  ACTION_THROW_IF,
  ACTION_VALIDATE,
  VALID_LENGTH,
  VALID_MATCH_SOME
} from "../../helpers/action";
import Config from "../../models/Config";

import { Exception } from "../../models/Exception";
import { WrapTM, WrapTMC } from "../../models/LoggerWrapper";

export const ConfigSet = (a: any) => {
  const { args } = ACTION_SEPERATE_ARGUMENT(a);
  try {
    log(WrapTM("debug", "status", "before load config"));
    let config = Config.Load({ bypass: true });
    log(WrapTM("debug", "start command", "set config"));

    ACTION_THROW_IF(ACTION_VALIDATE(args, VALID_MATCH_SOME, ["token", "username", "color", "location"]));
    ACTION_THROW_IF(ACTION_VALIDATE(args, VALID_LENGTH, 2));

    if (args.includes("token")) config.setToken(args[1]);
    else if (args.includes("username")) config.setUserId(args[1]);
    else if (args.includes("color")) config.setColor(args[1]);
    else if (args.includes("location")) config.setLocation(args[1]);

    try {
      config.save();
    } catch (e) {
      let exception: Exception = e;
      ACTION_THROW_IF(exception);
    }
  } catch (e) {
    let exception: Exception = e;
    ACTION_THROW_IF(exception);
  }
};

export default () => {
  log(WrapTM("debug", "start command", "config"));

  try {
    Config.Load();
    log(WrapTMC("info", "configuration", Config.Load().path));
  } catch (e) {
    let exception: Exception = e;
    ACTION_THROW_IF(exception);
  }
};
