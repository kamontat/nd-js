import "jest-extended";

import { Novel } from "../Novel";
import { HistoryNode } from "../../history/HistoryNode";
import { NovelChapter } from "../Chapter";
import { HistoryAction } from "../../history/HistoryAction";
import { NovelStatus } from "../NovelStatus";

function checkExist(history: HistoryNode[], action: HistoryAction, includeString: string) {
  return history.findIndex(v => {
    return v.action === action && JSON.stringify(v.toJSON()).includes(includeString);
  });
}

describe("Start history in novel", function() {
  const id = "123123";
  const loc = "/tmp";
  const novel = new Novel(id, loc);
  test("Should have creating history", function() {
    const hist = novel.history();
    expect(hist.list().length).toBeGreaterThan(0);
  });

  describe("Get history", function() {
    const hist = novel.history();
    const size = hist.size();

    describe("Update novel name", function() {
      novel.name = "Add name";

      test("Should add updating to history", function() {
        expect(hist.size()).toBeGreaterThan(size);
      });

      test("Should be mutation history", function() {
        expect(novel.history()).toEqual(hist);
      });
    });

    describe("Update novel location", function() {
      const location = "newest location";
      novel.location = location;

      test("Should add to history", function() {
        const result = checkExist(hist.list(), HistoryAction.MODIFIED, location);
        expect(result).toBeGreaterThanOrEqual(0);
      });
    });
  });
});

describe("Start history in novel chapter", function() {
  const id = "456456";
  const number = "142";
  const chap = new NovelChapter(id, number);

  describe("Getting history", function() {
    const history = chap.history();
    test("Should contain some default history node", function() {
      expect(history.size()).toBeGreaterThan(0);
    });
  });

  describe("Update chapter information", function() {
    chap.status = NovelStatus.CLOSED;
    test("Should add to history", function() {
      const result = checkExist(chap.history().list(), HistoryAction.MODIFIED, NovelStatus.CLOSED.toLocaleLowerCase());
      expect(result).toBeGreaterThanOrEqual(0);
    });
  });
});

describe("Integrate history between novel and chapter", function() {
  const id = "49192923";
  const novel = new Novel(id);

  describe("Get history of novel", function() {
    const hist = novel.history();
    const size = hist.size();

    describe("Add new chapter to novel", function() {
      const chapA = new NovelChapter(id, "1");
      novel.addChapter(chapA);
      const size2 = hist.size();

      test("Should merge 2 history together", function() {
        expect(hist.size()).toBeGreaterThan(size);
      });

      describe("Update information of chapter", function() {
        const name = "Chapter A";
        chapA.name = name;

        test("Should add to novel history too", function() {
          expect(hist.size()).toBeGreaterThan(size2);
        });
      });
    });
  });

  describe("Add multiple chapter", function() {
    const nameB = "Chapter BBB";
    const nameC = "Chapter CCCCC";
    const nameD = "Chapter D";

    const chapB = new NovelChapter(id, "2", nameB);
    const chapC = new NovelChapter(id, "3", nameC);
    const chapD = new NovelChapter(id, "4", nameD);

    novel.addChapter(chapB);
    novel.addChapter(chapC);
    novel.addChapter(chapD);

    test("Should contain history of all added chapter", function() {
      const list = novel.history().list();

      const indexB = checkExist(list, HistoryAction.ADDED, nameB);
      expect(indexB).toBeGreaterThanOrEqual(0);
      const indexC = checkExist(list, HistoryAction.ADDED, nameC);
      expect(indexC).toBeGreaterThanOrEqual(0);
      const indexD = checkExist(list, HistoryAction.ADDED, nameD);
      expect(indexD).toBeGreaterThanOrEqual(0);
    });
  });
});
