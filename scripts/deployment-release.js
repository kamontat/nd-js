#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const execa = require("execa");
const commander = require("commander");

const _version = require("../package.json").version;

const command = commander
  .option(
    "-T, --title <title>",
    `Release title name (default=Release version <${_version}>)`,
    `Release version ${_version}`
  )
  .option("-C, --custom-version", "Create release on this custom version")
  .parse(process.argv);

const version = command.customVersion || _version;

const os = process.platform;
const commandName = `ghr-${os}/ghr`;
const commandPath = path.join(".", "scripts", "lib", commandName);
if (!fs.existsSync(commandPath)) throw new Error(`your os(${os}) is not support by changelog generator`);

console.log(`Release version: ${version} (title="${command.title}")`);

(async () => {
  // ghr [options...] TAG PATH
  const { stdout, stderr } = await execa(commandPath, [version, "./bin"]);

  console.log(stdout);
  console.error(stderr);
})();
