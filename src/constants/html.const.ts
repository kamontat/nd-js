/**
 * @internal
 * @module nd.html.constant
 */

import { CssTemplate } from "../models/html/HtmlCss";

export const HTML_FILE: string = require("../templates/index.mustache");

export const CSS_CLASS_BLACKLIST_TEXT = ["er1", "er2", "er3", "er4"];

export const HTML_BLACKLIST_TEXT = ["ads.dek-d.com", "min_t_comment", "Dek-D Writer APP", "BG&Picture"];

export const DEFAULT_CSS_TEMPLATE = new CssTemplate("default", require("../templates/default/style.css"));
