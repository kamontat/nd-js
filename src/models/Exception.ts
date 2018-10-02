/**
 * @internal
 * @module nd.exception
 */

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

  constructor(title: string, code?: number, shift?: number) {
    super(title);
    Error.captureStackTrace(this, this.constructor);

    this.description = title;

    if (code) {
      this.code = code;
    }
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
  constructor(title: string, shift?: number) {
    super(title, 10, shift);
  }

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
  constructor(title: string, shift?: number) {
    super(title, 30, shift);
  }

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
  constructor(title: string, shift?: number) {
    super(title, 50, shift);
  }

  clone = (): Exception => {
    let n = new FError(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}

export class Warning extends Exception {
  warn = true;

  constructor(title: string, shift?: number) {
    super(title, 100, shift);
  }

  clone = (): Exception => {
    let n = new Warning(this.message);
    n.code = this.code;
    n.description = this.description;
    n.warn = this.warn;
    return n;
  };
}
