import { SECURITY_FAIL_ERR } from "../constants/error.const";
import { verify, decode } from "jsonwebtoken";
import { ND } from "../constants/nd.const";
import { log } from "winston";
import { WrapTMCT } from "./LoggerWrapper";
import { COLORS } from "../constants/color.const";
import { VerifyToken, DecodeToken } from "../apis/token";

export class Security {
  static Checking(token: string, username: string) {
    const tv = new TokenValidator(token);
    const uv = new UsernameValidator(username);
    const nv = new NDValidator(tv, uv);

    return tv.isValid() && uv.isValid() && nv.isValid();
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
    if (
      !this.email.match(
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
      )
    )
      throw SECURITY_FAIL_ERR.loadString("Wrong email format");

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
    VerifyToken(this.token, this.username);
    return true;
  }
}