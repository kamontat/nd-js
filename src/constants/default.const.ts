export let CONST_DEFAULT_LOGGER_LEVEL = "info";
export const BeChangeLevel = (level: string) => (CONST_DEFAULT_LOGGER_LEVEL = level);

export let CONST_DEFAULT_COLOR = true;
export const BeColor = (color: boolean) => (CONST_DEFAULT_COLOR = color);

export let CONST_DEFAULT_QUIET = false;
export const BeQuiet = () => (CONST_DEFAULT_QUIET = true);

export let CONST_DEFAULT_LOG_FILE_EXIST = true;
export const BeLog = (has: boolean) => (CONST_DEFAULT_LOG_FILE_EXIST = has);

export let CONST_DEFAULT_LOG_FOLDER = "/tmp/nd";
export const BeLoggerTo = (folder: string) => (CONST_DEFAULT_LOG_FOLDER = folder);

export let CONST_DEFAULT_LOG_TYPE: "long" | "short" = "short";
export let BeShortOutput = () => (CONST_DEFAULT_LOG_TYPE = "short");
export let BeLongOutput = () => (CONST_DEFAULT_LOG_TYPE = "long");
