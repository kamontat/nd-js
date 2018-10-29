/**
 * @external
 * @module commander.command
 */

import { NovelBuilder } from "../builder/novel";
import { ByLength, SeperateArgumentApi, ThrowIf, ValidList } from "../helpers/action";
import { ListrHelper } from "../helpers/listr";
import { GetNID } from "../helpers/novel";
import Config from "../models/Config";

/**
 * This is fetching novel information
 *
 * @public
 * @param a argument pass from commandline
 *
 * @version 2.0
 * @see {@link Config}
 * @see {@link ListrHelper}
 * @see {@link NovelBuilder}
 */
export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  ThrowIf(ValidList(args, ByLength, 1));

  const id = GetNID(args[0]);
  const config = Config.Load();
  config.updateByOption(options);

  new ListrHelper()
    .addByHelper("Fetching Novel", NovelBuilder.fetch(id))
    .addFnByHelper("Building Novel", ctx => NovelBuilder.build(id, ctx.result.cheerio), "novel")
    .runNovel({ withChapter: options.withChapter });
};
