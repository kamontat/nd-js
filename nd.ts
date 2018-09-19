import Vorpal from "vorpal";
import program from "commander";

import { VorpalRegister, CommanderRegister } from "./src/helpers/command";
import { VERSION, DELIMITER } from "./src/constants/ndConst";

import logger from "./src/models/Logger";

import { Config, Download, Register, Interactive } from "./src/controllers";

let interactive = false;

program.version(`nd version: ${VERSION}`, "-v, --version");

CommanderRegister(program, logger, Register);
// CommanderRegister(program, logger, Download)
// CommanderRegister(program, logger, Config)

CommanderRegister(program, logger, Interactive, () => {
  const cli = new Vorpal();
  cli.version(`nd version: ${VERSION}`);

  VorpalRegister(cli, logger, Register);
  VorpalRegister(cli, logger, Download);
  VorpalRegister(cli, logger, Config);

  cli.delimiter(DELIMITER).show();

  interactive = true;
});

program.parse(process.argv);
program.allowUnknownOption(false);

if (!interactive) {
  program.outputHelp();
  process.exit(1);
}
