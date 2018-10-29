/**
 * @internal
 * @module nd.exception
 */

import { Exception } from "./Exception";

/**
 * NFError is not found error
 */
export class NFError extends Exception {
  constructor(title: string, shift?: number) {
    super(title, 10, shift);
  }

  public clone = (): Exception => {
    const n = new NFError(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}
