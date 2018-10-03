import "jest-extended";
import { GetHtmlTemplateApi, CreateHtmlApi } from "../html";
import { DEFAULT_HTML_TEMPLATE } from "../../constants/html.const";
import { NovelBuilder } from "../../builder/novel";

test("Should create html template via API", function() {
  const template = GetHtmlTemplateApi(DEFAULT_HTML_TEMPLATE);
  const html = template.build();

  expect(html).toInclude('<html lang="en">');
  expect(html).toInclude("<body>");
  expect(html).toInclude("<head>");
  expect(html).toInclude("<title>");
});

test("Should build html via API", function() {
  const html = CreateHtmlApi(NovelBuilder.createChapter("123", "5"), [
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
