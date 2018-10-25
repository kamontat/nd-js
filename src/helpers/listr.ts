import Listr, { ListrTask, ListrOptions } from "listr";
import { Novel } from "../models/Novel";
import { ThrowIf } from "./action";
import Observable from "zen-observable";
import { NovelChapter } from "../models/Chapter";
import Bluebird from "bluebird";

export class ListrHelper {
  static createFn(title: string, fn: (ctx: any) => Bluebird<any> | Observable<any>, contextKey = "result"): ListrTask {
    return {
      title: title,
      task: ctx => {
        let result = fn(ctx);
        if (result instanceof Bluebird) return result.then(res => (ctx[contextKey] = res));
        else return <any>result;
      }
    };
  }

  static create(title: string, promise: Bluebird<any>, contextKey = "result"): ListrTask {
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

  addByHelper(title: string, promise: Bluebird<any>, contextKey = "result") {
    this.list.add(ListrHelper.create(title, promise, contextKey));
    return this;
  }

  addFnByHelper(title: string, fn: (ctx: any) => Bluebird<any> | Observable<any>, contextKey = "result") {
    this.list.add(ListrHelper.createFn(title, fn, contextKey));
    return this;
  }

  addLoadChapterList(title: string, { force = false, contextKey = "result", overrideNovel = (_: Novel) => {} }) {
    return this.addFnByHelper(title, ctx => {
      const novel: Novel = ctx[contextKey];
      overrideNovel(novel);
      return new Observable(observer => {
        novel
          .saveAll({
            force: force,
            completeFn: (chap: NovelChapter) => {
              observer.next(`Chapter ${chap.number}`);
            }
          })
          .then(res => {
            ctx.novel = res;
            observer.complete();
          })
          .catch(e => observer.error(e));
      });
    });
  }

  run(ctx?: any) {
    return this.list.run(ctx);
  }

  runNovel({ withChapter = false, ctx = {}, contextKey = "novel" }) {
    return this.list
      .run(ctx)
      .then(ctx => {
        (<Novel>ctx[contextKey]).print({ withChapter: withChapter });
      })
      .catch(ThrowIf);
  }
}
