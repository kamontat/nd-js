/**
 * @external
 * @module output.constant
 */

import fs from "fs";
import { tmpdir } from "os";
import path from "path";

import { ND } from "./nd.const";

export const DIR_ND_ROOT_NAME = ND.PROJECT_NAME;
export const DIR_ND_ROOT_PATH = path.join(tmpdir(), DIR_ND_ROOT_NAME);

export const DIR_TMP_NAME = "tmp";
export const DIR_TMP_PATH = path.join(DIR_ND_ROOT_PATH, DIR_TMP_NAME);

export const DIR_TMP_RANDOM = fs.mkdtempSync(path.join(DIR_TMP_PATH, "nd-"));
if (!fs.existsSync(DIR_TMP_RANDOM))
  fs.mkdirSync(DIR_TMP_RANDOM, { recursive: true });

// TODO: change log to this folder
export const DIR_LOG_NAME = "logs";
export const DIR_LOG_PATH = path.join(DIR_ND_ROOT_PATH, DIR_LOG_NAME);
if (!fs.existsSync(DIR_LOG_PATH))
  fs.mkdirSync(DIR_LOG_PATH, { recursive: true });
