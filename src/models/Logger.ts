/**
 * @external
 * @module logger
 */

import { transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { LOGGER_LEVEL, HAS_COLOR, IS_QUIET, HAS_LOG_FILE, LOG_FOLDER_PATH, LOG_TYPE } from "../constants/default.const";
import { Format } from "logform";

const { colorize, timestamp, printf } = format;
const { Console } = transports;

type LogOption = {
  level: string;
  color: boolean;
  quiet: boolean;
  log: {
    has: boolean;
    folder: string;
  };
};

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
  return JSON.stringify(info, undefined, "  ");
});

const customTimestamp = timestamp({ format: "DD-MM-YYYY::HH.mm.ss" });

export default (
  option: LogOption = {
    level: LOGGER_LEVEL,
    color: HAS_COLOR,
    quiet: IS_QUIET,
    log: { has: HAS_LOG_FILE, folder: LOG_FOLDER_PATH }
  }
) => {
  let consoleFormat: Format[] = [];
  let fileFormat: Format[] = [];

  if (option.color) consoleFormat.push(colorize());
  consoleFormat.push(customTimestamp, customLog);

  fileFormat.push(customTimestamp, customJSON);

  let transports = [];

  transports.push(
    new Console({
      format: format.combine(...consoleFormat),
      level: option.level,
      stderrLevels: ["error", "warn"],
      silent: option.quiet
    })
  );

  if (option.log.has) {
    transports.push(
      new DailyRotateFile({
        json: true,
        dirname: option.log.folder,
        filename: "nd-%DATE%.log",
        datePattern: "MM-YYYY",
        zippedArchive: true,
        maxSize: "10m",
        maxFiles: "100"
      })
    );
  }

  return {
    level: option.level,
    format: format.combine(...fileFormat),
    transports: transports
  };
};

// TODO: Add colors using chalk https://github.com/chalk/chalk
