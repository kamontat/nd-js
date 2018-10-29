import "jest-extended";
import { HtmlNode } from "../HtmlNode";

test("Should create html node", function() {
  const node = new HtmlNode({
    tag: "p",
    text: "text",
    style: undefined
  });

  const html = node.build();

  expect(html).toInclude("<p>");
  expect(html).toInclude("</p>");
  expect(html).toInclude("text");

  expect(html).not.toInclude("style");
});

test("Should create html with style", function() {
  const node = new HtmlNode({
    tag: "p",
    text: "text",
    style: "width: 100%;"
  });

  const html = node.build();

  expect(html).toInclude("</p>");
  expect(html).toInclude("text");

  expect(html).toInclude("style");
  expect(html).toInclude("width");
  expect(html).toInclude("100%");
});
