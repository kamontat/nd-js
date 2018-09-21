import { SeperateArgument, WillThrow, IfValidate, Length } from "../../apis/action";
import { verbose, error } from "winston";
import { GetNID } from "../../apis/novel";
import { Exception } from "../../models/Exception";
import { NovelBuilder } from "../../models/Novel";
import { DownloadAPI } from "../../apis/download";
import Config from "../../models/Config";

export const RawDownload = (a: any[]) => {
  const { options, args } = SeperateArgument(a);
  if (options.chapter.length === 0) options.chapter = [0];

  verbose("execute config");
  verbose(`chapters: [${options.chapter}]`);

  WillThrow(IfValidate(args, Length, 1));

  try {
    let id = GetNID(args[0]);
    verbose(`NID: ${id}`);

    let config = Config.Load();
    if (options.location) config.setLocation(options.location);

    let novel = NovelBuilder.create(id, config.getLocation());
    DownloadAPI(novel.getLinkAtChapter(options.chapter[0]));
  } catch (e) {
    let exception: Exception = e;
    error(exception.message);
    exception.exit();
  }
};
