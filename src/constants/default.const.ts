/**
 * @external
 * @module commander.const
 */

export let LOGGER_LEVEL = "info";
export const BeChangeLevel = (level: string) => (LOGGER_LEVEL = level);

export let HAS_COLOR = true;
export const BeColor = (color: boolean) => (HAS_COLOR = color);

export let IS_QUIET = false;
export const BeQuiet = () => (IS_QUIET = true);

export let HAS_LOG_FILE = true;
export const BeLog = (has: boolean) => (HAS_LOG_FILE = has);

export let LOG_FOLDER_PATH = "/tmp/nd";
export const BeLoggerTo = (folder: string) => (LOG_FOLDER_PATH = folder);

export let LOG_TYPE: "long" | "short" = "short";
export let BeShortOutput = () => (LOG_TYPE = "short");
export let BeLongOutput = () => (LOG_TYPE = "long");
