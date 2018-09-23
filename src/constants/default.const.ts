export let LOGGER_LEVEL = "info";
export const BeChangeLevel = (level: string) => {
  LOGGER_LEVEL = level;
};

export let COLOR = true;
export const BeColor = (color: boolean) => {
  COLOR = color;
};

export let QUIET = false;
export const BeQuiet = () => {
  QUIET = true;
};

export let HAS_LOG = true;
export const BeLog = (has: boolean) => {
  HAS_LOG = has;
};

export let LOGGER_FOLDER = "/tmp/nd";
export const BeLoggerTo = (folder: string) => {
  LOGGER_FOLDER = folder;
};

export let OUTPUT_TYPE: "long" | "short" = "short";
export let BeShortOutput = () => {
  OUTPUT_TYPE = "short";
};
export let BeLongOutput = () => {
  OUTPUT_TYPE = "long";
};
