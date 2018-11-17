/**
 * @external
 * @module output.debugger.api
 */

import { log } from "winston";

import { WrapTM } from "../apis/loggerWrapper";

const DEBUGGER_NAME = "DEBUGGER";

export const Debugger = (title: string, description: any) => {
  log(WrapTM("debug", `${DEBUGGER_NAME} ${title}`, description));
};
