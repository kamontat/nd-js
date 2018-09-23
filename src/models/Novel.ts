import { GetLink, GetLinkWithChapter } from "../apis/novel";
import { URL } from "url";
import { NovelError } from "../constants/error.const";

export interface Downloadable {
  getLink(): URL;
}

export class NovelBuilder {
  static create(id: string, location: string) {
    return new Novel(id, location);
  }

  static build(id: string, location: string) {
    let novel = new Novel(id, location);
    return novel.load();
  }
}

export class Novel implements Downloadable {
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

  getLink() {
    let link = GetLink(this._id);
    if (link) return link;
    throw NovelError.clone().loadString("cannot generate download link");
  }

  getLinkAtChapter(chapter: string) {
    let link = GetLinkWithChapter(this._id, chapter);
    if (link) return link;
    throw NovelError.clone().loadString("cannot generate download link");
  }

  getLinkAtChapters(chapters: string[]) {
    return chapters.filter(v => v !== undefined && v !== null).map(v => this.getLinkAtChapter(v));
  }
}
