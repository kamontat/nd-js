/**
 * @internal
 * @module output.logger.model
 */

import terminalLink from "terminal-link";
import { log } from "winston";

import { WrapTMCT } from "../../apis/loggerWrapper";
import { COLORS } from "../../constants/color.const";
import { GetLink } from "../../helpers/novel";
import { Printer, PrintOption } from "../Printer";

import { CPrinter } from "./CPrinter";
import { Novel } from "./Novel";

export class NPrinter implements Printer {
  private novel: Novel;
  constructor(n: Novel) {
    this.novel = n;
  }

  public format(opt?: PrintOption) {
    const link = GetLink(this.novel.id);

    if (opt && opt.short)
      return `${terminalLink(this.novel.id, (link && link.toString()) || "")} ${terminalLink(
        this.novel.name || "no-name",
        `file://${this.novel.location}`,
      )}`;

    return `
Novel ID:      ${terminalLink(this.novel.id, (link && link.toString()) || "")}
Novel name:    ${terminalLink(this.novel.name || "no-name", `file://${this.novel.location}`)}
Novel chapter: [${this.novel.chapter({ copy: true }).map(n => n.number)}]
Download:      ${this.novel.startDownloadAt.toString()}
Update At:     ${this.novel.lastUpdateAt.toString()}
    `;
  }

  public print(opt?: PrintOption) {
    const link = GetLink(this.novel.id);

    log(
      WrapTMCT("info", "Novel link", terminalLink(this.novel.id, (link && link.toString()) || ""), {
        message: COLORS.Link,
      }),
    );
    log(
      WrapTMCT("info", "Novel name", terminalLink(this.novel.name || "no-name", `file://${this.novel.location}`), {
        message: COLORS.Name,
      }),
    );

    const comp = this.novel.completedChapter.map(c => c.number);
    if (comp.length > 0) log(WrapTMCT("info", "Completed chapter", comp));
    const sold = this.novel.soldChapter.map(c => c.number);
    if (sold.length > 0) log(WrapTMCT("warn", "Sold chapter", sold));
    const clos = this.novel.closedChapter.map(c => c.number);
    if (clos.length > 0) log(WrapTMCT("warn", "Closed chapter", clos));
    const unkn = this.novel.unknownChapter.map(c => c.number);
    if (unkn.length > 0) log(WrapTMCT("error", "Unknown chapter", unkn));

    if (this.novel.chapterSize.size > 0 && opt && !opt.short) {
      const printer = new CPrinter();
      this.novel.chapter({ copy: true }).map(c => printer.setChapter(c).print());
    }

    log(WrapTMCT("verbose", "Download at", this.novel.startDownloadAt));
    log(WrapTMCT("verbose", "Update at", this.novel.lastUpdateAt));
  }
}
