/**
 * @external
 * @module commander.command
 */

import { SeperateArgumentApi, ThrowIf, ValidList, ByLength } from "../../helpers/action";
import { log } from "winston";
import { GetNID } from "../../helpers/novel";
import { Exception } from "../../models/Exception";
import { NovelBuilder } from "../../builder/novel";
import { FetchApi } from "../../apis/download";
import Config from "../../models/Config";
import { WrapTM, WrapTMC, WrapTMCT } from "../../models/LoggerWrapper";
import { HtmlBuilder } from "../../builder/html";
import { WriteChapter } from "../../apis/file";
import { GetNovelNameApi } from "../../apis/novel";

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
      .forEach(element =>
        FetchApi(element)
          .then(res => {
            const html = HtmlBuilder.template(res.chapter._nid)
              .addName(GetNovelNameApi(res.cheerio))
              .addChap(res.chapter)
              .addContent(HtmlBuilder.buildContent(res.cheerio));
            return WriteChapter(html.renderDefault(), res.chapter, options.force);
          })
          .then(result => {
            log(WrapTMCT("info", "Result file", result.file()));
            log(WrapTMCT("verbose", `Chapter ${result._chapterNumber}`, result.toString()));
          })
      );
  } catch (e) {
    let exception: Exception = e;
    exception.printAndExit();
  }
};
