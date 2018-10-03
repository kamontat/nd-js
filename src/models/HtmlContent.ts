/**
 * @internal
 * @module nd.html
 */

import { load } from "cheerio";
import { HtmlNode } from "./HtmlNode";

export class HtmlContent {
  _nodes: HtmlNode[];
  constructor() {
    this._nodes = [];
  }

  add(node: HtmlNode) {
    this._nodes.push(node);
  }

  adds(nodes: HtmlNode[]) {
    this._nodes.push(...nodes);
  }

  build() {
    let content = load("<div></div>", {
      decodeEntities: false,
      lowerCaseTags: true,
      xmlMode: false
    });

    let result: Cheerio | undefined = undefined;

    for (let n = 0; n < this._nodes.length; n++) {
      let node = this._nodes[n];
      let tag = `<${node.tag}>${node.text}</${node.tag}>`;
      if (result) {
        result = result.append(tag);
      } else {
        result = content
          .root()
          .find("div")
          .append(tag);
      }
    }
    return (result && result.parent().html()) || "";
  }
}
