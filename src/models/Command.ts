/**
 * @external
 * @module commander.command
 */

import { COption } from "./Option";

/**
 * CCommand is the custom command for commander command
 */
export type CCommand = {
  subcommand?: CCommand[];

  name: string;
  alias: string;
  desc: string;
  options?: COption[];
  fn: (...args: any[]) => void;
};
