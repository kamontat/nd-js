/**
 * @external
 * @module commander.command
 */

import Config from "../models/Config";
import { SeperateArgumentApi, ByLength, ValidList, ThrowIf } from "../helpers/action";
import { GetNID } from "../helpers/novel";
import { NovelBuilder } from "../builder/novel";
import { ListrApis } from "../helpers/listr";

/**
 * This is fetching novel information
 *
 * @public
 * @param a argument pass from commandline
 *
 * @version 2.0
 * @see {@link Config}
 * @see {@link ListrApis}
 * @see {@link NovelBuilder}
 */
export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  ThrowIf(ValidList(args, ByLength, 1));

  let id = GetNID(args[0]);
  let config = Config.Load();
  config.updateByOption(options);

  new ListrApis()
    .addByHelper("Fetching Novel", NovelBuilder.fetch(id))
    .addFnByHelper("Building Novel", ctx => NovelBuilder.build(id, ctx.result.cheerio), "novel")
    .runNovel({ withChapter: options.withChapter });
};
