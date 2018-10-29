import { log } from "winston";

import { WrapTMC } from "../LoggerWrapper";

import { Exception } from "./Exception";

export class ExceptionStorage {
  constructor() {}

  public exceptions: Exception[] = [];

  public add(exception: Exception) {
    this.exceptions.push(exception);
  }

  public list() {
    return this.exceptions.filter(e => e.call);
  }

  public print() {
    log(WrapTMC("warn", "Exception", "---------------"));
    this.list().forEach((v, i) => log(WrapTMC(v.warn ? "warn" : "error", `Exception ${i}`, v.message)));
  }

  public reset() {
    this.exceptions.forEach(exp => exp.reset());
  }
  public static CONST = new ExceptionStorage();
}
