/**
 * @external
 * @module commander.command
 */

import { NovelProgressBuilder } from "../builder/progress";
import { PARAM_WRONG_ERR } from "../constants/error.const";
import { SeperateArgumentApi } from "../helpers/commander";
import { CheckIsNovelPath } from "../helpers/helper";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  const location = args[0];

  if (!CheckIsNovelPath(location)) PARAM_WRONG_ERR.loadString("Input is NOT novel path").printAndExit();

  return NovelProgressBuilder.Build()
    .buildLocalNovelInformation(`Build novel from ${location}`, location)
    .fetchLatestInformation("Fetching latest novel information")
    .downloadChapterList("Update chapters", true)
    .saveResourceFile("Building new resource file", true)
    .runNovel(undefined, { withChapter: options.withChapter, withChanges: options.withChanges });
};
