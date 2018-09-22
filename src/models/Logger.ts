import { transports, format } from "winston";
import DailyRotateFile from "winston-daily-rotate-file";

import { LOGGER_LEVEL, COLOR, QUIET, HAS_LOG, LOGGER_FOLDER } from "../constants/defaultConst";
import { Format } from "logform";

const { splat, colorize, simple, timestamp, printf } = format;
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

// [timestamp]
const customLog = format((info, opt) => {
  // if (opt.start) console.log(info);
  // console.log(opt);
  return info;
});

const customJSON = printf(info => {
  return JSON.stringify(info, undefined, "  ");
});

const customTimestamp = timestamp({ format: "DD-MM-YYYY HH-mm-ss" });

// TODO: update logger
export default (
  option: LogOption = { level: LOGGER_LEVEL, color: COLOR, quiet: QUIET, log: { has: HAS_LOG, folder: LOGGER_FOLDER } }
) => {
  let consoleFormat: Format[] = [];
  let fileFormat: Format[] = [];

  if (option.color) consoleFormat.push(colorize());
  consoleFormat.push(customTimestamp, customLog());

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

// TODO: Add colors using colors https://github.com/Marak/colors.js
