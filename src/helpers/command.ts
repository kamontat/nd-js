import Vorpal from "vorpal";
import { CommanderStatic } from "commander";
import { Controller } from "../controllers/_interface";
import winston from "winston";
import setting from "../models/Logger";

function preaction(option: any) {
  let level: "info" | "verbose" | "error" | "debug" = "info";

  if (option.parent.quiet) level = "error";
  if (option.parent.debug) level = "debug";
  if (option.parent.verbose) level = "verbose";

  winston.configure(setting({ level: level }));
}

function postaction() {
  process.exit(0);
}

export function VorpalRegister(cli: Vorpal, controller: Controller, action?: Vorpal.Action) {
  let c = cli.command(controller.Command, controller.Description);
  controller.Alias.forEach(v => {
    c.alias(v);
  });

  if (controller.Options) {
    controller.Options.forEach(function(v) {
      c.option(v.option, v.description);
    });
  }

  if (action) {
    c.action(action);
  } else if (controller.VorpalAction) {
    c.action(controller.VorpalAction);
  }
}

export function CommanderRegister(program: CommanderStatic, controller: Controller, action?: (args: string[]) => void) {
  let c = program.command(controller.Command).description(controller.Description);
  let result = [controller.Command];

  // FIXME: commander not support multiple alias
  // https://github.com/tj/commander.js/issues/531
  // controller.Alias.forEach(c.alias);

  if (controller.Alias.length > 0) {
    c.alias(controller.Alias[0]);
    result.push(controller.Alias[0]);
  }

  if (controller.Options) {
    controller.Options.forEach(function(v) {
      c.option(v.option, v.description, v.action, v.defaultValue);
    });
  }

  if (action) {
    c.action(action);
  } else if (controller.Action) {
    c.action(function(...args: object[]) {
      let options = args.pop();
      preaction(options);

      if (controller.Action) controller.Action(options, args);

      postaction();
    });
  }
  return result;
}
