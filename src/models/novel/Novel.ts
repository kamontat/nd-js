/**
 * @internal
 * @module nd.novel
 */

import Bluebird from "bluebird";
import { existsSync } from "fs";
import { mkdirp } from "fs-extra";
import moment, { Moment } from "moment";
import { join } from "path";
import terminalLink from "terminal-link";
import { log } from "winston";

import { FetchApi } from "../../apis/download";
import { WriteChapter } from "../../apis/file";
import { CreateChapterListApi, GetNovelDateApi, GetNovelNameApi, NormalizeNovelName } from "../../apis/novel";
import { HtmlBuilder } from "../../builder/html";
import { NovelBuilder } from "../../builder/novel";
import { COLORS } from "../../constants/color.const";
import { NOVEL_CLOSED_WARN, NOVEL_NOTFOUND_ERR, NOVEL_SOLD_WARN, NOVEL_WARN } from "../../constants/error.const";
import { DEFAULT_NOVEL_FOLDER_NAME } from "../../constants/novel.const";
import { SaveIf } from "../../helpers/action";
import { GetLink } from "../../helpers/novel";
import Config from "../command/Config";
import { Historian } from "../history/Historian";
import { HistoryNode } from "../history/HistoryNode";
import { WrapTMCT } from "../output/LoggerWrapper";

import { NovelChapter, NovelStatus } from "./Chapter";

export class Novel extends Historian {
  private _id: string;
  private _location?: string;

  private _name?: string;
  private _chapters?: NovelChapter[];

  private _downloadAt: Moment; // manually collect
  private _updateAt?: Moment; // this from website

  constructor(id: string, location?: string) {
    super();

    this._id = id;
    if (location) {
      this.setLocation(location);
    } else {
      this.setLocation(Config.Load().getNovelLocation());
    }

    this._downloadAt = moment();
  }

  public get location(): string {
    return this._location || Config.Load({ quiet: true }).getNovelLocation();
  }

  public get id() {
    return this._id;
  }

  public get name() {
    return this._name || "";
  }

  public get lastUpdateAt() {
    return this._updateAt || moment();
  }

  public get startDownloadAt() {
    return this._downloadAt || moment();
  }

  public addChapter(n: NovelChapter) {
    // TODO: subscribe chapter
    if (this._chapters) {
      this._chapters.push(n);
    } else {
      this._chapters = [n];
    }
  }

  public resetChapter() {
    this._chapters = [];
  }

  public setName(n: string) {
    this.notify(HistoryNode.CreateByChange("Novel name", { before: this.name, after: n }));
    this._name = n;
  }

  public setLocation(v: string) {
    this.notify(HistoryNode.CreateByChange("Novel location", { before: this.location, after: v }));
    this._location = v;
  }

  public chapter({ copy = false }) {
    if (!this._chapters) return [];
    if (copy) return this._chapters.copyWithin(0, 0);
    else return this._chapters;
  }

  public mapChapter(fn: (n: NovelChapter, index?: number) => any) {
    return this.chapter({ copy: true }).map(fn);
  }

  public filterChapter(fn: (n: NovelChapter, index?: number) => boolean) {
    return this.chapter({ copy: true }).filter(fn);
  }

  public eachChapter(fn: (n: NovelChapter, index?: number) => void) {
    return this.chapter({ copy: true }).forEach(fn);
  }

  get completedChapter() {
    return this.filterChapter(c => c.isCompleted());
  }

  get closedChapter() {
    return this.filterChapter(c => c.isClosed());
  }

  get soldChapter() {
    return this.filterChapter(c => c.isSold());
  }

  get unknownChapter() {
    return this.filterChapter(c => c.isUnknown());
  }

  get chapterSize() {
    if (!this._chapters || this._chapters.length < 1) {
      return { start: 0, end: 0, size: 0 };
    }
    const s = parseInt(this._chapters[0].number);
    const e = parseInt(this._chapters[this._chapters.length - 1].number);
    return {
      start: s,
      end: e,
      size: e - s + 1,
    };
  }

  public update($: CheerioStatic) {
    this._updateAt = GetNovelDateApi($);
  }

  public load($: CheerioStatic): Bluebird<Novel> {
    return new Bluebird(res => {
      this._name = GetNovelNameApi($);

      if (this._location) {
        this._location = join(this._location, DEFAULT_NOVEL_FOLDER_NAME(NormalizeNovelName(this._name)));
      }

      // this._chapters = [NovelBuilder.createChapter(this._id, "0", { location: this._location })];
      this._chapters = [];
      this._chapters.push(
        ...CreateChapterListApi($).map(chap => {
          chap.setLocation(this._location);
          return chap;
        }),
      );

      this.update($);
      res(this);
    });
  }

  // public print(option?: { withChapter?: boolean }) {
  //   const link = GetLink(this._id);

