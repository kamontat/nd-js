import Vorpal from "vorpal";
import logger from "winston";

import { Controller } from "./_interface";
import ConfigModel from "../models/Config";
import { ParameterNotFoundError, WrongParameterError } from "../constants/errorConst";

class ConfigController implements Controller {
  Command = "config";
  Alias = [];
  Description = "Setup configuration file on HOME";
  Options = [
    { option: "-p, --path", description: "Get configuration file path" },
    { option: "-s, --set", description: "Set config setting" }
  ];

  VorpalAction(this: Vorpal, _: Vorpal.Args): Promise<void> {
    return new Promise((res, _) => {
      res();
    });
  }

  Action(options: any, args: object[]): void {
    logger.verbose(`execute config`);

    let config = ConfigModel.Load();

    if (options.path) {
      logger.info(config.path);
    } else if (options.set) {
      if (args.length !== 2) {
        ParameterNotFoundError.loadString("set required 2 parameters");
        logger.error(ParameterNotFoundError.throw());
        ParameterNotFoundError.exit();
      }

      let accepts = [
        { label: "token", action: config.setToken },
        { label: "username", action: config.setUserId },
        { label: "color", action: config.setColor },
        { label: "location", action: config.setLocation }
      ];

      let result = accepts.filter(v => {
        return args[0].toString() === v.label;
      });

      if (result.length !== 1) {
        WrongParameterError.loadString(`accept: ${accepts}`);
        logger.error(WrongParameterError.throw());
        WrongParameterError.exit();
      }

      result[0].action(args[1].toString());

      config.save();
    }
  }
}

export const Config = new ConfigController();
