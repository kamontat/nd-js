#!/usr/bin/env bash
# shellcheck disable=SC1000

# generate by v3.0.2
# link (https://github.com/Template-generator/script-genrating/tree/v3.0.2)

# set -x #DEBUG - Display commands and their arguments as they are executed.
# set -v #VERBOSE - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.

command -v cloc &>/dev/null || exit 1

filename="./LOC.md"
touch "$filename"
content="$(cat $filename)"

version="v$(node ./scripts/lib/getVersion.js)"

echo "## Version $version
$(cloc . --exclude-dir=node_modules,coverage,docs,bin,.caches --md)

$content" >"$filename"
