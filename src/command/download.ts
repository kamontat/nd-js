/**
 * @external
 * @module commander.command
 */

import Bluebird from "bluebird";

import { NovelBuilder } from "../builder/novel";
import { SeperateArgumentApi } from "../helpers/commander";
import { ListrController } from "../helpers/listr";
import { GetNID } from "../helpers/novel";
import { ExceptionStorage } from "../models/error/ExceptionStorage";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  const ids = args.map(arg => GetNID(arg));

  return Bluebird.each(ids, id => {
    return new ListrController()
      .addByHelper(`Fetching novel ${id}`, NovelBuilder.fetch(id))
      .addFnByHelper(`Building novel ${id}`, ctx => NovelBuilder.build(id, ctx.result.cheerio), "novel")
      .addLoadChapterList("Download chapters", {
        force: options.force,
        contextKey: "novel",
      })
      .addCreateResourceFile(`Building resource file`, { force: options.force })
      .runNovel({ withChapter: options.withChapter });
  }).then(() => {
    ExceptionStorage.CONST.print();
  });
};
