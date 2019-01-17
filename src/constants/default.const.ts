/**
 * @external
 * @module output.logger.constant
 */

import { resolve } from "path";

import { DIR_LOG_PATH } from "./file.const";

export let LOGGER_LEVEL = "verbose";
export const BeChangeLevel = (level: string) => (LOGGER_LEVEL = level);

export let HAS_COLOR = true;
export const BeColor = (color: boolean) => (HAS_COLOR = color);

export let IS_QUIET = false;
export const BeQuiet = () => (IS_QUIET = true);

export let HAS_LOG_FILE = true;
export const BeLog = (has: boolean) => (HAS_LOG_FILE = has);

export let LOG_FOLDER_PATH = resolve(DIR_LOG_PATH); // Default is a $TMPDIR variable

export const BeLoggerTo = (folder: string) => {
  // log(WrapTM("debug", "Change default log location", `Update ${LOG_FOLDER_PATH} => ${folder}`));
  LOG_FOLDER_PATH = folder;
};

export let LOG_TYPE: "long" | "short" = "short";
export let BeShortOutput = () => (LOG_TYPE = "short");
export let BeLongOutput = () => (LOG_TYPE = "long");
