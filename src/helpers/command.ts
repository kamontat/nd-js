/**
 * @external
 * @module commander.command
 */

import { Command, CommanderStatic } from "commander";
import { configure } from "winston";

import { ADMIN_CMD, INIT_CMD, SET_CONFIG_CMD } from "../constants/command.const";
import { LOCATION_OPT } from "../constants/option.const";
import { CCommand } from "../models/Command";
import Config from "../models/Config";
import setting from "../models/Logger";
import { COption } from "../models/Option";

import { ThrowIf } from "./action";

export const MakeOption = (program: Command | CommanderStatic, o: COption) => {
  if (o === LOCATION_OPT) program.option(o.name, o.desc, o.fn && getAction(o.fn), o.default);
  else program.option(o.name, o.desc, o.fn, o.default);
};

const makeCommand = (program: Command | CommanderStatic, c: CCommand) => {
  const p = program
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
      Config.Load({ bypass });

      // avoid difference error
      if (c) fn(args);
      else fn(args[0], args[1]);
    } catch (e) {
      ThrowIf(e);
    }
  };
};

export const MakeCommand = (program: Command | CommanderStatic, c: CCommand) => {
  const p = makeCommand(program, c);
  p.action(getAction(c.fn, c));
};
