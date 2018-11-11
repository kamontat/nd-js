/**
 * @internal
 * @module nd.novel.model
 */

/**
 * The status of novel chapter
 */
export enum NovelStatus {
  /**
   * Unknown will be the default status of novel chapter
   */
  UNKNOWN = "unknown",

  /**
   * Completed will set when the network downloaded the chapter and save completely
   */
  COMPLETED = "completed",

  /**
   * Closed will set if the auto detect, have detected the close chapter
   */
  CLOSED = "closed",

  /**
   * Sold will set if the autodetect, have detected the sold chapter
   */
  SOLD = "sold",
}

export class NovelStatusUtils {
  public static ToStatus(str: string) {
    switch (str.toLowerCase()) {
      case NovelStatus.UNKNOWN.toLowerCase():
        return NovelStatus.UNKNOWN;
      case NovelStatus.COMPLETED.toLowerCase():
        return NovelStatus.COMPLETED;
      case NovelStatus.SOLD.toLowerCase():
        return NovelStatus.SOLD;
      case NovelStatus.CLOSED.toLowerCase():
        return NovelStatus.CLOSED;
      default:
        return NovelStatus.UNKNOWN;
    }
  }
}
