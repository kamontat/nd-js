export let LOGGER_LEVEL = "info";
export const ChangeLevel = (level: string) => {
  LOGGER_LEVEL = level;
};

export let COLOR = true;
export const SetColor = (noColor: boolean) => {
  COLOR = !noColor;
};

export let QUIET = false;
export const BeQuiet = () => {
  QUIET = true;
};

export let HAS_LOG = true;
export const NoLog = () => {
  HAS_LOG = false;
};

export let LOGGER_FOLDER = "/tmp/nd";
export const LoggerTo = (folder: string) => {
  LOGGER_FOLDER = folder;
};
