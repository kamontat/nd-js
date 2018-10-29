/**
 * @internal
 * @module nd.html.builder
 */

import { GetNovelContent } from "../apis/novel";
import { NovelChapter } from "../models/Chapter";
import { HtmlBuild } from "../models/HtmlBuilding";
import { HtmlContent } from "../models/HtmlContent";
import { HtmlToc } from "../models/HtmlTOC";
import { Novel } from "../models/Novel";

export class HtmlBuilder {
  public static template(id: string) {
    return new HtmlBuild(id);
  }

  public static buildContent(chapter: NovelChapter, $: CheerioStatic) {
    const content = new HtmlContent();
    content.adds(GetNovelContent(chapter, $));
    return content;
  }

  public static buildToc(novel: Novel) {
    return new HtmlToc(novel);
  }
}
