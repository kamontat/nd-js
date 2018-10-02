import "jest-extended";
import { API_GET_HTML_TEMPLATE, API_CREATE_HTML } from "../html";
import { CONST_DEFAULT_HTML_TEMPLATE } from "../../constants/htmlConst";
import { NovelBuilder } from "../../models/Novel";

test("Should create html template via API", function() {
  const template = API_GET_HTML_TEMPLATE(CONST_DEFAULT_HTML_TEMPLATE);
  const html = template.build();

  expect(html).toInclude('<html lang="en">');
  expect(html).toInclude("<body>");
  expect(html).toInclude("<head>");
  expect(html).toInclude("<title>");
});

test("Should build html via API", function() {
  const html = API_CREATE_HTML(NovelBuilder.createChapter("123", "5"), [
    {
      tag: "p",
      text: "hello world, this is content"
    }
  ]);

  expect(html).toInclude("123");
  expect(html).toInclude("5");
  expect(html).toInclude("hello");
  expect(html).toInclude("content");
});
