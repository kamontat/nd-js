/**
 * @external
 * @module commander.command
 */

import { log } from "winston";

import { VERSION } from "../../security/index-main";
import { WrapTMCT } from "../apis/loggerWrapper";
import { COLORS } from "../constants/color.const";
import { ND } from "../constants/nd.const";
// import { SeperateArgumentApi } from "../helpers/commander";

export default (_: any) => {
  // const { options, args } = SeperateArgumentApi(a);

  log(
    WrapTMCT("info", "ND official name", ND.PROJECT_NAME, {
      message: COLORS.Name,
    }),
  );
  log(WrapTMCT("info", "Main version", ND.VERSION));
  log(WrapTMCT("info", "Security version", VERSION));

  log(WrapTMCT("info", "ND build time", ND.TIME, { message: COLORS.DateTime }));
  log(WrapTMCT("info", "ND state", ND.ENV));
};
