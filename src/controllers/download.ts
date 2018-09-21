import Vorpal from "vorpal";
import logger from "winston";

import { Controller } from "./_interface";

class DownloadController implements Controller {
  Command = "download";
  Alias = ["load", "d"];
  Description = "Download new novel set.";
  VorpalAction(): Vorpal.Action {
    let self = this;
    return function(this: Vorpal, _: Vorpal.Args) {
      return new Promise((res, _) => {
        this.log("test");
        res();
      });
    };
  }

  Action(_: string[]) {
    logger.verbose("execute download");

    process.exit(0);
  }
}

export const Download = new DownloadController();
