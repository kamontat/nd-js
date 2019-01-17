/**
 * @external
 * @module nd.security.api.admin
 */

import { Config } from "./AdminConfig";
import { RequireTokenData, ResultTokenData } from "./data";
import { TokenManagement } from "./Token";

const manager = new TokenManagement(Config.CONST);

export const SignToken = (version: string, data: RequireTokenData) =>
  manager.signToken(version, data);

export const DecodeToken = (version: string, hex: string, fullname: string) =>
  manager.decodeToken(version, hex, fullname);

export const ConvertToRequireTokenData = (
  result: ResultTokenData,
  fullname: string,
) => manager.convertToRequireTokenData(result, fullname);
