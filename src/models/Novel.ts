import { log } from "winston";
import { GetLinkWithChapter, GetChapterFile, GetNID, GetLink } from "../helpers/novel";
import { URL } from "url";
import { NovelError } from "../constants/error.const";
import Config from "./Config";
import { join } from "path";
import { API_GET_NOVEL_NAME, API_CREATE_NOVEL_CHAPTER_LIST } from "../apis/novel";
import { WrapTMC } from "./LoggerWrapper";

type NovelChapterBuilderOption = { name?: string; location?: string };

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
      option && option.location
    );
  }
}

export class Novel {
  // TODO: add required information attribute
  _id: string;
  _location?: string;

  _name?: string;
  _chapters?: NovelChapter[];

  _createAt: Date;
  _updateAt: Date;

  constructor(id: string, location?: string) {
    this._id = id;
    if (location) this._location = location;

    this._createAt = new Date();
    this._updateAt = new Date();
  }

  update() {
    this._updateAt = new Date();
  }

  load($: CheerioStatic): Promise<Novel> {
    return new Promise(res => {
      this._name = API_GET_NOVEL_NAME($);
      this._chapters = API_CREATE_NOVEL_CHAPTER_LIST($);

      this.update();
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

  print(option?: { all: boolean }) {
    if (!option) option = { all: true };

    const link = GetLink(this._id);

    log(WrapTMC("info", "Novel name", this._name));
    log(WrapTMC("info", "Novel link", link && link.toString()));

    if (option.all) {
    }
  }
}

export class NovelChapter {
  _nid: string;
  _name?: string;
  _chapterNumber: string = "0";
  _location: string;

  constructor(id: string, chapter?: string, name?: string, location?: string) {
    this._nid = id;
    this._name = name;
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

  link() {
    let link = GetLinkWithChapter(this._nid, this._chapterNumber);
    if (link) return link;
    throw NovelError.clone().loadString("cannot generate download link");
  }

  file() {
    return join(this._location, GetChapterFile(this._chapterNumber));
  }
}
