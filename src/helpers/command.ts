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

export const MakeOption = (program: Command | CommanderStatic, o: COption) => {
  program.option(o.name, o.desc, o.fn && getAction(o.fn), o.default);
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

const getAction = (fn: (...args: any[]) => void) => {
  return (args: any[]) => {
    // setup logger configuration
    const setup = setting();
    if (setup) configure(setup);
    try {
      Config.Load();
      fn(args);
    } catch (e) {
      ThrowIf(e);
    }
  };
};

export const MakeCommand = (program: Command | CommanderStatic, c: CCommand) => {
  let p = makeCommand(program, c);
  p.action(getAction(c.fn));
};
