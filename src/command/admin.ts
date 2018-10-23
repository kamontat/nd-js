import { SeperateArgumentApi } from "../helpers/action";
import { log } from "winston";
import { WrapTMC } from "../models/LoggerWrapper";
import { prompt } from "inquirer";
import { ND } from "../constants/nd.const";
import { Throw } from "../helpers/action";
import { SECURITY_FAIL_ERR } from "../constants/error.const";
import { TokenDataType, CreateToken } from "../apis/token";
import { UsernameValidator } from "../models/Security";

type passwordType = { password: string };
const password = {
  type: "password",
  message: "Enter a admin password",
  name: "password",
  mask: "*"
};

const information = [
  {
    type: "input",
    name: "fullname",
    message: "Enter your full name (name surname email)",
    validate: (str: string) => new UsernameValidator(str).isValid()
  },
  {
    type: "input",
    name: "username",
    message: "Enter username"
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
      { name: "1 year", value: "1y" }
    ]
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
      { name: "1 day", value: "1d" }
    ]
  }
];

export default (a: any) => {
  if (ND.isProd()) throw SECURITY_FAIL_ERR.loadString("Admin not work in production.");
  const { options } = SeperateArgumentApi(a);
  log(WrapTMC("verbose", "start admin", ND.ENV));
  prompt<passwordType>([password]).then(answers => {
    if (answers.password !== ND.Z) {
      Throw(SECURITY_FAIL_ERR, "You not admin.");
    }

    prompt<TokenDataType>(information).then(answers => {
      const token = CreateToken(answers);
      if (options.json)
        console.log(
          JSON.stringify({
            token: token,
            username: answers.fullname
          })
        );
      else log(WrapTMC("info", `Token for ${ND.PROJECT_NAME} v${ND.VERSION}`, token));
    });
  });
};
