#!/usr/bin/env node

const execa = require("execa");
const commander = require("commander");

const command = commander
  .option("--ci", "Run on CI")
  .option("--no-release", "Not run release command")
  .option("--no-doc", "Not run doc command")
  .option("--no-changelog", "Not run changelog command")
  .option("--no-loc", "Not run loc command")
  .option("--no-commit", "Not commit anything")
  .option("--commit-message <message>", "Create commit with custom message")
  .option("--no-update-tag", "Not update tag in package")
  .option("--no-create-tag", "Not create git tag")
  .option("--type <type>", "Next release version type: [major, minor, patch, beta, alpha, rc, prerelease]")
  .parse(process.argv);

// run step:
/* ********************

Run step: 

1. Run tag command (without create tag yet!)
2. Run creating document and push to gh-page
3. Run creating loc
4. Run creating changelog
5. Run commit the document changes
6. Run tag command (with create tag)
7. Run release the RELEASE in github

******************** */

(async () => {
  const exec = async (...args) => {
    const { stdout, stderr } = await execa("./scripts/deployment.js", args);
    if (stderr) {
      console.error(stderr);
      process.exit(1);
    }

    console.log(stdout);
  };

  const git = async (...args) => {
    const { stdout, stderr } = await execa("git", args);
    if (stderr) {
      console.error(stderr);
      process.exit(1);
    }

    console.log(stdout);
  };

  if (command.updateTag) {
    if (!command.type) throw new Error("To update tag, you must have --type <type> option");

    console.log(`Update tag: type ${command.type}`);

    await exec("tag", command.type, "--no-tag");
  }

  const version = require("../package.json").version;

  if (command.doc) {
    console.log(`Create document version: ${version}`);
    await exec("doc", "--push");
  }

  if (command.loc) {
    console.log(`Create loc version: ${version}`);
    await exec("loc");
  }

  if (command.changelog) {
    console.log(`Create version: ${version} changelog`);
    await exec("changelog");
  }

  if (command.commit) {
    const message = command.commitMessage || `[release] Release version ${version} [skip ci]`;

    console.log(`Create commit with message: ${message}`);
    // git config credential.helper 'cache --timeout=120'
    // git config user.email "<email>"
    // git config user.name "Deployment Bot"
    if (command.ci) {
      await git("config", "credential.helper", "'cache --timeout=120'");
      await git("config", "user.email", "nd-bot@nd.com");
      await git("config", "user.name", "ND deployment [bot]");
    }

    await git("commit", "-am", message);
    await git("push", "https://${GITHUB_TOKEN}@github.com/kamontat/nd-js.git", "master");
  }
})();
