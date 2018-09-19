import Vorpal from "vorpal";
import { Logger } from "winston";

import { Controller } from "./_interface";

class DownloadController implements Controller {
  Command = "download";
  Alias = ["load", "d"];
  Description = "Download new novel set.";

  VorpalAction(_: Logger): Vorpal.Action {
    return function(this: Vorpal, _: Vorpal.Args) {
      return new Promise((res, _) => {
        res();
      });
    };
  }

  Action(logger: Logger): (_: string[]) => void {
    return function(_: string[]) {
      logger.verbose("execute download");

      process.exit(0);
    };
  }
}

export const Download = new DownloadController();
