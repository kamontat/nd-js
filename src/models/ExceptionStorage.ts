/**
 * @internal
 * @module nd.exception
 */

import { Exception } from "./Exception";
import { log } from "winston";
import { WrapTMC } from "./LoggerWrapper";

/**
 * Exception storage, will keep all created exception from the begin process until the end of process.
 * This will use call method to define is exception be called.
 *
 * This implement as singleton class, you can use the class object by {@link CONST} propoty
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since Obtober 23, 2018
 */
export class ExceptionStorage {
  /**
   * Singleton object of this storage
   */
  static CONST = new ExceptionStorage();

  exceptions: Exception[] = [];

  constructor() {}

  /**
   * This will auto call in constructor of {@link Exception}
   * @param exception new exception
   */
  add(exception: Exception) {
    this.exceptions.push(exception);
  }

  /**
   * List called exception
   */
  list() {
    return this.exceptions.filter(e => e.call);
  }

  /**
   * Print this result to winston logger
   */
  print() {
    log(WrapTMC("warn", "Exception", "---------------"));
    this.list().forEach((v, i) => log(WrapTMC(v.warn ? "warn" : "error", `Exception ${i}`, v.message)));
  }

  /**
   * reset all exception in storage
   */
  reset() {
    this.exceptions.forEach(exp => exp.reset());
  }
}
