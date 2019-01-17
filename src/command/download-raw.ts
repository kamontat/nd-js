/**
 * @external
 * @module commander.command
 */

import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { NovelProgressBuilder } from "../builder/progress";
import {
  ByLength,
  SeperateArgumentApi,
  ThrowIf,
  ValidList,
} from "../helpers/commander";
import { MakeReadableNumberArray } from "../helpers/helper";
import { GetNID } from "../helpers/novel";

export default (a: any) => {
  log(WrapTMC("verbose", "prepare", "raw download"));
  const { options, args } = SeperateArgumentApi(a);

  if (options.chapter.length === 0) {
    options.chapter = [0];
  }

  ThrowIf(ValidList(args, ByLength, 1));

  log(WrapTMC("verbose", "start", "raw download"));
  const id = GetNID(args[0]);
  const chapterString: string[] = options.chapter;

  // Newest progress APIs
  NovelProgressBuilder.Build()
    .fetchNovel("Fetching novel", id)
    .buildNovelInformation("Build novel information")
    .downloadOnlyChapterList(
      `Download chapters (${MakeReadableNumberArray(chapterString)})`,
      chapterString,
      options.force,
    )
    .runNovel(undefined, {
      withChapter: options.withChapter,
    });
};
