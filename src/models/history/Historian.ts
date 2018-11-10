/**
 * @internal
 * @module nd.history
 */

import { Observable } from "../Observable";

import { History } from "./History";
import { HistoryNode } from "./HistoryNode";

export class Historian extends Observable<HistoryNode> {
  protected initial() {
    this.loadObserver(new History());
  }

  protected updateHistory(history: History) {
    this.history()
      .list()
      .forEach(change => {
        history.notify(change);
      });

    this.loadObserver(history);
  }

  constructor() {
    super();
    this.initial();
  }

  public history() {
    return this.observe() as History;
  }

  public resetHistory() {
    this.history().resetNode();
  }

  public linkTo(historian: Historian) {
    this.updateHistory(historian.history());
  }
}
