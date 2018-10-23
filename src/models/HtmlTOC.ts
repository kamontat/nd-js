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
    if (this._novel._chapters) return this._novel._chapters.filter(c => c.isCompleted());
    else return [];
  }
}
