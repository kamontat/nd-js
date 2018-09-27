import { SeperateArgument, WillThrow, IfValidate, Length } from "../../helpers/action";
import { log } from "winston";
import { GetNID } from "../../helpers/novel";
import { Exception } from "../../models/Exception";
import { NovelBuilder } from "../../models/Novel";
import { DownloadAPI } from "../../apis/download";
import Config from "../../models/Config";
import { WrapTM, WrapTMC } from "../../models/LoggerWrapper";

export const RawDownload = (a: any[]) => {
  const { options, args } = SeperateArgument(a);
  if (options.chapter.length === 0) options.chapter = [0];

  log(WrapTM("debug", "start command", "raw download"));

  WillThrow(IfValidate(args, Length, 1));

  try {
    let id = GetNID(args[0]);
    log(WrapTMC("debug", "novel ID", id));

    let config = Config.Load();
    if (options.location) config.setLocation(options.location);

    DownloadAPI(NovelBuilder.createChapter(id, options.chapter[0], { location: config.getLocation() }))
      .then((filename: string) => {
        log(WrapTMC("info", "Filename", filename));
      })
      .catch((err: Exception) => {
        err.printAndExit();
      });
  } catch (e) {
    let exception: Exception = e;
    exception.printAndExit();
  }
};
