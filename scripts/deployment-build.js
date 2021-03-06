#!/usr/bin/env node

const webpack = require("webpack");
const { exec } = require("pkg");

const commander = require("commander");

const command = commander
  .option("--no-compile", "No compile the code first")
  .option("--only-admin", "Compile and build admin program only")
  .option("--only-main", "Compile and build main program only")
  .option("--no-build", "Not build any file")
  .option("--debug", "enable debug mode in pkg")
  .parse(process.argv);

(async () => {
  const config = require("../webpack.config.js");
  config.mode = "production";

  const build = async (onlyMain, onlyAdmin) => {
    let arr = [".", "--out-path", "bin"];
    if (command.debug) arr.push("--debug");
    if (!onlyAdmin) {
      await exec(arr);
    }

    arr = [".caches/nd-admin.min.js", "--target", "linux,win,macos", "--output", "./bin/nd-admin"];
    if (command.debug) arr.push("--debug");
    if (!onlyMain) {
      await exec(arr);
    }
  };

  if (command.compile) {
    await webpack(config, async (e, s) => {
      console.log(s.toString());
      if (!s.hasErrors()) {
        if (command.build) await build(command.onlyMain, command.onlyAdmin);
      } else console.error(e);
    });
  } else {
    if (command.build) await build(command.onlyMain, command.onlyAdmin);
  }
})();
