import "jest-extended";

import { CONST_DEFAULT_HTML_TEMPLATE } from "../../constants/htmlConst";
import { CONST_PROJECT_NAME } from "../../constants/nd.const";
import { HtmlTemplate, HtmlNode } from "../Html";
import { NovelBuilder } from "../Novel";
import { API_GET_HTML_TEMPLATE } from "../../apis/html";

test("Should able to create template constants", function() {
  const template = CONST_DEFAULT_HTML_TEMPLATE;

  expect(template._name).toEqual("default");
  expect(template._css).not.toBeEmpty();
});

test("Should build content with input value", function() {
  const id = "123123";
  const title = "Some unique title";

  const content = "Some longgggggggggg content";

  const template = CONST_DEFAULT_HTML_TEMPLATE;
  const html = template.build({
    id: id,
    title: title,
    chapterNumber: "3",
    content: content,
    command: CONST_PROJECT_NAME
  });

  expect(html).toInclude(id);
  expect(html).toInclude(title);
  expect(html).toInclude(content);
  expect(html).toInclude(CONST_PROJECT_NAME);
});

test("Should create new HtmlTemplate with default constants", function() {
  const template = new HtmlTemplate(CONST_DEFAULT_HTML_TEMPLATE);

  expect(template._template).toEqual(CONST_DEFAULT_HTML_TEMPLATE);
  expect(template._nodes).toBeArrayOfSize(0);
});

test("Should able to update id", function() {
  const id = "5940123";
  const template = new HtmlTemplate(CONST_DEFAULT_HTML_TEMPLATE);

  template.setNID(id);
  expect(template._nid).toEqual(id);
});

test("Should able to update by completely chapter model", function() {
  const id = "4892912";
  const chapterName = "Hello world";
  const chapterNumber = "23";

  const chapter = NovelBuilder.createChapter(id, chapterNumber, { name: chapterName });

  const template = new HtmlTemplate(CONST_DEFAULT_HTML_TEMPLATE);

  template.setChapter(chapter);

  expect(template._chapterName).toEqual(chapterName);
  expect(template._chapterNumber).toEqual(chapterNumber);

  expect(template._title).toInclude(id);
  expect(template._title).toInclude(chapterNumber);
});

test("Should able to update by chapter with no name model", function() {
  const id = "4892912";
  const chapterNumber = "23";

  const chapter = NovelBuilder.createChapter(id, chapterNumber);

  const template = new HtmlTemplate(CONST_DEFAULT_HTML_TEMPLATE);

  template.setChapter(chapter);

  expect(template._chapterName).toEqual("");
  expect(template._chapterNumber).toEqual(chapterNumber);

  expect(template._title).toInclude(id);
  expect(template._title).toInclude(chapterNumber);
});

test("Should able to update title", function() {
  const title = "Title name";

  const template = new HtmlTemplate(CONST_DEFAULT_HTML_TEMPLATE);

  template.setTitle(title);

  expect(template._title).toEqual(title);
});

test("Should include node to html build", function() {
  const template = new HtmlTemplate(CONST_DEFAULT_HTML_TEMPLATE);

  const list = ["Hello", "Morning", "Javascript", "Typescript", "ND-js"];
  list.forEach(element => {
    template.add({ tag: "p", text: element });
  });

  const html = template.build();

  list.forEach(element => {
    expect(html).toInclude(element);
  });
});

test("Should able to add multiple node as once", function() {
  const template = new HtmlTemplate(CONST_DEFAULT_HTML_TEMPLATE);

  const list: HtmlNode[] = [
    { tag: "p", text: "Else" },
    { tag: "p", text: "ValuE" },
    { tag: "p", text: "Noone" },
    { tag: "span", text: "Yes say yes" }
  ];
  template.adds(list);

  const html = template.build();

  list.forEach(element => {
    expect(html).toInclude(`<${element.tag}>`);
    expect(html).toInclude(element.text);
  });
});

test("Should able to build even no node", function() {
  const template = new HtmlTemplate(CONST_DEFAULT_HTML_TEMPLATE);
  const html = template.build();

  expect(html).toInclude('<html lang="en">');
  expect(html).toInclude("<body>");
  expect(html).toInclude("<head>");
  expect(html).toInclude("<title>");
});
