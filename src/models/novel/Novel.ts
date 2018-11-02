/**
 * @internal
 * @module nd.novel
 */

import Bluebird from "bluebird";
import { existsSync } from "fs";
import { mkdirp } from "fs-extra";
import moment, { Moment } from "moment";
import { join } from "path";
import { log } from "winston";

import { FetchApi } from "../../apis/download";
import { WriteChapter } from "../../apis/file";
import { CreateChapterListApi, GetNovelDateApi, GetNovelNameApi, NormalizeNovelName } from "../../apis/novel";
import { HtmlBuilder } from "../../builder/html";
import { NovelBuilder } from "../../builder/novel";
import { NOVEL_CLOSED_WARN, NOVEL_NOTFOUND_ERR, NOVEL_SOLD_WARN, NOVEL_WARN } from "../../constants/error.const";
import { DEFAULT_NOVEL_FOLDER_NAME } from "../../constants/novel.const";
import { SaveIf } from "../../helpers/action";
import { Timestamp } from "../../helpers/helper";
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

    this.notify(HistoryNode.CreateByChange("Novel ID", { before: undefined, after: id }));
    this._id = id;

    if (!location) location = Config.Load().getNovelLocation();
    this.location = location;

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

  public addChapter(chapter: NovelChapter) {
    chapter.location = this.location; // link the location as well
    chapter.linkTo(this); // link chapter history to novel history

    if (this._chapters) {
      this._chapters.push(chapter);
    } else {
      this._chapters = [chapter];
    }
  }

  public resetChapter() {
    this._chapters = [];
  }

  public set name(n: string) {
    this.notify(HistoryNode.CreateByChange("Novel name", { before: this.name, after: n }));
    this._name = n;
  }

  public set location(v: string) {
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
    const last = GetNovelDateApi($);

    this.notify(
      HistoryNode.CreateByChange("Last update", { before: Timestamp(this._updateAt), after: Timestamp(last) }),
    );
    this._updateAt = last;
  }

  public load($: CheerioStatic): Bluebird<Novel> {
    return new Bluebird(res => {
      this.name = GetNovelNameApi($);

      if (this._location)
        this.location = join(this._location, DEFAULT_NOVEL_FOLDER_NAME(NormalizeNovelName(this.name)));

      this.resetChapter();
      CreateChapterListApi($).forEach(c => this.addChapter.call(this, c));

      this.update($);
      res(this);
    });
  }

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

          chap.status = NovelStatus.COMPLETED;
          log(WrapTMCT("verbose", chap.status, `${chap.toString()}`));
        } catch (e) {
          if (NOVEL_SOLD_WARN.equal(e)) {
            e.loadString(`id ${chap.id} chapter ${chap.number}`);
            chap.status = NovelStatus.SOLD;
          } else if (NOVEL_CLOSED_WARN.equal(e)) {
            e.loadString(`id ${chap.id} chapter ${chap.number}`);
            chap.status = NovelStatus.CLOSED;
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
