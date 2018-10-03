/**
 * @external
 * @module commander.command
 */
import { CCommand } from "../models/Command";

import Changelog from "../actions/command/changelog";
import Initial from "../actions/command/Initial";
import Download from "../actions/command/download";
import Config, { ConfigSet } from "../actions/command/config";
import RawDownload from "../actions/command/raw-download";
import Fetch from "../actions/command/fetch";
import { LOCATION_OPT } from "./option.const";

export const CHANGELOG_CMD: CCommand = {
  name: "changelog",
  alias: "change",
  desc: "Show command changelog",
  fn: Changelog
};

export const INIT_CMD: CCommand = {
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

export const CONFIG_CMD: CCommand = {
  name: "configuration",
  alias: "config",
  desc: `Get config location path`,
  fn: Config
};

export const SET_CONFIG_CMD: CCommand = {
  name: "set-config",
  alias: "setc",
  desc: "Set config value",
  fn: ConfigSet
};

export const RAW_DOWNLOAD_CMD: CCommand = {
  name: "raw-download",
  alias: "D",
  desc: "Add id and chapter directly and download",
  options: [
    LOCATION_OPT,
    {
      name: "-C, --chapter [value]",
      desc: "number of chapter",
      fn: (v: string, l: string[]) => {
        l.push(v);
        return l;
      },
      default: []
    }
  ],
  fn: RawDownload
};

export const DOWNLOAD_CMD: CCommand = {
  name: "download",
  alias: "d",
  desc: "download novel command",
  options: [
    LOCATION_OPT,
    {
      name: "-F, --force",
      desc: "Force download even folder in exist",
      default: false
    }
  ],
  fn: Download
};

export const FETCH_CMD: CCommand = {
  name: "fetch",
  alias: "E",
  desc: "Fetching novel from website and show the result",
  fn: Fetch
};
