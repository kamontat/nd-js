/**
 * @external
 * @module commander.command
 */
import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { SeperateArgumentApi } from "../helpers/commander";
import { CheckIsLatestVersion } from "../helpers/helper";
import { InstallLatestVersion, InstallVersion } from "../models/release";

export default (a: any) => {
  const { options } = SeperateArgumentApi(a);

  CheckIsLatestVersion().then(latest => {
    if (latest.isLatest) {
      log(WrapTMC("warn", "message", "current version is the newest version"));

      return;
    }

    log(WrapTMC("verbose", "Execute Upgrade", "execution"));

    if (options.at) InstallVersion(options.at);
    else InstallLatestVersion();
  });
};
