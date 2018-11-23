#!/usr/bin/env node

const commander = require("commander");

const command = commander
  .option("--push", "Push changes to gh-page")
  .option("--only-push", "Push changes to gh-page without compiled document")
  .option("--silent", "No output anything")
  .parse(process.argv);

const push = command.push === undefined && command.onlyPush === undefined ? false : true; // boolean
const build = command.onlyPush === undefined ? true : false; // boolean
const silent = command.silent || false; // boolean

console.log(`Setting: build => ${build}, push => ${push}, silent => ${silent}`);

const exea = require("execa");
try {
  (async () => {
    if (build) {
      const { stdout, stderr } = await exea("./node_modules/.bin/typedoc", [
        "--out",
        "../docs",
        "--target",
        "ES5",
        "--module",
        "commonjs",
        "--name",
        "ND JS",
        "--mode",
        "modules",
        "--exclude",
        "**/*+(_|.spec|.e2e|nd)*.ts"
      ]);

      if (!silent) {
        console.log(stdout);
        console.error(stderr);
      }
    }

    if (push) {
      const ghpages = require("gh-pages");
      await ghpages
        .publish("docs", {
          message: "[skip ci] Auto generating commit, Updates document"
        })
        .then(v => {
          console.log("Completed!");
          return new Promise(res => res());
        });
    }
  })();
} catch (e) {
  console.error(e);
}
