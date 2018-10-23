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

# How to use
## ./deploy.sh [alpha|beta|patch|minor|major] [--yes <title>]

semver="$1"
yes=false
[[ $2 == "--yes" ]] && yes=true
title="$3"

lib_sh() {
	filename="$1"
	"./scripts/lib/$filename.sh" "$2"
}

lib() {
	filename="$1"
	node "./scripts/lib/$filename.js" "$2"
}

update_version() {
	local semver="$1"
	[[ $semver == "alpha" ]] && yarn --silent version:alpha "$version" && return
	[[ $semver == "beta" ]] && yarn --silent version:beta "$version" && return
	[[ $semver == "patch" ]] && yarn --silent version:patch "$version" && return
	[[ $semver == "minor" ]] && yarn --silent version:minor "$version" && return
	[[ $semver == "major" ]] && yarn --silent version:major "$version" && return

	echo "invalid version" && exit 5
}

if test -z "$semver"; then
	printf "Update version: (alpha|beta|patch|minor|major) "
	read -r semver
fi

expected="$(update_version "$semver")"
echo "$expected"
yarn version --new-version "$expected" --no-git-tag-version

version="v$(lib "getVersion")"

if lib "promptYN" "create release of version $version" || yes; then
	# check git status
	status="$(git status --short)"

	if test -z "$status"; then
		if (! lib "promptYN" "git status must be empty") || yes; then
			exit 1
		fi
	fi

	# create changelog
	# bypass gitgo since it not support --next-tag option
	git-chglog --config ./.gitgo/chglog/config.yml --next-tag "$version" -o "./CHANGELOG.md"

	# create jsdoc
	yarn docs
	yarn loc
	yarn gh-pages

	# save work
	git add .
	git commit -m "[release] Version: $version"

	# create bin file
	yarn deploy

	# create git tag
	git tag "$version"

	# update work
	if lib "promptYN" "execute git push code and tag" || yes; then
		git push && git push --tag
	fi

	# create release
	if lib "promptYN" "create release in github" || yes; then
		prerelease=""
		if [[ "$semver" == "alpha" ]] || [[ "$semver" == "beta" ]]; then
			prerelease="--prerelease"
		fi
		if test -z "$title"; then
			printf "your release title message is "
			read -r title
		fi
		message="$(git-chglog --config ./.gitgo/chglog/config.yml "$version")"

		final="$(printf '%s\n%s' "$title" "$message")"

		hub release create "$prerelease" --message="$final" "$version" -a "./bin/nd-linux" -a "./bin/nd-macos" -a "./bin/nd-win.exe"
	fi
else
	echo "exit"
fi
