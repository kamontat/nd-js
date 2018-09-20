import Vorpal from "vorpal";
import program from "commander";

import { VorpalRegister, CommanderRegister } from "./src/helpers/command";
import { VERSION, DELIMITER } from "./src/constants/ndConst";

import setting from "./src/models/Logger";

import { Config, Download, Initial, Interactive } from "./src/controllers";
import winston from "winston";

program.allowUnknownOption(true);
let interactive = false;

program.version(`nd version: ${VERSION}`, "-v, --version");

program.option("-D, --debug", "be debug");
program.option("-V, --verbose", "be verbose");
program.option("-q, --quiet", "be quiet");

CommanderRegister(program, Initial);
CommanderRegister(program, Config);
// CommanderRegister(program, Download)

CommanderRegister(program, Interactive, () => {
  const cli = new Vorpal();
  cli.version(`nd version: ${VERSION}`);

  VorpalRegister(cli, Initial);
  VorpalRegister(cli, Config);
  // VorpalRegister(cli, Download);

  cli.delimiter(DELIMITER).show();

  interactive = true;
});

program.parse(process.argv);

if (!interactive) {
  program.outputHelp();
  process.exit(1);
}
