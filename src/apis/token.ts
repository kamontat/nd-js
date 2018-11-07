/**
 * @internal
 * @module nd.security
 */

import { decode, sign, verify } from "jsonwebtoken";

import { SECURITY_FAIL_ERR } from "../constants/error.const";
import { ND } from "../constants/nd.const";
import { IS_S, S } from "../constants/security.const";
import { TokenValidator } from "../models/security/TokenValidator";
import { UsernameValidator } from "../models/security/UsernameValidator";

interface ResultToken {
  version: string;
  token: string;
  name: string;
  iat: string;
  nbf: string;
  exp: string;
  iss: string;
  sub: string;
  jti: string;
}

export interface TokenDataType {
  issuedate: string;
  expiredate: string;
  fullname: string;
  username: string;
}
export const CreateToken = (data: TokenDataType) => {
  return sign({ version: ND.VERSION, token: S, name: data.username }, new UsernameValidator(data.fullname).key, {
    expiresIn: data.expiredate,
    issuer: "ND-JS master",
    notBefore: data.issuedate,
    algorithm: ND.ALGO,
    jwtid: ND.ID(),
    subject: "ND-JS",
  });
};

export const VerifyToken = (token: TokenValidator, username: UsernameValidator) => {
  try {
    const result = verify(token.token, username.key, {
      algorithms: [ND.ALGO],
      jwtid: ND.ID(),
      subject: "ND-JS",
    }) as ResultToken;

    if (result.version !== ND.VERSION || IS_S(result.token) !== ND.VERSION) {
      throw SECURITY_FAIL_ERR.loadString(
        `Your token cannot use to current version ${result.version} !== ${ND.VERSION}`,
      );
    }

    return result;
  } catch (e) {
    throw SECURITY_FAIL_ERR.loadError(e);
  }
};

export const DecodeToken: (token: string) => ResultToken = (token: string) => {
  const result = decode(token, {
    json: true,
    complete: false,
  });

  if (result === null || typeof result === "string") {
    return { version: "", token: "", name: "", iat: "", nbf: "", exp: "", iss: "", sub: "", jti: "" };
  }
  return result as ResultToken;
};
