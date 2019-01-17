/**
 * @internal
 * @module nd.novel.model
 */

import moment, { Moment } from "moment";
import { render } from "mustache";
import { join } from "path";
import { log } from "winston";

import { WrapTMC } from "../../apis/loggerWrapper";
import {
  CHAPTER_CLOSED_WARN,
  CHAPTER_SOLD_WARN,
  NOVEL_ERR,
} from "../../constants/error.const";
import {
  CheckIsNumber,
  RevertTimestamp,
  Timestamp,
} from "../../helpers/helper";
import { GetChapterFile, GetLinkWithChapter } from "../../helpers/novel";
import Config from "../command/Config";
import { Historian } from "../history/Historian";
import { HistoryNode } from "../history/HistoryNode";

import { NovelStatus } from "./NovelStatus";

export class NovelChapter extends Historian {
  get id() {
    return this._nid;
  }

  get name() {
    return this._name || "";
  }

  get description() {
    return `Chapter ${this.number} of ${this.id}`;
  }

  set name(n: string) {
    this.notify(
      HistoryNode.CreateByChange(
        `Chap ${this.number} name`,
        { before: this._name, after: n },
        { description: this.description },
      ),
    );
    this._name = n;
  }

  get location() {
    return this._location || "";
  }

  set location(loc: string) {
    if (this._location === loc) return;

    this.notify(
      HistoryNode.CreateByChange(
        `Chap ${this.number} location`,
        { before: this._location, after: loc },
        { description: this.description },
      ),
    );
    this._location = loc;
  }

  get number() {
    return this._chapterNumber;
  }

  get key() {
    return parseInt(this.number);
  }

  get date() {
    if (!this._date) return "";
    return this._date.format("Do MMM YYYY");
  }

  get moment() {
    return this._date ? this._date : moment();
  }

  get timestamp() {
    return Timestamp(this._date) || "";
  }

  set date(d: string | Moment) {
    const date = typeof d === "string" ? RevertTimestamp(d) : d;
    if (!date.isValid()) return;

    if (this._date) {
      const isSame =
        this._date.isSame(date, "year") &&
        this._date.isSame(date, "month") &&
        this._date.isSame(date, "day");
      if (!isSame) {
        this._date = date;
      }
    } else {
      this.notifyDateChange(date);
      this._date = date;
    }
  }

  get status() {
    return this._status;
  }

  set status(status: NovelStatus) {
    this.notify(
      HistoryNode.CreateByChange(
        `Chap ${this.number} status`,
        { before: this._status, after: status },
        { description: this.description },
      ),
    );
    this._status = status;
  }

  private _status: NovelStatus = NovelStatus.UNKNOWN;

  private notifyDateChange(date: Moment) {
    this.notify(
      HistoryNode.CreateByChange(
        `Chap ${this.number} date`,
        { before: Timestamp(this._date), after: Timestamp(date) },
        { description: this.description },
      ),
    );
  }

  protected _nid: string;
  protected _name?: string;
  protected _chapterNumber: string = "0";
  protected _location: string;

  protected _date?: Moment;

  constructor(
    id: string,
    chapter?: string,
    name?: string,
    location?: string,
    date?: Moment,
  ) {
    super();

    this.notify(HistoryNode.CreateByChange("Chapter ID", { after: id }));
    this._nid = id;

    if (chapter) {
      if (CheckIsNumber(chapter)) {
        this.notify(
          HistoryNode.CreateByChange("Chapter number", {
            before: undefined,
            after: chapter,
          }),
        );
        this._chapterNumber = chapter;
      } else {
        log(
          WrapTMC("warn", "Novel creator", `Chapter is not number (${chapter})`),
        );
      }
    }

    if (name) this.name = name;

    if (date && date.isValid()) this.date = date;

    if (!location) location = Config.Load({ quiet: true }).getNovelLocation();
    this._location = "";
    this.location = location;
  }

  public link() {
    const link = GetLinkWithChapter(this.id, this.number);
    if (link) {
      return link;
    }
    throw NOVEL_ERR.clone().loadString("cannot generate download link");
  }

  public file() {
    return join(this._location, GetChapterFile(this.number));
  }

  public format(format: string) {
    return render(format, this);
  }

  public head() {
    if (this.number === "0") return "Chapter Zero";
    else return `Chapter ${this.number}`;
  }

  public toJSON() {
    return {
      id: this.id,
      name: this.name,
      number: this.number,
      date: this.timestamp,
      status: this.status,
    };
  }

  public isCompleted() {
    return this._status === NovelStatus.COMPLETED;
  }

  public isSold() {
    return this._status === NovelStatus.SOLD;
  }

  public isClosed() {
    return this._status === NovelStatus.CLOSED;
  }

  public isUnknown() {
    return this._status === NovelStatus.UNKNOWN;
  }

  public markSell() {
    this.status = NovelStatus.SOLD;
    // return CHAPTER_SOLD_WARN.clone().loadString(`id ${this.id} chapter ${this.number}`);
  }

  public markClose() {
    this.status = NovelStatus.CLOSED;
    // return CHAPTER_CLOSED_WARN.clone().loadString(`id ${this.id} chapter ${this.number}`);
  }

  public markComplete() {
    this.status = NovelStatus.COMPLETED;
  }

  public markUnknown() {
    this.status = NovelStatus.UNKNOWN;
  }

  public throw() {
    if (this.isClosed())
      return CHAPTER_CLOSED_WARN.clone().loadString(
        `id ${this.id} chapter ${this.number}`,
      );
    else if (this.isSold())
      return CHAPTER_SOLD_WARN.clone().loadString(
        `id ${this.id} chapter ${this.number}`,
      );
    return;
  }

  public toString() {
    return this.format("{{name}} @{{number}} was {{status}} on {{date}}");
  }

  public equals(c: NovelChapter) {
    return this.id === c.id && this.number === c.id;
  }
}
