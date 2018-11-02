/**
 * @external
 * @module commander.command
 */

import { NovelBuilder } from "../builder/novel";
import { SeperateArgumentApi } from "../helpers/action";

export default (a: any) => {
  const { args } = SeperateArgumentApi(a);
  const location = args[0];

  NovelBuilder.buildLocal(location);
};
