#!/usr/bin/env bash
# shellcheck disable=SC1000

# generate by v3.0.2
# link (https://github.com/Template-generator/script-genrating/tree/v3.0.2)

# set -x #DEBUG - Display commands and their arguments as they are executed.
# set -v #VERBOSE - Display shell input lines as they are read.
# set -n #EVALUATE - Check syntax of the script but don't execute.

#/ -----------------------------------
#/ Description:  ...
#/ How to:       ...
#/               ...
#/ Option:       --help | -h | -? | help | h | ?
#/                   > show this message
#/               --version | -v | version | v
#/                   > show command version
#/ -----------------------------------
#/ Create by:    Kamontat Chantrachirathunrong <kamontat.c@hotmail.com>
#/ Since:        28/09/2018
#/ -----------------------------------
#/ Error code    1      -- error
#/ -----------------------------------
#/ Known bug:    ...
#/ -----------------------------------
#// Version:      0.0.1   -- description
#//               0.0.2b1 -- beta-format
#//               0.0.2a1 -- alpha-format

printf "Update version: (alpha|beta|patch|minor|major) " >&2
read -r semver

version="$(node ./scripts/lib/getVersion.js)"

[[ $semver == "alpha" ]] && yarn --silent version:alpha "$version"
[[ $semver == "beta" ]] && yarn --silent version:beta "$version"
[[ $semver == "patch" ]] && yarn --silent version:patch "$version"
[[ $semver == "minor" ]] && yarn --silent version:minor "$version"
[[ $semver == "major" ]] && yarn --silent version:major "$version"
