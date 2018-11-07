/**
 * @internal
 * @module nd.security
 */

import { SECURITY_FAIL_ERR } from "../../constants/error.const";
import { ND } from "../../constants/nd.const";
import { CheckIsEmail } from "../../helpers/helper";

import { Validator } from "./Validator";

export class UsernameValidator implements Validator {
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

  get key() {
    if (this.username.length !== 3) {
      return "";
    }
    return this.username.join(" ").concat(" ", ND.A());
  }

  constructor(username: string) {
    this.username = username.split(" ");
  }
  public username: string[];

  public isValid() {
    // must be form of `name surname email`
    if (this.username.length !== 3) {
      throw SECURITY_FAIL_ERR.loadString("Username must stay in form of 'name surname email'");
    }

    if (!this.name.match(/^\w+$/)) {
      throw SECURITY_FAIL_ERR.loadString("Name must contains only english charactor");
    }
    if (!this.surname.match(/^\w+$/)) {
      throw SECURITY_FAIL_ERR.loadString("Surname must contains only english charactor");
    }
    if (!CheckIsEmail(this.email)) {
      throw SECURITY_FAIL_ERR.loadString("Wrong email format");
    }

    if (this.email === "admin@nd.com" && ND.isProd()) {
      throw SECURITY_FAIL_ERR.loadString("You using mockup token");
    }
    return true;
  }
}
