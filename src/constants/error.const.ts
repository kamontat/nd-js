/**
 * @internal
 * @module nd.error.constant
 */

import { EError } from "../models/error/ErrorError";
import Throwable, { Exception } from "../models/error/Exception";
import { FError } from "../models/error/FailError";
import { NFError } from "../models/error/NotFoundError";
import { Warning } from "../models/error/Warning";

export const CONFIG_WARN: Throwable = new Warning("Config have warning message", 0);
export const PARAM_WARN: Throwable = new Warning("Parameter have warning message", 1);
export const OPTION_WARN: Throwable = new Warning("Option have warning message", 2);

export const NOVEL_WARN: Throwable = new Warning("Novel warning", 3);
export const CHAPTER_SOLD_WARN: Throwable = new Warning("This chapter is selling", 3 + 1);
export const CHAPTER_CLOSED_WARN: Throwable = new Warning("This chapter is closed", 3 + 2);
export const CHAPTER_NOTFOUND_WARN: Throwable = new Warning("This chapter is not exist", 3 + 3);

export const CONFIG_NOTFOUND_ERR: Throwable = new NFError("Config file not found", 0);
export const PARAM_NOTFOUND_ERR: Throwable = new NFError("Required parameter not exist", 1);
export const OPTION_NOTFOUND_ERR: Throwable = new NFError("Required parameter not exist", 2);
export const NOVEL_NOTFOUND_ERR: Throwable = new NFError("Required novel not found", 3);

export const CONFIG_CREATE_ERR: Throwable = new EError("Cannot create config file", 0);
export const PARAM_WRONG_ERR: Throwable = new EError("Wrong parameter", 1);
export const OPTION_WRONG_ERR: Throwable = new EError("Wrong option", 2);
export const DOWNLOAD_ERR: Throwable = new EError("Cannot download file", 4);
export const FILE_ERR: Throwable = new EError("Cannot save file", 5);

export const CONFIG_FAIL_ERR: Throwable = new FError("Cannot pass config file", 0);
export const PARAM_FAIL_ERR: Throwable = new FError("Fail to update by parameter", 1);
export const OPTION_FAIL_ERR: Throwable = new FError("Fail to update by option", 2);
export const NOVEL_ERR: Throwable = new FError("Cannot create a novel", 3);
export const SECURITY_FAIL_ERR: Throwable = new FError("You key is not pass security condition", 10);

export const WIP_ERR: Throwable = new Exception("This feature will coming soon", 255);
