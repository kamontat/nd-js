/**
 * @internal
 * @module nd.security.api
 */

import { log } from "winston";

import {
  ConvertToRequireTokenData,
  DecryptToken,
} from "../../security/index-main";
import { COLORS } from "../constants/color.const";
import { ND } from "../constants/nd.const";
import { RevertTimestamp } from "../helpers/helper";
import { NameValidator } from "../models/security/NameValidator";
import { TokenValidator } from "../models/security/TokenValidator";
import { NDValidator } from "../models/security/Validator";

import { WrapTMCT } from "./loggerWrapper";

export class Security {
  public static Checking(token: string, name: string) {
    const tv = new TokenValidator(token);
    const uv = new NameValidator(name);
    return new NDValidator(tv, uv);
  }

  public static Printer(token: string, name: string) {
    const validator = Security.Checking(token, name);

    log(
      WrapTMCT("info", "Name", validator.name.name, { message: COLORS.Name }),
    );
    log(
      WrapTMCT("info", "Surname", validator.name.surname, {
        message: COLORS.Name,
      }),
    );
    log(WrapTMCT("info", "Email", validator.name.email));

    if (ND.isProd()) {
      const _decode = DecryptToken({
        fullname: name,
        token,
        version: ND.VERSION,
      });
      const decode = ConvertToRequireTokenData(_decode, name);
      log(
        WrapTMCT("info", "Worked version", decode.versionrange, {
          message: COLORS.Important,
        }),
      );
      log(
        WrapTMCT("info", "Username", decode.username, { message: COLORS.Name }),
      );
      log(
        WrapTMCT("info", "Issue at", RevertTimestamp(decode.issuedate), {
          message: COLORS.DateTime,
        }),
      );
      log(
        WrapTMCT("info", "Not before", RevertTimestamp(decode.notbeforedate), {
          message: COLORS.DateTime,
        }),
      );
      log(
        WrapTMCT("info", "Expire at", RevertTimestamp(decode.expiredate), {
          message: COLORS.DateTime,
        }),
      );
    }
  }
}
