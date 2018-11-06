/**
 * @external
 * @module commander.command
 */

import { NovelBuilder } from "../builder/novel";
import { ByLength, SeperateArgumentApi, ThrowIf, ValidList } from "../helpers/action";
import { CheckIsPathExist } from "../helpers/helper";
import { ListrHelper } from "../helpers/listr";
import { GetNID } from "../helpers/novel";
import Config from "../models/command/Config";
import { Novel } from "../models/novel/Novel";
import { NPrinter } from "../models/novel/NPrinter";

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
 * @see {@link ListrHelper}
 * @see {@link NovelBuilder}
 */
export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  ThrowIf(ValidList(args, ByLength, 1));

  let progress: ListrHelper;

  if (CheckIsPathExist(args[0])) {
    const location = args[0];
    progress = FetchLocation(location, options);
  } else {
    const id = GetNID(args[0]);
    progress = FetchServer(id, options);
  }

  progress.runNovel({ withChapter: options.withChapter, withHistory: options.withHistory });
};
