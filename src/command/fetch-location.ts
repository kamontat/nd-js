/**
 * @external
 * @module commander.command
 */

import { ListrController } from "../helpers/listr";

export default (location: string, _: { [key: string]: any }) => {
  return new ListrController().addLoadLocalPath(`Build novel from ${location}`, location, {});
};
