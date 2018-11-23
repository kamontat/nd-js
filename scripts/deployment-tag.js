#!/usr/bin/env node

const fs = require("fs");
const execa = require("execa");
const commander = require("commander");
const pjson = require("../package.json");

const command = commander
  .option("-C, --current-version <current>", "Specify current version to make changes")
  .option("-N, --next-version <next>", "Specify next version to become")
  .option("-T, --test", "Test the result only, not change any file or tag in repository")
  .option("--no-tag", "Not auto create tag in git repository")
  .parse(process.argv);

const hasTag = command.tag;
const version = command.currentVersion || pjson.version;
let next = command.nextVersion;

if (!next) {
  if (command.args.length !== 1) throw new Error("require tag type to release");

  const tagTypes = ["major", "minor", "patch", "beta", "alpha", "rc", "prerelease", "none"];
  const tagType = command.args[0];

  console.log(`Create new tag type: ${tagType}`);

  if (tagTypes.findIndex(v => tagType === v) < 0) throw new Error(`Your tag type should follow this list ${tagTypes}`);

  const semver = require("semver");

  if (tagType === "none") next = version;
  else if (tagType === "beta" || tagType === "alpha" || tagType === "rc")
    next = semver.inc(version, "prerelease", tagType);
  else next = semver.inc(version, tagType);
}

console.log(`process will change version from ${version} => ${next}`);
if (command.test) process.exit(0);

pjson.version = next;

fs.writeFileSync("./package.json", JSON.stringify(pjson, undefined, "  "));

if (hasTag) {
  (async () => {
    await execa("git", ["tag", next]);
  })();
}
