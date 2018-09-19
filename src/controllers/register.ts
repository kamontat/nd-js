import Vorpal from "vorpal";
import { Logger } from "winston";

import { Controller } from "./_interface";

class RegisterController implements Controller {
  Command = "initial";
  Alias = ["init"];
  Description = "Initial nd command in current computer";

  VorpalAction(_: Logger): Vorpal.Action {
    return function(this: Vorpal, _: Vorpal.Args) {
      return new Promise((res, _) => {
        res();
      });
    };
  }

  Action(logger: Logger): (_: string[]) => void {
    return function(_: string[]) {
      logger.verbose("execute register");

      process.exit(0);
    };
  }
}

export const Register = new RegisterController();
