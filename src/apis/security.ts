/**
 * @internal
 * @module nd.security.api
 */

import { log } from "winston";

import { ConvertToRequireTokenData, DecryptToken } from "../../security/index-prod";
import { COLORS } from "../constants/color.const";
import { ND } from "../constants/nd.const";
import { RevertTimestamp } from "../helpers/helper";
import { TokenValidator } from "../models/security/TokenValidator";
import { UsernameValidator } from "../models/security/UsernameValidator";
import { NDValidator } from "../models/security/Validator";

import { WrapTMCT } from "./loggerWrapper";

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

    const _decode = DecryptToken({ fullname: username, token, version: ND.VERSION });
    const decode = ConvertToRequireTokenData(_decode, username);
    log(WrapTMCT("info", "Worked version", decode.versionrange, { message: COLORS.Important }));
    log(WrapTMCT("info", "Username", decode.username, { message: COLORS.Name }));
    log(WrapTMCT("info", "Issue at", RevertTimestamp(decode.issuedate), { message: COLORS.DateTime }));
    log(WrapTMCT("info", "Not before", RevertTimestamp(decode.notbeforedate), { message: COLORS.DateTime }));
    log(WrapTMCT("info", "Expire at", RevertTimestamp(decode.expiredate), { message: COLORS.DateTime }));
  }
}
