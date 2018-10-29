/**
 * @external
 * @module commander.option
 */

/**
 * COption is the custom option for commander option
 */
export interface COption {
  name: string;
  desc: string;
  default?: any;
  fn?(arg1: any, arg2: any): void;
}
