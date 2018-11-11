/**
 * @internal
 * @module nd.security.api
 */

import { log } from "winston";

import { COLORS } from "../constants/color.const";
import { IS_S } from "../constants/security.const";
import { RevertTimestamp } from "../helpers/helper";
import { TokenValidator } from "../models/security/TokenValidator";
import { UsernameValidator } from "../models/security/UsernameValidator";
import { NDValidator } from "../models/security/Validator";

import { WrapTMCT } from "./loggerWrapper";
import { DecodeToken } from "./token";

export class Security {
  public static Checking(token: string, username: string) {
    const tv = new TokenValidator(token);
    const uv = new UsernameValidator(username);
    return new NDValidator(tv, uv);
  }

  public static Printer(token: string, username: string) {
    const validator = Security.Checking(token, username);

    log(WrapTMCT("info", "Name", validator.username.name, { message: COLORS.Name }));
    log(WrapTMCT("info", "Surname", validator.username.surname, { message: COLORS.Name }));
    log(WrapTMCT("info", "Email", validator.username.email));

    const decode = DecodeToken(token);
    log(WrapTMCT("info", "Worked version", IS_S(decode.token), { message: COLORS.Important }));
    // log(WrapTMCT("info", "Token", decode.token));
    log(WrapTMCT("info", "Username", decode.name, { message: COLORS.Name }));
    log(WrapTMCT("info", "Issue at", RevertTimestamp(decode.iat), { message: COLORS.DateTime }));
    log(WrapTMCT("info", "Not before", RevertTimestamp(decode.nbf), { message: COLORS.DateTime }));
    log(WrapTMCT("info", "Expire at", RevertTimestamp(decode.exp), { message: COLORS.DateTime }));
  }
}
