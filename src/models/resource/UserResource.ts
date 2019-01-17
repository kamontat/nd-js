/**
 * @internal
 * @module nd.resource.model
 */

import Config from "../command/Config";

export interface User {
  fullname: string;
}

export class UserResource {
  private user: User;

  constructor() {
    this.user = {
      fullname: Config.Load({ bypass: true, quiet: true }).getFullname(),
    };
  }

  public build(): User {
    return this.user;
  }
}
