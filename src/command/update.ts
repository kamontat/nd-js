/**
 * @external
 * @module commander.command
 */

import { NovelBuilder } from "../builder/novel";
import { PARAM_WRONG_ERR } from "../constants/error.const";
import { SeperateArgumentApi } from "../helpers/commander";
import { CheckIsNovelPath } from "../helpers/helper";
import { ListrController } from "../helpers/listr";
import { Novel } from "../models/novel/Novel";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  const location = args[0];

  if (!CheckIsNovelPath(location)) PARAM_WRONG_ERR.loadString("Input is NOT novel path").printAndExit();

  // TODO: Make changes output more readable that this.
  return new ListrController()
    .addByHelper(`Load local novel`, NovelBuilder.buildLocal(location), "novel")
    .addFnByHelper(`Update local novel`, ctx => (ctx.novel as Novel).update(), "novel")
    .addLoadChapterList("Download chapters", {
      force: true,
      contextKey: "novel",
    })
    .addCreateResourceFile(`Building resource file`, { force: true })
    .runNovel({ withChapter: options.withChapter, withChanges: options.changes });
};
