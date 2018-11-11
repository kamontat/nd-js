/**
 * @external
 * @module listr.controller
 */

import Bluebird from "bluebird";
import Listr, { ListrOptions, ListrTask } from "listr";
import { Observable } from "rxjs";
import { log } from "winston";

import { ListrApi } from "../apis/listr";
import { WrapTMCT } from "../apis/loggerWrapper";
import { NovelBuilder } from "../builder/novel";
import { History } from "../models/history/History";
import { HistoryNode } from "../models/history/HistoryNode";
import { NovelChapter } from "../models/novel/Chapter";
import { Novel } from "../models/novel/Novel";
import { NPrinter } from "../models/novel/NPrinter";

import { ThrowIf } from "./commander";

export class ListrController {
  private list: Listr;
  private history: History;

  constructor(options?: ListrOptions) {
    this.list = new Listr(undefined, options);
    this.history = new History();
  }

  public add(task: ListrTask) {
    this.list.add(task);
    return this;
  }

  public adds(tasks: ReadonlyArray<ListrTask>) {
    this.list.add(tasks);
    return this;
  }

  public addByHelper(title: string, promise: Bluebird<any>, contextKey = "result") {
    this.list.add(ListrApi.create(title, promise, contextKey));
    return this;
  }

  public addFnByHelper(title: string, fn: (ctx: any) => Bluebird<any> | Observable<any>, contextKey = "result") {
    this.list.add(ListrApi.createFn(title, fn, contextKey));
    return this;
  }

  public addLoadLocalPath(title: string, location: string, { contextKey = "novel" }) {
    return this.addFnByHelper(title, ctx => {
      return new Observable(observer => {
        NovelBuilder.buildLocal(location, {
          completeNovelFn: () => observer.next("Completed novel"),
          completeHistoryFn: () => observer.next("Completed history"),
        })
          .then(novel => {
            ctx[contextKey] = novel;
            observer.complete();
          })
          .catch(e => observer.error(e));
      });
    });
  }

  public addLoadChapterList(title: string, { force = false, contextKey = "result", overrideNovel = (_: Novel) => {} }) {
    return this.addFnByHelper(title, ctx => {
      const novel: Novel = ctx[contextKey];
      return new Observable(observer => {
        overrideNovel(novel);
        novel
          .saveNovel({
            force,
            completeFn: (chap: NovelChapter) => {
              this.history.addNode(HistoryNode.CreateADD("The chapter", { after: chap.toString() }));
              observer.next(`Chapter ${chap.number}`);
            },
            completedFn: (chap: NovelChapter) => {
              observer.next(`Chapter ${chap.number} Exist!`);
            },
            failFn: (chap: NovelChapter) => {
              this.history.addNode(HistoryNode.CreateDEL("The chapter", { before: chap.toString() }));
              observer.next(`Chapter ${chap.number} ${chap.status}`);
            },
          })
          .then(res => {
            ctx.novel = res;
            observer.complete();
          })
          .catch(e => observer.error(e));
      });
    });
  }

  public addCreateResourceFile(title: string, { force = false, contextKey = "novel" }) {
    return this.addFnByHelper(title, ctx => {
      const novel: Novel = ctx[contextKey];
      return new Observable(observer => {
        novel
          .saveResource({ force })
          .then(res => {
            ctx.novel = res;
            observer.complete();
          })
          .catch(e => observer.error(e));
      });
    });
  }

  public run(ctx?: any) {
    return this.list.run(ctx);
  }

  public runNovel({ withChapter = false, withHistory = false, withChanges = false, ctx = {}, contextKey = "novel" }) {
    return this.list
      .run(ctx)
      .then(context => {
        const novel = context[contextKey] as Novel;

        new NPrinter(novel).print({ short: !withChapter });

        if (withHistory) {
          novel
            .history()
            .list()
            .forEach((node, index) => log(WrapTMCT("info", `History ${index}`, node.toString())));
        }

        if (withChanges) {
          this.history.list().forEach((node, index) => log(WrapTMCT("info", `History ${index}`, node.toString())));
        }
      })
      .catch(ThrowIf);
  }
}
