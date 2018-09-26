import { HtmlTemplateConstant } from "../models/Html";

export const HTML_FILE: string = require("../templates/index.mustache");

export const BlackListText = ["ads.dek-d.com", "min_t_comment"];

// chapter name
// novel id
export const HtmlTitleTemplate = "Chapter {{chapterNumber}} ({{nid}})";

const css = require("../templates/default/style.css");
export const DefaultHTMLTemplate = new HtmlTemplateConstant("default", css);
