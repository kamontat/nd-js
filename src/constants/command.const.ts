import Changelog from "../actions/command/changelog";
import Initial from "../actions/command/Initial";
import Config, { ConfigSet } from "../actions/command/config";
import { RawDownload } from "../actions/command/download";
import Fetch from "../actions/command/fetch";
import { CCommand } from "../models/Command";

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
  desc: "Parameter id and chapter directly and download",
  options: [
    {
      name: "-C, --chapter [value]",
      desc: "number of chapter",
      fn: (v: string, l: string[]) => {
        l.push(v);
        return l;
      },
      default: []
    },
    {
      name: "-L, --location <location>",
      desc: "custom location of the file"
    }
  ],
  fn: RawDownload
};

export const FETCH_CMD: CCommand = {
  name: "fetch",
  alias: "E",
  desc: "Fetching novel from website and show the result",
  fn: Fetch
};
