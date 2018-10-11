import Listr, { ListrTask, ListrOptions } from "listr";
import { Novel } from "../models/Novel";
import { ThrowIf } from "./action";

export class ListrHelper {
  static createFn(title: string, fn: (ctx: any) => Promise<any>, contextKey = "result"): ListrTask {
    return {
      title: title,
      task: ctx => fn(ctx).then(res => (ctx[contextKey] = res))
    };
  }

  static create(title: string, promise: Promise<any>, contextKey = "result"): ListrTask {
    return ListrHelper.createFn(title, _ => promise, contextKey);
  }
}

export class ListrApis {
  private list: Listr;
  constructor(options?: ListrOptions) {
    this.list = new Listr(undefined, options);
  }

  add(task: ListrTask) {
    this.list.add(task);
    return this;
  }

  adds(tasks: ReadonlyArray<ListrTask>) {
    this.list.add(tasks);
    return this;
  }

  addByHelper(title: string, promise: Promise<any>, contextKey = "result") {
    this.list.add(ListrHelper.create(title, promise, contextKey));
    return this;
  }

  addFnByHelper(title: string, fn: (ctx: any) => Promise<any>, contextKey = "result") {
    this.list.add(ListrHelper.createFn(title, fn, contextKey));
    return this;
  }

  run(ctx?: any) {
    return this.list.run(ctx);
  }

  runNovel({ withChapter = false }, ctx?: any) {
    this.list
      .run(ctx)
      .then(ctx => (<Novel>ctx.result).print({ withChapter: withChapter }))
      .catch(ThrowIf);
  }
}
