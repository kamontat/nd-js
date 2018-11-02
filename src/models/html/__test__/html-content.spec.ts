import "jest-extended";
import { HtmlContent } from "../HtmlContent";
import { HtmlNode } from "../HtmlNode";

test("Should add new html node", function() {
  const content = new HtmlContent();
  content.add(
    new HtmlNode({
      tag: "span",
      text: "String"
    })
  );

  expect(content.build()).toInclude("<span>String</span>");

  content.add(
    new HtmlNode({
      tag: "h1",
      text: "Header1"
    })
  );

  expect(content.build()).toInclude("<h1>Header1</h1>");
});

test("Should add multiple html node", function() {
  const content = new HtmlContent();

  const list = [
    new HtmlNode({ tag: "span", text: "Hello Span" }),
    new HtmlNode({ tag: "h1", text: "Hello H1" }),
    new HtmlNode({ tag: "h5", text: "Hello H5" }),
    new HtmlNode({ tag: "h3", text: "Hello H3" })
  ];

  content.adds(list);
  const html = content.build();

  expect(html).toInclude("<span>Hello Span</span>");
  expect(html).toInclude("<h1>Hello H1</h1>");
  expect(html).toInclude("<h5>Hello H5</h5>");
  expect(html).toInclude("<h3>Hello H3</h3>");
});
