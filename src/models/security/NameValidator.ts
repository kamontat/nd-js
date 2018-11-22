/**
 * @internal
 * @module nd.security.model
 */

import { IsFullName } from "../../../security/index-prod";
import { SECURITY_FAIL_ERR } from "../../constants/error.const";

import { Validator } from "./Validator";

export class NameValidator implements Validator {
  get fullname() {
    return this._fullname.join(" ");
  }

  get name() {
    if (this._fullname.length !== 3) {
      return "";
    }
    return this._fullname[0];
  }

  get surname() {
    if (this._fullname.length !== 3) {
      return "";
    }
    return this._fullname[1];
  }

  get email() {
    if (this._fullname.length !== 3) {
      return "";
    }
    return this._fullname[2];
  }

  private _fullname: string[];

  constructor(fullname: string) {
    this._fullname = fullname.split(" ");
  }

  public isValid() {
    try {
      return IsFullName(this._fullname.join(" "));
    } catch (e) {
      throw SECURITY_FAIL_ERR.loadError(e);
    }
  }
}
