/**
 * @internal
 * @module listr.model.builder
 */

import { ListrOptions } from "listr";
import { Observable } from "rxjs";
import { log } from "winston";

import { WrapTMCT } from "../apis/loggerWrapper";
import { ThrowIf } from "../helpers/commander";
import Config from "../models/command/Config";
import { History } from "../models/history/History";
import { HistoryNode } from "../models/history/HistoryNode";
import { NovelChapter } from "../models/novel/Chapter";
import { Novel } from "../models/novel/Novel";
import { NPrinter } from "../models/novel/NPrinter";
import { Progress, ProgressOptions, Title, TitleFn } from "../models/output/progress";

import { NovelBuilder } from "./novel";

export class NovelProgressBuilder extends Progress {
  private id?: string;
  private changes: History = new History();

  private _downloadChapter(
    title: Title | TitleFn,
    downloadOption: { force?: boolean; override?(_: Novel): Novel } = { force: false, override: n => n },
    opts?: ProgressOptions,
  ) {
    this.add(
      title,
      (ctx: any) => {
        return new Observable(observer => {
          const novel = ctx[this.getContentKey(opts)] as Novel;
          if (downloadOption && downloadOption.override) downloadOption.override(novel);
          novel
            .saveNovel({
              force: downloadOption.force,
              completeFn: (chap: NovelChapter) => {
                this.changes.addNode(HistoryNode.CreateADD("The chapter", { after: chap.toString() }));
                observer.next(`Chapter ${chap.number}`);
              },
              completedFn: (chap: NovelChapter) => {
                observer.next(`Chapter ${chap.number} Exist!`);
              },
              failFn: (chap: NovelChapter) => {
                this.changes.addNode(HistoryNode.CreateDEL("The chapter", { before: chap.toString() }));
                observer.next(`Chapter ${chap.number} ${chap.status}`);
              },
            })
            .then(res => {
              ctx[this.getContentKey(opts)] = res;
              ctx.previous = res;
              observer.complete();
            })
            .catch(e => observer.error(e));
        });
      },
      opts,
    );

    return this;
  }

  public fetchNovel(title: Title | TitleFn, id: string, opts?: ProgressOptions) {
    this.id = id;
    this.add(title, NovelBuilder.fetch(id), opts);
    return this;
  }

  public buildLocalNovelInformation(title: Title | TitleFn, path: string, opts?: ProgressOptions) {
    this.add(
      title,
      ctx => {
        return new Observable(observer => {
          NovelBuilder.buildLocal(path, {
            completeNovelFn: () => observer.next("Completed novel"),
            completeHistoryFn: () => observer.next("Completed history"),
          })
            .then(novel => {
              ctx[this.getContentKey(opts)] = novel;
              ctx.previous = novel;
              observer.complete();
            })
            .catch(e => observer.error(e));
        });
      },
      opts,
    );
    return this;
  }

  public buildNovelInformation(title: Title | TitleFn, id: string = "", opts?: ProgressOptions) {
    const _id = this.id || id;
    this.add(
      title,
      ctx => {
        const context = ctx[this.getContentKey(opts)] as { cheerio: CheerioStatic; chapter: NovelChapter };
        return NovelBuilder.build(_id, context.cheerio);
      },
      opts,
    );
    return this;
  }

  public fetchLatestInformation(title: Title | TitleFn, opts?: ProgressOptions) {
    this.add(title, ctx => {
      const novel = ctx[this.getContentKey(opts)] as Novel;
      return novel.update();
    });
    return this;
  }

  public downloadChapterList(title: Title | TitleFn, force?: boolean, opts?: ProgressOptions) {
    return this._downloadChapter(title, { force }, opts);
  }

  public downloadOnlyChapterList(title: Title | TitleFn, chapters: string[], force?: boolean, opts?: ProgressOptions) {
    const config = Config.Load();

    return this._downloadChapter(
      title,
      {
        force,
        override: n => {
          n.location = config.getNovelLocation();
          // get the chapter from the novel chapters list
          const _chapters = chapters.map(chapterString => {
            const _chapter = NovelBuilder.createChapter(n.id, chapterString, { location: n.location });
            const chapter = n.getChapter(_chapter);
            if (chapter) return chapter;
            return _chapter;
          });
          // reset all the list
          n.resetChapter();
          // add only request chapter
          _chapters.forEach(c => n.addChapter.call(n, c));
          return n;
        },
      },
      opts,
    );
  }

  public saveResourceFile(title: Title | TitleFn, force?: boolean, opts?: ProgressOptions) {
    this.add(
      title,
      (ctx: any) => {
        const novel = ctx[this.getContentKey(opts)] as Novel;
        return novel.saveResource({ force });
      },
      opts,
    );

    return this;
  }

  public runNovel(ctx: any, { withChapter = false, withHistory = false, withChanges = false }, opts?: ProgressOptions) {
    return this.run(ctx)
      .then(context => {
        const novel = context[this.getContentKey(opts)] as Novel;
        new NPrinter(novel).print({ short: !withChapter });

        if (withHistory) {
          novel
            .history()
            .list()
            .forEach((node, index) => log(WrapTMCT("info", `History ${index}`, node.toString())));
        }

        if (withChanges) {
          this.changes.list().forEach((node, index) => log(WrapTMCT("info", `History ${index}`, node.toString())));
        }
      })
      .catch(e => ThrowIf(e));
  }
  public static Build(options?: ListrOptions) {
    return new NovelProgressBuilder(options);
  }
}
