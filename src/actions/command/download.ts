import { SeperateArgument, WillThrow, IfValidate, Length } from "../../helpers/action";
import { log } from "winston";
import { GetNID } from "../../helpers/novel";
import { Exception } from "../../models/Exception";
import { NovelBuilder } from "../../models/Novel";
import { API_DOWNLOAD } from "../../apis/download";
import Config from "../../models/Config";
import { WrapTM, WrapTMC } from "../../models/LoggerWrapper";
import { API_GET_NOVEL_CHAPTER_NAME, API_GET_NOVEL_CONTENT } from "../../apis/novel";
import { writeFileSync } from "fs";

export const RawDownload = (a: any[]) => {
  const { options, args } = SeperateArgument(a);
  if (options.chapter.length === 0) options.chapter = [0];

  log(WrapTM("debug", "start command", "raw download"));

  WillThrow(IfValidate(args, Length, 1));

  try {
    let id = GetNID(args[0]);
    let chapter: string[] = options.chapter;
    log(WrapTMC("debug", "novel ID", id));
    log(WrapTMC("debug", "Chapter list", chapter));

    let config = Config.Load();
    config.updateByOption(options);

    chapter.map(chap => NovelBuilder.createChapter(id, chap, { location: config.getLocation() })).forEach(element => {
      API_DOWNLOAD(element)
        .then(({ cheerio, chapter }) => {
          chapter._name = API_GET_NOVEL_CHAPTER_NAME(cheerio);
          const content = API_GET_NOVEL_CONTENT(chapter, cheerio);

          writeFileSync(chapter.file(), content);
          log(WrapTMC("info", "Filename", chapter.file()));
        })
        .catch((err: Exception) => {
          err.printAndExit();
        });
    });
  } catch (e) {
    let exception: Exception = e;
    exception.printAndExit();
  }
};
