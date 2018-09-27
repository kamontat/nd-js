import { HtmlTemplateConstant } from "../models/Html";

export const HTML_FILE: string = require("../templates/index.mustache");

export const DEFAULT_HTML_BLACKLIST_TEXT = ["ads.dek-d.com", "min_t_comment"];

// chapter name
// novel id
export const DEFAULT_HTML_TITLE_TEMPLATE = "Chapter {{chapterNumber}} ({{nid}})";

const css = require("../templates/default/style.css").toString();
export const DEFAULT_HTML_TEMPLATE = new HtmlTemplateConstant("default", css);
