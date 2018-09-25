import program from "commander";
import winston from "winston";

import setting from "./models/Logger";

import { VERSION } from "./constants/nd.const";
import { MakeCommand, MakeOption, LoadConfig } from "./helpers/command";

import {
  DebugOption,
  QuietOption,
  VerboseOption,
  NoColorOption,
  NoLogOption,
  LogLocationOption,
  ShortOutputOption,
  LongOutputOption
} from "./constants/option.const";

import {
  ChangelogCommand,
  InitialCommand,
  ConfigCommand,
  SetConfigCommand,
  RawDownloadCommand
} from "./constants/command.const";

program.version(`nd version: ${VERSION}`, "-v, --version");

MakeOption(program, VerboseOption);
MakeOption(program, DebugOption);
MakeOption(program, QuietOption);
MakeOption(program, NoColorOption);
MakeOption(program, NoLogOption);
MakeOption(program, LogLocationOption);
MakeOption(program, ShortOutputOption);
MakeOption(program, LongOutputOption);

MakeCommand(program, ChangelogCommand);
MakeCommand(program, InitialCommand);

MakeCommand(program, ConfigCommand);
MakeCommand(program, SetConfigCommand);

MakeCommand(program, RawDownloadCommand);

LoadConfig();

program.command("*", undefined, { noHelp: true }).action((args: any[]) => {
  winston.configure(setting());

  winston.error(`${args} is not valid.`);
  program.outputHelp();
  process.exit(1);
});

program.allowUnknownOption(false);
program.parse(process.argv);
