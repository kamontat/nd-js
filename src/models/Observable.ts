/**
 * @internal
 * @module public.object
 */

import { Observer } from "./Observer";

// ผู้ถูกสังเกตการณ์
export class Observable<T> {
  private observer?: Observer<T>;

  private collected = true;

  protected loadObserver(observer: Observer<T>) {
    this.observer = observer;
  }

  public notify(result: T | undefined) {
    if (this.observer && this.collected) this.observer.notify(result);
  }

  public observe() {
    return this.observer;
  }

  public pauseObserve() {
    this.collected = false;
  }

  public startObserve() {
    this.collected = true;
  }
}
