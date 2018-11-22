/**
 * @internal
 * @module nd.security.model
 */
import { DecryptToken } from "../../../security/index-prod";

import { ND } from "../../constants/nd.const";
import { CheckIsExist } from "../../helpers/helper";

import { NameValidator } from "./NameValidator";
import { TokenValidator } from "./TokenValidator";

export interface Validator {
  /**
   * @throws ValidateError
   */
  isValid(): boolean;
}

export class NDValidator implements Validator {
  constructor(token: TokenValidator, username: NameValidator) {
    this.token = token;
    this.name = username;
  }
  public token: TokenValidator;
  public name: NameValidator;

  public isValid() {
    const result = this.token.isValid() && this.name.isValid();
    const decode = DecryptToken({ fullname: this.name.fullname, token: this.token.token, version: ND.VERSION });
    return result && CheckIsExist(decode && decode.toString());
  }
}
