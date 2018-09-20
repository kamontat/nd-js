import Vorpal from "vorpal";
import winston from "winston";

import { Controller } from "./_interface";
import Config from "../models/Config";

class InitialController implements Controller {
  Command = "initial";
  Alias = ["init"];
  Description = "Initial nd command in current computer";

  Options = [{ option: "-F, --force", description: "Force create even file exist." }];

  VorpalAction(this: Vorpal, _: Vorpal.Args): Promise<void> {
    return new Promise((res, _) => {
      res();
    });
  }

  Action(options: any, _: object[]): void {
    winston.verbose("execute initial command");

    let config = Config.Initial(options.force);

    winston.info(`config path: ${config.path}`);
  }
}

export const Initial = new InitialController();
