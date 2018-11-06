/**
 * @internal
 * @module nd.novel
 */

import moment, { Moment } from "moment";
import { render } from "mustache";
import { join } from "path";
import { log } from "winston";

import { NOVEL_ERR } from "../../constants/error.const";
import { CheckIsNumber, RevertTimestamp, Timestamp } from "../../helpers/helper";
import { GetChapterFile, GetLinkWithChapter } from "../../helpers/novel";
import Config from "../command/Config";
import { Historian } from "../history/Historian";
import { HistoryNode } from "../history/HistoryNode";
import { WrapTMC, WrapTMCT } from "../output/LoggerWrapper";

import { CPrinter } from "./CPrinter";
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
      HistoryNode.CreateByChange("Chapter name", { before: this._name, after: n }, { description: this.description }),
    );
    this._name = n;
  }

  get location() {
    return this._location || "";
  }

  set location(loc: string) {
    this.notify(
      HistoryNode.CreateByChange(
        "Chapter location",
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
        this._date.isSame(date, "year") && this._date.isSame(date, "month") && this._date.isSame(date, "day");
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
        "Chapter status",
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
        "Chapter date",
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

  constructor(id: string, chapter?: string, name?: string, location?: string, date?: Moment) {
    super();

    this.notify(HistoryNode.CreateByChange("Chapter ID", { before: undefined, after: id }));
    this._nid = id;
    if (name) this.name = name;

    if (date && date.isValid()) this.date = date;

    if (!location) location = Config.Load({ quiet: true }).getNovelLocation();
    this.notify(HistoryNode.CreateByChange("Chapter location", { before: undefined, after: location }));
    this._location = location;

    if (chapter) {
      if (CheckIsNumber(chapter)) {
        this.notify(HistoryNode.CreateByChange("Chapter number", { before: undefined, after: chapter }));
        this._chapterNumber = chapter;
      } else {
        log(WrapTMC("warn", "Novel creator", `Chapter is not number (${chapter})`));
      }
    }
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
    if (this.number === "0") return "Zero chapter";
    else return `Chapter: ${this.number}`;
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
  }

  public markClose() {
    this.status = NovelStatus.CLOSED;
  }

  public markComplete() {
    this.status = NovelStatus.COMPLETED;
  }

  public markUnknown() {
    this.status = NovelStatus.UNKNOWN;
  }

  public toString() {
    return `Chapter ${this.number} "${this.name}" was downloaded ${this.status} at ${this.date}`;
  }
}
