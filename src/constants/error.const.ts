import Throwable, { NFError, EError, FError, Warning } from "../models/Exception";

export const ConfigWarning: Throwable = new Warning("Config have warning message", 0);
export const ConfigNotFoundError: Throwable = new NFError("Config file not found", 0);
export const CreateConfigError: Throwable = new EError("Cannot create config file", 0);
export const ConfigFailError: Throwable = new FError("Cannot pass config file", 0);

export const ParameterWarning: Throwable = new Warning("Parameter have warning message", 1);
export const ParameterNotFoundError: Throwable = new NFError("Required parameter not exist", 1);
export const WrongParameterError: Throwable = new EError("Wrong parameter", 1);

export const OptionWarning: Throwable = new Warning("Option have warning message", 2);
export const WrongOptionError: Throwable = new EError("Wrong option", 2);
export const FailOptionError: Throwable = new FError("Fail to update by option", 2);

export const NovelWarning: Throwable = new Warning("Novel have warning message", 3);
export const NovelNotFoundError: Throwable = new NFError("Required novel not found", 3);
export const NovelError: Throwable = new FError("Cannot create the novel", 3);

export const DownloadError: Throwable = new EError("Cannot download file", 4);
