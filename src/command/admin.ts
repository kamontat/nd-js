/**
 * @external
 * @module commander.command
 */

import { prompt } from "inquirer";
import semver from "semver";
import { log } from "winston";

import { WrapTMC } from "../apis/loggerWrapper";
import { CreateToken, TokenDataType } from "../apis/token";
import { SECURITY_FAIL_ERR } from "../constants/error.const";
import { ND } from "../constants/nd.const";
import { SeperateArgumentApi } from "../helpers/commander";
import { Throw } from "../helpers/commander";
import { UsernameValidator } from "../models/security/UsernameValidator";

interface PasswordType {
  password: string;
}

const password = {
  type: "password",
  message: "Enter a admin password",
  name: "password",
  mask: "*",
};

const information = [
  {
    type: "input",
    name: "fullname",
    message: "Enter your full name (name surname email)",
    validate: (str: string) => new UsernameValidator(str).isValid(),
  },
  {
    type: "input",
    name: "username",
    message: "Enter username",
  },
  {
    type: "list",
    name: "expiredate",
    message: "Token expire date",
    choices: [
      { name: "3 hours", value: "3h" },
      { name: "5 hours", value: "5h" },
      { name: "10 hours", value: "10h" },
      { name: "1 day", value: "1d" },
      { name: "7 days", value: "7d" },
      { name: "30 days", value: "30d" },
      { name: "180 days", value: "180d" },
      { name: "1 year", value: "1y" },
    ],
  },
  {
    type: "list",
    name: "issuedate",
    message: "When the token can be use",
    choices: [
      { name: "now", value: "1" },
      { name: "1 hours", value: "1h" },
      { name: "5 hours", value: "5h" },
      { name: "10 hours", value: "10h" },
      { name: "1 day", value: "1d" },
    ],
  },
  {
    type: "list",
    name: "versionrange",
    message: "Range of version can be use",
    choices: [
      { name: "Every version", value: "*" },
      {
        name: "Patch is updatable, Allow backward",
        value: `${semver.major(ND.VERSION)}.${semver.minor(ND.VERSION)}.x`,
      },
      { name: "Patch is updatable, NOT allow backward", value: `~${ND.VERSION}` },
      { name: "Minor and Patch is updatable, allow backward", value: `${semver.major(ND.VERSION)}.x.x` },
      { name: "Minor and Patch is updatable, NOT allow backward", value: `^${ND.VERSION}` },
    ],
  },
];

export default (a: any) => {
  if (ND.isProd()) {
    throw SECURITY_FAIL_ERR.loadString("Admin not work in production.");
  }

  const { options } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "start admin", ND.ENV));

  prompt<PasswordType>([password]).then(answers => {
    if (answers.password !== ND.Z()) {
      Throw(SECURITY_FAIL_ERR, "You not admin.");
    }

    prompt<TokenDataType>(information).then(answers => {
      const token = CreateToken(answers);
      if (options.json) {
        // tslint:disable-next-line
        console.log(
          JSON.stringify({
            token,
            username: answers.fullname,
          }),
        );
      } else {
        log(WrapTMC("info", `Token for ${ND.PROJECT_NAME} v${ND.VERSION}`, token));
      }
    });
  });
};
