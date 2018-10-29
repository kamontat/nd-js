/**
 * @internal
 * @module nd.history
 */

import moment, { Moment } from "moment";
import { v4 } from "uuid";

import { Timestamp } from "../helpers/helper";

export enum HistoryAction {
  ADDED = "Added",
  MODIFIED = "Modified",
  DELETED = "Deleted",
}

export class HistoryNode {
  private _id: string;
  private _title: string;
  private _description: string;

  private _before: string;
  private _after: string;

  private _action: HistoryAction;
  public get action() {
    return this._action;
  }

  private _time: Moment;

  constructor(
    action: HistoryAction,
    title: string,
    value: { before?: string; after?: string },
    opt?: { description?: string; time?: Moment },
  ) {
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
}
