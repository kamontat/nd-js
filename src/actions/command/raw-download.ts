/**
 * @external
 * @module commander.command
 */

import { SeperateArgumentApi, ThrowIf, ValidList, ByLength } from "../../helpers/action";
import { log } from "winston";
import { GetNID } from "../../helpers/novel";
import { Exception } from "../../models/Exception";
import { NovelBuilder } from "../../builder/novel";
import { FetchApi, DownloadChapters, DownloadChapter } from "../../apis/download";
import Config from "../../models/Config";
import { WrapTM, WrapTMC, WrapTMCT } from "../../models/LoggerWrapper";
import { HtmlBuilder } from "../../builder/html";
import { WriteChapter } from "../../apis/file";
import { GetNovelNameApi } from "../../apis/novel";
import { NovelStatus } from "../../models/Chapter";
import { NOVEL_SOLD_WARN } from "../../constants/error.const";

export default (a: any[]) => {
  const { options, args } = SeperateArgumentApi(a);
  if (options.chapter.length === 0) options.chapter = [0];

  log(WrapTM("debug", "start command", "raw download"));

  ThrowIf(ValidList(args, ByLength, 1));

  try {
    let id = GetNID(args[0]);
    let chapterString: string[] = options.chapter;
    log(WrapTMC("debug", "novel ID", id));
    log(WrapTMC("debug", "Chapter list", chapterString));

    let config = Config.Load();

    NovelBuilder.create(id, { location: config.getNovelLocation() }).then(async novel => {
      // do not create novel folder
      novel._location = config.getNovelLocation();
      // update chapter to novel
      novel._chapters = chapterString.map(chapter =>
        NovelBuilder.createChapter(id, chapter, { location: config.getNovelLocation() })
      );

      await novel.save({ force: options.force, resource: false });
      novel.print();
    });
  } catch (e) {
    e.printAndExit();
  }
};
