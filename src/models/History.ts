/**
 * @internal
 * @module nd.history
 */

import { Moment } from "moment";

import { HistoryAction, HistoryNode } from "./HistoryNode";

export class History {
  private nodes: HistoryNode[];
  private linked: History[];

  private _list() {
    const result = this.linked.reduce((p, c) => {
      p.push(...c._list());
      return p;
    }, this.nodes.copyWithin(0, 0));

    return result.sort((a, b) => {
      const ajson = a.toJSON();
      const bjson = b.toJSON();
      if (ajson.time === bjson.time) {
        return 0;
      } else if (ajson.time > bjson.time) {
        return -1;
      } else {
        return 1;
      }
    });
  }

  constructor() {
    this.nodes = [];
    this.linked = [];
  }

  public link(history: History) {
    this.linked.push(history);
  }

  public addNode(node: HistoryNode) {
    this.nodes.push(node);
    return this;
  }

  public addADDNode(title: string, value: { after: string }, opt?: { description?: string; time?: Moment }) {
    this.nodes.push(new HistoryNode(HistoryAction.ADDED, title, value, opt));
  }

  public addMODIFIEDNode(
    title: string,
    value: { before: string; after: string },
    opt?: { description?: string; time?: Moment },
  ) {
    this.nodes.push(new HistoryNode(HistoryAction.MODIFIED, title, value, opt));
  }

  public addDELETEDNode(title: string, value: { before: string }, opt?: { description?: string; time?: Moment }) {
    this.nodes.push(new HistoryNode(HistoryAction.DELETED, title, value, opt));
  }

  public addNodes(nodes: HistoryNode[]) {
    this.nodes.push(...nodes);
    return this;
  }

  public resetNode() {
    this.nodes = [];
    return this;
  }

  public size() {
    return this.list().length;
  }

  public list(opt?: {
    map?(node: HistoryNode): string;
    reduce?(previousValue: string, currentValue: HistoryNode, currentIndex?: number): string;
  }) {
    if (opt) {
      if (opt.map) {
        return this._list().map(opt.map);
      } else if (opt.reduce) {
        return this._list().reduce(opt.reduce, "");
      }
    }
    return this._list();
  }
}
