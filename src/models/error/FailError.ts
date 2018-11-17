/**
 * @internal
 * @module nd.error.model
 */

import { Exception } from "./Exception";

/**
 * FError is fail to do something
 */
export class FError extends Exception {
  constructor(title: string, shift?: number) {
    super(title, 50, shift);
  }

  public clone = (): Exception => {
    const n = new FError(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}
