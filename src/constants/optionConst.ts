import { LOGGER_LEVEL, ChangeLevel, SetColor, BeQuiet, NoLog, LoggerTo } from "./defaultConst";

export type COption = { name: string; desc: string; fn?: (arg1: any, arg2: any) => void; default?: any };

export const VerboseOption: COption = {
  name: "-V, --verbose",
  desc: "Be verbose",
  fn: () => ChangeLevel("verbose")
};

export const DebugOption: COption = {
  name: "-D, --debug",
  desc: "Turn open debugger",
  fn: () => ChangeLevel("debug")
};

export const QuietOption: COption = { name: "-Q, --quiet", desc: "Be quiet", fn: () => BeQuiet() };

export const NoLogOption: COption = { name: "--no-log", desc: "No log to the files", fn: () => NoLog() };

export const LogLocationOption: COption = {
  name: "--log-location <location>",
  desc: "custom logger folder location",
  fn: location => LoggerTo(location)
};

export const NoColorOption: COption = {
  name: "-N, --no-color",
  desc: "Make no color output",
  fn: () => SetColor(true)
};

// export const ForceOption: COption = { name: "-F, --force", desc: "Make force to execution" };