  //   log(
  //     WrapTMCT("info", "Novel name", terminalLink(this._name || "no-name", `file://${this._location}`), {
  //       message: COLORS.Name
  //     })
  //   );
  //   log(WrapTMCT("info", "Novel link", terminalLink(this._id, (link && link.toString()) || "")));

  //   // Name is clickable
  //   // if (this._location) log(WrapTMCT("info", "Novel location", this._location));
  //   // if (this._location) log(WrapTMCT("info", "First chapter", NovelBuilder.createZeroChapter(this).file()));

  //   this.printChapterNumber();

  //   if (this._chapters && option && option.withChapter) {
  //     this._chapters.forEach(chapter => {
  //       log(WrapTMCT("info", `Chapter ${chapter.number}`, chapter.toString()));
  //     });
  //   }

  //   log(WrapTMCT("verbose", "Download at", this._downloadAt));
  //   log(WrapTMCT("verbose", "Update at", this._updateAt));
  // }

  // public printChapterNumber() {
  //   const completedChapters: string[] | undefined =
  //     this._chapters && this._chapters.filter(c => c.status === NovelStatus.COMPLETED).map(c => c.number);
  //   const closedChapters: string[] | undefined =
  //     this._chapters && this._chapters.filter(c => c.status === NovelStatus.CLOSED).map(c => c.number);
  //   const soldChapters: string[] | undefined =
  //     this._chapters && this._chapters.filter(c => c.status === NovelStatus.SOLD).map(c => c.number);
  //   const unknownChapters: string[] | undefined =
  //     this._chapters && this._chapters.filter(c => c.status === NovelStatus.UNKNOWN).map(c => c.number);

  //   if (completedChapters && completedChapters.length > 0) {
  //     log(WrapTMCT("info", "Completed chapters", completedChapters, { message: COLORS.ChapterList }));
  //   }
  //   if (closedChapters && closedChapters.length > 0) {
  //     log(WrapTMCT("info", "Closed chapters", closedChapters, { message: COLORS.ChapterList }));
  //   }
  //   if (soldChapters && soldChapters.length > 0) {
  //     log(WrapTMCT("info", "Sold chapters", soldChapters, { message: COLORS.ChapterList }));
  //   }
  //   if (unknownChapters && unknownChapters.length > 0) {
  //     log(WrapTMCT("info", "Unknown chapters", unknownChapters, { message: COLORS.ChapterList }));
  //   }
  // }

  public async validateBeforeSave({ force = false }) {
    if (this._location && existsSync(this._location) && !force) {
      throw NOVEL_WARN.clone().loadString(`Novel ID ${this._id} is exist`);
    }
    await mkdirp(this._location || "");
  }

  public async saveZero({ validate = false, force = false }) {
    if (validate) {
      this.validateBeforeSave({ force });
    }

    const zero = NovelBuilder.createZeroChapter(this);
    await zero.download(force);
  }

  public saveChapters({ validate = false, force = false, completeFn = (_: NovelChapter) => {} }) {
    if (validate) {
      this.validateBeforeSave({ force });
    }

    if (this._chapters && this._chapters.length > 0) {
      return Bluebird.each(this._chapters, async chap => {
        try {
          const res = await FetchApi(chap);
          const html = HtmlBuilder.template(res.chapter.id)
            .addChap(res.chapter)
            .addName(this._name)
            .addContent(HtmlBuilder.buildContent(res.chapter, res.cheerio))
            .renderDefault();

          await WriteChapter(html, res.chapter, force);
          completeFn(chap);
          // console.log(`Completed ${res.chapter.number}`);

          chap.setStatus(NovelStatus.COMPLETED);
          log(WrapTMCT("verbose", chap.status, `${chap.toString()}`));
        } catch (e) {
          if (NOVEL_SOLD_WARN.equal(e)) {
            e.loadString(`id ${chap.id} chapter ${chap.number}`);
            chap.setStatus(NovelStatus.SOLD);
          } else if (NOVEL_CLOSED_WARN.equal(e)) {
            e.loadString(`id ${chap.id} chapter ${chap.number}`);
            chap.setStatus(NovelStatus.CLOSED);
          }
          SaveIf(e);
        }
      });
    }
    return Bluebird.reject(NOVEL_NOTFOUND_ERR.loadString("don't have any chapters"));
  }

  public async saveResource() {
    // TODO: implement save resource file
    if (!this._location) {
      // const resource = ResourceBuilder.build(this._location || "", this);
      // await resource.save(force);
    }
    return Bluebird.resolve(this);
  }

  public async saveNovel({ force = false, completeFn = (_: NovelChapter) => {} }) {
    await this.validateBeforeSave({ force });
    await this.saveChapters({ force, completeFn });
    await this.saveZero({ force });
    return Bluebird.resolve(this);
  }

  public async saveAll({ force = false, completeFn = (_: NovelChapter) => {} }) {
    await this.saveNovel({ force, completeFn });
    await this.saveResource();
    return new Promise<Novel>(res => res(this));
  }
}
