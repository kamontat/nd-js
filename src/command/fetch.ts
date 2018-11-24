/**
 * @external
 * @module commander.command
 */

import { NovelProgressBuilder } from "../builder/progress";
import { SeperateArgumentApi, ThrowIf } from "../helpers/commander";
import { CheckIsPathExist } from "../helpers/helper";
import { GetNID } from "../helpers/novel";

import FetchLocation from "./fetch-location";
import FetchServer from "./fetch-server";

/**
 * This is fetching novel information
 *
 * @public
 * @param a argument pass from commandline
 *
 * @version 2.0
 * @see {@link Config}
 * @see {@link NovelBuilder}
 */
export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);

  let progress: NovelProgressBuilder;
  args.forEach(each => {
    try {
      if (options.local || CheckIsPathExist(each)) {
        const location = each;
        progress = FetchLocation(location, options);
      } else {
        const id = GetNID(each);
        progress = FetchServer(id, options);
      }
      progress.runNovel(undefined, { withChapter: options.withChapter, withHistory: options.withHistory });
    } catch (e) {
      ThrowIf(e, { noExit: true });
    }
  });
};
