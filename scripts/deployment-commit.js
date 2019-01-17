#!/usr/bin/env node

const execa = require("execa");
const commander = require("commander");

const command = commander
  .option("--ci", "Setting commit for CI")
  .option("--config-email <email>", "Custom user email")
  .option("--config-name <name>", "Custom user name")
  .option("--github-token <token>", "Custom token (default=process.env.GITHUB_TOKEN)")
  .option("--push", "Also push changes to master")
  .option("--push-tag", "Also push tag changes to master")
  .option("--pr", "Instead of push to master, this will create github PR (require: hub cli)")
  .option("--custom-branch", "Custom pushing branch (default=master)")
  .option("--with-tag", "Also create tag after commit result")
  .option("--tag-name <tag>", "custom tag name (default=package.version)")
  .parse(process.argv);

if (command.args.length !== 1) throw new Error("require commit message");
const message = command.args[0];

(async () => {
  const git = async (...args) => {
    const {
      stdout,
      stderr
    } = await execa("git", args);
    if (stderr) {
      console.error(stderr);
      process.exit(1);
    }

    console.log(stdout);
  };

  if (command.ci && process.env.CI) {
    // await git("config", "credential.helper", "'cache --timeout=120'");

    const email = command.configEmail || "nd-bot@nd.com";
    const name = command.configName || "nd bot";

    await git("config", "user.email", email);
    await git("config", "user.name", name);
  }

  const token = command.githubToken || process.env.GITHUB_TOKEN;
  const branch = command.customBranch || "master";

  await git("commit", "-am", message, "--allow-empty");
  if (command.withTag) {
    const version = command.tagName || require("../package.json").version;
    await execa("git", ["tag", version]);
  }

  if (command.pr) {
    await execa("git", ["push"]);

    console.log(`Create PR to ${branch}`);
    const args = ["pull-request", "-m", `'${message}'`, "-b", branch];

    const {
      stdout
    } = await execa("hub", args);
    console.log(stdout);
  } else if (command.push) {
    console.log(`github token: ${token.substr(0, 6)}`);

    if (command.ci)
      await git("push", `https://${token}@github.com/kamontat/nd-js.git`, branch);
    else
      await git("push", 'origin', branch);
  }

  await git("push", `--tags`);
})();