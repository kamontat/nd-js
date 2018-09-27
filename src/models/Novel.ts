import { GetLink, GetLinkWithChapter, GetChapterFile, GetNID } from "../helpers/novel";
import { URL } from "url";
import { NovelError } from "../constants/error.const";
import Config from "./Config";
import { join } from "path";

type NovelChapterBuilderOption = { name?: string; location?: string };

export class NovelBuilder {
  static create(id: string, location: string) {
    return new Novel(id, location);
  }

  static build(id: string, location: string) {
    let novel = new Novel(id, location);
    return novel.load();
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
  _location: string;

  constructor(id: string, location: string) {
    this._id = id;
    this._location = location;
  }

  load() {
    // TODO: load novel from internet and fill all information
    return new Promise(res => res());
  }

  chapter(chapter: string): NovelChapter {
    return NovelBuilder.createChapter(this._id, chapter);
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
      this._chapterNumber = chapter;
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
