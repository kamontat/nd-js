#!/usr/bin/env node

const fs = require("fs");
const execa = require("execa");
const commander = require("commander");

const command = commander
  .option("-N, --next-version <next>", "The version of current loc output (should be next if not run tag before)")
  .parse(process.argv);

const version = command.nextVersion || require("../package.json").version;
const locFileName = "./LOC.md";

(async () => {
  const { stdout } = await execa("./node_modules/.bin/cloc", [
    "src",
    "admin",
    "security",
    "--exclude-dir=__test__",
    "--md"
  ]);

  const content = fs.readFileSync(locFileName).toString();
  if (content.includes(version)) throw new Error("Your version already saved to LOC.md");

  const result = `## Version ${version}
  ${stdout}
  ${content}`;

  fs.writeFileSync(locFileName, result);
})();
