/**
 * @external
 * @module commander.command
 */

import { configure } from "winston";

import { CommanderStatic, Command } from "commander";

import setting from "../models/Logger";
import { COption } from "../models/Option";
import { CCommand } from "../models/Command";
import Config from "../models/Config";
import { ThrowIf } from "./action";
import { SET_CONFIG_CMD, ADMIN_CMD, INIT_CMD } from "../constants/command.const";
import { LOCATION_OPT } from "../constants/option.const";

export const MakeOption = (program: Command | CommanderStatic, o: COption) => {
  if (o === LOCATION_OPT) program.option(o.name, o.desc, o.fn && getAction(o.fn), o.default);
  else program.option(o.name, o.desc, o.fn, o.default);
};

const makeCommand = (program: Command | CommanderStatic, c: CCommand) => {
  let p = program
    .command(c.name)
    .description(c.desc)
    .alias(c.alias);

  if (c.options) {
    c.options.forEach(o => MakeOption(p, o));
  }
  return p;
};

const getAction = (fn: (...args: any[]) => void, c?: CCommand) => {
  return (...args: any[]) => {
    try {
      const setup = setting();
      if (setup) configure(setup);
      // setup logger configuration

      const bypassCMD = [SET_CONFIG_CMD, ADMIN_CMD, INIT_CMD];
      const bypass: boolean = c ? bypassCMD.includes(c) : false;
      Config.Load({ bypass: bypass });

      // avoid difference error
      if (c) fn(args);
      else fn(args[0], args[1]);
    } catch (e) {
      ThrowIf(e);
    }
  };
};

export const MakeCommand = (program: Command | CommanderStatic, c: CCommand) => {
  let p = makeCommand(program, c);
  p.action(getAction(c.fn, c));
};
