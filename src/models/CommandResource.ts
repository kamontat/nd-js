/**
 * @internal
 * @module nd.resource
 */

import { ND } from "../constants/nd.const";
import { Moment } from "moment";
import { Timestamp, RevertTimestamp } from "../helpers/helper";
import moment = require("moment");

export type CommandResourceType = {
  name: string;
  version: string;
  date: string | undefined;
};

export class CommandResource {
  name: string;
  version: string;
  updateAt?: string;

  constructor({
    name = ND.PROJECT_NAME,
    version = ND.VERSION,
    lastUpdate = moment()
  }: {
    name: string;
    version: string;
    lastUpdate: Moment;
  }) {
    this.name = name;
    this.version = version;
    this.updateAt = Timestamp(lastUpdate);
  }

  build(): CommandResourceType {
    return {
      name: this.name,
      version: this.version,
      date: this.updateAt
    };
  }

  static Load(result: CommandResourceType) {
    const name = result.name;
    const version = result.version;
    const date = RevertTimestamp(result.date);

    return new CommandResource({
      name: name,
      version: version,
      lastUpdate: date
    });
  }
}
