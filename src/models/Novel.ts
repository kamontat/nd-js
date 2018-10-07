/**
 * @internal
 * @module nd.novel
 */

import moment, { Moment } from "moment";

import { log } from "winston";
import { GetLink } from "../helpers/novel";
import { NOVEL_WARN, NOVEL_SOLD_WARN, NOVEL_CLOSED_WARN } from "../constants/error.const";
import { join } from "path";
import { GetNovelNameApi, CreateChapterListApi, GetNovelDateApi, NormalizeNovelName } from "../apis/novel";
import { WrapTMCT, WrapTMC, WrapTM } from "./LoggerWrapper";
import { COLORS } from "../constants/color.const";
import { DEFAULT_NOVEL_FOLDER_NAME } from "../constants/novel.const";
import { existsSync } from "fs";
import { mkdirpSync, mkdirp } from "fs-extra";
import { Exception } from "./Exception";
import { NovelChapter, NovelStatus } from "./Chapter";
import { NovelBuilder } from "../builder/novel";
import { FetchApi } from "../apis/download";
import { HtmlBuilder } from "../builder/html";
import { WriteChapter } from "../apis/file";
import { Resource } from "./Resource";
import { os } from "pjson";
import { exit } from "shelljs";
import { MakeReadableNumberArray } from "../helpers/helper";
import { ResourceBuilder } from "../builder/resource";

export class Novel {
  // TODO: add required information attribute
  _id: string;
  _location?: string;

  _name?: string;
  _chapters?: NovelChapter[];

  _downloadAt: Moment; // manually collect
  _updateAt?: Moment; // this from website

  constructor(id: string, location?: string) {
    this._id = id;
    if (location) this._location = location;

    this._downloadAt = moment();
  }

  update($: CheerioStatic) {
    this._updateAt = GetNovelDateApi($);
  }

  load($: CheerioStatic): Promise<Novel> {
    return new Promise(res => {
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

    log(WrapTMCT("info", "Novel name", this._name, { message: COLORS.Name }));
    log(WrapTMCT("info", "Novel link", link));

    if (this._location) log(WrapTMCT("info", "Novel location", this._location));
    if (this._location) log(WrapTMCT("info", "First chapter", NovelBuilder.createZeroChapter(this).file()));

    this.printChapterNumber();

    if (this._chapters && option && option.withChapter) {
      this._chapters.forEach(chapter => {
        log(WrapTMCT("info", `Chapter ${chapter._chapterNumber}`, chapter.toString()));
      });
    }

    log(WrapTMCT("verbose", "Download at", this._downloadAt));
    log(WrapTMCT("verbose", "Update at", this._updateAt));
  }

  printChapterNumber() {
    const completedChapters: string[] | undefined =
      this._chapters && this._chapters.filter(c => c.status === NovelStatus.COMPLETED).map(c => c._chapterNumber);
    const closedChapters: string[] | undefined =
      this._chapters && this._chapters.filter(c => c.status === NovelStatus.CLOSED).map(c => c._chapterNumber);
    const soldChapters: string[] | undefined =
      this._chapters && this._chapters.filter(c => c.status === NovelStatus.SOLD).map(c => c._chapterNumber);
    const unknownChapters: string[] | undefined =
      this._chapters && this._chapters.filter(c => c.status === NovelStatus.UNKNOWN).map(c => c._chapterNumber);

    if (completedChapters && completedChapters.length > 0)
      log(WrapTMCT("info", "Completed chapters", completedChapters, { message: COLORS.ChapterList }));
    if (closedChapters && closedChapters.length > 0)
      log(WrapTMCT("verbose", "Closed chapters", closedChapters, { message: COLORS.ChapterList }));
    if (soldChapters && soldChapters.length > 0)
      log(WrapTMCT("verbose", "Sold chapters", soldChapters, { message: COLORS.ChapterList }));
    if (unknownChapters && unknownChapters.length > 0)
      log(WrapTMCT("debug", "Unknown chapters", unknownChapters, { message: COLORS.ChapterList }));
  }

  async save({ force = false }) {
    // const force = option && option.force;
    if (this._location && existsSync(this._location) && !force) {
      throw NOVEL_WARN.clone().loadString(`Novel ID ${this._id} is exist`);
    }

    await mkdirp(this._location || "");

    const zero = NovelBuilder.createZeroChapter(this);
    await zero.download(force);

    if (this._chapters) {
      await Promise.all(
        this._chapters.map(async chap => {
          try {
            log(WrapTM("debug", "start download", `chapter ${chap._chapterNumber}`));
            const res = await FetchApi(chap);
            log(WrapTM("debug", "start build html file", `chapter ${chap._chapterNumber}`));
            const html = HtmlBuilder.template(res.chapter._nid)
              .addChap(res.chapter)
              .addName(this._name)
              .addContent(HtmlBuilder.buildContent(res.cheerio))
              .renderDefault();

            await WriteChapter(html, res.chapter, force);
            log(WrapTMCT("verbose", "Completed", `${chap.toString()}`));
            chap.setStatus(NovelStatus.COMPLETED);
          } catch (e) {
            if (NOVEL_SOLD_WARN.equal(e)) {
              e.loadString(`chapter ${chap._chapterNumber}`);
              chap.setStatus(NovelStatus.SOLD);
            } else if (NOVEL_CLOSED_WARN.equal(e)) {
              e.loadString(`chapter ${chap._chapterNumber}`);
              chap.setStatus(NovelStatus.SOLD);
            } else {
              if (e instanceof Exception) {
                if (!e.warn) throw e;
                else e.printAndExit();
              }
            }
          }
        })
      );

      if (!this._location) {
        // const resource = ResourceBuilder.build(this._location || "", this);
        // await resource.save(force);
      }
    }
  }
}
