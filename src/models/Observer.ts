import { Subject } from "rxjs";

// ผู้สังเกตการณ์
export class Observer<T> {
  private subject: Subject<T>;

  protected addAction(next?: (value: T | undefined) => void, error?: (error: any) => void, complete?: () => void) {
    this.subject.subscribe(next, error, complete);
  }

  constructor() {
    this.subject = new Subject();
  }

  public notify(result: T | undefined) {
    this.subject.next(result);
  }
}
