import chalk, { Chalk } from "chalk";
import { HeaderSize } from "../constants/output.const";
import { inspect } from "util";
import { DEFAULT_COLOR } from "../constants/default.const";
import { DEFAULT_TITLE_COLOR } from "../constants/color.const";

type level = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export const WrapTitleMessage = (level: level, title: string, message: any) => {
  title = title.charAt(0).toUpperCase() + title.slice(1);
  return {
    level: level,
    message: `${title.padEnd(HeaderSize)}: ${
      message instanceof Object ? inspect(message, false, 1, DEFAULT_COLOR) : message
    }`
  };
};
export const WrapTM = WrapTitleMessage;

export const WrapTitleMessageColor = (
  level: level,
  title: any,
  message: any,
  theme?: { title: Chalk; message: string }
) => {
  title = title.charAt(0).toUpperCase() + title.slice(1);
  if (!theme) {
    theme = {
      title: DEFAULT_TITLE_COLOR,
      message: "reset"
    };
  }

  return {
    level: level,
    message: `${theme.title(title.padEnd(HeaderSize))}: ${
      message instanceof Object ? inspect(message, false, 1, DEFAULT_COLOR) : message
    }`
  };
};
export const WrapTMC = WrapTitleMessageColor;
