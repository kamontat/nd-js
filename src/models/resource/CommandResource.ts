/**
 * @internal
 * @module nd.resource
 */

import { ND } from "../../constants/nd.const";
import { Timestamp } from "../../helpers/helper";

export interface CommandResourceType {
  name: string;
  version: string;
  date: string | undefined; // timestamp
}

export class CommandResource {
  private name: string;
  private version: string;
  private updateAt?: string;

  constructor() {
    this.name = ND.PROJECT_NAME;
    this.version = ND.VERSION;
    this.updateAt = Timestamp(ND.TIME);
  }

  public build(): CommandResourceType {
    return {
      name: this.name,
      version: this.version,
      date: this.updateAt,
    };
  }
}
