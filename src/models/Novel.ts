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

export class Novel {
  // TODO: add required information attribute
  _id: string;
  _location?: string;

  _name?: string;
  _chapters?: NovelChapter[];

  _downloadAt: Moment; // manually collect
  _updateAt?: Moment; // this from website

  resource: Resource; // auto initial

  constructor(id: string, location?: string) {
    this._id = id;
    if (location) this._location = location;

    this._downloadAt = moment();

    this.resource = new Resource(this);
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
    log(
      WrapTMCT("info", "Chapters", this._chapters && this._chapters.map(c => c._chapterNumber), {
        message: COLORS.ChapterList
      })
    );
    if (this._chapters && option && option.withChapter) {
      this._chapters.forEach(chapter => {
        log(WrapTMCT("verbose", `Chapter ${chapter._chapterNumber}`, chapter.toString()));
      });
    }

    log(WrapTMCT("verbose", "Download at", this._downloadAt));
    log(WrapTMCT("verbose", "Update at", this._updateAt));
  }

  async save({ force = false, resource = true }) {
    // const force = option && option.force;
    if (this._location && existsSync(this._location) && !force) {
      NOVEL_WARN.clone()
        .loadString(`Novel ID ${this._id} is exist`)
        .printAndExit();
      return;
    }

    await mkdirp(this._location || "");

    try {
      const zero = NovelBuilder.createZeroChapter(this);
      await zero.download(force);
    } catch (e) {
      e.printAndExit();
    }

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
            if (e === NOVEL_SOLD_WARN) {
              e.loadString(`chapter ${chap._chapterNumber}`);
              chap.setStatus(NovelStatus.SOLD);
            } else if (e === NOVEL_CLOSED_WARN) {
              e.loadString(`chapter ${chap._chapterNumber}`);
              chap.setStatus(NovelStatus.SOLD);
            }
            e.printAndExit();
          }
        })
      );

      if (resource)
        try {
          await this.resource.save(force);
        } catch (e) {
          e.printAndExit();
        }
    }
  }
}
