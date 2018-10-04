import "jest-extended";
import { HtmlTemplate } from "../HtmlTemplate";

test("Should create new template", function() {
  const template = new HtmlTemplate({
    id: "123123",
    chapterNumber: "20",
    content: "Content"
  });

  const html = template.renderDefault();

  expect(html).toInclude("123123");
  expect(html).toInclude("20");
  expect(html).toInclude("Content");

  expect(html).toInclude('<html lang="en">');
  expect(html).toInclude("<head>");
  expect(html).toInclude("<body>");
});
