/**
 * @internal
 * @module nd.resource.model
 */

import { RequireTokenData } from "../../../security/index-main";
import { ND } from "../../constants/nd.const";
import { Timestamp } from "../../helpers/helper";
import Config from "../command/Config";

export interface CommandResourceType {
  name: string;
  version: string;
  date: string | undefined; // timestamp
  user?: RequireTokenData;
}

export class CommandResource {
  private name: string;
  private version: string;
  private updateAt?: string;

  private config: Config;

  constructor() {
    this.name = ND.PROJECT_NAME;
    this.version = ND.VERSION;
    this.updateAt = Timestamp(ND.TIME);

    this.config = Config.Load({ quiet: true });
  }

  public build(): CommandResourceType {
    const result = this.config.result;

    return {
      name: this.name,
      version: this.version,
      date: this.updateAt,
      user: result,
    };
  }
}
