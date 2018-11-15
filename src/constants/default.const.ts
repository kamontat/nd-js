import { tmpdir } from "os";
import { resolve } from "path";
import { log } from "winston";

import { WrapTM } from "../apis/loggerWrapper";

/**
 * @external
 * @module output.logger.constant
 */

export let LOGGER_LEVEL = "verbose";
export const BeChangeLevel = (level: string) => (LOGGER_LEVEL = level);

export let HAS_COLOR = true;
export const BeColor = (color: boolean) => (HAS_COLOR = color);

export let IS_QUIET = false;
export const BeQuiet = () => (IS_QUIET = true);

export let HAS_LOG_FILE = true;
export const BeLog = (has: boolean) => (HAS_LOG_FILE = has);

export let LOG_FOLDER_PATH = resolve(tmpdir(), "nd"); // Default is a $TMPDIR variable
export const BeLoggerTo = (folder: string) => {
  // log(WrapTM("debug", "Change default log location", `Update ${LOG_FOLDER_PATH} => ${folder}`));
  LOG_FOLDER_PATH = folder;
};

export let LOG_TYPE: "long" | "short" = "short";
export let BeShortOutput = () => (LOG_TYPE = "short");
export let BeLongOutput = () => (LOG_TYPE = "long");
