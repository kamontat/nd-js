import { DefaultHTMLTemplate } from "../constants/htmlConst";

export interface HtmlTemplateConstant {
  name: string;
  file: string;
}

export class HtmlTemplate {
  template: HtmlTemplateConstant;
  constructor(template: HtmlTemplateConstant) {
    this.template = template;
  }

  // TODO: Implement add new node to exist html
  add(node: HtmlNode) {}
  adds(nodes: HtmlNode[]) {}

  // TODO: Make build html to string completed
  build(): string {
    return "";
  }
}

export interface HtmlNode {
  tag: string;
  text: string;
  newline: boolean;
}

export const CreateTemplate = (template: HtmlTemplateConstant): HtmlTemplate => {
  return new HtmlTemplate(template);
};

export const MakeHTML = (result: HtmlNode[]) => {
  let template = CreateTemplate(DefaultHTMLTemplate);
  template.adds(result);
  return template.build();
};
