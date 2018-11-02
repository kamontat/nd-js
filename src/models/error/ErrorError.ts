/**
 * @internal
 * @module nd.exception
 */

import { Exception } from "./Exception";

/**
 * EError is error or wrong input
 */
export class EError extends Exception {
  constructor(title: string, shift?: number) {
    super(title, 30, shift);
  }

  public clone = (): Exception => {
    const n = new EError(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}
