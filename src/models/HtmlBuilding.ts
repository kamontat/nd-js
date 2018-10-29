/**
 * @internal
 * @module nd.html
 */

import { HtmlBuilder } from "../builder/html";
import { NovelChapter } from "../models/Chapter";
import { HtmlContent } from "../models/HtmlContent";
import { HtmlTemplate } from "../models/HtmlTemplate";
import { HtmlToc } from "../models/HtmlTOC";
import { Novel } from "../models/Novel";

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
      .addLastUpdate(chapter.getDate());
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
