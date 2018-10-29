/**
 * @internal
 * @module nd.resource
 */

import { Moment } from "moment";
import moment = require("moment");

import { ND } from "../constants/nd.const";
import { RevertTimestamp, Timestamp } from "../helpers/helper";

export interface CommandResourceType {
  name: string;
  version: string;
  date: string | undefined;
}

export class CommandResource {

  constructor({
    name = ND.PROJECT_NAME,
    version = ND.VERSION,
    lastUpdate = moment(),
  }: {
    name: string;
    version: string;
    lastUpdate: Moment;
  }) {
    this.name = name;
    this.version = version;
    this.updateAt = Timestamp(lastUpdate);
  }
  public name: string;
  public version: string;
  public updateAt?: string;

  public build(): CommandResourceType {
    return {
      name: this.name,
      version: this.version,
      date: this.updateAt,
    };
  }

  public static Load(result: CommandResourceType) {
    const name = result.name;
    const version = result.version;
    const date = RevertTimestamp(result.date);

    return new CommandResource({
      name,
      version,
      lastUpdate: date,
    });
  }
}
