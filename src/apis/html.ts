import { DEFAULT_HTML_TEMPLATE } from "../constants/html.const";
import { HtmlTemplateConstant, HtmlTemplate, HtmlNode } from "../models/Html";
import { NovelChapter } from "../models/Novel";

export const getHtmlTemplateApi = (template: HtmlTemplateConstant): HtmlTemplate => {
  return new HtmlTemplate(template);
};

export const CreateHtmlApi = (chapter: NovelChapter, result: HtmlNode[]) => {
  let template = getHtmlTemplateApi(DEFAULT_HTML_TEMPLATE);
  template.setChapter(chapter);
  template.adds(result);
  return template.build();
};
