/**
 * @internal
 * @module nd.security.model
 */
import { DecryptToken } from "../../../security/index-prod";

import { ND } from "../../constants/nd.const";
import { CheckIsExist } from "../../helpers/helper";

import { TokenValidator } from "./TokenValidator";
import { UsernameValidator } from "./UsernameValidator";

export interface Validator {
  /**
   * @throws ValidateError
   */
  isValid(): boolean;
}

export class NDValidator implements Validator {
  constructor(token: TokenValidator, username: UsernameValidator) {
    this.token = token;
    this.username = username;
  }
  public token: TokenValidator;
  public username: UsernameValidator;

  public isValid() {
    const result = this.token.isValid() && this.username.isValid();
    const decode = DecryptToken({ fullname: this.username.fullname, token: this.token.token, version: ND.VERSION });
    return result && CheckIsExist(decode && decode.toString());
  }
}
