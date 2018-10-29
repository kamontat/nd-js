/**
 * @internal
 * @module nd.html
 */

import moment = require("moment");
import { render } from "mustache";

import { DEFAULT_CSS_TEMPLATE, HTML_FILE } from "../constants/html.const";
import { ND } from "../constants/nd.const";
import { GetLinkWithChapter } from "../helpers/novel";

import { NovelChapter } from "./Chapter";
import { CssTemplate } from "./HtmlCss";

export class HtmlTemplate {

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
  public novelID: string;
  public novelName?: string;

  public chapterNumber: string;
  public chapterName?: string;

  public lastUpdate?: string;

  public next?: string;
  public prev?: string;

  public content: string;

  public toc?: NovelChapter[];

  public link?: string; // update when call build
  public command?: string; // update when call build
  public version?: string; // update when call build
  public date?: string; // update when call build
  public css?: string; // update when call build

  public render(html: string, css: CssTemplate) {
    this.lastUpdate = this.lastUpdate === "Invalid date" ? "" : this.lastUpdate;

    const chap = parseInt(this.chapterNumber);

    this.next = (chap + 1).toString();
    this.prev = chap <= 1 ? "0" : (chap - 1).toString();

    this.date = moment().format("dddd, Do MMM YYYY | HH.mm.ss Z");
    this.command = ND.PROJECT_NAME;
    this.version = ND.VERSION;
    this.css = css.getStyle();

    const link = GetLinkWithChapter(this.novelID, this.chapterNumber);
    this.link = link && link.toString();
    return render(html, this);
  }

  public renderDefault() {
    return this.render(HTML_FILE, DEFAULT_CSS_TEMPLATE);
  }
}
