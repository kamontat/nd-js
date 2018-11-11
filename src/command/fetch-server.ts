/**
 * @external
 * @module commander.command
 */

import { NovelBuilder } from "../builder/novel";
import { ListrController } from "../helpers/listr";
import Config from "../models/command/Config";

export default (id: string, options: { [key: string]: any }) => {
  const config = Config.Load();
  config.updateByOption(options);

  return new ListrController()
    .addByHelper("Fetching Novel", NovelBuilder.fetch(id))
    .addFnByHelper("Building Novel", ctx => NovelBuilder.build(id, ctx.result.cheerio), "novel");
};
