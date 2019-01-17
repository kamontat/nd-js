/**
 * @external
 * @module output.logger.api
 */

import chalk from "chalk";
import { Format } from "logform";
import { format, log, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";
import * as Transport from "winston-transport";

import {
  HAS_COLOR,
  HAS_LOG_FILE,
  IS_QUIET,
  LOG_FOLDER_PATH,
  LOG_TYPE,
  LOGGER_LEVEL,
} from "../constants/default.const";

import { level } from "./loggerWrapper";

const { colorize, timestamp, printf } = format;
const { Console } = transports;

interface LogOption {
  level: string;
  color: boolean;
  quiet: boolean;
  log: {
    has: boolean;
    folder: string;
  };
}

const levelColor = {
  info: chalk.blueBright,
  warn: chalk.yellow,
  error: chalk.red,
  debug: chalk.reset,
  silly: chalk.reset,
  verbose: chalk.reset,
} as { [key in level]: any };

let alreadySetup = false;

// tslint:disable-next-line
export namespace Logger {
  /**
   * custom timestamp format to DD-MM-YYYY::HH.mm.ss
   */
  const time = timestamp({ format: "DD-MM-YYYY::HH.mm.ss" });

  /**
   * custom logger output in console
   */
  const customConsoleFormat = printf(info => {
    const levelPadding = !HAS_COLOR ? 8 : 18;
    if (LOG_TYPE === "long") {
      return `${info.level.padEnd(levelPadding)} ${info.timestamp}
  ${info.message}
  `;
    } else if (LOG_TYPE === "short") {
      return `[${levelColor[info.level as level](
        info.level.padEnd(levelPadding),
      )}] ${info.message}`;
    }
    return `${info.message}`;
  });

  /**
   * custom logger output in file
   */
  const customFileFormat = printf(info => {
    return JSON.stringify(
      { level: info.level, message: info.message, timestamp: info.timestamp },
      (_, value: string) => {
        if (typeof value === "string") {
          return value
            .replace(/\u001b\[.*?m/g, "") // color
            .replace(/\u001b\]8;;/g, "") // link
            .replace(/\u0007/g, " "); // link
        }
        return value;
      },
      "  ",
    );
  });

  const createConsole = (option: LogOption, formats: Format[]) => {
    return new Console({
      format: format.combine(...formats),
      level: "info", // option.level,
      stderrLevels: ["error", "warn"],
      silent: option.quiet,
    });
  };

  const createFile = (option: LogOption, formats: Format[]) => {
    return new DailyRotateFile({
      format: format.combine(...formats),
      level: option.level,
      json: true,
      dirname: option.log.folder,
      filename: "nd-%DATE%.log",
      datePattern: "DD-MM-YYYY",
      zippedArchive: true,
      maxSize: "10m",
      maxFiles: "100",
    });
  };

  export const setting = (
    option: LogOption = {
      level: LOGGER_LEVEL,
      color: HAS_COLOR,
      quiet: IS_QUIET,
      log: { has: HAS_LOG_FILE, folder: LOG_FOLDER_PATH },
    },
  ) => {
    if (alreadySetup) {
      return undefined;
    }
    alreadySetup = true;

    // setup console log
    const console = [time, customConsoleFormat];

    // tslint:disable-next-line
    if (option.color) console.push(colorize());

    // setup file log
    const file = [time, customFileFormat];

    // setup transport to console and file
    const transports: Transport[] = [createConsole(option, console)];
    if (option.log.has) transports.push(createFile(option, file));

    // return result
    return {
      level: option.level,
      transports,
    };
  };

  export const show = log;
}
