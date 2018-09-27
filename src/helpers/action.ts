import { log } from "winston";

import { WrongParameterError } from "../constants/error.const";
import { Exception } from "../models/Exception";
import { WrapTMC, WrapTM } from "../models/LoggerWrapper";

/**
 * Helper for {@link IfValidate} function
 *
 * @param a first argument
 * @param b second argument
 *
 */
export const VALID_MATCH_SOME = (a: any[], b: any[]) => {
  return b.some(v => v === (a[0] === undefined ? "" : a[0]));
};

/**
 * Helper for {@link IfValidate} function
 *
 * @param a first argument
 * @param b second argument
 */
export const VALID_LENGTH = (a: any[], b: number) => {
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
export const ACTION_VALIDATE = (args: any[], validFn: (a: any[], b: any) => boolean, expected: any) => {
  if (!validFn(args, expected)) {
    return WrongParameterError.clone().loadString(`Expected [${expected}] but got [${args}]`);
  }
  return;
};

/**
 * This will check is exception exist, and throw + exit command
 *
 * @param e exception to be throw if exist
 */
export const ACTION_THROW_IF = (e?: Exception) => {
  if (e) {
    e.printAndExit();
  }
};

/**
 * This will seperate argument to args and options.
 * You can use this function on the top of action function.
 *
 * @param a argument from action function
 *
 */
export const ACTION_SEPERATE_ARGUMENT = (a: any[]) => {
  let cmd: { [key: string]: any } = a.filter(v => typeof v === "object")[0];
  let args: string[] = a.filter(v => typeof v === "string").map(v => v.toString());

  log(WrapTMC("silly", "option", cmd));
  log(WrapTMC("debug", "argument", args));

  return {
    options: cmd,
    args: args
  };
};
