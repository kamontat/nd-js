/**
 * @external
 * @module commander.command
 */

import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { NovelProgressBuilder } from "../builder/progress";
import { ByLength, SeperateArgumentApi, ThrowIf, ValidList } from "../helpers/commander";
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

  // Old progress APIs
  // new ListrController()
  //   .addByHelper("Fetching Novel", NovelBuilder.fetch(id))
  //   .addFnByHelper("Building novel", ctx => NovelBuilder.build(id, ctx.result.cheerio), "novel")
  //   .addLoadChapterList("Download chapters", {
  //     force: options.force,
  //     contextKey: "novel",
  //     overrideNovel: (novel: Novel) => {
  //       novel.location = config.getNovelLocation();
  //       // get the chapter from the novel chapters list
  //       const chapters = chapterString.map(chapter => {
  //         const c = NovelBuilder.createChapter(id, chapter, { location: config.getNovelLocation() });
  //         return novel.getChapter(c);
  //       });
  //       // reset all the list
  //       novel.resetChapter();
  //       // add only request chapter
  //       chapters.forEach(c => novel.addChapter.call(novel, c));
  //     }
  //   })
  //   .runNovel({ contextKey: "novel", withChapter: options.withChapter });
};
