/**
 * @internal
 * @module nd.history
 */

export enum HistoryAction {
  ADDED = "Added",
  MODIFIED = "Modified",
  DELETED = "Deleted",
}

export class HistoryActionUtils {
  public static ToAction(str: string) {
    switch (str.toLowerCase()) {
      case HistoryAction.ADDED.toLowerCase():
        return HistoryAction.ADDED;
      case HistoryAction.MODIFIED.toLowerCase():
        return HistoryAction.MODIFIED;
      case HistoryAction.DELETED.toLowerCase():
        return HistoryAction.DELETED;
      default:
        return HistoryAction.ADDED;
    }
  }
}
