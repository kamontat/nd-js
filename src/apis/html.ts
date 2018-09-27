import { DEFAULT_HTML_TEMPLATE } from "../constants/htmlConst";
import { HtmlTemplateConstant, HtmlTemplate, HtmlNode } from "../models/Html";
import { NovelChapter } from "../models/Novel";

export const API_GET_HTML_TEMPLATE = (template: HtmlTemplateConstant): HtmlTemplate => {
  return new HtmlTemplate(template);
};

export const API_CREATE_HTML = (chapter: NovelChapter, result: HtmlNode[]) => {
  let template = API_GET_HTML_TEMPLATE(DEFAULT_HTML_TEMPLATE);
  template.setChapter(chapter);
  template.adds(result);
  return template.build();
};
