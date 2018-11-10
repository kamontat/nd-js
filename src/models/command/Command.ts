/**
 * @module commander.command
 */

import { COption } from "./Option";

/**
 * @external
 * CCommand is the custom command for commander command
 */
export interface CCommand {
  /**
   * Name of the command
   */
  name: string;

  /**
   * alias of the command (usually with use 1 character only)
   */
  alias: string;

  /**
   * description of the command in help option
   */
  desc: string;

  /**
   * Option of the command {@link COption}
   */
  options?: COption[];

  /**
   * This will called when user run the command
   * @param args function that will execute if user run the command
   */
  fn(...args: any[]): void;

  /**
   * set to `true`, if don't want the command in help option
   */
  noHelp?: boolean;
}
