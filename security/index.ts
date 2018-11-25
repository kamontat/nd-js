/**
 * @internal
 * @module nd.security
 */

export const indexDev = require("./index-dev");

export const indexProd = require("./index-prod");

declare let COMPILED_DATE: number;

/**
 * Compile date get from definePlugin of webpack
 */
export const DATE = COMPILED_DATE;
