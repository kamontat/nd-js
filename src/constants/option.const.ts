/**
 * @external
 * @module commander.option
 */

import { BeChangeLevel, BeColor, BeQuiet, BeLog, BeLoggerTo, BeShortOutput, BeLongOutput } from "./default.const";
import { COption } from "../models/Option";
import Config from "../models/Config";
import { HELPER_LOAD_CONFIG } from "../helpers/config";
import { ThrowIf } from "../helpers/action";

// export const VERBOSE_OPT: COption = {
//   name: "-V, --verbose",
//   desc: "Be verbose",
//   fn: () => BeChangeLevel("verbose")
// };

export const DEBUG_OPT: COption = {
  name: "-D, --debug",
  desc: "Turn open debugger",
  fn: () => BeChangeLevel("debug")
};

export const QUIET_OPT: COption = { name: "-Q, --quiet", desc: "Be quiet", fn: () => BeQuiet() };

export const SHORT_OUT_OPT: COption = {
  name: "--log-short",
  desc: "make 1 line output",
  fn: () => BeShortOutput()
};
export const LONG_OUT_OPT: COption = {
  name: "--log-long",
  desc: "make multiple line output",
  fn: () => BeLongOutput()
};

export const NO_LOG_OPT: COption = { name: "--log-none", desc: "No log to the files", fn: () => BeLog(false) };

export const LOG_PATH_OPT: COption = {
  name: "--log-location <location>",
  desc: "custom logger folder location",
  fn: location => BeLoggerTo(location)
};

export const NO_COLOR_OPT: COption = {
  name: "-N, --no-color",
  desc: "Make no color output",
  fn: () => BeColor(false)
};

export const LOCATION_OPT: COption = {
  name: "-L, --location <location>",
  desc: "Custom output location",
  fn: location => {
    Config.Load({ quiet: true }).setNovelLocation(location);
  }
};
