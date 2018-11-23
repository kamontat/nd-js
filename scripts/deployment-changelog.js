#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const commander = require("commander");
const execa = require("execa");

const command = commander
  .option("-T, --create-tag", "Create git tag with current version in package.json")
  .option("-N, --next-tag <next>", "Create changelog with specify version tag")
  .parse(process.argv);

const version = command.nextTag || require("../package.json").version;

// type Platform = 'aix' | 'android' | 'darwin' | 'freebsd' | 'linux' | 'openbsd' | 'sunos' | 'win32' | 'cygwin';
const os = process.platform;
const commandName = `git-chglog-${os}`;
const commandPath = path.join(".", "scripts", "lib", commandName);
if (!fs.existsSync(commandPath)) throw new Error(`your os(${os}) is not support by changelog generator`);

(async () => {
  // git-chglog --config ./.gitgo/chglog/config.yml --next-tag "$expected" -o "./CHANGELOG.md"
  const { stdout } = await execa(commandPath, [
    "--config",
    "./.gitgo/chglog/config.yml",
    "--next-tag",
    version,
    "--output",
    "./CHANGELOG.md"
  ]);

  console.log(stdout);

  if (command.tag === true) await execa("git", ["tag", version]);
})();
