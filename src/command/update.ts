/**
 * @external
 * @module commander.command
 */

import Bluebird from "bluebird";
import { log } from "winston";

import { WrapTMCT } from "../apis/loggerWrapper";
import { NovelProgressBuilder } from "../builder/progress";
import { PARAM_WRONG_ERR } from "../constants/error.const";
import { SeperateArgumentApi, ThrowIf } from "../helpers/commander";
import { CheckIsNovelPath, WalkDirSync } from "../helpers/helper";
import Config from "../models/command/Config";
import { ExceptionStorage } from "../models/error/ExceptionStorage";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  const max = options.maximum || "3";

  const update = (location: string, exit: boolean) => {
    if (!CheckIsNovelPath(location)) {
      const error = PARAM_WRONG_ERR.clone().loadString(
        "Input is NOT novel path",
      );
      error.print();
      if (exit) error.exit();
    }

    return NovelProgressBuilder.Build()
      .buildLocalNovelInformation(`Build novel from ${location}`, location)
      .fetchLatestInformation("Fetching latest novel information")
      .downloadChapterList("Update chapters", true)
      .saveResourceFile("Building new resource file", true)
      .runNovel(undefined, {
        withChapter: options.withChapter,
        withChanges: options.withChange,
      });
  };

  // push default location in configuration if not exist
  if (args.length < 1)
    args.push(
      Config.Load({
        quiet: true,
        bypass: true,
        force: true,
      }).getNovelLocation(),
    );

  Bluebird.each(args, arg => {
    const location = arg || "."; // default is current directory

    log(WrapTMCT("debug", "Is recusive", options.recusive));
    log(WrapTMCT("debug", "Max recusive", max));

    if (options.recusive) {
      const subfolders = WalkDirSync(location, max);
      log(WrapTMCT("debug", "recusive subfolder", subfolders));

      return Bluebird.each(subfolders, subfolder => update(subfolder, false));
    } else {
      return update(location, true);
    }
  })
    .then(() => {
      ExceptionStorage.CONST.print();
    })
    .catch(e => {
      ThrowIf(e);
    });
};
