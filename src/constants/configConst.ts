import os from "os";
import path from "path";

const home = os.homedir();

export const DEFAULT_CONFIG_NAME = ".nd";

export const DEFAULT_CONFIG_EXTENSION = "yml";

export const DEFAULT_CONFIG_FOLDER = path.join(home, DEFAULT_CONFIG_NAME, "config");

export const DEFAULT_CONFIG_FILE = path.join(DEFAULT_CONFIG_FOLDER, `default.${DEFAULT_CONFIG_EXTENSION}`);
