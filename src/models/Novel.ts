import moment, { Moment } from "moment";

import { log } from "winston";
import { GetLinkWithChapter, GetChapterFile, GetNID, GetLink } from "../helpers/novel";
import { URL } from "url";
import { NovelError } from "../constants/error.const";
import Config from "./Config";
import { join } from "path";
import { API_GET_NOVEL_NAME, API_CREATE_NOVEL_CHAPTER_LIST, API_GET_NOVEL_DATE } from "../apis/novel";
import { WrapTMCT } from "./LoggerWrapper";
import { API_ADD_COLOR } from "../helpers/color";

type NovelChapterBuilderOption = { name?: string; location?: string; date?: Moment };

export class NovelBuilder {
  static create(id: string, option?: { location?: string }) {
    return new Novel(id, option && option.location);
  }

  static build(id: string, $: CheerioStatic, option?: { location?: string }) {
    let novel = NovelBuilder.create(id, option);
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
    this._updateAt = API_GET_NOVEL_DATE($);
  }

  load($: CheerioStatic): Promise<Novel> {
    return new Promise(res => {
      this._name = API_GET_NOVEL_NAME($);
      this._chapters = API_CREATE_NOVEL_CHAPTER_LIST($);
      this.update($);
      res(this);
    });
  }

  chapter(chapter: string): NovelChapter {
    if (this._chapters) {
      const result = this._chapters.filter(v => v._chapterNumber === chapter);
      if (result.length === 1) return result[0];
    }
    return NovelBuilder.createChapter(this._id, chapter, { location: this._location });
  }

  print() {
    const link = GetLink(this._id);
    log(WrapTMCT("info", "Novel name", this._name, { message: "name" }));
    log(WrapTMCT("info", "Novel link", link));
    log(
      WrapTMCT(
        "info",
        "Chapters",
        `[${this._chapters &&
          this._chapters.map(c => c._chapterNumber, {
            message: "chapter_numbers"
          })}]`
      )
    );
    if (this._chapters) {
      this._chapters.forEach(chapter => {
        log(
          WrapTMCT(
            "verbose",
            `Chapter ${chapter._chapterNumber}`,
            `${API_ADD_COLOR(chapter._name, "chapter_name")} [อัพเดตล่าสุดเมื่อ ${API_ADD_COLOR(
              chapter._date &&
                chapter._date.calendar(undefined, {
                  sameDay: "[วันนี้]",
                  lastDay: "[เมื่อวาน]",
                  lastWeek: "[วัน]dddd[ที่แล้ว]",
                  sameElse: "DD/MM/YYYY"
                }),
              "date"
            )}]`
          )
        );
      });
    }

    log(WrapTMCT("verbose", "Download at", this._downloadAt));
    log(WrapTMCT("verbose", "Update at", this._updateAt));
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
      this._location = Config.Load({ quiet: true })._novelLocation || "";
    }

    if (chapter) {
      if (chapter.match(/^\d+$/)) {
        this._chapterNumber = chapter;
      }
    }
  }

  setName(name: string) {
    this._name = name;
  }

  setDate(date: Moment) {
    this._date = date;
  }

  link() {
    let link = GetLinkWithChapter(this._nid, this._chapterNumber);
    if (link) return link;
    throw NovelError.clone().loadString("cannot generate download link");
  }

  file() {
    return join(this._location, GetChapterFile(this._chapterNumber));
  }
}
