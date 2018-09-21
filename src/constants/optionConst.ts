import { LOGGER_LEVEL, ChangeLevel } from "./defaultConst";

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
export const QuietOption: COption = { name: "-Q, --quiet", desc: "Be quiet", fn: () => ChangeLevel("error") };

// export const ForceOption: COption = { name: "-F, --force", desc: "Make force to execution" };
