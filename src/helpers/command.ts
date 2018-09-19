import Vorpal from "vorpal";
import { CommanderStatic } from "commander";
import { Controller } from "../controllers/_interface";
import { Logger } from "winston";

export function VorpalRegister(cli: Vorpal, logger: Logger, controller: Controller, action?: Vorpal.Action) {
  let c = cli.command(controller.Command, controller.Description);
  controller.Alias.forEach(v => {
    c.alias(v);
  });

  if (action) {
    c.action(action);
  } else if (controller.VorpalAction) {
    c.action(controller.VorpalAction(logger));
  }
}

export function CommanderRegister(
  program: CommanderStatic,
  logger: Logger,
  controller: Controller,
  action?: (args: string[]) => void
) {
  let c = program.command(controller.Command).description(controller.Description);
  let result = [controller.Command];

  // FIXME: commander not support multiple alias
  // https://github.com/tj/commander.js/issues/531
  // controller.Alias.forEach(c.alias);

  if (controller.Alias.length > 0) {
    c.alias(controller.Alias[0]);
    result.push(controller.Alias[0]);
  }

  if (action) {
    c.action(action);
  } else if (controller.Action) {
    c.action(controller.Action(logger));
  }

  return result;
}
