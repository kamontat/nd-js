/**
 * @external
 * @module commander.command
 */

import { SeperateArgumentApi, ThrowIf, ValidList, ByLength } from "../helpers/action";
import { GetNID } from "../helpers/novel";
import { NovelBuilder } from "../builder/novel";
import Config from "../models/Config";
import { WrapTMC } from "../models/LoggerWrapper";
import { log } from "winston";
import { ListrApis } from "../helpers/listr";
import { Novel } from "../models/Novel";

export default (a: any) => {
  log(WrapTMC("verbose", "prepare", "raw download"));
  const { options, args } = SeperateArgumentApi(a);

  if (options.chapter.length === 0) options.chapter = [0];

  ThrowIf(ValidList(args, ByLength, 1));

  log(WrapTMC("verbose", "start", "raw download"));
  const id = GetNID(args[0]);
  const chapterString: string[] = options.chapter;
  const config = Config.Load();

  new ListrApis()
    .addByHelper("Fetching Novel", NovelBuilder.fetch(id))
    .addFnByHelper("Building novel", ctx => NovelBuilder.build(id, ctx.result.cheerio), "novel")
    .addLoadChapterList("Download chapters", {
      force: options.force,
      contextKey: "novel",
      overrideNovel: (novel: Novel) => {
        novel.location = config.getNovelLocation();
        // update chapter to novel
        const chapters = chapterString.map(chapter =>
          NovelBuilder.createChapter(id, chapter, { location: config.getNovelLocation() })
        );
        novel.setChapter(chapters, { force: true });
      }
    })
    .runNovel({ contextKey: "novel", withChapter: options.withChapter });
};
