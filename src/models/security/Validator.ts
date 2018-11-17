/**
 * @internal
 * @module nd.security.model
 */

import { VerifyToken } from "../../apis/token";
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
    const decode = VerifyToken(this.token, this.username);
    return result && CheckIsExist(decode && decode.toString());
  }
}
