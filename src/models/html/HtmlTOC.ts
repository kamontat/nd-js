/**
 * @internal
 * @module nd.html
 */

import { log } from "winston";

import { WrapTM } from "../output/LoggerWrapper";
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
