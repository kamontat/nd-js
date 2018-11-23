#!/usr/bin/env node

const commander = require("commander");

const command = commander.option("--push", "Push changes to gh-page").parse(process.argv);

console.log(command);
