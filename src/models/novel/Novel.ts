/**
 * @internal
 * @module nd.novel.model
 */

import Bluebird from "bluebird";
import SortedArrayMap from "collections/sorted-array-map";
import { existsSync } from "fs";
import { mkdirp } from "fs-extra";
import moment, { Moment } from "moment";
import { join } from "path";
import { log } from "winston";

import { FetchApi } from "../../apis/download";
import { Writer } from "../../apis/fileWriter";
import { WrapTMCT } from "../../apis/loggerWrapper";
import { CreateChapterListApi, GetNovelDateApi, GetNovelNameApi, NormalizeNovelName } from "../../apis/novel";
import { HtmlBuilder } from "../../builder/html";
import { NovelBuilder } from "../../builder/novel";
import { ResourceBuilder } from "../../builder/resource";
import { NOVEL_NOTFOUND_ERR, NOVEL_WARN } from "../../constants/error.const";
import { DEFAULT_NOVEL_FOLDER_NAME } from "../../constants/novel.const";
import { SaveIf } from "../../helpers/commander";
import { CheckIsNovelPath, RevertTimestamp, Timestamp } from "../../helpers/helper";
import Config from "../command/Config";
import { Historian } from "../history/Historian";
import { HistoryActionUtils } from "../history/HistoryAction";
import { HistoryNode, HistoryNodeType } from "../history/HistoryNode";
import { NovelChapterResourceType } from "../resource/NovelResource";

import { NovelChapter } from "./Chapter";

export class Novel extends Historian {
  set name(n: string) {
    this.notify(
      HistoryNode.CreateByChange("Novel name", { before: this.name, after: n }, { description: this.description }),
    );
    this._name = n;
  }

  set location(v: string) {
    this.notify(HistoryNode.CreateByChange("Novel location", { before: this.location, after: v }));
    this._location = v;
  }

  set lastUpdate($: CheerioStatic) {
    const last = GetNovelDateApi($);
    this.notify(
      HistoryNode.CreateByChange("Last update", { before: Timestamp(this._updateAt), after: Timestamp(last) }),
    );

    this._updateAt = last;
  }

  get location(): string {
    return this._location || Config.Load({ quiet: true }).getNovelLocation();
  }

  get id() {
    return this._id;
  }

  get name() {
    return this._name || "";
  }

  get alias() {
    return this._alias;
  }

  get description() {
    return `Novel ID ${this.id} (${this.name})`;
  }

  get lastUpdateAt() {
    return this._updateAt || moment();
  }

  get startDownloadAt() {
    return this._downloadAt || moment();
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
    if (this._chapters.length < 1) {
      return { start: 0, end: 0, size: 0, list: [] };
    }

    const numbers = this._chapters.keys();
    const s = parseInt(numbers[0].toString());
    const e = parseInt(numbers[numbers.length - 1].toString());
    log(WrapTMCT("debug", "Chapter size (start)", s));
    log(WrapTMCT("debug", "Chapter size (end)", e));
    log(WrapTMCT("debug", "Chapter size (size)", numbers.length));
    log(WrapTMCT("debug", "Chapter size (list)", numbers));
    return {
      start: s,
      end: e,
      size: numbers.length,
      list: numbers,
    };
  }
  private _id: string;
  private _location?: string;

  private _alias: string[];

  private _name?: string;
  private _chapters: SortedArrayMap<NovelChapter>;

  private _downloadAt: Moment; // manually collect
  private _updateAt?: Moment; // this from website

  private async validateBeforeSave({ force = false }) {
    if (this._location && existsSync(this._location) && !force) {
      throw NOVEL_WARN.clone().loadString(`Novel ID ${this._id} is exist`);
    }
    await mkdirp(this._location || "");
  }

  private async saveZero({ validate = false, force = false }) {
    if (validate) {
      this.validateBeforeSave({ force });
    }

    const zero = NovelBuilder.createZeroChapter(this);
    await zero.download(force);
  }

  private saveChapters({
    validate = false,
    force = false,
    completeFn = (_: NovelChapter) => {},
    completedFn = (_: NovelChapter) => {},
    failFn = (_: NovelChapter) => {},
  }) {
    if (validate) this.validateBeforeSave({ force });

    if (this._chapters.length < 1)
      return Bluebird.reject(NOVEL_NOTFOUND_ERR.loadString("don't have any chapters or this might be short novel"));

    return Bluebird.each(this.chapter({ copy: true }), async chap => {
      if (chap.isCompleted()) {
        completedFn(chap); // already downloaded, this for update novel
      }

      if (chap.isUnknown()) {
        const res = await FetchApi(chap);
        const content = HtmlBuilder.buildContent(res.chapter, res.cheerio);

        if (content) {
          const html = HtmlBuilder.template(res.chapter.id)
            .addChap(res.chapter)
            .addName(this._name)
            .addContent(content)
            .renderDefault();

          await Writer.ByChapter(html, res.chapter, force);

          completeFn(chap);
          chap.markComplete();
        }
      }

      if (chap.isClosed() || chap.isSold()) {
        failFn(chap);
        SaveIf(chap.throw());
      }
    });
  }

