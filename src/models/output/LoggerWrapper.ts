/**
 * @external
 * @module logger
 */

import { inspect } from "util";

import { COLORS } from "../../constants/color.const";
import { HAS_COLOR } from "../../constants/default.const";
import { LOG_HEAD_SIZE } from "../../constants/output.const";

import { ColorType } from "./Color";

type level = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export const WrapTitleMessage = (level: level, title: string, message: any, color?: boolean) => {
  let headerShifting = LOG_HEAD_SIZE;
  if (color) {
    headerShifting += 10;
  }
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return {
    level,
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
  theme?: { title?: ColorType; message?: ColorType }
) => {
  title = title.charAt(0).toUpperCase() + title.slice(1);
  const titleTheme = theme && theme.title ? theme.title : COLORS.Title;
  const messageTheme = theme && theme.message ? theme.message : COLORS.String;

  return WrapTitleMessage(level, titleTheme.formatColor(title), messageTheme.formatColor(message), true);
};
export const WrapTMC = WrapTitleMessageColor;

export const WrapTitleMessageColorType = (
  level: level,
  title: any,
  message: any,
  theme?: { title?: ColorType; message?: ColorType }
) => {
  if (!theme) {
    return WrapTitleMessageColor(level, title, ColorType.colorize(message));
  }
  const newTitle = theme.title ? theme.title.formatColor(title) : COLORS.Title.formatColor(title);
  const newMessage = theme.message ? theme.message.formatColor(message) : ColorType.colorize(message);

  return WrapTitleMessage(level, newTitle, newMessage, true);
};
export const WrapTMCT = WrapTitleMessageColorType;
