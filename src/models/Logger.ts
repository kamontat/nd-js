import { transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import {
  DEFAULT_LOGGER_LEVEL,
  DEFAULT_COLOR,
  DEFAULT_QUIET,
  DEFAULT_LOG_FILE_EXIST,
  DEFAULT_LOG_FOLDER,
  DEFAULT_LOG_TYPE
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
  const levelPadding = !DEFAULT_COLOR ? 8 : 18;
  if (DEFAULT_LOG_TYPE === "long") {
    return `${info.level.padEnd(levelPadding)} ${info.timestamp}
${info.message}
`;
  } else if (DEFAULT_LOG_TYPE === "short") {
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
    level: DEFAULT_LOGGER_LEVEL,
    color: DEFAULT_COLOR,
    quiet: DEFAULT_QUIET,
    log: { has: DEFAULT_LOG_FILE_EXIST, folder: DEFAULT_LOG_FOLDER }
  }
) => {
  let consoleFormat: Format[] = [];
  let fileFormat: Format[] = [];

  if (option.color) consoleFormat.push(colorize());
  consoleFormat.push(customTimestamp, customLog);

  fileFormat.push(customTimestamp, customJSON);

  return {
    level: option.level,
    format: format.combine(...fileFormat),
    transports: [
      new Console({
        format: format.combine(...consoleFormat),
        level: option.level,
        stderrLevels: ["error", "warn"],
        silent: option.quiet
      }),
      new DailyRotateFile({
        json: true,
        dirname: option.log.folder,
        filename: "nd-%DATE%.log",
        datePattern: "MM-YYYY",
        zippedArchive: true,
        maxSize: "10m",
        maxFiles: "100"
      })
    ]
  };
};

// TODO: Add colors using chalk https://github.com/chalk/chalk
