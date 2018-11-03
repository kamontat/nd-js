/**
 * @internal
 * @module nd.resource
 */

import { History } from "../history/History";
import { HistoryNodeType } from "../history/HistoryNode";

export type HistoryResourceType = HistoryNodeType[];

export class HistoryResource {
  private history?: History;

  constructor() {}

  public load(history: History) {
    this.history = history;
  }

  public build(): HistoryResourceType {
    if (!this.history) return [];
    return this.history.toJSON();
  }
}
