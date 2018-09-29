import { transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import {
  CONST_DEFAULT_LOGGER_LEVEL,
  CONST_DEFAULT_COLOR,
  CONST_DEFAULT_QUIET,
  CONST_DEFAULT_LOG_FILE_EXIST,
  CONST_DEFAULT_LOG_FOLDER,
  CONST_DEFAULT_LOG_TYPE
} from "../constants/default.const";
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
  const levelPadding = !CONST_DEFAULT_COLOR ? 8 : 18;
  if (CONST_DEFAULT_LOG_TYPE === "long") {
    return `${info.level.padEnd(levelPadding)} ${info.timestamp}
${info.message}
`;
  } else if (CONST_DEFAULT_LOG_TYPE === "short") {
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
    level: CONST_DEFAULT_LOGGER_LEVEL,
    color: CONST_DEFAULT_COLOR,
    quiet: CONST_DEFAULT_QUIET,
    log: { has: CONST_DEFAULT_LOG_FILE_EXIST, folder: CONST_DEFAULT_LOG_FOLDER }
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
