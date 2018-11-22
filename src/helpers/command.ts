/**
 * @external
 * @module commander.api
 */

import { Command, CommanderStatic } from "commander";
import { configure } from "winston";

import { Logger } from "../apis/logger";
import { INIT_CMD, SET_CONFIG_CMD } from "../constants/command.const";
import { LOCATION_OPT } from "../constants/option.const";
import { CCommand } from "../models/command/Command";
import Config from "../models/command/Config";
import { COption } from "../models/command/Option";

import { ThrowIf } from "./commander";

export const MakeOption = (program: Command | CommanderStatic, o: COption) => {
  if (o === LOCATION_OPT) program.option(o.name, o.desc, o.fn && getAction(o.fn), o.default);
  else program.option(o.name, o.desc, o.fn, o.default);
};

const makeCommand = (program: Command | CommanderStatic, c: CCommand) => {
  const p = program
    .command(c.name, undefined, { noHelp: c.noHelp })
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
      const setup = Logger.setting();
      if (setup) configure(setup);
      // setup logger configuration

      const bypassCMD = [SET_CONFIG_CMD, INIT_CMD];
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
