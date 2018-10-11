/**
 * @external
 * @module commander.command
 */

import { SeperateArgumentApi, ThrowIf, ValidList, ByLength } from "../../helpers/action";
import { log } from "winston";
import { GetNID } from "../../helpers/novel";
import { NovelBuilder } from "../../builder/novel";
import Config from "../../models/Config";
import { ExceptionStorage } from "../../models/ExceptionStorage";

export default (a: any[]) => {
  const { options, args } = SeperateArgumentApi(a);
  if (options.chapter.length === 0) options.chapter = [0];

  ThrowIf(ValidList(args, ByLength, 1));

  const id = GetNID(args[0]);
  const chapterString: string[] = options.chapter;
  const config = Config.Load();

  NovelBuilder.fetch(id, { location: config.getNovelLocation() })
    .then(res => {
      return NovelBuilder.build(res.chapter.id, res.cheerio);
    })
    .then(async novel => {
      // do not create novel folder
      novel._location = config.getNovelLocation();
      // update chapter to novel
      novel._chapters = chapterString.map(chapter =>
        NovelBuilder.createChapter(id, chapter, { location: config.getNovelLocation() })
      );

      await novel.saveAll({ force: options.force });
      novel.print({ withChapter: options.withChapter });
      ExceptionStorage.CONST.print();
    })
    .catch(err => {
      ThrowIf(err);
    });
};
