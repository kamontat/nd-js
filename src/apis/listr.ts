/**
 * @external
 * @module listr.api
 */

import Bluebird from "bluebird";
import { ListrTask } from "listr";
import { Observable } from "rxjs";

export class ListrApi {
  public static createFn(
    title: string,
    fn: (ctx: any) => Bluebird<any> | Observable<any>,
    contextKey = "result",
  ): ListrTask {
    return {
      title,
      task: ctx => {
        const result = fn(ctx);
        if (result instanceof Bluebird) {
          return result.then(res => (ctx[contextKey] = res));
        } else {
          return result as any;
        }
      },
    };
  }

  public static create(title: string, promise: Bluebird<any>, contextKey = "result"): ListrTask {
    return ListrApi.createFn(title, _ => promise, contextKey);
  }
}
