/**
 * @internal
 * @module nd.security
 */

import { SECURITY_FAIL_ERR } from "../constants/error.const";
import { ND } from "../constants/nd.const";
import { VerifyToken, DecodeToken } from "../apis/token";
import { log } from "winston";
import { WrapTMCT } from "./LoggerWrapper";
import { CheckIsExist, CheckIsEmail, Timestamp, RevertTimestamp } from "../helpers/helper";
import { COLORS } from "../constants/color.const";

export class Security {
  static Checking(token: string, username: string) {
    const tv = new TokenValidator(token);
    const uv = new UsernameValidator(username);
    return new NDValidator(tv, uv);
  }

  static Printer(token: string, username: string) {
    const validator = Security.Checking(token, username);

    log(WrapTMCT("info", "Name", validator.username.name, { message: COLORS.Name }));
    log(WrapTMCT("info", "Surname", validator.username.surname, { message: COLORS.Name }));
    log(WrapTMCT("info", "Email", validator.username.email));

    const decode = DecodeToken(token);
    log(WrapTMCT("info", "Username", decode.name, { message: COLORS.Name }));
    log(WrapTMCT("info", "Issue at", RevertTimestamp(decode.iat), { message: COLORS.DateTime }));
    log(WrapTMCT("info", "Not before", RevertTimestamp(decode.nbf), { message: COLORS.DateTime }));
    log(WrapTMCT("info", "Expire at", RevertTimestamp(decode.exp), { message: COLORS.DateTime }));
  }
}

export interface Validator {
  /**
   * @throws ValidateError
   */
  isValid(): boolean;
}

export class TokenValidator implements Validator {
  token: string;

  constructor(token: string) {
    this.token = token;
  }

  isValid() {
    const min = 200;
    const max = 250;
    // between 205 <-> 210
    if (this.token.length <= min) throw SECURITY_FAIL_ERR.loadString(`Token must have more than ${min} charactor`);
    if (this.token.length > max) throw SECURITY_FAIL_ERR.loadString(`Token cannot have more than ${max} charactor`);
    return true;
  }
}

export class UsernameValidator implements Validator {
  username: Array<string>;

  constructor(username: string) {
    this.username = username.split(" ");
  }

  get name() {
    return this.username[0];
  }

  get surname() {
    return this.username[1];
  }

  get email() {
    return this.username[2];
  }

  get key() {
    return this.username.join(" ").concat(" ", ND.A);
  }

  isValid() {
    // must be form of `name surname email`
    if (this.username.length !== 3)
      throw SECURITY_FAIL_ERR.loadString("Username must stay in form of 'name surname email'");

    if (!this.name.match(/^\w+$/)) throw SECURITY_FAIL_ERR.loadString("Name must contains only english charactor");
    if (!this.surname.match(/^\w+$/))
      throw SECURITY_FAIL_ERR.loadString("Surname must contains only english charactor");
    if (!CheckIsEmail(this.email)) throw SECURITY_FAIL_ERR.loadString("Wrong email format");
    return true;
  }
}

export class NDValidator implements Validator {
  token: TokenValidator;
  username: UsernameValidator;

  constructor(token: TokenValidator, username: UsernameValidator) {
    this.token = token;
    this.username = username;
  }

  isValid() {
    const result = this.token.isValid() && this.username.isValid();
    const decode = VerifyToken(this.token, this.username);
    return result && CheckIsExist(decode && decode.toString());
  }
}
