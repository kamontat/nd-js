/**
 * @internal
 * @module nd.security
 */

export const indexDev = require("./index-admin");

export const indexProd = require("./index-main");

declare let COMPILED_DATE: number;

/**
 * Compile date get from definePlugin of webpack
 */
export const DATE = COMPILED_DATE;
