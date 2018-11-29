/**
 * @external
 * @module commander.api
 */

import { log } from "winston";

import { WrapTM, WrapTMC } from "../apis/loggerWrapper";
import { PARAM_WRONG_ERR } from "../constants/error.const";
import Throwable, { Exception } from "../models/error/Exception";

/**
 * Helper for {@link IfValidate} function
 *
 * @param a first argument
 * @param b second argument
 *
 */
export const ByMatchSome = (a: any[], b: any[]) => {
  return b.some(v => v === (a[0] === undefined ? "" : a[0]));
};

/**
 * Helper for {@link IfValidate} function
 *
 * @param a first argument
 * @param b second argument
 */
export const ByLength = (a: any[], b: number) => {
  return a.length === b;
};

/**
 * Check argument is validate
 *
 * @param args arguments from action function
 * @param validFn validate function see more on this file
 * @param expected expected result
 *
 * @return exception if error occurred, this method can be use with {@link WillThrow}
 */
export const ValidList = (
  args: any[],
  validFn: (a: any[], b: any) => boolean,
  expected: any,
): Exception | undefined => {
  if (!validFn(args, expected)) {
    return PARAM_WRONG_ERR.clone().loadString(
      `Expected [${expected}] but got [${args}]`,
    );
  }
  return;
};

/**
 * This will check is exception exist, and throw + exit command
 *
 * @param e exception to be throw if exist
 */
export const ThrowIf = (e?: Throwable, option?: { noExit?: boolean }) => {
  if (!option || (option && option.noExit === undefined))
    option = { noExit: false };

  if (e) {
    // print the result
    if (e.print) e.print();
    else log(WrapTM("error", "Error", e.stack ? e.stack : e.message));
    // exit if have to
    if (!option.noExit) {
      if (e.exit) e.exit();
      else process.exit(1);
    }
  }
};

export const SaveIf = (e?: Exception) => {
  if (e && e.save) {
    e.save();
  }
};

export const Throw = (e: Throwable, message?: string) => {
  if (message) {
    e.loadString(message);
  }
  ThrowIf(e);
};

/**
 * This will seperate argument to args and options.
 * You can use this function on the top of action function.
 *
 * @param a argument from action function
 *
 */
export const SeperateArgumentApi = <T = string>(a: any[]) => {
  const cmd: { [key: string]: any } = a.filter(v => typeof v === "object")[0];
  const args: T[] = a.filter(v => typeof v === "string").map(v => v.toString());

  log(WrapTMC("silly", "option", cmd));
  log(WrapTMC("debug", "argument", args));

  return {
    options: cmd,
    args,
  };
};
