/**
 * @internal
 * @module nd.error.model
 */

import { Exception } from "./Exception";

/**
 * Warning is one kind of error, but this can gonna exit the program.
 */
export class Warning extends Exception {
  constructor(title: string, shift?: number) {
    super(title, 100, shift);
  }
  public _warn = true;

  public clone = (): Exception => {
    const n = new Warning(this.message);
    n.code = this.code;
    n.description = this.description;
    n._warn = this.warn();
    return n;
  };
}
