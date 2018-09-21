import { WrongParameterError } from "../constants/errorConst";
import winston = require("winston");
import { Exception } from "../models/Exception";

/**
 * This method will loop through args and check is subcommand exist
 *
 * @param args arguments (not include option)
 * @param subcommand command that wanted
 *
 * @return true if is subcommand, otherwise return false
 */
export const IsSubcommand = (args: string[], subcommand: string) => {
  return args.includes(subcommand);
};

/**
 * This will shift first element out.
 * be aware that input arguemnt will be changes too.
 *
 * @param args arguments for pass through subcommand argument
 *
 * @return result argument
 *
 */
export const SubcommandArgument = (args: string[]) => {
  args.shift();
  return args;
};

/**
 * Helper for {@link IfValidate} function
 *
 * @param a first argument
 * @param b second argument
 *
 */
export const MatchSome = (a: any[], b: any[]) => {
  return b.some(v => v === a[0]);
};

/**
 * Helper for {@link IfValidate} function
 *
 * @param a first argument
 * @param b second argument
 */
export const Length = (a: any[], b: number) => {
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
export const IfValidate = (args: any[], validFn: (a: any[], b: any) => boolean, expected: any) => {
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
export const WillThrow = (e?: Exception) => {
  if (e) {
    winston.error(e.message);
    e.exit();
  }
};

/**
 * This will seperate argument to args and options.
 * You can use this function on the top of action function.
 *
 * @param a argument from action function
 *
 */
export const SeperateArgument = (a: any[]) => {
  let cmd: { [key: string]: any } = a.filter(v => typeof v === "object")[0];
  let args: string[] = a.filter(v => typeof v === "string").map(v => v.toString());

  winston.verbose(`option: ${cmd}`);
  winston.verbose(`argument: [${args}]`);

  return {
    options: cmd,
    args: args
  };
};
