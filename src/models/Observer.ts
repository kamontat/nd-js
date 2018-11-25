/**
 * @internal
 * @module public.object
 */

import { Subject } from "rxjs";

/**
 * Thai: ผู้สังเกตการณ์
 * English: This Observer is the rxjs Observer concept, but the program need a little bit of custom, to make notify even easier to use.
 *
 *
 * @author Kamontat Chantrachirathumrong
 * @version 1.0.0
 * @since November 25, 2018
 */
export class Observer<T> {
  private subject: Subject<T>;

  /**
   * This method will add the action to tell what observer need to do after something occurred.
   *
   * @param next If data changes, what is next thing to do
   * @param error when the error occurred, what to do
   * @param complete after observable completed the task, what to do
   */
  protected addAction(next?: (value: T | undefined) => void, error?: (error: any) => void, complete?: () => void) {
    this.subject.subscribe(next, error, complete);
  }

  /**
   * Basically, this will create the Subject in rxjs {@link http://reactivex.io/rxjs/manual/overview.html#subject}.
   *
   * You might confuse, if you never coding on rxjs concept before.
   *
   * But this class make you never need to understand the concept of Reactive Extensions.
   *
   * To use the class, you also need {@link Observable} class as well.
   *
   * Concept: each information changes in Observable, Observer should notice that and do some action.
   *
   * So your duty on this class, you need to call {@link addAction} to tell the observer what to do when data has changes.
   *
   * @example
   *
   * For easier example, Client and Library.
   * When the Client borrow some book from librarian,
   * Librarian should notice library server that some book is borrowed.
   *
   */
  constructor() {
    this.subject = new Subject();
  }

  /**
   * Normally, this method should be called in Observable, to notify the action(s)
   *
   * @param result notify result
   */
  public notify(result: T | undefined) {
    this.subject.next(result);
  }

  /**
   * Normally, this method should be called in Observable, to notify that something went wrong
   *
   * @param result error (should be {@link Error})
   */
  public error(result: any) {
    this.subject.error(result);
  }

  /**
   * Normally, this method should be called in Observable, to notify the task completed
   */
  public completed() {
    this.subject.complete();
  }
}
