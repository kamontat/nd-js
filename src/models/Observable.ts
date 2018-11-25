/**
 * @internal
 * @module public.object
 */

import { Observer } from "./Observer";

/**
 * Thai: ผู้ถูกสังเกตการณ์
 * English: This Observable is the rxjs Observable concept, but the program need a little bit of custom, to make notify even easier to use.
 *
 * In the program I design that each Observable contain ONLY 1 observer.
 * Basically, I design this class to notify when the changes was occurred.
 *
 * With additional feature, pause/unpause observe.
 *
 * If you don't temporary want to notify change to the observer, you can call {@link pauseObserve} to stop notify anything to observer.
 * And you can resume be called {@link startObserve} method.
 */
export class Observable<T> {
  private observer?: Observer<T>;

  private collected = true;

  /**
   * Load observer, you can load observer in this subclass only.
   * And the observer will overwrited if it already exist.
   *
   * @param observer observer
   */
  protected loadObserver(observer: Observer<T>) {
    this.observer = observer;
  }

  /**
   * Notify change to observer
   *
   * @param result changes result
   */
  public notify(result: T | undefined) {
    if (this.observer && this.collected) this.observer.notify(result);
  }

  /**
   * Get observer that current observe this class
   */
  public observe() {
    return this.observer;
  }

  /**
   * pause will make observer cannot hear any changes
   */
  public pauseObserve() {
    this.collected = false;
  }

  /**
   * start observe, you have to run this only if you pause it
   */
  public startObserve() {
    this.collected = true;
  }
}
