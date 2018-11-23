import { RequireTokenData as RD, ResultTokenData as RTD } from "./lib/data";

import { ConvertToRequireTokenData as Convert, DecodeToken, SignToken, Validation } from "./lib/_utils-prod";
import { Config, NAME as N, VERSION as V } from "./lib/ProdConfig";

declare let COMPILED_DATE: number;

/**
 * ND-SECURITY name
 */
export const NAME = N;

/**
 * ND-SECURITY version
 */
export const VERSION = V;

/**
 * Compile date get from definePlugin of webpack
 */
export const DATE = COMPILED_DATE;

/**
 * This is a information that require to create token
 *
 * @param data is a json of this type
 * @param data.fullname The fullname of user (should be in format 'name surname email')
 * @param data.username Username will be show everytime you run the ND command
 * @param data.version Version of the ND command, (note: on each of version will have their own key)
 * @param data.versionrange Range (accord to semver libraries) of the version that this version will be use for
 * @param data.notbeforedate The begin datetime that this token will be able to use, (shortest time is 1ms)
 * @param data.expiredate The last datetime that this token will able to use, (longest should be forever)
 * @param data.issuedate the datetime that token was created
 */
export type RequireTokenData = RD;

/**
 * The value the save in the token, this will be the instantly value inside the token
 *
 * @param data is a json of this type
 * @param data.version version what is token for (string)
 * @param data.token: token for one of validator (string)
 * @param data.name: name of the user (string)
 * @param data.iat: create at date (timestamp|number)
 * @param data.nbf: not before date (timestamp|number)
 * @param data.exp: expire date (timestamp|number)
 * @param data.iss: who create is token (string)
 * @param data.sub: Subject of the token ("ND-JS")
 * @param data.jti: Id of the token (string)
 */
export type ResultTokenData = RTD;

/**
 * This will convert the {@link ResultTokenData} to {@link RequireTokenData}
 *
 * @param result result of the decrypt token data
 * @param fullname fullname of the user
 *
 * @return {@link RequireTokenData}
 */
export const ConvertToRequireTokenData = Convert;

/**
 * The encryption token for nd command version 1.0.0 or more
 *
 * @param data Needed information to encrypt the token
 * @param data.fullname The fullname of user (should be in format 'name surname email')
 * @param data.username Username will be show everytime you run the ND command
 * @param data.version Version of the ND command, (note: on each of version will have their own key)
 * @param data.versionrange Range (accord to semver libraries) of the version that this version will be use for
 * @param data.notbeforedate The begin datetime that this token will be able to use, (shortest time is 1ms)
 * @param data.expiredate The last datetime that this token will able to use, (longest should be forever)
 * @param data.issuedate Not require, you can add empty string here.
 *
 * @return the token string (avg. 700-1000 character)
 *
 * @example
 *
 * const token = EncryptToken({
 *   fullname: "name surname email",
 *   username: "username",
 *   version: "nd-version",
 *   versionrange: "v-range",
 *   issuedate: "", // not necessary
 *   notbeforedate: "1ms",
 *   expiredate: "1y",
 * });
 *
 * console.log(token);
 */
export const EncryptToken = (data: RequireTokenData) => {
  return SignToken(data.version, data);
};

/**
 * The decryption token for nd command version 1.0.0 or more.
 *
 * You can convert the result token data to require token data by {@link ConvertToRequireTokenData} method
 *
 * @param data Needed information of decrypt the token
 * @param data.fullname The name that regis in encrypt token, should be in format 'name surname email'
 * @param data.token String token, This should be the random string of 700 or more character
 * @param data.version Version of the ND command, (note: on each of version will have their own key)
 *
 * @return token data that is {@link ResultTokenData} type
 *
 * @example
 * const data = DecryptToken({
 *   fullname: "name surname email",
 *   token: "token",
 *   version: "nd-version",
 * });
 * console.log(data);
 *
 * @see {@link RequireTokenData}
 * @see {@link ConvertToRequireTokenData}
 */
export const DecryptToken = (data: { fullname: string; token: string; version: string }): ResultTokenData => {
  return DecodeToken(data.version, data.token, data.fullname);
};

/**
 * This is validation method to check is input follow fullname thing
 */
export const IsFullName = Validation.IsFullname;

/**
 * This is method for list the version that can be use in the progra
 */
export const ListVersion = () => Config.CONST.listVersion();
