/**
 * @internal
 * @module output.logger.model
 */

import { log } from "winston";

import { WrapTMCT } from "../../apis/loggerWrapper";
import { COLORS } from "../../constants/color.const";
import { Printer, PrintOption } from "../Printer";

import { NovelChapter } from "./Chapter";

export class CPrinter implements Printer {
  private chapter?: NovelChapter;

  constructor(c?: NovelChapter) {
    this.chapter = c;
  }

  public setChapter(c: NovelChapter) {
    this.chapter = c;
    return this;
  }

  public format(opt?: PrintOption) {
    if (!this.chapter) return "";

    if (opt && opt.short === false) {
      return this.chapter.toString();
    } else {
      // return `chapter #${this.chapter.number} was ${this.chapter.}`
      return this.chapter.format("chapter {{number}} is {{status}}");
      // return JSON.stringify(this.chapter.toJSON());
    }
  }

  public print(opt?: PrintOption) {
    if (!this.chapter) return;

    const json = this.chapter.toJSON();

    if (opt && opt.short)
      log(
        WrapTMCT("info", this.chapter.head(), `${COLORS.Name.color(json.name)}`),
      );
    else
      log(
        WrapTMCT(
          "info",
          `${this.chapter.head()}`,
          `${COLORS.Name.color(json.name)} [${COLORS.DateTime.color(
            this.chapter.date,
          )}] ${COLORS.Important.color(json.status)}`,
        ),
      );
  }
}
