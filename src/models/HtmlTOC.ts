/**
 * @internal
 * @module nd.html
 */

import { Novel } from "./Novel";
import { log } from "winston";
import { WrapTM } from "./LoggerWrapper";

export class HtmlToc {
  _novel: Novel;
  constructor(novel: Novel) {
    this._novel = novel;
  }

  build() {
    return this._novel.completedChapter;
  }
}
