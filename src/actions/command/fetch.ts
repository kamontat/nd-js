import { log } from "winston";
import Config from "../../models/Config";
import { SeperateArgument, Length, IfValidate, WillThrow } from "../../helpers/action";
import { WrapTMC, WrapTM } from "../../models/LoggerWrapper";
import { Exception } from "../../models/Exception";
import { GetNID } from "../../helpers/novel";
import { API_DOWNLOAD } from "../../apis/download";
import { NovelBuilder } from "../../models/Novel";

/**
 * This is initial command.
 *
 * @public
 * @param a argument pass from commandline
 *
 * @version 1.0
 * @see {@link Config}
 */
export default (a: any) => {
  log(WrapTM("debug", "start command", "fetch"));

  const { options, args } = SeperateArgument(a);
  const long = options.long !== undefined && options.long == true;

  WillThrow(IfValidate(args, Length, 1));

  log(WrapTM("debug", "Is long", long));

  try {
    let id = GetNID(args[0]);

    let config = Config.Load();
    config.updateByOption(options);

    API_DOWNLOAD(NovelBuilder.createChapter(id, "0"))
      .then(res => {
        log(WrapTMC("silly", "Result", res.cheerio.html()));
        // res.cheerio
      })
      .catch((err: Exception) => {
        err.printAndExit();
      });
  } catch (e) {
    let exception: Exception = e;
    exception.printAndExit();
  }
};
