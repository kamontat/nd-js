import { COption } from "./optionConst";

import Changelog from "../actions/command/changelog";
import Initial from "../actions/command/Initial";
import Config, { ConfigSet } from "../actions/command/config";

export type CCommand = {
  subcommand?: CCommand[];

  name: string;
  alias: string;
  desc: string;
  options?: COption[];
  fn: (...args: any[]) => void;
};

export const ChangelogCommand: CCommand = {
  name: "changelog",
  alias: "C",
  desc: "Show command changelog",
  fn: Changelog
};

export const InitialCommand: CCommand = {
  name: "initial",
  alias: "init",
  desc: "Initial ndd to current computer",
  options: [
    {
      name: "-F, --force",
      desc: "Force to create config even it exist"
    }
  ],
  fn: Initial
};

export const ConfigCommand: CCommand = {
  name: "config",
  alias: "C",
  desc: "Manage configuration file",
  fn: Config
};
