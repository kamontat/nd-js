/**
 * @external
 * @module commander.command
 */

import { ListrHelper } from "../helpers/listr";

export default (location: string, _: { [key: string]: any }) => {
  return new ListrHelper().addLoadLocalPath(`Build novel from ${location}`, location, {});
};
