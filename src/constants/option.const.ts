import { BeChangeLevel, BeColor, BeQuiet, BeLog, BeLoggerTo, BeShortOutput, BeLongOutput } from "./default.const";

export type COption = { name: string; desc: string; fn?: (arg1: any, arg2: any) => void; default?: any };

export const VerboseOption: COption = {
  name: "-V, --verbose",
  desc: "Be verbose",
  fn: () => BeChangeLevel("verbose")
};

export const DebugOption: COption = {
  name: "-D, --debug",
  desc: "Turn open debugger",
  fn: () => BeChangeLevel("debug")
};

export const QuietOption: COption = { name: "-Q, --quiet", desc: "Be quiet", fn: () => BeQuiet() };

export const ShortOutputOption: COption = { name: "--short", desc: "make 1 line output", fn: () => BeShortOutput() };
export const LongOutputOption: COption = {
  name: "--long",
  desc: "make multiple line output",
  fn: () => BeLongOutput()
};

export const NoLogOption: COption = { name: "--no-log", desc: "No log to the files", fn: () => BeLog(false) };

export const LogLocationOption: COption = {
  name: "--log-location <location>",
  desc: "custom logger folder location",
  fn: location => BeLoggerTo(location)
};

export const NoColorOption: COption = {
  name: "-N, --no-color",
  desc: "Make no color output",
  fn: () => BeColor(false)
};

// export const ForceOption: COption = { name: "-F, --force", desc: "Make force to execution" };
