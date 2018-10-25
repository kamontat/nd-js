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

command_template='import { SeperateArgumentApi } from "../helpers/action";
import { log } from "winston";
import { WrapTMC } from "../models/LoggerWrapper";

export default (a: any) => {
  const { options, args } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "title", "execution"));
};
'

cmd_const="export const ${cmdname}: CCommand = {
  name: \"${commandname}\",
  alias: \"\",
  desc: \"\",
  fn: ${commandname}
};
"

echo "$command_template" >"src/command/${filename}.ts"

echo "regising... ${cmdname}"

echo "$cmd_const" >>"src/constants/command.const.ts"

echo "Add import ${commandname} from \"../command/${filename}\"; => src/constants/command.const.ts"

echo "Add MakeCommand(program, ${cmdname}); => src/nd.ts"
