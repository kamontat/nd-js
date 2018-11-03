/**
 * @internal
 * @module nd.history
 */

import SortedArraySet from "collections/sorted-array-set";

import { Observer } from "../Observer";

import { HistoryNode } from "./HistoryNode";
import { DEFAULT_MAXIMUM_HISTORY } from "../../constants/novel.const";

export class History extends Observer<HistoryNode> {
  private nodes: SortedArraySet<HistoryNode>;

  constructor() {
    super();

    this.nodes = new SortedArraySet(undefined, HistoryNode.Equals, HistoryNode.Compare);
    this.addAction(v => {
      if (v) this.addNode(v);
    });
  }

  public addNode(node: HistoryNode) {
    if (this.nodes.length >= DEFAULT_MAXIMUM_HISTORY) {
      this.nodes.shift();
    }
    this.nodes.add(node);
    return this;
  }

  public resetNode() {
    this.nodes = new SortedArraySet(undefined, HistoryNode.Equals, HistoryNode.Compare);
    return this;
  }

  public size(): number {
    return this.nodes.length;
  }

  public list() {
    return this.nodes.toArray() as HistoryNode[];
  }

  public toJSON() {
    return this.nodes.toArray().map(node => node.toJSON());
  }
}
