import winston from "winston";

import { CommanderStatic, Command } from "commander";

import setting from "../models/Logger";

import { CCommand } from "../constants/commandConst";
import { COption } from "../constants/optionConst";
import { LOGGER_LEVEL } from "../constants/defaultConst";

export const MakeOption = (program: Command | CommanderStatic, o: COption) => {
  program.option(o.name, o.desc, o.fn, o.default);
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

const addAction = (program: Command | CommanderStatic, c: CCommand) => {
  program.action((...args: any[]) => {
    winston.configure(setting({ level: LOGGER_LEVEL }));
    c.fn(args);
  });
};

export const MakeCommand = (program: Command | CommanderStatic, c: CCommand) => {
  let p = makeCommand(program, c);
  addAction(p, c);
};
