/**
 * @internal
 * @module nd.html
 */

import { CssTemplate } from "../models/HtmlCss";

export const HTML_FILE: string = require("../templates/index.mustache");

export const HTML_BLACKLIST_TEXT = ["ads.dek-d.com", "min_t_comment"];

export const DEFAULT_CSS_TEMPLATE = new CssTemplate("default", require("../templates/default/style.css"));
