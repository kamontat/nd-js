/**
 * @internal
 * @module nd.novel
 */

import moment, { Moment } from "moment";

import { log } from "winston";
import { GetLink } from "../helpers/novel";
import { NOVEL_WARN, NOVEL_SOLD_WARN, NOVEL_CLOSED_WARN, NOVEL_NOTFOUND_ERR } from "../constants/error.const";
import { join } from "path";
import { GetNovelNameApi, CreateChapterListApi, GetNovelDateApi, NormalizeNovelName } from "../apis/novel";
import { WrapTMCT } from "./LoggerWrapper";
import { COLORS } from "../constants/color.const";
import { DEFAULT_NOVEL_FOLDER_NAME } from "../constants/novel.const";
import { existsSync } from "fs";
import { mkdirp } from "fs-extra";
import { NovelChapter, NovelStatus } from "./Chapter";
import { NovelBuilder } from "../builder/novel";
import { FetchApi } from "../apis/download";
import { HtmlBuilder } from "../builder/html";
import { WriteChapter } from "../apis/file";
import Config from "./Config";

import terminalLink from "terminal-link";
import { SaveIf } from "../helpers/action";
import Bluebird from "bluebird";
import { History } from "./History";

export class Novel {
  // TODO: add required information attribute
  private _id: string;
  private _location?: string;

  private _name?: string;
  private _chapters?: NovelChapter[];

  private _downloadAt: Moment; // manually collect
  private _updateAt?: Moment; // this from website

  private _history: History;

  constructor(id: string, location?: string) {
    this._history = new History();

    this._id = id;
    if (location) this.setLocation(location);
    else this.setLocation(Config.Load().getNovelLocation());

    this._downloadAt = moment();
  }

  public get location(): string {
    return this._location || Config.Load({ quiet: true }).getNovelLocation();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name || "";
  }

  get history() {
    return this._history;
  }

  get lastUpdateAt() {
    return this._updateAt || moment();
  }

  get startDownloadAt() {
    return this._downloadAt || moment();
  }

  addChapter(n: NovelChapter) {
    if (this._chapters) this._chapters.push(n);
    else this._chapters = [n];
  }

  setName(n: string) {
    if (this._name) this.history.addMODIFIEDNode("Novel name", { before: this._name, after: n });
    else this._history.addADDNode("Novel name", { after: n });
    this._name = n;
  }

  setLocation(v: string) {
    if (this._location) this.history.addMODIFIEDNode("Novel location", { before: this._location, after: v });
    else this._history.addADDNode("Novel location", { after: v });
    this._location = v;
  }

  setChapter(ns: NovelChapter[], opt?: { force?: boolean }) {
    if (opt && opt.force) this._chapters = ns;
    if (this._chapters) this._chapters.push(...ns);
    else this._chapters = ns;
  }

  mapChapter(fn: (n: NovelChapter) => any) {
    return (this._chapters && this._chapters.map(fn)) || [];
  }

  get completedChapter() {
    return (this._chapters && this._chapters.filter(c => c.isCompleted())) || [];
  }

  get chapterSize() {
    if (!this._chapters || this._chapters.length < 1) return { start: 0, end: 0 };
    return {
      start: this._chapters[0].number,
      end: this._chapters[this._chapters.length - 1].number
    };
  }

  update($: CheerioStatic) {
    this._updateAt = GetNovelDateApi($);
  }

  load($: CheerioStatic): Bluebird<Novel> {
    return new Bluebird(res => {
      this._name = GetNovelNameApi($);

      if (this._location)
        this._location = join(this._location, DEFAULT_NOVEL_FOLDER_NAME(NormalizeNovelName(this._name)));

      // this._chapters = [NovelBuilder.createChapter(this._id, "0", { location: this._location })];
      this._chapters = [];
      this._chapters.push(
        ...CreateChapterListApi($).map(chap => {
          chap.setLocation(this._location);
          return chap;
        })
      );

      this.update($);
      res(this);
    });
  }

  print(option?: { withChapter?: boolean }) {
    const link = GetLink(this._id);

    log(
      WrapTMCT("info", "Novel name", terminalLink(this._name || "no-name", `file://${this._location}`), {
        message: COLORS.Name
      })
    );
    log(WrapTMCT("info", "Novel link", terminalLink(this._id, (link && link.toString()) || "")));

    // Name is clickable
    // if (this._location) log(WrapTMCT("info", "Novel location", this._location));
    // if (this._location) log(WrapTMCT("info", "First chapter", NovelBuilder.createZeroChapter(this).file()));

    this.printChapterNumber();

    if (this._chapters && option && option.withChapter) {
      this._chapters.forEach(chapter => {
        log(WrapTMCT("info", `Chapter ${chapter.number}`, chapter.toString()));
      });
    }

    log(WrapTMCT("verbose", "Download at", this._downloadAt));
    log(WrapTMCT("verbose", "Update at", this._updateAt));
  }

  printChapterNumber() {
    const completedChapters: string[] | undefined =
      this._chapters && this._chapters.filter(c => c.status === NovelStatus.COMPLETED).map(c => c.number);
    const closedChapters: string[] | undefined =
      this._chapters && this._chapters.filter(c => c.status === NovelStatus.CLOSED).map(c => c.number);
    const soldChapters: string[] | undefined =
      this._chapters && this._chapters.filter(c => c.status === NovelStatus.SOLD).map(c => c.number);
    const unknownChapters: string[] | undefined =
      this._chapters && this._chapters.filter(c => c.status === NovelStatus.UNKNOWN).map(c => c.number);

    if (completedChapters && completedChapters.length > 0)
      log(WrapTMCT("info", "Completed chapters", completedChapters, { message: COLORS.ChapterList }));
    if (closedChapters && closedChapters.length > 0)
      log(WrapTMCT("info", "Closed chapters", closedChapters, { message: COLORS.ChapterList }));
    if (soldChapters && soldChapters.length > 0)
      log(WrapTMCT("info", "Sold chapters", soldChapters, { message: COLORS.ChapterList }));
    if (unknownChapters && unknownChapters.length > 0)
      log(WrapTMCT("info", "Unknown chapters", unknownChapters, { message: COLORS.ChapterList }));
  }

  async validateBeforeSave({ force = false }) {
    if (this._location && existsSync(this._location) && !force) {
      throw NOVEL_WARN.clone().loadString(`Novel ID ${this._id} is exist`);
    }
    await mkdirp(this._location || "");
  }

  async saveZero({ validate = false, force = false }) {
    if (validate) this.validateBeforeSave({ force: force });

    const zero = NovelBuilder.createZeroChapter(this);
    await zero.download(force);
  }

  saveChapters({ validate = false, force = false, completeFn = (_: NovelChapter) => {} }) {
    if (validate) this.validateBeforeSave({ force: force });

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

  async saveResource() {
    // TODO: implement save resource file
    if (!this._location) {
      // const resource = ResourceBuilder.build(this._location || "", this);
      // await resource.save(force);
    }
    return Bluebird.resolve(this);
  }

  async saveNovel({ force = false, completeFn = (_: NovelChapter) => {} }) {
    await this.validateBeforeSave({ force });
    await this.saveChapters({ force, completeFn });
    await this.saveZero({ force });
    return Bluebird.resolve(this);
  }

  async saveAll({ force = false, completeFn = (_: NovelChapter) => {} }) {
    await this.saveNovel({ force, completeFn });
    await this.saveResource();
    return new Promise<Novel>(res => res(this));
  }
}
