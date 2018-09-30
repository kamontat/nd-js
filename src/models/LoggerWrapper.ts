import chalk, { Chalk } from "chalk";
import { CONST_DEFAULT_LOG_HEADER_SIZE } from "../constants/output.const";
import { inspect } from "util";
import { CONST_DEFAULT_COLOR } from "../constants/default.const";
import { TITLE_COLOR, CONST_DEFAULT_COLORS } from "../constants/color.const";
import { ColorType } from "./Color";

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
  theme?: { title: ColorType; message: ColorType }
) => {
  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (!theme) {
    theme = {
      title: CONST_DEFAULT_COLORS.Title,
      message: CONST_DEFAULT_COLORS.String
    };
  }

  return WrapTitleMessage(level, theme.title.formatColor(title), theme.message.formatColor(message), true);
};
export const WrapTMC = WrapTitleMessageColor;

export const WrapTitleMessageColorType = (
  level: level,
  title: any,
  message: any,
  theme?: { title?: ColorType; message?: ColorType }
) => {
  if (!theme) return WrapTitleMessageColor(level, title, ColorType.colorize(message));
  const newTitle = theme.title ? theme.title.formatColor(title) : CONST_DEFAULT_COLORS.Title.formatColor(title);
  const newMessage = theme.message ? theme.message.formatColor(message) : ColorType.colorize(message);

  return WrapTitleMessage(level, newTitle, newMessage, true);
};
export const WrapTMCT = WrapTitleMessageColorType;
