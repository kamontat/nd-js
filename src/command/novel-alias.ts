import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { SeperateArgumentApi } from "../helpers/commander";

// TODO: idea of the command (alias)

// 1. alias <location|id> <alias_name>
export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "Execute Alias", "execution"));
};
