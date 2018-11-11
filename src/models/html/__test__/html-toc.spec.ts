import "jest-extended";
import { HtmlToc } from "../HtmlTOC";
import { NovelBuilder } from "../../../builder/novel";
import { Novel } from "../../novel/Novel";
import { NovelStatus } from "../../novel/NovelStatus";

test("Should create toc element", function() {
  expect.hasAssertions();

  const id = "1598605";

  const mock = new Novel(id);
  const cA = NovelBuilder.createChapter(id, "1");
  cA.status = NovelStatus.COMPLETED;
  mock.addChapter(cA);

  const cB = NovelBuilder.createChapter(id, "2");
  cB.status = NovelStatus.COMPLETED;
  mock.addChapter(cB);

  const cC = NovelBuilder.createChapter(id, "3");
  cC.status = NovelStatus.COMPLETED;
  mock.addChapter(cC);

  const cD = NovelBuilder.createChapter(id, "4");
  cD.status = NovelStatus.COMPLETED;
  mock.addChapter(cD);

  mock.addChapter(NovelBuilder.createChapter(id, "5"));
  mock.addChapter(NovelBuilder.createChapter(id, "6"));

  const toc = new HtmlToc(mock);
  const tocContent = toc.build();

  // Not create chapter that not completed
  expect(tocContent).toHaveLength(4);
});
