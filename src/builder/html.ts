import { HtmlTemplate } from "../models/HtmlTemplate";
import { HtmlContent } from "../models/HtmlContent";
import { HtmlToc } from "../models/HtmlTOC";
import { NovelChapter } from "../models/Chapter";
import { Novel } from "../models/Novel";
import { GetNovelContent } from "../apis/novel";

export class HtmlBuild extends HtmlTemplate {
  constructor(id: string) {
    super({
      id: id,
      chapterNumber: "",
      content: ""
    });
  }

  addNovel(novel: Novel) {
    return this.addName(novel.name)
      .addChapNum("0")
      .addToc(HtmlBuilder.buildToc(novel));
  }

  addName(name?: string) {
    this.novelName = name;
    return this;
  }

  addChap(chapter: NovelChapter) {
    return this.addChapName(chapter.name)
      .addChapNum(chapter.number)
      .addLastUpdate(chapter.getDate());
  }

  addChapNum(chapterNumber: string) {
    this.chapterNumber = chapterNumber;
    return this;
  }

  addChapName(name: string | undefined) {
    this.chapterName = name;
    return this;
  }

  addLastUpdate(date: string | undefined) {
    this.lastUpdate = date;
    return this;
  }

  addContent(content: HtmlContent) {
    this.content = content.build();
    return this;
  }

  addToc(toc: HtmlToc) {
    this.toc = toc.build();
    return this;
  }
}

export class HtmlBuilder {
  static template(id: string) {
    return new HtmlBuild(id);
  }

  static buildContent(chapter: NovelChapter, $: CheerioStatic) {
    const content = new HtmlContent();
    content.adds(GetNovelContent(chapter, $));
    return content;
  }

  static buildToc(novel: Novel) {
    return new HtmlToc(novel);
  }
}
