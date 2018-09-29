import os from "os";
import path from "path";

const home = os.homedir();

export const CONST_DEFAULT_FOLDER_NAME = ".nd";

export const CONST_DEFAULT_FOLDER = path.join(home, CONST_DEFAULT_FOLDER_NAME);

export const CONST_DEFAULT_CONFIG_EXTENSION = "yml";

export const CONST_DEFAULT_CONFIG_FOLDER = path.join(CONST_DEFAULT_FOLDER, "config");

export const CONST_DEFAULT_CONFIG_FILE = path.join(
  CONST_DEFAULT_CONFIG_FOLDER,
  `default.${CONST_DEFAULT_CONFIG_EXTENSION}`
);

export const CONST_DEFAULT_LOG_EXTENSION = "log";

export const CONST_DEFAULT_LOG_FOLDER = path.join(CONST_DEFAULT_FOLDER, "log");
