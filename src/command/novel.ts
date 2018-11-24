import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { SeperateArgumentApi } from "../helpers/commander";

// TODO: idea of the command (novel)

// 1. novel list [--location <location>] == list all novel in location, recusive
// 2. novel alias <location> <custom-name> == set novel location to custom name
// 3. novel modify <location|id|name> [delete|create] [--chapter <number...>] [--name <name>]
export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "Execute Novel", "execution"));
};
