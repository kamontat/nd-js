/**
 * @internal
 * @module nd
 * @description This is root file for run the program in node
 *
 */

import program from "commander";
import winston from "winston";

import setting from "./models/Logger";

import { ND } from "./constants/nd.const";
import { MakeCommand, MakeOption } from "./helpers/command";

import {
  DEBUG_OPT,
  QUIET_OPT,
  VERBOSE_OPT,
  NO_COLOR_OPT,
  NO_LOG_OPT,
  LOG_PATH_OPT,
  SHORT_OUT_OPT,
  LONG_OUT_OPT
} from "./constants/option.const";

import {
  CHANGELOG_CMD,
  INIT_CMD,
  CONFIG_CMD,
  SET_CONFIG_CMD,
  RAW_DOWNLOAD_CMD,
  FETCH_CMD,
  DOWNLOAD_CMD,
  UPDATE_CMD,
  VERSION_CMD
} from "./constants/command.const";

import { ADMIN_CMD } from "./constants/command.const";

import { OPTION_COLOR, ARGUMENT_COLOR, PARAMETER_COLOR } from "./constants/color.const";

program.name(ND.PROJECT_NAME).version(`nd version: ${ND.VERSION}`, "-v, --version");

MakeOption(program, VERBOSE_OPT);
MakeOption(program, DEBUG_OPT);
MakeOption(program, QUIET_OPT);
MakeOption(program, NO_COLOR_OPT);
MakeOption(program, NO_LOG_OPT);
MakeOption(program, LOG_PATH_OPT);
MakeOption(program, SHORT_OUT_OPT);
MakeOption(program, LONG_OUT_OPT);

MakeCommand(program, VERSION_CMD);
MakeCommand(program, CHANGELOG_CMD);
MakeCommand(program, INIT_CMD);
MakeCommand(program, CONFIG_CMD);
MakeCommand(program, SET_CONFIG_CMD);

MakeCommand(program, DOWNLOAD_CMD);
MakeCommand(program, RAW_DOWNLOAD_CMD);
MakeCommand(program, FETCH_CMD);
MakeCommand(program, UPDATE_CMD);
if (ND.isDev()) MakeCommand(program, ADMIN_CMD);

program.command("*", undefined, { noHelp: true }).action((args: any[]) => {
  const setup = setting();
  if (setup) winston.configure(setup);
  winston.error(`${args} is not valid.`);
  program.outputHelp();
  process.exit(1);
});

program.on("--help", function() {
  console.log("");
  console.log(`Examples:
$ ${ND.PROJECT_NAME} ${ARGUMENT_COLOR("initial")} [${OPTION_COLOR("--force")}]
$ ${
    ND.PROJECT_NAME
  } ${ARGUMENT_COLOR("set-config")} [${PARAMETER_COLOR("token")}|${PARAMETER_COLOR("username")}|${PARAMETER_COLOR("color")}|${PARAMETER_COLOR("location")}]
$ ${
    ND.PROJECT_NAME
  } ${OPTION_COLOR("--")}[${OPTION_COLOR("help")}|${OPTION_COLOR("changelog")}|${OPTION_COLOR("version")}]
`);
});

program.allowUnknownOption(false);
program.parse(process.argv);
