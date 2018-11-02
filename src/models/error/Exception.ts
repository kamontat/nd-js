/**
 * @internal
 * @module nd.exception
 */

import { log } from "winston";

import { WrapTMC } from "../output/LoggerWrapper";

import { ExceptionStorage } from "./ExceptionStorage";

/**
 * This is the throwable interface, which use to contain more helper method than Error interface
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since Obtober 22, 2018
 */
export default interface Throwable extends Error {
  /**
   * Print the result and call {@link exit} method
   */
  printAndExit(): void;

  /**
   * This will exit the process (using {@link process.exit(code)}), if and only if the error isn't warning exception
   */
  exit(): void;

  /**
   * To check is the error is a warning error
   */
  warn(): boolean;

  /**
   * This will load cause error from parameter
   * @param e cause error
   */
  loadError(e: Error): Exception;
  /**
   * This will load cause message from parameter
   * @param e cause message
   */
  loadString(e: string): Exception;

  /**
   * Clone the exception, if the error may cause more than 1 place
   */
  clone(): Exception;

  /**
   * This will check is input error is same as current throwable
   * @param e another object
   */
  equal(e: any | undefined): boolean;
}

/**
 * The Exception will throw if nd error occurred.
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since Obtober 22, 2018
 */
export class Exception extends Error implements Throwable {
  /**
   * code is the error code if exception is not warning
   */
  code: number = 1;
  /**
   * description why error occurred
   */
  description: string = "";

  /**
   * This is flag, will be true if the exception occurred
   */
  get call() {
    return this._called;
  }

  protected _called: boolean = false;
  protected _warn: boolean = false;

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

    ExceptionStorage.CONST.add(this);
  }

  /**
   * This is flag is exception is warning
   */
  warn = () => {
    return this._warn;
  };

  /**
   * Call this when exception be throw. This will automatic call if you print the result out
   */
  save = () => {
    this._called = true;
  };

  /**
   * reset the exception to no call again
   */
  reset = () => {
    this._called = false;
  };

  /**
   * Helper method, for print and exit if not warning
   */
  printAndExit = () => {
    this.save();

    if (this.warn()) {
      log(WrapTMC("warn", "Warning", this.stack ? this.stack : this.message));
    } else {
      log(WrapTMC("error", "Error", this.stack ? this.stack : this.message));
    }
    this.exit();
  };

  /**
   * Exit the process if not warning exception
   */
  exit = () => {
    if (!this.warn()) {
      process.exit(this.code);
    }
  };

  /**
   * @inheritdoc
   */
  loadError = (e: Error) => {
    this.message = `${this.description} cause by "${e.message}"`;
    return this;
  };

  /**
   * @inheritdoc
   */
  loadString = (message: string) => {
    this.message = `${this.description} cause by "${message}"`;
    return this;
  };

  /**
   * @inheritdoc
   */
  clone = (): Exception => {
    return this;
  };

  /**
   * @inheritdoc
   */
  equal = (e: any | undefined): boolean => {
    if (!e) return false;
    return e.code === this.code;
  };
}
