import { DEFAULT_CONFIG_FOLDER } from "../constants/configConst";

import Vorpal from "vorpal";
import { Logger } from "winston";

import { Controller } from "./_interface";

process.env["NODE_CONFIG_DIR"] = DEFAULT_CONFIG_FOLDER;
import config from "config";
import { WrongException } from "../models/Exception";

class ConfigController implements Controller {
  Command = "config";
  Alias = [];
  Description = "Setup configuration file on HOME";

  VorpalAction(_: Logger): Vorpal.Action {
    return function(this: Vorpal, _: Vorpal.Args) {
      return new Promise((res, _) => {
        res();
      });
    };
  }

  Action(logger: Logger): (_: string[]) => void {
    return function(_: string[]) {
      logger.verbose("execute config");

      process.exit(0);
    };
  }
}

export const Config = new ConfigController();
