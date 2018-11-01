import { Observer } from "./Observer";

// ผู้ถูกสังเกตการณ์
export class Observable<T> {
  private observer?: Observer<T>;

  protected loadObserver(observer: Observer<T>) {
    this.observer = observer;
  }

  public notify(result: T | undefined) {
    if (this.observer) this.observer.notify(result);
  }

  public observe() {
    return this.observer;
  }
}
