/**
 * @internal
 * @module nd.novel.model
 */

import Bluebird from "bluebird";

import { FetchApi } from "../../apis/download";
import { Writer } from "../../apis/fileWriter";
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
      const content = HtmlBuilder.buildContent(res.chapter, res.cheerio);

      if (content) {
        const html = HtmlBuilder.template(this._nid)
          .addNovel(this._novel)
          .addContent(content)
          .renderDefault();

        return Writer.ByChapter(html, res.chapter, force);
      } else {
        return Bluebird.reject(res.chapter.throw());
      }
    });
  }
}
