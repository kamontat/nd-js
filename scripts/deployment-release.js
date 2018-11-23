#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

const execa = require("execa");
const commander = require("commander");

const _version = require("../package.json").version;

const command = commander
  .option("-T, --title <title>", `Release title name (default: Release version ${_version})`)
  .option("--github-token <token>", "Custom token (default=process.env.GITHUB_TOKEN)")
  .option("-B, --body <body>", "Release body (default: changelog of current version)")
  .option("-C, --custom-version <version>", "Create release on this custom version")
  .parse(process.argv);

const version = command.customVersion || _version;
const title = command.title || `Release version ${version}`;

const os = process.platform;
const commandName = `ghr-${os}/ghr`;
const commandPath = path.join(".", "scripts", "lib", commandName);
if (!fs.existsSync(commandPath)) throw new Error(`your os(${os}) is not support by changelog generator`);

console.log(`Release version: ${version} (title="${title}")`);

const token = command.githubToken || process.env.GITHUB_TOKEN;

(async () => {
  let { stdout } = await execa("./scripts/deployment.js", ["changelog", "--stdout", "--next-tag", version]);
  const body = command.body || stdout;
  console.log(`Release body: 
${body}
`);

  // ghr <version> ./bin -t token -n title -b body
  const result = await execa(commandPath, ["-t", token, "-n", `'${title}'`, "-b", `'${body}'`, version, "./bin"]);

  console.log(result.stdout);
})();
