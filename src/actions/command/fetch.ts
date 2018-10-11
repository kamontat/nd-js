/**
 * @external
 * @module commander.command
 */

import { log } from "winston";
import Config from "../../models/Config";
import { SeperateArgumentApi, ByLength, ValidList, ThrowIf } from "../../helpers/action";
import { WrapTM } from "../../models/LoggerWrapper";
import { Exception } from "../../models/Exception";
import { GetNID } from "../../helpers/novel";
import { FetchApi } from "../../apis/download";
import { NovelBuilder } from "../../builder/novel";
import { LOGGER_LEVEL } from "../../constants/default.const";

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

  const { options, args } = SeperateArgumentApi(a);

  ThrowIf(ValidList(args, ByLength, 1));

  try {
    let id = GetNID(args[0]);

    let config = Config.Load();
    config.updateByOption(options);

    NovelBuilder.fetch(id)
      .then(res => {
        return NovelBuilder.build(id, res.cheerio);
      })
      .then(novel => {
        novel.print({ withChapter: options.withChapter });
      })
      .catch((err: Exception) => {
        err.printAndExit();
      });
  } catch (e) {
    console.error(e);
    e.printAndExit();
  }
};
