/**
 * @internal
 * @module nd.security
 */

import { log } from "winston";

import { COLORS } from "../constants/color.const";
import { RevertTimestamp } from "../helpers/helper";
import { WrapTMCT } from "../models/LoggerWrapper";
import { TokenValidator } from "../models/SecurityTokenValidator";
import { UsernameValidator } from "../models/SecurityUsernameValidator";
import { NDValidator } from "../models/SecurityValidator";

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
    log(WrapTMCT("info", "Username", decode.name, { message: COLORS.Name }));
    log(WrapTMCT("info", "Issue at", RevertTimestamp(decode.iat), { message: COLORS.DateTime }));
    log(WrapTMCT("info", "Not before", RevertTimestamp(decode.nbf), { message: COLORS.DateTime }));
    log(WrapTMCT("info", "Expire at", RevertTimestamp(decode.exp), { message: COLORS.DateTime }));
  }
}
