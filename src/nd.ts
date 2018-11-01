/**
 * @internal
 * @module nd
 * @description This is root file for run the program in node
 *
 */

process.env.SUPPRESS_NO_CONFIG_WARNING = "true";

import program from "commander";
import winston from "winston";

import "./_setup";
import { ARGUMENT_COLOR, OPTION_COLOR, PARAMETER_COLOR, PRIMARY_ARGUMENT_COLOR } from "./constants/color.const";
import {
  CHANGELOG_CMD,
  CONFIG_CMD,
  DOWNLOAD_CMD,
  FETCH_CMD,
  INIT_CMD,
  RAW_DOWNLOAD_CMD,
  SET_CONFIG_CMD,
  UPDATE_CMD,
  VALIDATOR_CMD,
  VERSION_CMD,
} from "./constants/command.const";
import { ADMIN_CMD } from "./constants/command.const";
import { ND } from "./constants/nd.const";
import {
  DEBUG_OPT,
  LOG_PATH_OPT,
  LONG_OUT_OPT,
  NO_COLOR_OPT,
  NO_LOG_OPT,
  QUIET_OPT,
  SHORT_OUT_OPT,
} from "./constants/option.const";
import { MakeCommand, MakeOption } from "./helpers/command";
import setting from "./models/output/Logger";

program.name(ND.PROJECT_NAME).version(`nd version: ${ND.VERSION}`, "-v, --version");

// MakeOption(program, VERBOSE_OPT);
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
MakeCommand(program, VALIDATOR_CMD);

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

program.on("--help", () => {
  // tslint:disable-next-line
  console.log("");
  // tslint:disable-next-line
  console.log(`Examples:
  $ ${ND.PROJECT_NAME} ${PRIMARY_ARGUMENT_COLOR("initial")} [${OPTION_COLOR("--force")}] [${OPTION_COLOR(
    "--raw",
  )} <${PARAMETER_COLOR("json")}>|${OPTION_COLOR("--file")} <${PARAMETER_COLOR("path")}>]
  $ ${ND.PROJECT_NAME} ${PRIMARY_ARGUMENT_COLOR("set-config")} [${ARGUMENT_COLOR("token")}|${ARGUMENT_COLOR(
    "username",
  )}|${ARGUMENT_COLOR("color")}|${ARGUMENT_COLOR("location")}]
  $ ${ND.PROJECT_NAME} ${PRIMARY_ARGUMENT_COLOR("fetch")} <${ARGUMENT_COLOR("id")}> [${OPTION_COLOR("--with-chapter")}]
  $ ${ND.PROJECT_NAME} ${PRIMARY_ARGUMENT_COLOR("validator")} [${ARGUMENT_COLOR("config")}|${ARGUMENT_COLOR(
    "application",
  )}] [${OPTION_COLOR("--info")}]
  $ ${ND.PROJECT_NAME} [${OPTION_COLOR("--help")}|${OPTION_COLOR("--changelog")}|${OPTION_COLOR("--version")}]
`);
});

program.allowUnknownOption(false);
program.parse(process.argv);
