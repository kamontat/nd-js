import { SeperateArgumentApi } from "../../helpers/action";
import { NovelBuilder } from "../../builder/novel";
import { Exception } from "../../models/Exception";
import { GetNID } from "../../helpers/novel";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  const ids = args.map(arg => GetNID(arg));
  ids.forEach(id => {
    NovelBuilder.create(id)
      .then(async novel => {
        await novel.save({ force: options.force });
        novel.print({ withChapter: options.withChapter });
      })
      .catch(err => {
        err.printAndExit();
      });
  });
};
