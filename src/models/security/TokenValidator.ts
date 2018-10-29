/**
 * @internal
 * @module nd.security
 */

import { SECURITY_FAIL_ERR } from "../../constants/error.const";

import { Validator } from "./Validator";

export class TokenValidator implements Validator {
  constructor(token: string) {
    this.token = token;
  }
  public token: string;

  public isValid() {
    const min = 200;
    const max = 250;
    // between 205 <-> 210
    if (this.token.length <= min) {
      throw SECURITY_FAIL_ERR.loadString(`Token must have more than ${min} charactor`);
    }
    if (this.token.length > max) {
      throw SECURITY_FAIL_ERR.loadString(`Token cannot have more than ${max} charactor`);
    }
    return true;
  }
}
