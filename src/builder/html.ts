/**
 * @internal
 * @module nd.html.model.builder
 */

import { GetNovelContent } from "../apis/novel";
import { HtmlBuild } from "../models/html/HtmlBuilding";
import { HtmlContent } from "../models/html/HtmlContent";
import { HtmlToc } from "../models/html/HtmlTOC";
import { NovelChapter } from "../models/novel/Chapter";
import { Novel } from "../models/novel/Novel";

export class HtmlBuilder {
  public static template(id: string) {
    return new HtmlBuild(id);
  }

  public static buildContent(chapter: NovelChapter, $: CheerioStatic) {
    const build = new HtmlContent();
    const content = GetNovelContent(chapter, $);
    if (!content) return;

    build.adds(content);
    return build;
  }

  public static buildToc(novel: Novel) {
    return new HtmlToc(novel);
  }
}
