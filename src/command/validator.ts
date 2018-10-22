import { SeperateArgumentApi, ThrowIf, ValidList, ByMatchSome, ByLength } from "../helpers/action";
import { log } from "winston";
import { WrapTMC } from "../models/LoggerWrapper";
import Config from "../models/Config";

export const VALIDATE_LIST = ["config"];

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "starting...", "validator"));

  ThrowIf(ValidList(args, ByMatchSome, VALIDATE_LIST));
  ThrowIf(ValidList(args, ByLength, 1));

  if (args.includes("config")) {
    if (options.info) Config.Load({ bypass: true }).showStatus({ console: true, all: false });
    else Config.Load({ bypass: true }).showStatus({ console: false, all: true });
  }

  process.exit(0);
};
