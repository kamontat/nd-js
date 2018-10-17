/**
 * @external
 * @module commander.command
 */

import { ThrowIf } from "../helpers/action";
import { WIP_ERR } from "../constants/error.const";
import { log } from "winston";
import { WrapTM } from "../models/LoggerWrapper";

export default (..._: any[]) => {
  log(WrapTM("debug", "command start", "show changelogs"));
  ThrowIf(WIP_ERR);
};
