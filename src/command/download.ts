import { SeperateArgumentApi } from "../helpers/action";
import { NovelBuilder } from "../builder/novel";
import { GetNID } from "../helpers/novel";
import { ListrApis } from "../helpers/listr";
import Bluebird from "bluebird";
import { ExceptionStorage } from "../models/ExceptionStorage";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  const ids = args.map(arg => GetNID(arg));

  return Bluebird.each(ids, id => {
    return new ListrApis()
      .addByHelper(`Fetching novel ${id}`, NovelBuilder.fetch(id))
      .addFnByHelper(`Building novel ${id}`, ctx => NovelBuilder.build(id, ctx.result.cheerio), "novel")
      .addLoadChapterList("Download chapters", {
        force: options.force,
        contextKey: "novel"
      })
      .runNovel({ withChapter: options.withChapter });
  }).then(() => {
    ExceptionStorage.CONST.print();
    // ExceptionStorage.CONST.reset(); // reset the called result
  });
};
