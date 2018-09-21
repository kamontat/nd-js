export let LOGGER_LEVEL = "info";
export const ChangeLevel = (level: string) => {
  LOGGER_LEVEL = level;
};

export let COLOR = true;
export const SetColor = (noColor: boolean) => {
  COLOR = !noColor;
};
