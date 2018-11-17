/**
 * @internal
 * @module nd.security.model
 */

import { SECURITY_FAIL_ERR } from "../../constants/error.const";

import { Validator } from "./Validator";

export class TokenValidator implements Validator {
  constructor(token: string) {
    this.token = token;
  }
  public token: string;

  public isValid() {
    const tokenArray = this.token.split(".");
    if (tokenArray.length !== 3) throw SECURITY_FAIL_ERR.loadString(`Token must be xx.yy.zz format`);
    return true;
  }
}
