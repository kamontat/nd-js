/**
 * @external
 * @module commander.command
 */

import Bluebird from "bluebird";
import { readdirSync, statSync } from "fs-extra";
import { join } from "path";
import { log } from "winston";

import { WrapTMCT } from "../apis/loggerWrapper";
import { NovelProgressBuilder } from "../builder/progress";
import { PARAM_WRONG_ERR } from "../constants/error.const";
import { SeperateArgumentApi } from "../helpers/commander";
import { CheckIsNovelPath, WalkDirSync } from "../helpers/helper";
import { ExceptionStorage } from "../models/error/ExceptionStorage";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  const location = args[0] || "."; // default is current directory

  const max = options.maximum || "3";

  log(WrapTMCT("debug", "Is recusive", options.recusive));
  log(WrapTMCT("debug", "Max recusive", max));

  const update = (location: string, exit: boolean) => {
    if (!CheckIsNovelPath(location)) {
      const error = PARAM_WRONG_ERR.clone().loadString("Input is NOT novel path");
      error.print();
      if (exit) error.exit();
    }

    return NovelProgressBuilder.Build()
      .buildLocalNovelInformation(`Build novel from ${location}`, location)
      .fetchLatestInformation("Fetching latest novel information")
      .downloadChapterList("Update chapters", true)
      .saveResourceFile("Building new resource file", true)
      .runNovel(undefined, { withChapter: options.withChapter, withChanges: options.withChanges });
  };

  if (options.recusive) {
    const subfolders = WalkDirSync(location, max);
    log(WrapTMCT("debug", "recusive subfolder", subfolders));

    Bluebird.each(subfolders, subfolder => update(subfolder, false)).then(() => {
      ExceptionStorage.CONST.print();
    });
  } else {
    update(location, true);
  }
};
