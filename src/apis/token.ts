import { sign, verify, decode } from "jsonwebtoken";
import { UsernameValidator, TokenValidator } from "../models/Security";
import { ND } from "../constants/nd.const";
import { SECURITY_FAIL_ERR } from "../constants/error.const";

export type TokenDataType = { issuedate: string; expiredate: string; fullname: string; username: string };
export const CreateToken = (data: TokenDataType) => {
  return sign({ sub: "ND-JS", name: data.username }, new UsernameValidator(data.fullname).key, {
    expiresIn: data.expiredate,
    issuer: "ND-JS master",
    notBefore: data.issuedate,
    algorithm: ND.ALGO
  });
};

export const VerifyToken = (token: TokenValidator, username: UsernameValidator) => {
  try {
    verify(token.token, username.key, { algorithms: [ND.ALGO], jwtid: ND.ID, subject: "ND-JS" });
  } catch (e) {
    throw SECURITY_FAIL_ERR.loadError(e);
  }
};

export const DecodeToken = (token: string) => {
  return decode(token, {
    json: true,
    complete: false
  });
};
