/**
 * @internal
 * @module nd.error.model
 */

import { log } from "winston";

import { WrapTMC } from "../../apis/loggerWrapper";
import { ND } from "../../constants/nd.const";

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
   * Print the result via winston logger
   */
  print(): void;

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
   * code is the error code if exception is not warning
   */
  public code: number = 1;
  /**
   * description why error occurred
   */
  public description: string = "";

  /**
   * This is flag is exception is warning
   */
  public warn = () => {
    return this._warn;
  };

  /**
   * Call this when exception be throw. This will automatic call if you print the result out
   */
  public save = () => {
    this._called = true;
  };

  /**
   * reset the exception to no call again
   */
  public reset = () => {
    this._called = false;
  };

  public print = () => {
    const output = ND.isProd() ? this.message : this.stack ? this.stack : this.message;
    if (this.warn()) {
      log(WrapTMC("warn", "Warning", output));
    } else {
      log(WrapTMC("error", "Error", output));
    }
  };

  /**
   * Helper method, for print and exit if not warning
   */
  public printAndExit = () => {
    this.save();

    this.print();
    this.exit();
  };

  /**
   * Exit the process if not warning exception
   */
  public exit = () => {
    if (!this.warn()) {
      process.exit(this.code);
    }
  };

  /**
   * @inheritdoc
   */
  public loadError = (e: Error) => {
    this.message = `${this.description} cause by "${e.message}"`;
    return this;
  };

  /**
   * @inheritdoc
   */
  public loadString = (message: string) => {
    this.message = `${this.description} cause by "${message}"`;
    return this;
  };

  /**
   * @inheritdoc
   */
  public clone = (): Exception => {
    return this;
  };

  /**
   * @inheritdoc
   */
  public equal = (e: any | undefined): boolean => {
    if (!e) return false;
    return e.code === this.code;
  };
}
