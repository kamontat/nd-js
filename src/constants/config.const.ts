/**
 * @internal
 * @module nd.config.constant
 */

import os from "os";
import path from "path";

export const GIT_USERNAME = "kamontat";
export const GIT_REPONAME = "nd-js";

const home = os.homedir();

export const ND_FOLDER_NAME = ".nd";

export const ND_FOLDER_PATH = path.join(home, ND_FOLDER_NAME);

export const CONFIG_EXTENSION = "yml";

export const CONFIG_FOLDER_PATH = process.env.NODE_CONFIG_DIR || path.join(ND_FOLDER_PATH, "config");

export const CONFIG_FILE_PATH = path.join(CONFIG_FOLDER_PATH, `default.${CONFIG_EXTENSION}`);

export const LOG_EXTENSION = "log";

export const LOG_FOLDER = path.join(ND_FOLDER_PATH, "log");
