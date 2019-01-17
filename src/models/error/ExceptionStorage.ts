/**
 * @internal
 * @module nd.error.controller
 */

import { log } from "winston";

import { WrapTMC } from "../../apis/loggerWrapper";
import { PrintHeader } from "../output/header";

import { Exception } from "./Exception";

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
  constructor() {}

  public exceptions: Exception[] = [];

  /**
   * This will auto call in constructor of {@link Exception}
   * @param exception new exception
   */
  public add(exception: Exception) {
    this.exceptions.push(exception);
  }

  /**
   * List called exception
   */
  public list() {
    return this.exceptions.filter(e => e.call);
  }

  public print() {
    const list = this.list();
    if (list.length > 0) PrintHeader("Exception", { level: "warn" });
    list.forEach((v, i) =>
      log(WrapTMC(v.warn ? "warn" : "error", `Exception ${i}`, v.message)),
    );
  }

  /**
   * reset all exception in storage
   */
  public reset() {
    this.exceptions.forEach(exp => exp.reset());
  }
  /**
   * Singleton object of this storage
   */
  public static CONST = new ExceptionStorage();
}