  constructor(id: string, location?: string) {
    super();

    this.notify(HistoryNode.CreateByChange("Novel ID", { before: undefined, after: id }));
    this._id = id;

    this._alias = [];

    this._chapters = new SortedArrayMap();

    if (!location) location = Config.Load().getNovelLocation();
    this.location = location;

    this._downloadAt = moment();
  }

  public addAlias(alias: string) {
    this._alias.push(alias);
  }

  public getChapter(key: number | NovelChapter) {
    if (typeof key === "number") {
      return this._chapters.get(key);
    }
    return this._chapters.get(key.key);
  }

  public addChapter(chapter: NovelChapter) {
    const size = JSON.stringify(this.chapterSize);
    const isReplace = this.replaceChapter(chapter);
    if (!isReplace) {
      this.notify(
        HistoryNode.CreateByChange(
          "Novel chapters",
          { before: size, after: JSON.stringify(chapter.toJSON()) },
          { description: this.description },
        ),
      );
      chapter.location = this.location; // link the location as well
      chapter.linkTo(this); // link chapter history to novel history
    }
  }

  public replaceChapter(chap: NovelChapter) {
    if (this._chapters.has(chap.key)) {
      const current = this._chapters.get(chap.key) as NovelChapter;
      // reset to unknown if chapter is incompleted
      if (!current.isCompleted()) {
        current.markUnknown();
      } else {
        // if writer update something and the chapter isn't sold or closed
        if (current.moment.isBefore(chap.moment) && chap.isUnknown()) {
          current.markUnknown();
        }
      }
      return true;
    } else {
      this._chapters.set(chap.key, chap);
      return false;
    }
  }

  public resetChapter() {
    this._chapters = new SortedArrayMap();
  }

  public setAll(setting: {
    id?: string;
    name?: string;
    lastUpdate?: string;
    downloadAt?: string;
    chapters?: NovelChapterResourceType[];
  }) {
    this.pauseObserve();

    if (setting.id) this._id = setting.id;
    if (setting.name) this._name = setting.name;
    if (setting.lastUpdate) this._updateAt = RevertTimestamp(setting.lastUpdate);
    if (setting.downloadAt) this._downloadAt = RevertTimestamp(setting.downloadAt);

    if (setting.chapters && setting.chapters.length > 0) {
      this.resetChapter();
      setting.chapters.map(c => NovelBuilder.buildChapterLocal(this, c)).forEach(c => this.addChapter(c));
    }

    this.startObserve();
  }

  public setHistory(nodes: HistoryNodeType[]) {
    this.pauseObserve();

    nodes
      .map(
        node =>
          new HistoryNode(
            HistoryActionUtils.ToAction(node.action),
            node.title,
            { before: node.value.before, after: node.value.after },
            { description: node.description, time: RevertTimestamp(node.time) },
          ),
      )
      .forEach(node => this.history().addNode(node));
    this.startObserve();
  }

  public chapter({ copy = false }) {
    if (!this._chapters) return [];
    const array = this._chapters.toArray() as NovelChapter[];

    if (copy) return array.copyWithin(0, 0);
    else return array;
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

  public update(): Bluebird<Novel> {
    return FetchApi(NovelBuilder.createZeroChapter(this)).then(value => {
      return this.load(value.cheerio);
    });
  }

  public load($: CheerioStatic): Bluebird<Novel> {
    return new Bluebird(res => {
      this.name = GetNovelNameApi($);

      if (this._location && !CheckIsNovelPath(this._location))
        this.location = join(this._location, DEFAULT_NOVEL_FOLDER_NAME(NormalizeNovelName(this.name)));

      // this.resetChapter();
      CreateChapterListApi($).forEach(c => this.addChapter.call(this, c));

      this.lastUpdate = $;
      res(this);
    });
  }

  public saveResource({ force = false }) {
    const res = ResourceBuilder.Create(this);
    const path = res.buildPath(this.location);
    return Writer.ByPath(JSON.stringify(res.toJSON(), undefined, "  "), path, force).then(() => Bluebird.resolve(this));
  }

  public async saveNovel({
    force = false,
    completeFn = (_: NovelChapter) => {},
    completedFn = (_: NovelChapter) => {},
    failFn = (_: NovelChapter) => {},
  }) {
    try {
      await this.validateBeforeSave({ force });
      await this.saveChapters({ force, completeFn, completedFn, failFn });
      await this.saveZero({ force });
      return Bluebird.resolve(this);
    } catch (e) {
      return Bluebird.reject(e);
    }
  }

  public async saveAll({ force = false, completeFn = (_: NovelChapter) => {} }) {
    try {
      await this.saveNovel({ force, completeFn });
      await this.saveResource({ force });

      return Bluebird.resolve(this);
    } catch (e) {
      return Bluebird.reject(e);
    }
  }

  public toJSON() {
    return {
      id: this.id,
      alias: this.alias,
      name: this.name,
      lastUpdate: Timestamp(this.lastUpdateAt),
      chapters: this.mapChapter(chap => chap.toJSON()),
    };
  }
}
