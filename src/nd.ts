import program from "commander";
import winston from "winston";

import setting from "./models/Logger";

import { VERSION } from "./constants/ndConst";
import {
  DebugOption,
  QuietOption,
  VerboseOption,
  NoColorOption,
  NoLogOption,
  LogLocationOption
} from "./constants/optionConst";
import { ChangelogCommand, InitialCommand, ConfigCommand, RawDownloadCommand } from "./constants/commandConst";
import { MakeCommand, MakeOption } from "./apis/command";

program.version(`nd version: ${VERSION}`, "-v, --version");

MakeOption(program, VerboseOption);
MakeOption(program, DebugOption);
MakeOption(program, QuietOption);
MakeOption(program, NoColorOption);
MakeOption(program, NoLogOption);
MakeOption(program, LogLocationOption);

MakeCommand(program, ChangelogCommand);
MakeCommand(program, InitialCommand);

MakeCommand(program, ConfigCommand);
MakeCommand(program, RawDownloadCommand);

program.command("*", undefined, { noHelp: true }).action((args: any[]) => {
  winston.configure(setting());

  winston.error(`${args} is not valid.`);
  program.outputHelp();
  process.exit(1);
});

program.allowUnknownOption(false);
program.parse(process.argv);
