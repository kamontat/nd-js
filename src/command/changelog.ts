/**
 * @external
 * @module commander.command
 */

import { log } from "winston";

import { WrapTM } from "../apis/loggerWrapper";
import { WIP_ERR } from "../constants/error.const";
import { ThrowIf } from "../helpers/commander";

export default (..._: any[]) => {
  log(WrapTM("debug", "command start", "show changelogs"));
  ThrowIf(WIP_ERR);
};
