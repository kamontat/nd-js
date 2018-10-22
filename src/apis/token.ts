/**
 * @internal
 * @module nd.security
 */

import { sign, verify, decode } from "jsonwebtoken";
import { UsernameValidator, TokenValidator } from "../models/Security";
import { ND } from "../constants/nd.const";
import { SECURITY_FAIL_ERR } from "../constants/error.const";

type ResultToken = { name: string; iat: string; nbf: string; exp: string; iss: string; sub: string; jti: string };

export type TokenDataType = { issuedate: string; expiredate: string; fullname: string; username: string };
export const CreateToken = (data: TokenDataType) => {
  return sign({ name: data.username }, new UsernameValidator(data.fullname).key, {
    expiresIn: data.expiredate,
    issuer: "ND-JS master",
    notBefore: data.issuedate,
    algorithm: ND.ALGO,
    jwtid: ND.ID,
    subject: "ND-JS"
  });
};

export const VerifyToken = (token: TokenValidator, username: UsernameValidator) => {
  try {
    return verify(token.token, username.key, { algorithms: [ND.ALGO], jwtid: ND.ID, subject: "ND-JS" });
  } catch (e) {
    throw SECURITY_FAIL_ERR.loadError(e);
  }
};

export const DecodeToken: (token: string) => ResultToken = (token: string) => {
  const result = decode(token, {
    json: true,
    complete: false
  });

  if (result === null || typeof result === "string") {
    return { name: "", iat: "", nbf: "", exp: "", iss: "", sub: "", jti: "" };
  }
  return result as ResultToken;
};
