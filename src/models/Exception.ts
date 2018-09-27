import { log } from "winston";
import { WrapTMC } from "./LoggerWrapper";

export default interface Throwable extends Error {
  exit(): void;

  loadError(e: Error): Exception;
  loadString(e: string): Exception;

  clone(): Exception;
}

export class Exception extends Error implements Throwable {
  code: number = 1;
  description: string = "";
  warn: boolean = false;

  constructor(title: string, shift?: number) {
    super(title);
    Error.captureStackTrace(this, this.constructor);

    this.description = title;

    if (shift) {
      this.code += shift;
    }
  }

  printAndExit = () => {
    if (this.warn) {
      log(WrapTMC("warn", "Warning", this.message));
    } else {
      log(WrapTMC("error", "Error", this.message));
    }
    this.exit();
  };

  exit = () => {
    if (!this.warn) {
      process.exit(this.code);
    }
  };

  loadError = (e: Error) => {
    this.message = `${this.description} cause by "${e.message}"`;
    return this;
  };

  loadString = (message: string) => {
    this.message = `${this.description} cause by "${message}"`;
    return this;
  };

  clone = (): Exception => {
    return this;
  };
}

/**
 * NFError is not found error
 */
export class NFError extends Exception {
  code = 10;

  clone = (): Exception => {
    let n = new NFError(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}

/**
 * EError is error or wrong input
 */
export class EError extends Exception {
  code = 20;

  clone = (): Exception => {
    let n = new EError(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}

/**
 * FError is fail to do something
 */
export class FError extends Exception {
  code = 40;

  clone = (): Exception => {
    let n = new FError(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}

export class Warning extends Exception {
  code = 100;
  warn = true;

  clone = (): Exception => {
    let n = new Warning(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}
