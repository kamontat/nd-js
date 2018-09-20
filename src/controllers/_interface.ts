import Vorpal from "vorpal";
import { CommanderStatic } from "commander";

export type Option = {
  option: string;
  description: string;
  action?: (val: any, defaultValue?: any) => string | void;
  defaultValue?: any;
};

export interface Controller {
  Command: string;
  Alias: string[];
  Description: string;
  VorpalAction?: Vorpal.Action;
  Options?: Option[];
  Action?: (options: any, args: object[]) => void;
}
