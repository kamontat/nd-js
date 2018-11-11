/**
 * @internal
 * @module nd.novel.model
 */

import { FetchApi } from "../../apis/download";
import { WriteChapter } from "../../apis/file";
import { HtmlBuilder } from "../../builder/html";

import { NovelChapter } from "./Chapter";
import { Novel } from "./Novel";

export class NovelZeroChapter extends NovelChapter {
  private _novel: Novel;

  constructor(novel: Novel) {
    super(novel.id, "0", undefined, novel.location);

    this._novel = novel;
  }

  public download(force?: boolean) {
    return FetchApi(this).then(res => {
      const html = HtmlBuilder.template(this._nid)
        .addNovel(this._novel)
        .addContent(HtmlBuilder.buildContent(res.chapter, res.cheerio))
        .renderDefault();

      return WriteChapter(html, res.chapter, force);
    });
  }
}
