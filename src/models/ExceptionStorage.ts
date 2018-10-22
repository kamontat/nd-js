import { Exception } from "./Exception";
import { log } from "winston";
import { WrapTMC } from "./LoggerWrapper";

export class ExceptionStorage {
  static CONST = new ExceptionStorage();

  exceptions: Exception[] = [];

  constructor() {}

  add(exception: Exception) {
    this.exceptions.push(exception);
  }

  list() {
    return this.exceptions.filter(e => e.called);
  }

  print() {
    log(WrapTMC("warn", "Exception", "---------------"));
    this.list().forEach((v, i) => log(WrapTMC(v.warn ? "warn" : "error", `Exception ${i}`, v.message)));
  }

  reset() {
    this.exceptions.forEach(exp => (exp.called = false));
  }
}
