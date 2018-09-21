import Vorpal from "vorpal";
import winston from "winston";

import { Controller } from "./_interface";
import Config from "../models/Config";

class InitialController implements Controller {
  Command = "initial";
  Alias = ["init"];
  Description = "Initial nd command in current computer";
  Options = [{ option: "-F, --force", description: "Force create even file exist." }];

  initialConfigFile(force: boolean) {
    let config = Config.Initial(force);
    winston.info(`config path: ${config.path}`);
  }

  VorpalAction(): Vorpal.Action {
    let self = this;
    return (args: Vorpal.Args) => {
      return new Promise((res, _) => {
        self.initialConfigFile(args.options.force);
        res();
      });
    };
  }

  Action(options: any, _: object[]): void {
    winston.verbose("execute initial command");
    this.initialConfigFile(options.force);
  }
}

export const Initial = new InitialController();
