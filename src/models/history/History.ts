/**
 * @internal
 * @module nd.history.model
 */

import SortedArraySet from "collections/sorted-array-set";
import { log } from "winston";

import { WrapTM } from "../../apis/loggerWrapper";
import { DEFAULT_MAXIMUM_HISTORY } from "../../constants/novel.const";
import { Observer } from "../Observer";

import { HistoryNode } from "./HistoryNode";

export class History extends Observer<HistoryNode> {
  private nodes: SortedArraySet<HistoryNode>;

  constructor() {
    super();

    this.nodes = new SortedArraySet(
      undefined,
      HistoryNode.Equals,
      HistoryNode.Compare,
    );
    this.addAction(v => {
      if (v) this.addNode(v);
    });
  }

  public addNode(node: HistoryNode) {
    log(WrapTM("debug", "History added", node.toJSON()));
    if (this.nodes.length >= DEFAULT_MAXIMUM_HISTORY) {
      const removed = this.nodes.pop();
      log(WrapTM("debug", "History removed", removed.toJSON()));
    }
    this.nodes.add(node);
    return this;
  }

  public resetNode() {
    this.nodes = new SortedArraySet(
      undefined,
      HistoryNode.Equals,
      HistoryNode.Compare,
    );
    return this;
  }

  public size(): number {
    return this.nodes.length;
  }

  public list() {
    return this.nodes.toArray().reverse() as HistoryNode[]; // reverse top=oldest
  }

  public toJSON() {
    return this.nodes.toArray().map(node => node.toJSON());
  }
}
