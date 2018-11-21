/**
 * @internal
 * @module nd.security.model
 */

import { IsFullName } from "../../../security/index-prod";
import { SECURITY_FAIL_ERR } from "../../constants/error.const";

import { Validator } from "./Validator";

export class UsernameValidator implements Validator {
  get fullname() {
    return this.username.join(" ");
  }

  get name() {
    if (this.username.length !== 3) {
      return "";
    }
    return this.username[0];
  }

  get surname() {
    if (this.username.length !== 3) {
      return "";
    }
    return this.username[1];
  }

  get email() {
    if (this.username.length !== 3) {
      return "";
    }
    return this.username[2];
  }

  private username: string[];

  constructor(username: string) {
    this.username = username.split(" ");
  }

  public isValid() {
    try {
      return IsFullName(this.username.join(" "));
    } catch (e) {
      throw SECURITY_FAIL_ERR.loadError(e);
    }
  }
}
