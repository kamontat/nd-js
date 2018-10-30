/**
 * @external
 * @module logger
 */

import { Format } from "logform";
import { format, transports } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import {
  HAS_COLOR,
  HAS_LOG_FILE,
  IS_QUIET,
  LOG_FOLDER_PATH,
  LOG_TYPE,
  LOGGER_LEVEL
} from "../../constants/default.const";

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

const customLog = printf(info => {
  const levelPadding = !HAS_COLOR ? 8 : 18;
  if (LOG_TYPE === "long") {
    return `${info.level.padEnd(levelPadding)} ${info.timestamp}
${info.message}
`;
  } else if (LOG_TYPE === "short") {
    return `[${info.level.padEnd(levelPadding)}] ${info.message}`;
  }
  return `${info.message}`;
});

const customJSON = printf(info => {
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
    "  "
  );
});

const customTimestamp = timestamp({ format: "DD-MM-YYYY::HH.mm.ss" });

let called = false;

export default (
  option: LogOption = {
    level: LOGGER_LEVEL,
    color: HAS_COLOR,
    quiet: IS_QUIET,
    log: { has: HAS_LOG_FILE, folder: LOG_FOLDER_PATH }
  }
) => {
  if (called) {
    return undefined;
  } else {
    called = true;
  }

  const consoleFormat: Format[] = [];
  const fileFormat: Format[] = [];

  if (option.color) {
    consoleFormat.push(colorize());
  }
  consoleFormat.push(customTimestamp, customLog);

  fileFormat.push(customTimestamp, customJSON);

  const transports = [];

  transports.push(
    new Console({
      format: format.combine(...consoleFormat),
      level: "info", // option.level,
      stderrLevels: ["error", "warn"],
      silent: option.quiet
    })
  );

  if (option.log.has) {
    transports.push(
      new DailyRotateFile({
        format: format.combine(...fileFormat),
        level: option.level,
        json: true,
        dirname: option.log.folder,
        filename: "nd-%DATE%.log",
        datePattern: "DD-MM-YYYY",
        zippedArchive: true,
        maxSize: "10m",
        maxFiles: "100"
      })
    );
  }

  return {
    level: option.level,
    transports
  };
};

// TODO: Add colors using chalk https://github.com/chalk/chalk
