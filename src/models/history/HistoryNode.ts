/**
 * @internal
 * @module nd.history
 */

import moment, { Moment } from "moment";
import { v4 } from "uuid";

import { Timestamp } from "../../helpers/helper";

export enum HistoryAction {
  ADDED = "Added",
  MODIFIED = "Modified",
  DELETED = "Deleted",
}

export interface HistoryCreatorChanges { before?: string; after?: string }
export interface HistoryCreatorOption { description?: string; time?: Moment }

export class HistoryNode {
  get id() {
    return this._id;
  }
  public get action() {
    return this._action;
  }

  private _id: string;

  private _title: string;
  private _description: string;

  private _before: string;
  private _after: string;

  private _action: HistoryAction;

  private _time: Moment;

  constructor(action: HistoryAction, title: string, value: HistoryCreatorChanges, opt?: HistoryCreatorOption) {
    this._action = action;

    this._id = v4();
    this._title = title;

    this._before = value.before || "";
    this._after = value.after || "";

    this._description = (opt && opt.description && opt.description) || "";
    this._time = (opt && opt.time && opt.time) || moment();
  }

  public toString() {
    return `${this._id}: ${this._title} was ${this.action} from '${this._before}' to '${
      this._after
    }' at ${this._time.toString()}`;
  }

  public toJSON() {
    return {
      action: this.action,
      title: this._title,
      description: this._description,
      value: {
        before: this._before,
        after: this._after,
      },
      time: Timestamp(this._time) || "",
    };
  }
  public static Equals(a: HistoryNode, b: HistoryNode) {
    return a._id === b._id;
  }

  public static Compare(a: HistoryNode, b: HistoryNode) {
    if (a._time < b._time) return -1;
    else if (a._time > b._time) return 1;
    else return 0;
  }

  public static CreateADD(title: string, { after = "" }, opt?: HistoryCreatorOption) {
    return new HistoryNode(HistoryAction.ADDED, title, { after }, opt);
  }

  public static CreateMOD(title: string, { before = "", after = "" }, opt?: HistoryCreatorOption) {
    return new HistoryNode(HistoryAction.MODIFIED, title, { before, after }, opt);
  }

  public static CreateDEL(title: string, { before = "" }, opt?: HistoryCreatorOption) {
    return new HistoryNode(HistoryAction.DELETED, title, { before }, opt);
  }

  public static CreateByChange(title: string, changes: HistoryCreatorChanges, opt?: HistoryCreatorOption) {
    if (changes.before && changes.after) return this.CreateMOD(title, changes, opt);
    if (changes.after) return this.CreateADD(title, changes, opt);
    if (changes.before) return this.CreateDEL(title, changes, opt);
    return new HistoryNode(HistoryAction.DELETED, "Error: nothing changes", changes, {
      description: title,
      time: opt && opt.time,
    });
  }
}
