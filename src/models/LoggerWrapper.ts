import chalk, { Chalk } from "chalk";
import { LOG_HEAD_SIZE } from "../constants/output.const";
import { inspect } from "util";
import { HAS_COLOR } from "../constants/default.const";
import { TITLE_COLOR, COLORS } from "../constants/color.const";
import { ColorType } from "./Color";

type level = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export const WrapTitleMessage = (level: level, title: string, message: any, color?: boolean) => {
  let headerShifting = LOG_HEAD_SIZE;
  if (color) headerShifting += 10;
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return {
    level: level,
    message: `${title.padEnd(headerShifting)}: ${
      message instanceof Object ? inspect(message, false, 1, HAS_COLOR) : message
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
      title: COLORS.Title,
      message: COLORS.String
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
  const newTitle = theme.title ? theme.title.formatColor(title) : COLORS.Title.formatColor(title);
  const newMessage = theme.message ? theme.message.formatColor(message) : ColorType.colorize(message);

  return WrapTitleMessage(level, newTitle, newMessage, true);
};
export const WrapTMCT = WrapTitleMessageColorType;
