/**
 * @external
 * @module commander.constant
 */

import { log } from "winston";

import Admin from "../command/admin";
import Changelog from "../command/changelog";
import Config from "../command/config";
import ConfigSet, { CONFIG_SET_LIST } from "../command/config-set";
import Download from "../command/download";
import RawDownload from "../command/download-raw";
import Fetch from "../command/fetch";
import Initial from "../command/Initial";
import Update from "../command/update";
import Validator from "../command/validator";

import { WrapTMC } from "../apis/loggerWrapper";
import { CCommand } from "../models/command/Command";

import { ND } from "./nd.const";
import { LOCATION_OPT } from "./option.const";

export const VERSION_CMD: CCommand = {
  name: "version",
  alias: "V",
  desc: "Show command version",
  fn: () => log(WrapTMC("info", `${ND.PROJECT_NAME}`, `v${ND.VERSION}`)),
};

export const CHANGELOG_CMD: CCommand = {
  name: "changelog",
  alias: "change",
  desc: "Show command changelog",
  fn: Changelog,
};

export const INIT_CMD: CCommand = {
  name: "initial",
  alias: "init",
  desc: "Initial ndd to current computer",
  options: [
    {
      name: "-F, --force",
      desc: "Force to create config even it exist",
    },
    {
      name: "-R, --raw <json>",
      desc: "Pass raw json token to initial config file",
    },
    {
      name: "-E, --file <path>",
      desc: "Pass json file to create configuration",
    },
  ],
  fn: Initial,
};

export const CONFIG_CMD: CCommand = {
  name: "configuration",
  alias: "config",
  desc: `Get config location path`,
  options: [
    {
      name: "-R, --raw",
      desc: "Show only the path result",
    },
  ],
  fn: Config,
};

export const SET_CONFIG_CMD: CCommand = {
  name: "set-config",
  alias: "setc",
  desc: `Set config value [${CONFIG_SET_LIST}]`,
  fn: ConfigSet,
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
      default: [],
    },
    {
      name: "-F, --force",
      desc: "Force download even file is exist",
      default: false,
    },
  ],
  fn: RawDownload,
};

export const DOWNLOAD_CMD: CCommand = {
  name: "download",
  alias: "d",
  desc: "download novel command",
  options: [
    LOCATION_OPT,
    {
      name: "-F, --force",
      desc: "Force download even folder is exist",
      default: false,
    },
    {
      name: "-W, --with-chapter",
      desc: "List the result with chapter",
      default: false,
    },
  ],
  fn: Download,
};

export const FETCH_CMD: CCommand = {
  name: "fetch",
  alias: "E",
  desc: "Fetching novel from website and show the result",
  options: [
    {
      name: "-W, --with-chapter",
      desc: "List the result with chapter",
      default: false,
    },
    {
      name: "-H, --with-history",
      desc: "List the result with history",
      default: false,
    },
  ],
  fn: Fetch,
};

export const UPDATE_CMD: CCommand = {
  name: "update",
  alias: "U",
  desc: "Update individual novel in location",
  options: [
    {
      name: "-W, --with-chapter",
      desc: "List the result with chapter",
      default: false,
    },
    {
      name: "-C, --changes",
      desc: "Add all changes that occurred in this update",
    },
  ],
  fn: Update,
};

export const ADMIN_CMD: CCommand = {
  name: `admin-${ND.VERSION}`,
  alias: `a-${ND.VERSION}`,
  desc: "",
  options: [
    {
      name: "-J, --json",
      desc: "Export as json format",
    },
  ],
  fn: Admin,

  noHelp: true,
};

export const VALIDATOR_CMD: CCommand = {
  name: "validator",
  alias: "valid",
  desc: "Validate the command",
  options: [
    {
      name: "-I, --info",
      desc: "Also receive the information",
    },
  ],
  fn: Validator,
};
