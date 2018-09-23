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
#/ Since:        23/09/2018
#/ -----------------------------------
#/ Error code    1      -- error
#/ -----------------------------------
#/ Known bug:    ...
#/ -----------------------------------
#// Version:      0.0.1   -- description
#//               0.0.2b1 -- beta-format
#//               0.0.2a1 -- alpha-format

lib() {
  filename="$1"
  node "./scripts/lib/$filename.js" "$2"
}

version="$(lib "getVersion")"

if lib "promptYN" "create release of version $version"; then
  # check git status
  status="$(git status --short)"

  if test -z "$status"; then
    if ! lib "promptYN" "git status must be empty"; then
      exit 1
    fi
  fi

  # create changelog
  # bypass gitgo since it not support --next-tag option
  git-chglog --config ./.gitgo/chglog/config.yml --next-tag "$version" -o "./CHANGELOG.md"

  # create jsdoc
  yarn docs
  yarn gh-pages

  # save work
  git add .
  git commit -m "[release] Version: $version"

  # create bin file
  yarn deploy

  # create git tag
  git tag "$version"

  # update work
  if lib "promptYN" "execute git push code and tag"; then
    git push && git push --tag
  fi

  # create release
  if lib "promptYN" "create release in github"; then
    prerelease=""
    if lib "promptYN" "This is prerelease"; then
      prerelease="--prerelease"
    fi

    text="$(lib "promptText" "your release title message")"
    hub release create "$prerelease" --message "$text
$(git-chglog --config ./.gitgo/chglog/config.yml "$version")
" "$version"
  fi
else 
  echo "exit"
fi
