/**
 * @external
 * @module commander.command
 */

import { NovelBuilder } from "../builder/novel";
import { PARAM_WRONG_ERR } from "../constants/error.const";
import { SeperateArgumentApi } from "../helpers/action";
import { CheckIsPathExist } from "../helpers/helper";
import { CPrinter } from "../models/novel/CPrinter";
import { NPrinter } from "../models/novel/NPrinter";

export default (a: any) => {
  const { args } = SeperateArgumentApi(a);
  const location = args[0];

  if (!CheckIsPathExist(location)) PARAM_WRONG_ERR.loadString("Input should be valid location path").printAndExit();

  const novel = NovelBuilder.buildLocal(location);
  console.log(novel.toJSON());
  console.log(novel.history().toJSON());

  new NPrinter(novel).print({ short: false });
};
