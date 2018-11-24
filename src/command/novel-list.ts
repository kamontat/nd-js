import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { SeperateArgumentApi } from "../helpers/commander";

// TODO: idea of the command (list)

// 1. list [--recusive] [--max <number>]
export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "Execute List", "execution"));
};
