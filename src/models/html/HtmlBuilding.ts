/**
 * @internal
 * @module nd.html.model.builder
 */

import { HtmlBuilder } from "../../builder/html";
import { NovelChapter } from "../novel/Chapter";
import { Novel } from "../novel/Novel";

import { HtmlContent } from "./HtmlContent";
import { HtmlTemplate } from "./HtmlTemplate";
import { HtmlToc } from "./HtmlTOC";

export class HtmlBuild extends HtmlTemplate {
  constructor(id: string) {
    super({
      id,
      chapterNumber: "",
      content: "",
    });
  }

  public addNovel(novel: Novel) {
    return this.addName(novel.name)
      .addChapNum("0")
      .addToc(HtmlBuilder.buildToc(novel));
  }

  public addName(name?: string) {
    this.novelName = name;
    return this;
  }

  public addChap(chapter: NovelChapter) {
    return this.addChapName(chapter.name)
      .addChapNum(chapter.number)
      .addLastUpdate(chapter.date.toString());
  }

  public addChapNum(chapterNumber: string) {
    this.chapterNumber = chapterNumber;
    return this;
  }

  public addChapName(name: string | undefined) {
    this.chapterName = name;
    return this;
  }

  public addLastUpdate(date: string | undefined) {
    this.lastUpdate = date;
    return this;
  }

  public addContent(content: HtmlContent) {
    this.content = content.build();
    return this;
  }

  public addToc(toc: HtmlToc) {
    this.toc = toc.build();
    return this;
  }
}
