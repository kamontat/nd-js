import { SeperateArgumentApi, ThrowIf } from "../../helpers/action";
import { NovelBuilder } from "../../builder/novel";
import { GetNID } from "../../helpers/novel";
import { error } from "util";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  const ids = args.map(arg => GetNID(arg));
  ids.forEach(id => {
    try {
      NovelBuilder.fetch(id)
        .then(res => {
          return NovelBuilder.build(res.chapter.id, res.cheerio);
        })
        .then(async novel => {
          return novel.saveNovel({ force: options.force });
        })
        .then(async novel => {
          return novel.saveResource();
        })
        .then(async novel => {
          novel.print({ withChapter: options.withChapter });
        })
        .catch(err => {
          ThrowIf(err);
        });
    } catch (err) {
      ThrowIf(err);
    }
  });
};
