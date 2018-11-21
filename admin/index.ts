import inquirer from "inquirer";
import Random from "random-js";
import yargs, { Arguments } from "yargs";

import { ConvertToRequireTokenData, DecryptToken, EncryptToken, RequireTokenData } from "../security/index-dev";

import { checkPassword, expireDateChoice, notBeforeDateChoice } from "./_data";
import { question } from "./_utils";

// tslint:disable-next-line
yargs
  .scriptName("nd-admin")
  .usage("Usage: $0 <command> [options] args...")
  .command(
    "random <numbers..>",
    "Random number",
    yargs => {
      return yargs
        .option("json", {
          alias: "J",
          desc: "Output as JSON format",
        })
        .option("format", {
          alias: "F",
          desc: "Make beautiful format",
        })
        .positional("number", {
          describe: "Number of length of the random string [usually should be 24]",
          type: "string",
        });
    },
    (argv: Arguments) => {
      const engine = Random.engines.mt19937().autoSeed();
      const rand = new Random(engine);

      const results: string[] = [];

      (argv.numbers as string[]).forEach(number => {
        const size = parseInt(number);
        const result = rand.string(size, "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789");
        results.push(result);
      });

      if (argv.json) console.log(JSON.stringify({ random: results }, undefined, argv.format ? " " : undefined));
      else console.log(results);
    },
  )
  .command(
    ["create [specifyVersion]", "$0 [specifyVersion]"],
    "Create token for specify version",
    yargs => {
      return yargs
        .option("username", {
          desc: "Username will show everytime you run the command",
        })
        .option("fullname", {
          desc: "You name must follow this format: name surname email",
        })
        .option("expire", {
          desc: `Expire date must be one of this list ${expireDateChoice.map(v => v.value)}`,
          choices: expireDateChoice.map(v => v.value),
        })
        .option("not-before", {
          desc: `not before date must be one of this list ${notBeforeDateChoice.map(v => v.value)}`,
          choices: notBeforeDateChoice.map(v => v.value),
        })
        .option("version-range", {
          desc: "Range of the version that token will be applied to",
        })
        .option("json", {
          alias: "J",
          desc: "Output as JSON format",
        })
        .option("format", {
          alias: "F",
          desc: "Make beautiful format",
        })
        .option("yes", {
          alias: "Y",
          desc: "Alway say yes",
        })
        .positional("specifyVersion", {
          describe: "token for nd command version?",
          type: "string",
        });
    },
    (argv: Arguments) => {
      const version = argv.specifyVersion;

      inquirer
        .prompt<{ password: string }>({
          type: "password",
          name: "password",
          message: "Enter command password",
          mask: "",
        })
        .then(({ password }) => {
          if (!checkPassword(password)) {
            console.error("Wrong command password");
            process.exit(1);
          }

          console.log(`For version: ${version}`);
          const defaultAnswer: RequireTokenData = {
            version,
            username: argv.username,
            fullname: argv.fullname,
            expiredate: argv.expire,
            notbeforedate: argv.notBefore,
            versionrange: argv.versionRange,
            issuedate: "",
          };

          const print = (token: string, fullname: string) => {
            if (argv.json)
              console.log(JSON.stringify({ token, username: fullname }, undefined, argv.format ? " " : undefined));
            else console.log(`${argv.format ? `token: ${token}\nusername: ${fullname}` : `${token}`}`);
          };

          if (argv.yes) print(EncryptToken(defaultAnswer), defaultAnswer.fullname);
          else
            inquirer.prompt<RequireTokenData>(question(defaultAnswer)).then(answer => {
              print(EncryptToken(answer), answer.fullname);
            });
        });
    },
  )
  .command(
    "read <ver> [string]",
    "Read the token and generate report",
    {
      json: {
        alias: "J",
        desc: "Mark input as json format",
        conflicts: ["username", "token"],
      },
      fullname: {
        alias: "N",
        desc: "specify fullname of the token",
        conflicts: "json",
      },
      token: {
        alias: "T",
        desc: "specify command token",
        conflicts: "json",
      },
    },
    (argv: Arguments) => {
      const version = argv.ver;

      const json = argv.json ? JSON.parse(argv.string) : { fullname: argv.fullname, token: argv.token };
      json.version = version;

      const _result = DecryptToken(json);
      const result = ConvertToRequireTokenData(_result, json.fullname);

      console.log(`# Information
Version: ${result.version}
Apply to version: ${result.versionrange}
Name:     ${result.fullname}
Username: ${result.username}

# Date
Issue at:   ${new Date(_result.iat * 1000)}
Not before: ${new Date(_result.nbf * 1000)}
Expire at:  ${new Date(_result.exp * 1000)}`);
    },
  )
  .example("$0 random 24", "random string that size 24 (the string contain english character and number)")
  .example("$0 create [1.0.0]", "Open interactive prompt to create the token of command version 1.0.0")
  .example("$0 read 1.0.0 <key>", "Read the input key and create the report of the key")
  .help("h")
  .alias("h", "help")
  .epilog("copyright ©2018, Kamontat Chantrachirathumrong").argv;
