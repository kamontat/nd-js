/**
 * @internal
 * @module nd.html
 */

import moment = require("moment");
import { render } from "mustache";

import { CssTemplate } from "./HtmlCss";
import { PROJECT_NAME, VERSION } from "../constants/nd.const";
import { HTML_FILE, DEFAULT_CSS_TEMPLATE } from "../constants/html.const";
import { NovelChapter } from "./Chapter";

export class HtmlTemplate {
  novelID: string;
  novelName?: string;

  chapterNumber: string;
  chapterName?: string;

  lastUpdate?: string;

  next?: string;
  prev?: string;

  content: string;

  toc?: NovelChapter[];

  command?: string; // update when call build
  version?: string; // update when call build
  date?: string; // update when call build
  css?: string; // update when call build

  constructor(build: {
    id: string;
    name?: string;
    chapterNumber: string;
    chapterName?: string;
    lastUpdate?: string;
    content: string;
    toc?: string;
  }) {
    this.novelID = build.id;
    this.novelName = build.name;

    this.chapterName = build.chapterName;
    this.chapterNumber = build.chapterNumber;
    this.lastUpdate = build.lastUpdate === "Invalid date" ? "" : build.lastUpdate;

    this.content = build.content;
  }

  render(html: string, css: CssTemplate) {
    this.lastUpdate = this.lastUpdate === "Invalid date" ? "" : this.lastUpdate;

    const chap = parseInt(this.chapterNumber);

    this.next = (chap + 1).toString();
    this.prev = chap <= 1 ? "0" : (chap - 1).toString();

    this.date = moment().format("dddd, Do MMM YYYY | HH.mm.ss Z");
    this.command = PROJECT_NAME;
    this.version = VERSION;
    this.css = css.getStyle();
    return render(html, this);
  }

  renderDefault() {
    // console.log(this.chapterName);
    return this.render(HTML_FILE, DEFAULT_CSS_TEMPLATE);
  }
}
