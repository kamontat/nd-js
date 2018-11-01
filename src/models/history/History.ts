/**
 * @internal
 * @module nd.history
 */

import SortedArrayMap from "collections/sorted-array-map";

import { Observer } from "../Observer";

import { HistoryAction, HistoryNode } from "./HistoryNode";

export class History extends Observer<HistoryNode> {
  private nodes: SortedArrayMap<HistoryNode>;

  constructor() {
    super();

    this.nodes = new SortedArrayMap(undefined, HistoryNode.Equals, HistoryNode.Compare);
    this.addAction(v => {
      this.addNode(v);
    });
  }

  public addNode(node: HistoryNode) {
    this.nodes.add(node, node.id);
    return this;
  }

  public resetNode() {
    this.nodes = new SortedArrayMap(undefined, HistoryNode.Equals, HistoryNode.Compare);
    return this;
  }

  public size() {
    return this.nodes.length;
  }

  public list() {
    return this.nodes.toArray();
  }
}
