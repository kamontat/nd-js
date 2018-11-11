/**
 * @internal
 * @module nd.html.model
 */

import { Novel } from "../novel/Novel";

export class HtmlToc {
  constructor(novel: Novel) {
    this._novel = novel;
  }
  public _novel: Novel;

  public build() {
    return this._novel.completedChapter;
  }
}
