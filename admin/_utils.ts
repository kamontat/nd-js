import { IsFullName, ListVersion, RequireTokenData } from "../security/index-admin";

import { expireDateChoice, notBeforeDateChoice, versionChoice } from "./_data";

export const question = (answer: RequireTokenData) => {
  return [
    {
      type: "list",
      choices: ListVersion(),
      name: "version",
      message: "Each version will have there own key and token: ",
      default: answer.version,
    },
    {
      type: "input",
      name: "fullname",
      message: "Enter your full name (name surname email)",
      default: answer.fullname,
      validate: (v: string) => IsFullName(v, undefined),
    },
    { type: "input", name: "username", message: "Enter username", default: answer.username },
    {
      type: "list",
      name: "expiredate",
      message: "Token expire date",
      default: answer.expiredate,
      choices: expireDateChoice,
    },
    {
      type: "list",
      name: "notbeforedate",
      message: "When the token can be use",
      default: answer.issuedate,
      choices: notBeforeDateChoice,
    },
    {
      type: "list",
      name: "versionrange",
      message: "Range of version can be use",
      default: answer.versionrange,
      choices: (answer: RequireTokenData) => versionChoice(answer.version),
    },
  ];
};
