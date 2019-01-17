/**
 * @external
 * @module commander.command
 */

import Bluebird from "bluebird";

import { NovelProgressBuilder } from "../builder/progress";
import { SeperateArgumentApi } from "../helpers/commander";
import { MakeReadableNumberArray } from "../helpers/helper";
import { GetNID } from "../helpers/novel";
import { ExceptionStorage } from "../models/error/ExceptionStorage";
import { Novel } from "../models/novel/Novel";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  const ids = args.map(arg => GetNID(arg));

  return Bluebird.each(ids, id => {
    // Newest progress APIs
    return NovelProgressBuilder.Build()
      .fetchNovel(`Fetching novel ${id}`, id)
      .buildNovelInformation("Building novel information")
      .downloadChapterList(
        (novel?: Novel) =>
          (novel &&
            `Download chapter (${MakeReadableNumberArray(novel.chapterSize
              .list as string[])})`) ||
          "Download chapter",
        options.force,
      )
      .saveResourceFile("Building resource file", options.force)
      .runNovel(undefined, { withChapter: options.withChapter });
  }).then(() => {
    ExceptionStorage.CONST.print();
  });
};
