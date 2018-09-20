import Vorpal from "vorpal";
import logger from "winston";

import { Controller } from "./_interface";

class DownloadController implements Controller {
  Command = "download";
  Alias = ["load", "d"];
  Description = "Download new novel set.";

  VorpalAction(this: Vorpal, _: Vorpal.Args): Promise<void> {
    return new Promise((res, _) => {
      res();
    });
  }

  Action(_: string[]) {
    logger.verbose("execute download");

    process.exit(0);
  }
}

export const Download = new DownloadController();
