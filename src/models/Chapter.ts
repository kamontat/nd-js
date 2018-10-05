/**
 * @internal
 * @module nd.novel
 */

import { log } from "winston";
import { Moment } from "moment";
import Config from "./Config";
import { CheckIsNumber } from "../helpers/helper";
import { WrapTMC } from "./LoggerWrapper";
import { COLORS } from "../constants/color.const";
import { join } from "path";
import { GetChapterFile, GetLinkWithChapter } from "../helpers/novel";
import { NOVEL_ERR } from "../constants/error.const";
import { FetchApi } from "../apis/download";
import { Novel } from "./Novel";
import { HtmlBuilder } from "../builder/html";
import { WriteChapter } from "../apis/file";
import { render } from "mustache";

export enum NovelStatus {
  UNKNOWN = "unknown",
  COMPLETED = "completed",
  CLOSED = "closed",
  SOLD = "sold"
}

export class NovelChapter {
  // TODO: status of downloaded
  _nid: string;
  _name?: string;
  _chapterNumber: string = "0";
  _location: string;

  _date?: Moment;

  status: NovelStatus = NovelStatus.UNKNOWN;

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

  setStatus(status: NovelStatus) {
    this.status = status;
  }

  setName(name: string) {
    this._name = name;
  }

  setDate(date: Moment) {
    this._date = date;
  }

  getDate() {
    return (this._date && this._date.format("d MMM YYYY")) || "";
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

  format(format: string) {
    return render(format, this);
  }

  toString() {
    if (this._chapterNumber === "0") return COLORS.ChapterName.color("chapter zero");
    let result = "";
    if (this._name) result += COLORS.ChapterName.color(this._name);
    else result += "no-name";

    if (this._date) result += ` [อัพเดตล่าสุดเมื่อ ${COLORS.Date.formatColor(this._date)}]`;
    else result += ` [ไม่รู้การอัพเดตล่าสุด]`;

    return result;
  }
}

export class NovelZeroChapter extends NovelChapter {
  _novel: Novel;

  constructor(novel: Novel) {
    super(novel._id, "0", undefined, novel._location);

    this._novel = novel;
  }

  download(force?: boolean) {
    return FetchApi(this).then(res => {
      const html = HtmlBuilder.template(this._nid)
        .addNovel(this._novel)
        .addContent(HtmlBuilder.buildContent(res.cheerio))
        .renderDefault();

      return WriteChapter(html, res.chapter, force);
    });
  }
}
