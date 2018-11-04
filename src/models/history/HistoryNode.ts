/**
 * @internal
 * @module nd.history
 */

import moment, { Moment } from "moment";
import { v1 } from "uuid";

import { CheckIsExist, Timestamp } from "../../helpers/helper";

export enum HistoryAction {
  ADDED = "Added",
  MODIFIED = "Modified",
  DELETED = "Deleted",
}

export interface HistoryCreatorChanges {
  before?: string;
  after?: string;
}
export interface HistoryCreatorOption {
  description?: string;
  time?: Moment;
}

export interface HistoryNodeType {
  action: string;
  title: string;
  description: string;
  value: {
    before: string;
    after: string;
  };
  time: string;
}

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

    this._id = v1();
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

  public toJSON(): HistoryNodeType {
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
    return a.id === b.id;
  }

  public static Compare(a: HistoryNode, b: HistoryNode) {
    if (!a._time || !b._time) return 0;
    if (a._time.isAfter(b._time)) return -1;
    else if (a._time.isBefore(b._time)) return 1;
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
    if (CheckIsExist(changes.before) && CheckIsExist(changes.after) && changes.before !== changes.after)
      return this.CreateMOD(title, changes, opt);
    if (CheckIsExist(changes.after)) return this.CreateADD(title, changes, opt);
    if (CheckIsExist(changes.before)) return this.CreateDEL(title, changes, opt);
    return undefined;
    // return new HistoryNode(HistoryAction.DELETED, "Error: nothing changes", changes, {
    //   description: title,
    //   time: opt && opt.time,
    // });
  }
}
