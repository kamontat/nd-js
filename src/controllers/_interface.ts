import Vorpal from "vorpal";
import { Logger } from "winston";

export interface Controller {
  Command: string;
  Alias: string[];
  Description: string;
  VorpalAction?: (logger: Logger) => Vorpal.Action;
  Action?: (logger: Logger) => (args: string[]) => void;
}
