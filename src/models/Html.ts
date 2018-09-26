import $, { load } from "cheerio";
import { log } from "winston";
import Mustache, { render } from "mustache";
import { WrapTM, WrapTMC } from "../models/LoggerWrapper";
import { NovelChapter } from "./Novel";
import { HtmlTitleTemplate } from "../constants/htmlConst";

export type HtmlContent = {
  title: string;
  novelName: string;
  content: string;
};

export interface HtmlNode {
  tag: string;
  text: string;
}

export class HtmlTemplateConstant {
  _name: string;
  _html: string;

  constructor(name: string, html: string) {
    this._name = name;
    this._html = html;
  }

  build(content: HtmlContent) {
    log(WrapTM("debug", "build content", content));

    return render(this._html, content);
  }
}

export class HtmlTemplate {
  _template: HtmlTemplateConstant;

  _head: string;
  _title: string;
  _nodes: HtmlNode[];

  constructor(template: HtmlTemplateConstant) {
    this._template = template;
    this._head = ""; // head tag in html
    this._title = ""; // novel chapter in body
    this._nodes = [];
  }

  setHead(head: string) {
    this._head = head;
    return this;
  }

  setTitle(title: string) {
    this._title = title;
    return this;
  }

  setChapter(chapter: NovelChapter) {
    this.setHead(render(HtmlTitleTemplate, { nid: chapter._nid, chapterNumber: chapter._chapterNumber }));
    log(WrapTMC("debug", "Html head tag", this._head));
    this.setTitle(chapter._name || "");
    log(WrapTMC("debug", "Html title", this._title));
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
        console.log(`result 1: ${result.html()}`);
      } else {
        console.log(`content: ${content.html()}`);

        result = content
          .root()
          .find("div")
          .append(tag);
        console.log(`result 2: ${result.html()}`);
      }
    }

    let html = "";
    if (result) {
      html = result.parent().html() || "";
    }

    return this._template.build({ title: this._head, novelName: this._title, content: html });
  }
}
