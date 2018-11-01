/**
 * @internal
 * @module nd.novel
 */

import { Moment } from "moment";
import { render } from "mustache";
import { join } from "path";
import { log } from "winston";

import { COLORS } from "../../constants/color.const";
import { NOVEL_ERR } from "../../constants/error.const";
import { CheckIsNumber, Timestamp } from "../../helpers/helper";
import { GetChapterFile, GetLinkWithChapter } from "../../helpers/novel";
import Config from "../command/Config";
import { Historian } from "../history/Historian";
import { WrapTMC } from "../output/LoggerWrapper";

import { Novel } from "./Novel";

/**
 * The status of novel chapter
 */
export enum NovelStatus {
  /**
   * Unknown will be the default status of novel chapter
   */
  UNKNOWN = "unknown",

  /**
   * Completed will set when the network downloaded the chapter and save completely
   */
  COMPLETED = "completed",

  /**
   * Closed will set if the auto detect, have detected the close chapter
   */
  CLOSED = "closed",

  /**
   * Sold will set if the autodetect, have detected the sold chapter
   */
  SOLD = "sold",
}

export class NovelChapter extends Historian {
  get id() {
    return this._nid;
  }

  get name() {
    return this._name || "";
  }

  get number() {
    return this._chapterNumber;
  }

  get date() {
    return this._date;
  }

  protected _nid: string;
  protected _name?: string;
  protected _chapterNumber: string = "0";
  protected _location: string;

  protected _date?: Moment;

  constructor(id: string, chapter?: string, name?: string, location?: string, date?: Moment) {
    super();

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

  public status: NovelStatus = NovelStatus.UNKNOWN;

  public setStatus(status: NovelStatus) {
    this.status = status;
  }

  public setName(name: string) {
    this._name = name;
  }

  public setDate(date: Moment) {
    this._date = date;
  }

  public getDate() {
    return (this._date && this._date.format("d MMM YYYY")) || "";
  }

  public setLocation(location: string | undefined) {
    if (location) {
      this._location = location;
    }
  }

  public link() {
    const link = GetLinkWithChapter(this._nid, this._chapterNumber);
    if (link) {
      return link;
    }
    throw NOVEL_ERR.clone().loadString("cannot generate download link");
  }

  public file() {
    return join(this._location, GetChapterFile(this._chapterNumber));
  }

  public format(format: string) {
    return render(format, this);
  }

  public head() {
    if (this.number === "0") return "Zero chapter";
    else return `Chapter: ${this._chapterNumber}`;
  }

  // public toString() {
  //   if (this._chapterNumber === "0") {
  //     return COLORS.ChapterName.color("chapter zero");
  //   }
  //   let result = "";
  //   if (this._name) {
  //     result += COLORS.ChapterName.color(this._name);
  //   } else {
  //     result += "no-name";
  //   }

  //   result += ` ${COLORS.Important.color(this.status.toUpperCase())} `;

  //   if (this._date) {
  //     result += ` [อัพเดตล่าสุดเมื่อ ${COLORS.Date.formatColor(this._date)}]`;
  //   } else {
  //     result += ` [ไม่รู้การอัพเดตล่าสุด]`;
  //   }

  //   return result;
  // }

  public buildJSON() {
    return {
      name: this._name,
      number: this._chapterNumber,
      date: Timestamp(this._date),
      status: this.status,
    };
  }

  public isCompleted() {
    return this.status === NovelStatus.COMPLETED;
  }

  public isSold() {
    return this.status === NovelStatus.SOLD;
  }

  public isClosed() {
    return this.status === NovelStatus.CLOSED;
  }

  public isUnknown() {
    return this.status === NovelStatus.UNKNOWN;
  }

  public markSell() {
    this.status = NovelStatus.SOLD;
  }

  public markClose() {
    this.status = NovelStatus.CLOSED;
  }

  public markComplete() {
    this.status = NovelStatus.COMPLETED;
  }
}
