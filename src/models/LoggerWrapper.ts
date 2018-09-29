import chalk, { Chalk } from "chalk";
import { CONST_DEFAULT_LOG_HEADER_SIZE } from "../constants/output.const";
import { inspect } from "util";
import { CONST_DEFAULT_COLOR } from "../constants/default.const";
import { CONST_DEFAULT_TITLE_COLOR } from "../constants/color.const";
import { ColorType, API_ADD_COLOR } from "../helpers/color";

type level = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export const WrapTitleMessage = (level: level, title: string, message: any, color?: boolean) => {
  let headerShifting = CONST_DEFAULT_LOG_HEADER_SIZE;
  if (color) headerShifting += 10;
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return {
    level: level,
    message: `${title.padEnd(headerShifting)}: ${
      message instanceof Object ? inspect(message, false, 1, CONST_DEFAULT_COLOR) : message
    }`
  };
};
export const WrapTM = WrapTitleMessage;

export const WrapTitleMessageColor = (
  level: level,
  title: any,
  message: any,
  theme?: { title: Chalk; message: Chalk }
) => {
  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (!theme) {
    theme = {
      title: CONST_DEFAULT_TITLE_COLOR,
      message: chalk.reset
    };
  }

  return WrapTitleMessage(level, theme.title(title), theme.message(message), true);
};
export const WrapTMC = WrapTitleMessageColor;

export const WrapTitleMessageColorType = (
  level: level,
  title: any,
  message: any,
  theme?: { title?: Chalk; message?: ColorType }
) => {
  if (theme && theme.title) {
    return WrapTitleMessage(level, theme.title(title), API_ADD_COLOR(message, theme.message), true);
  }
  return WrapTitleMessageColor(level, title, API_ADD_COLOR(message, theme && theme.message));
};
export const WrapTMCT = WrapTitleMessageColorType;
