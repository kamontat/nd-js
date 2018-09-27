import { DEFAULT_HTML_TEMPLATE } from "../constants/htmlConst";
import { HtmlTemplateConstant, HtmlTemplate, HtmlNode } from "../models/Html";
import { NovelChapter } from "../models/Novel";

export const CreateTemplate = (template: HtmlTemplateConstant): HtmlTemplate => {
  return new HtmlTemplate(template);
};

export const MakeHTML = (chapter: NovelChapter, result: HtmlNode[]) => {
  let template = CreateTemplate(DEFAULT_HTML_TEMPLATE);
  template.setChapter(chapter);
  template.adds(result);
  return template.build();
};
