import "jest-extended";
import { HtmlToc } from "../HtmlTOC";
import { NovelBuilder } from "../../builder/novel";

test("Should create toc element", function() {
  expect.assertions(1);
  return NovelBuilder.create("1598605").then(mock => {
    const toc = new HtmlToc(mock);
    expect(toc.build()).not.toBeUndefined();
    // TODO: Add more test
  });
});
