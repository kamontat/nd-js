/**
 * @internal
 * @module nd.html
 */

import { Novel } from "./Novel";

export class HtmlToc {
  _novel: Novel;
  constructor(novel: Novel) {
    this._novel = novel;
  }

  build() {
    // TODO: Implement build toc by novel
    return "";
  }
}
