/**
 * @external
 * @module commander.command
 */

import { NovelProgressBuilder } from "../builder/progress";

export default (location: string, _: { [key: string]: any }) => {
  return NovelProgressBuilder.Build().buildLocalNovelInformation(`Building novel from ${location}`, location);
};
