/**
 * @internal
 * @module nd.history.model
 */

/**
 * HistoryAction is the action that descript what is it do.
 *
 * Normally the program will add is enum to {@link HistoryNode}
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since November 11, 2018
 */
export enum HistoryAction {
  ADDED = "Added",
  MODIFIED = "Modified",
  DELETED = "Deleted",
}

/**
 * This is utils of {@link HistoryAction} to convert string to history action
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since November 11, 2018
 */
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
