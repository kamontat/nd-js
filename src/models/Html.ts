import $, { load } from "cheerio";
import { log } from "winston";
import Mustache, { render } from "mustache";
import { WrapTM, WrapTMC } from "../models/LoggerWrapper";
import { NovelChapter } from "./Novel";
import { HtmlTitleTemplate, HTML_FILE } from "../constants/htmlConst";
import { PROJECT_NAME } from "../constants/nd.const";

export type HtmlContent = {
  title: string;
  novelName?: string;
  chapterName: string;
  chapterNumber: string;
  content: string;

  id: string;
  date: string;
  command: string;
};

export interface HtmlNode {
  tag: string;
  text: string;
}

export class HtmlTemplateConstant {
  _name: string;
  _css: string;

  constructor(name: string, css: string) {
    this._name = name;
    this._css = css;
  }

  build(content: HtmlContent) {
    // log(WrapTM("debug", "build content", content)); // too huge

    let chap = parseInt(content.chapterNumber);

    let nextChap = chap + 1;
    let prevChap = chap - 1;
    prevChap = prevChap < 0 ? 0 : prevChap;

    let build = Object.assign(
      {
        css: this._css,
        nextChapter: nextChap,
        previousChapter: prevChap
      },
      content
    );
    return render(HTML_FILE, build);
  }
}

export class HtmlTemplate {
  _template: HtmlTemplateConstant;

  _nid: string;

  _title: string;
  _chapterName: string;
  _chapterNumber: string;

  _nodes: HtmlNode[];

  constructor(template: HtmlTemplateConstant) {
    this._template = template;
    this._nid = "";
    this._title = ""; // head tag in html
    this._chapterName = ""; // novel chapter in body
    this._chapterNumber = "0";
    this._nodes = [];
  }

  setTitle(head: string) {
    this._title = head;
    log(WrapTMC("debug", "Html head title", this._title));
    return this;
  }

  setChapterName(title: string) {
    this._chapterName = title;
    log(WrapTMC("debug", "Html chapter name", this._chapterName));
    return this;
  }

  setChapterNumber(number: string) {
    this._chapterNumber = number;
    log(WrapTMC("debug", "Html Chapter number", this._chapterNumber));
    return this;
  }

  setNID(id: string) {
    this._nid = id;
    return this;
  }

  setChapter(chapter: NovelChapter) {
    this.setTitle(render(HtmlTitleTemplate, { nid: chapter._nid, chapterNumber: chapter._chapterNumber }));
    this.setChapterName(chapter._name || "");
    this.setChapterNumber(chapter._chapterNumber);
    this.setNID(chapter._nid);
    return this;
  }

  add(node: HtmlNode) {
    this._nodes.push(node);
  }

  adds(nodes: HtmlNode[]) {
    this._nodes.push(...nodes);
  }

  build(): string {
    let content = load("<div></div>", {
      decodeEntities: false,
      lowerCaseTags: true,
      xmlMode: false
    });

    let result: Cheerio | undefined = undefined;

    for (let n = 0; n < this._nodes.length; n++) {
      let node = this._nodes[n];
      let tag = `<${node.tag}>${node.text}</${node.tag}>`;
      if (result) {
        result = result.append(tag);
      } else {
        result = content
          .root()
          .find("div")
          .append(tag);
      }
    }

    let html = "";
    if (result) {
      html = result.parent().html() || "";
    }

    return this._template.build({
      title: this._title,
      chapterName: this._chapterName,
      chapterNumber: this._chapterNumber,
      content: html,
      id: this._nid,
      command: PROJECT_NAME,
      date: new Date().toLocaleString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
        hour12: false,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit"
      })
    });
  }
}
