/**
 * @external
 * @module commander.command
 */

import { NovelProgressBuilder } from "../builder/progress";
import Config from "../models/command/Config";

export default (id: string, options: { [key: string]: any }) => {
  const config = Config.Load();
  config.updateByOption(options);

  return NovelProgressBuilder.Build()
    .fetchNovel("Fetching novel", id)
    .buildNovelInformation("Building novel");
};
