#!/usr/bin/env node

const commander = require("commander");

commander
  .name("nd-deployment")
  .version("0.0.2", "-v, --version")
  .command("tag <type>", "Create and update tag version in git and package.json")
  .command("loc", "Generate Line of codes to the file")
  .command("changelog", "Generate Changelog to the file (WIP)")
  .command("doc", "Generate document to the file")
  .command("release", "Create release to github (WIP)")
  .command("all", "Run all process to deployment (WIP)")
  .parse(process.argv);
