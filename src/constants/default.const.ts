export let DEFAULT_LOGGER_LEVEL = "info";
export const BeChangeLevel = (level: string) => {
  DEFAULT_LOGGER_LEVEL = level;
};

export let DEFAULT_COLOR = true;
export const BeColor = (color: boolean) => {
  DEFAULT_COLOR = color;
};

export let DEFAULT_QUIET = false;
export const BeQuiet = () => {
  DEFAULT_QUIET = true;
};

export let DEFAULT_LOG_FILE_EXIST = true;
export const BeLog = (has: boolean) => {
  DEFAULT_LOG_FILE_EXIST = has;
};

export let DEFAULT_LOG_FOLDER = "/tmp/nd";
export const BeLoggerTo = (folder: string) => {
  DEFAULT_LOG_FOLDER = folder;
};

export let DEFAULT_LOG_TYPE: "long" | "short" = "short";
export let BeShortOutput = () => {
  DEFAULT_LOG_TYPE = "short";
};
export let BeLongOutput = () => {
  DEFAULT_LOG_TYPE = "long";
};
