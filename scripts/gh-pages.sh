#!/usr/bin/env bash
# shellcheck disable=SC1000

# generate by v3.0.2
# link (https://github.com/Template-generator/script-genrating/tree/v3.0.2)

# set -x #DEBUG - Display commands and their arguments as they are executed.
# set -v #VERBOSE - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.

command -v yarn &>/dev/null || exit 1

version="$(git describe --tags)"

message="Update documentation (version $version)
[ci skip]"

yarn gh-pages --dist docs --dotfiles --message "$message"
