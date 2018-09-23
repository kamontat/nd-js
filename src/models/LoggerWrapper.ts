import chalk from "chalk";
import { HeaderSize } from "../constants/output.const";
import { inspect } from "util";
import { COLOR } from "../constants/default.const";

type level = "error" | "warn" | "info" | "verbose" | "debug" | "silly";

export const WrapTitleMessage = (level: level, title: string, message: any) => {
  return {
    level: level,
    message: `${title.padEnd(HeaderSize)}: ${message instanceof Object ? inspect(message, false, 1, COLOR) : message}`
  };
};
export const WrapTM = WrapTitleMessage;

export const WrapTitleMessageColor = (
  level: level,
  title: any,
  message: any,
  theme?: { title: string; message: string }
) => {
  if (!theme) {
    theme = {
      title: "blue",
      message: "reset"
    };
  }
  return {
    level: level,
    message: `${title.padEnd(HeaderSize)}: ${message instanceof Object ? inspect(message, false, 1, COLOR) : message}`
  };
};
export const WrapTMC = WrapTitleMessageColor;
