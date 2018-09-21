import program from "commander";
import winston from "winston";

import setting from "./models/Logger";

import { VERSION } from "./constants/ndConst";
import { DebugOption, QuietOption, VerboseOption } from "./constants/optionConst";
import { ChangelogCommand, InitialCommand, ConfigCommand } from "./constants/commandConst";
import { MakeCommand, MakeOption } from "./helpers/command";

program.version(`nd version: ${VERSION}`, "-v, --version");

MakeOption(program, VerboseOption);
MakeOption(program, DebugOption);
MakeOption(program, QuietOption);

MakeCommand(program, ChangelogCommand);
MakeCommand(program, InitialCommand);

MakeCommand(program, ConfigCommand);

program.command("*", undefined, { noHelp: true }).action((args: any[]) => {
  winston.configure(setting());

  winston.error(`${args} is not valid.`);
  program.outputHelp();
  process.exit(1);
});

program.allowUnknownOption(false);
program.parse(process.argv);
