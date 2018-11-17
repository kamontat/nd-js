/**
 * @internal
 * @module nd.html.model
 */

import { load } from "cheerio";

import { HtmlNode } from "./HtmlNode";

export class HtmlContent {
  constructor() {
    this._nodes = [];
  }
  public _nodes: HtmlNode[];

  public add(node: HtmlNode) {
    this._nodes.push(node);
  }

  public adds(nodes: HtmlNode[]) {
    this._nodes.push(...nodes);
  }

  public build() {
    const content = load("<div></div>", {
      decodeEntities: false,
      lowerCaseTags: true,
      xmlMode: false,
    });

    let result: Cheerio | undefined;

    for (const node of this._nodes) {
      const tag = `<${node.tag}>${node.text}</${node.tag}>`;
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
