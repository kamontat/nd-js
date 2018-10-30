import { log } from "winston";

import { ByLength, ByMatchSome, SeperateArgumentApi, ThrowIf, ValidList } from "../helpers/action";
import Config from "../models/Config";
import { WrapTMC } from "../models/output/LoggerWrapper";

export const VALIDATE_LIST = ["config"];

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "starting...", "validator"));

  ThrowIf(ValidList(args, ByMatchSome, VALIDATE_LIST));
  ThrowIf(ValidList(args, ByLength, 1));

  if (args.includes("config")) {
    if (options.info) {
      Config.Load({ bypass: true }).showStatus({ console: true, all: false });
    } else {
      Config.Load({ bypass: true }).showStatus({ console: false, all: true });
    }
  }

  process.exit(0);
};
