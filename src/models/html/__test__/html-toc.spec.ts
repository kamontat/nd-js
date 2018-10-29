import "jest-extended";
import { HtmlToc } from "../HtmlTOC";
import { NovelBuilder } from "../../../builder/novel";

test("Should create toc element", function() {
  jest.setTimeout(10000);
  expect.hasAssertions();

  const id = "1598605";

  return NovelBuilder.fetch(id)
    .then(res => {
      return NovelBuilder.build(id, res.cheerio);
    })
    .then(mock => {
      const toc = new HtmlToc(mock);
      const tocContent = toc.build();

      expect(tocContent).not.toHaveLength(0);
      expect(mock.chapterSize.end).toBeGreaterThan(0);
    });
});
