import { HtmlTemplateConstant } from "../models/Html";

export const BlackListText = ["ads.dek-d.com", "min_t_comment"];

// chapter name
// novel id
export const HtmlTitleTemplate = "Chapter {{chapterNumber}} ({{nid}})";

const html = require("../templates/default/index.html");
export const DefaultHTMLTemplate = new HtmlTemplateConstant("default", html);
