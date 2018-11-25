import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { SeperateArgumentApi } from "../helpers/commander";

// TODO: idea of the command (modify)

// 1. modify <location|id|alias>
export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "Execute Modify", "execution"));
};
