/**
 * @external
 * @module commander.command
 */

import { SeperateArgumentApi, ThrowIf, ValidList, ByLength } from "../../helpers/action";
import { log } from "winston";
import { GetNID } from "../../helpers/novel";
import { Exception } from "../../models/Exception";
import { NovelBuilder } from "../../models/Novel";
import { DownloadApi } from "../../apis/download";
import Config from "../../models/Config";
import { WrapTM, WrapTMC, WrapTMCT } from "../../models/LoggerWrapper";
import { GetChapterNameApi, GetNovelContent, BuildNovelHtml } from "../../apis/novel";
import { writeFileSync } from "fs";

export default (a: any[]) => {
  const { options, args } = SeperateArgumentApi(a);
  if (options.chapter.length === 0) options.chapter = [0];

  log(WrapTM("debug", "start command", "raw download"));

  ThrowIf(ValidList(args, ByLength, 1));

  try {
    let id = GetNID(args[0]);
    let chapter: string[] = options.chapter;
    log(WrapTMC("debug", "novel ID", id));
    log(WrapTMC("debug", "Chapter list", chapter));

    let config = Config.Load();

    chapter
      .map(chap => NovelBuilder.createChapter(id, chap, { location: config.getNovelLocation() }))
      .forEach(element => DownloadApi(element).then(chap => log(WrapTMCT("info", "Filename", chap.file()))));
  } catch (e) {
    let exception: Exception = e;
    exception.printAndExit();
  }
};
