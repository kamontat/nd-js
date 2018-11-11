/**
 * @external
 * @module output.debugger.api
 */

import { log } from "winston";

import { WrapTMCT } from "../apis/loggerWrapper";

const DEBUGGER_NAME = "DEBUGGER";

export const Debugger = (title: string, description: any) => {
  log(WrapTMCT("debug", `${DEBUGGER_NAME} ${title}`, description));
};
