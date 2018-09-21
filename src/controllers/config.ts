import Vorpal from "vorpal";
import winston from "winston";

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

  path(isPath: boolean) {
    if (isPath) {
      let config = ConfigModel.Load();
      winston.info(config.path);
    }
  }

  set(isSet: boolean, args: object[]) {
    if (isSet) {
      let config = ConfigModel.Load();

      if (args.length !== 2) {
        ParameterNotFoundError.loadString("set required 2 parameters");
        winston.error(ParameterNotFoundError.message);
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
        winston.error(WrongParameterError.message);
        WrongParameterError.exit();
      }

      result[0].action(args[1].toString());

      config.save();
    }
  }

  VorpalAction(): Vorpal.Action {
    let self = this;
    console.log(self);
    return function(this: Vorpal, args: Vorpal.Args) {
      console.log(this);
      return new Promise(function(res, _) {
        console.log(self);

        self.path(args.options.path);
        res();
      });
    };
  }

  Action(options: any, args: object[]) {
    winston.verbose(`execute config`);

    this.path(options.path);
    this.set(options.set, args);
  }
}

export const Config = new ConfigController();
