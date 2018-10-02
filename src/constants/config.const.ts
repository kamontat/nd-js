/**
 * @internal
 * @module nd.config
 */

import os from "os";
import path from "path";

const home = os.homedir();

export const ND_FOLDER_NAME = ".nd";

export const ND_FOLDER_PATH = path.join(home, ND_FOLDER_NAME);

export const CONFIG_EXTENSION = "yml";

export const CONFIG_FOLDER_PATH = path.join(ND_FOLDER_PATH, "config");

export const CONFIG_FILE_PATH = path.join(CONFIG_FOLDER_PATH, `default.${CONFIG_EXTENSION}`);

export const LOG_EXTENSION = "log";

export const LOG_FOLDER = path.join(ND_FOLDER_PATH, "log");
