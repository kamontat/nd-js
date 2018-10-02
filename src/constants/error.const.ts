/**
 * @internal
 * @module nd.exception
 */

import Throwable, { NFError, EError, FError, Warning } from "../models/Exception";

export const CONFIG_WARN: Throwable = new Warning("Config have warning message", 0);
export const CONFIG_NOTFOUND_ERR: Throwable = new NFError("Config file not found", 0);
export const CONFIG_CREATE_ERR: Throwable = new EError("Cannot create config file", 0);
export const CONFIG_FAIL_ERR: Throwable = new FError("Cannot pass config file", 0);

export const PARAM_WARN: Throwable = new Warning("Parameter have warning message", 1);
export const PARAM_NOTFOUND_ERR: Throwable = new NFError("Required parameter not exist", 1);
export const PARAM_WRONG_ERR: Throwable = new EError("Wrong parameter", 1);

export const OPTION_WARN: Throwable = new Warning("Option have warning message", 2);
export const OPTION_WRONG_ERR: Throwable = new EError("Wrong option", 2);
export const OPTION_FAIL_ERR: Throwable = new FError("Fail to update by option", 2);

export const NOVEL_WARN: Throwable = new Warning("Novel have warning message", 3);
export const NOVEL_NOTFOUND_ERR: Throwable = new NFError("Required novel not found", 3);
export const NOVEL_ERR: Throwable = new FError("Cannot create the novel", 3);

export const DOWNLOAD_ERR: Throwable = new EError("Cannot download file", 4);
