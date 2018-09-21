import os from "os";
import path from "path";

const home = os.homedir();

export const DEFAULT_FOLDER_NAME = ".nd";

export const DEFAULT_FOLDER = path.join(home, DEFAULT_FOLDER_NAME);

export const DEFAULT_CONFIG_EXTENSION = "yml";

export const DEFAULT_CONFIG_FOLDER = path.join(DEFAULT_FOLDER, "config");

export const DEFAULT_CONFIG_FILE = path.join(DEFAULT_CONFIG_FOLDER, `default.${DEFAULT_CONFIG_EXTENSION}`);

export const DEFAULT_LOG_EXTENSION = "log";

export const DEFAULT_LOG_FOLDER = path.join(DEFAULT_FOLDER, "log");
