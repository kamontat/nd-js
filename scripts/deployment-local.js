#!/usr/bin/env node

const commander = require("commander");
const path = require("path");
const execa = require("execa");

const command = commander
  .option("--bin-path [path]", "Bin path", "/usr/local/bin")
  .option("--only-admin", "Move only nd-admin execuable file")
  .option("--only-main", "Move only nd execuable file")
  .option("--with-build", "Build the execuable before copy files")
  .parse(process.argv);

const resultBin = command.binPath;
const build = command.withBuild;

console.log(
  `Setting: build => ${build}, bin path => ${resultBin}, Only main: ${command.onlyMain}, Only admin: ${
    command.onlyAdmin
  }`
);

try {
  (async () => {
    if (build) {
      const { stdout } = await execa("./scripts/deployment.js", ["build"]);
      console.log(stdout);
    }

    let os = "";
    switch (process.platform) {
      case "darwin":
        os = "macos";
        break;
      case "linux":
        os = "linux";
        break;
      case "win32":
        os = "win.exe";
        break;
      default:
        break;
    }
    if (os === "") throw new Error(`Not support OS ${process.platform}`);

    const bin = "bin";
    const ndName = `nd-${os}`;
    const ndAdminName = `nd-admin-${os}`;

    if (!command.onlyMain) {
      const { stdout, stderr } = await execa("cp", [
        "-rf",
        path.join(bin, ndAdminName),
        path.join(resultBin, "nd-admin")
      ]);
      console.error(stderr);
      console.log(stdout);
    } else if (!command.onlyAdmin) {
      const { stdout, stderr } = await execa("cp", ["-rf", path.join(bin, ndName), path.join(resultBin, "nd")]);
      console.error(stderr);
      console.log(stdout);
    }
  })();
} catch (e) {
  console.error(e);
}
