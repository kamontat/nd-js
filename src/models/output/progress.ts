/**
 * @external
 * @module listr.model
 */

import Bluebird from "bluebird";
import Listr, { ListrOptions, ListrTaskWrapper } from "listr";
import { Observable } from "rxjs";

export type TaskFn = (ctx?: any, task?: ListrTaskWrapper) => Bluebird<any> | Observable<any>;
export type ContextKey = string;

export type Title = string;
export type TitleFn = (context?: any) => string;

export type SkipFn = (ctx?: any, task?: ListrTaskWrapper) => boolean | Promise<boolean> | string | void;
export type EnableFn = (ctx?: any) => boolean | Promise<boolean>;

export interface ProgressOptions {
  output?: string;
  skip?: SkipFn;
  enable?: EnableFn;
  context?: string;
}

export class Progress {
  private progress: Listr;

  protected getContentKey(opts?: ProgressOptions) {
    if (opts && opts.context) return opts.context;
    return Progress.CONTEXT_NAME;
  }

  constructor(options?: ListrOptions) {
    this.progress = new Listr(options);
  }

  public add(title: Title | TitleFn, fn: TaskFn | Bluebird<any>, opts?: ProgressOptions) {
    // execute title generate function
    const _title = typeof title !== "string" ? title(undefined) : title;
    this.progress.add({
      title: _title,
      task: (ctx: any, task: ListrTaskWrapper) => {
        const executor = fn;

        // update title
        if (typeof title !== "string") task.title = title(ctx.previous);

        let result: Bluebird<any> | Observable<any>;
        if (typeof executor === "function") {
          result = executor(ctx, task);
        } else {
          result = executor;
        }

        if (result instanceof Bluebird) {
          return result.then(res => {
            ctx[this.getContentKey(opts)] = res;
            ctx.previous = res;
          });
        } else {
          return result as any;
        }
      },
      skip: opts && opts.skip,
      enabled: opts && opts.enable,
    });
  }

  public run(ctx?: any) {
    return this.progress.run(ctx);
  }
  public static CONTEXT_NAME = "result";
}
