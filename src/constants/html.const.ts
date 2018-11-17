/**
 * @internal
 * @module nd.html.constant
 */

import { CssTemplate } from "../models/html/HtmlCss";

export const HTML_FILE: string = require("../templates/index.mustache");

export const ATTR_BLACKLIST: { key: string; value: string }[] = [
  { key: "id", value: "beacon_7169" },
  { key: "id", value: "floatboxstart" },
  { key: "id", value: "floatwriter" },
  { key: "id", value: "float_error" },
];

export const HTML_BLACKLIST_TEXT = ["ads.dek-d.com", "min_t_comment", "Dek-D Writer APP", "BG&Picture"];

export const DEFAULT_CSS_TEMPLATE = new CssTemplate("default", require("../templates/default/style.css"));
