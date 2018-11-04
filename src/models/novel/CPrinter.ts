import { log } from "winston";

import { COLORS } from "../../constants/color.const";
import { WrapTMCT } from "../output/LoggerWrapper";
import { Printer, PrintOption } from "../Printer";

import { NovelChapter } from "./Chapter";

export class CPrinter implements Printer {
  private chapter: NovelChapter;

  constructor(c: NovelChapter) {
    this.chapter = c;
  }

  public format(opt?: PrintOption) {
    return (opt && opt.short && "short") || "long";
  }

  public print(opt?: PrintOption) {
    const json = this.chapter.toJSON();

    if (opt && opt.short)
      log(
        WrapTMCT(
          "info",
          this.chapter.head(),
          `${COLORS.Name.color(json.name)} [${COLORS.DateTime.color(this.chapter.date)}]`,
        ),
      );
    else
      log(
        WrapTMCT(
          "info",
          this.chapter.head(),
          `[${COLORS.Important.color(json.status)}] ${COLORS.Name.color(json.name)} [${COLORS.DateTime.color(
            this.chapter.date,
          )}]`,
        ),
      );
  }
}
