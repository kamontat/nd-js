/**
 * @internal
 * @module output.logger.model
 */

import { log } from "winston";

import { WrapTMCT } from "../../apis/loggerWrapper";
import { COLORS } from "../../constants/color.const";
import { Printer, PrintOption } from "../Printer";

import { History } from "./History";
import { HistoryAction } from "./HistoryAction";

export class HPrinter implements Printer {
  private title: string;
  private history: History;

  constructor(history: History, title?: string) {
    this.title = title || "History";
    this.history = history;
  }

  public format(opt?: PrintOption) {
    return this.history.list().reduce((p, c, i) => {
      p = `${(opt && opt.short && "") ||
        `${this.title} #${i}: `}${c.toString()}`;

      if (p === "") return p;
      return p + "\n";
    }, "");
  }

  public print(opt?: PrintOption) {
    const history = this.history.list();
    if (opt && opt.short) {
      const stat = history.reduce(
        (p, c) => {
          if (p[c.action]) p[c.action] += 1;
          else p[c.action] = 1;
          return p;
        },
        {} as any,
      );

      log(
        WrapTMCT(
          "info",
          `${this.title} summary`,
          `Added=${COLORS.Number.color(
            stat[HistoryAction.ADDED] || 0,
          )}, Modified=${COLORS.Number.color(
            stat[HistoryAction.MODIFIED] || 0,
          )}, Deleted=${COLORS.Number.color(stat[HistoryAction.DELETED] || 0)}`,
        ),
      );

      return;
    }

    history.forEach((node, index) =>
      log(
        WrapTMCT(
          "info",
          `[${node.action.toUpperCase().charAt(0)}] ${this.title} #${index}`,
          node.toString(),
        ),
      ),
    );
  }
}
