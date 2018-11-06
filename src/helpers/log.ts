import { log } from "winston";

import { WrapTMCT } from "../models/output/LoggerWrapper";

const DEBUGGER_NAME = "DEBUGGER";

export const Debugger = (title: string, description: any) => {
  log(WrapTMCT("debug", `${DEBUGGER_NAME} ${title}`, description));
};
