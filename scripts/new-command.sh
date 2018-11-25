#!/usr/bin/env bash
# shellcheck disable=SC1000

# generate by v3.0.2
# link (https://github.com/Template-generator/script-genrating/tree/v3.0.2)

# set -x #DEBUG - Display commands and their arguments as they are executed.
# set -v #VERBOSE - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.

commandname="$1"
filename="$(echo "$commandname" | tr '[:upper:]' '[:lower:]')"
cmdname="$(echo "$commandname" | tr '[:lower:]' '[:upper:]')_CMD"

echo "creating... ${commandname}"

command_template="/**
 * @external
 * @module commander.command
 */
import { log } from \"winston\";

import { WrapTMC } from \"../apis/loggerWrapper\";
import { SeperateArgumentApi } from \"../helpers/commander\";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  log(WrapTMC(\"verbose\", \"Execute ${commandname}\", \"execution\"));
};
"

cmd_const="export const ${cmdname}: CCommand = {
  name: \"${filename}\",
  alias: \"\",
  desc: \"\",
  fn: ${commandname}
};
"

echo "$command_template" >"src/command/${filename}.ts"

echo "creating... ${cmdname}"

echo "$cmd_const" >>"src/constants/command.const.ts"

echo "Add => src/constants/command.const.ts
import ${commandname} from \"../command/${filename}\";"

echo "Add => src/nd.ts
MakeCommand(program, ${cmdname});"
