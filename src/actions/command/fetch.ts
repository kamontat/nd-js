/**
 * @external
 * @module commander.command
 */

import { log } from "winston";
import Config from "../../models/Config";
import { ACTION_SEPERATE_ARGUMENT, VALID_LENGTH, ACTION_VALIDATE, ACTION_THROW_IF } from "../../helpers/action";
import { WrapTM } from "../../models/LoggerWrapper";
import { Exception } from "../../models/Exception";
import { GetNID } from "../../helpers/novel";
import { DownloadApi } from "../../apis/download";
import { NovelBuilder } from "../../models/Novel";

/**
 * This is initial command.
 *
 * @public
 * @param a argument pass from commandline
 *
 * @version 1.0
 * @see {@link Config}
 */
export default (a: any) => {
  log(WrapTM("debug", "start command", "fetch"));

  const { options, args } = ACTION_SEPERATE_ARGUMENT(a);

  ACTION_THROW_IF(ACTION_VALIDATE(args, VALID_LENGTH, 1));

  try {
    let id = GetNID(args[0]);

    let config = Config.Load();
    config.updateByOption(options);

    DownloadApi(NovelBuilder.createChapter(id, "0"))
      .then(res => {
        NovelBuilder.build(id, res.cheerio).then(novel => {
          novel.print();
        });

        // novel.print({ color: true, long: all, all: true });
        // log(WrapTMC("verbose", "Novel id", novel._id));
        // const list = API_CREATE_NOVEL_CHAPTER_LIST(res.cheerio);
        // list.forEach(chap => log(WrapTMC("info", `Chapter ${chap._chapterNumber}`, chap._name)));
        // res.cheerio
      })
      .catch((err: Exception) => {
        err.printAndExit();
      });
  } catch (e) {
    let exception: Exception = e;
    exception.printAndExit();
  }
};
