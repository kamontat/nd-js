import "jest-extended";
import { HtmlToc } from "../HtmlTOC";
import { NovelBuilder } from "../../builder/novel";

test("Should create toc element", function() {
  expect.hasAssertions();

  return NovelBuilder.create("1598605").then(mock => {
    const toc = new HtmlToc(mock);

    const tocContent = toc.build();
    expect(tocContent).not.toHaveLength(0);
    expect(mock._chapters).not.toBeUndefined();
    if (mock._chapters) expect(tocContent).toHaveLength(mock._chapters.length);
  });
});
