/**
 * @internal
 * @module nd.novel
 */

import moment, { Moment } from "moment";

import { log } from "winston";
import { GetLinkWithChapter, GetChapterFile, GetNID, GetLink } from "../helpers/novel";
import { URL } from "url";
import { NOVEL_ERR } from "../constants/error.const";
import Config from "./Config";
import { join } from "path";
import { GetNovelNameApi, CreateChapterListApi, GetNovelDateApi, NormalizeNovelName } from "../apis/novel";
import { WrapTMCT, WrapTMC } from "./LoggerWrapper";
import { COLORS } from "../constants/color.const";
import { ColorType } from "./Color";
import { CheckIsNumber } from "../helpers/helper";
import { DownloadApi } from "../apis/download";
import { DEFAULT_NOVEL_FOLDER_NAME } from "../constants/novel.const";

type NovelChapterBuilderOption = { name?: string; location?: string; date?: Moment };

export class NovelBuilder {
  static create(id: string, option?: { location?: string }) {
    return DownloadApi(NovelBuilder.createChapter(id, undefined, { location: option && option.location })).then(res => {
      return NovelBuilder.build(res.chapter._nid, res.cheerio, { location: res.chapter._location });
    });
  }

  static build(id: string, $: CheerioStatic, option?: { location?: string }) {
    const novel = new Novel(id, option && option.location);
    return novel.load($);
  }

  static createChapter(id: string, chapter?: string, option?: NovelChapterBuilderOption) {
    return new NovelChapter(id, chapter, option && option.name, option && option.location);
  }

  static createChapterByLink(url: URL, option?: NovelChapterBuilderOption) {
    return new NovelChapter(
      GetNID(url.toString()),
      url.searchParams.get("chapter") || undefined,
      option && option.name,
      option && option.location,
      option && option.date
    );
  }
}

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

      this._chapters = CreateChapterListApi($).map(chap => {
        chap.setLocation(this._location);
        return chap;
      });
      this.update($);
      res(this);
    });
  }

  print() {
    const link = GetLink(this._id);
    log(WrapTMCT("info", "Novel name", this._name, { message: COLORS.Name }));
    log(WrapTMCT("info", "Novel link", link));
    log(
      WrapTMCT("info", "Chapters", this._chapters && this._chapters.map(c => c._chapterNumber), {
        message: COLORS.ChapterList
      })
    );
    if (this._chapters) {
      this._chapters.forEach(chapter => {
        log(
          WrapTMCT(
            "verbose",
            `Chapter ${chapter._chapterNumber}`,
            `${COLORS.ChapterName.color(chapter._name)} [อัพเดตล่าสุดเมื่อ ${COLORS.Date.formatColor(
              chapter._date && chapter._date
            )}]`
          )
        );
      });
    }

    log(WrapTMCT("verbose", "Download at", this._downloadAt));
    log(WrapTMCT("verbose", "Update at", this._updateAt));
  }

  save() {
    if (this._chapters) {
      this._chapters.forEach(v => {
        if (this._location) {
          console.log(v.file());
        }
      });
    }
  }
}

export class NovelChapter {
  _nid: string;
  _name?: string;
  _chapterNumber: string = "0";
  _location: string;

  _date?: Moment;

  constructor(id: string, chapter?: string, name?: string, location?: string, date?: Moment) {
    this._nid = id;
    this._name = name;

    this._date = date;
    if (location) {
      this._location = location;
    } else {
      this._location = Config.Load({ quiet: true }).getNovelLocation();
    }

    if (chapter) {
      if (CheckIsNumber(chapter)) {
        this._chapterNumber = chapter;
      } else {
        log(WrapTMC("warn", "Novel creator", `Chapter is not number (${chapter})`));
      }
    }
  }

  setName(name: string) {
    this._name = name;
  }

  setDate(date: Moment) {
    this._date = date;
  }

  setLocation(location: string | undefined) {
    if (location) this._location = location;
  }

  link() {
    let link = GetLinkWithChapter(this._nid, this._chapterNumber);
    if (link) return link;
    throw NOVEL_ERR.clone().loadString("cannot generate download link");
  }

  file() {
    return join(this._location, GetChapterFile(this._chapterNumber));
  }
}
