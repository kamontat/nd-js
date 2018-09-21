import Throwable, { NFError, EError, FError } from "../models/Exception";

export const ConfigNotFoundError: Throwable = new NFError("config file not found", 0);
export const CreateConfigError: Throwable = new EError("Cannot create config file", 0);
export const ConfigFailError: Throwable = new FError("Cannot pass config file", 0);

export const ParameterNotFoundError: Throwable = new NFError("Required parameter not exist", 1);
export const WrongParameterError: Throwable = new EError("Wrong parameter", 1);
