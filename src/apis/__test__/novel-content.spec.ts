import "jest-extended";
import cheerio from "cheerio";

import { CHAPTER_SOLD_WARN, CHAPTER_CLOSED_WARN, NOVEL_WARN } from "../../constants/error.const";
import { GetNovelContent } from "../novel";
import { NovelBuilder } from "../../builder/novel";
import { TEST_NID } from "../../../test/test";
import { Warning } from "../../models/error/Warning";
import Throwable from "../../models/error/Exception";

type TestCase = {
  case: { version: number; id: string; number: number };
  expected: {
    status?: Throwable;
  };
};

// find any closed and sold chapter in novel version 1
const cases: TestCase[] = [
  {
    case: {
      version: 1,
      id: "164129",
      number: 2
    },
    expected: {}
  },
  {
    case: {
      version: 2,
      id: "1819377",
      number: 58
    },
    expected: {}
  },
  {
    case: {
      version: 2,
      id: "1819377",
      number: 70
    },
    expected: {
      status: CHAPTER_SOLD_WARN
    }
  },
  {
    case: {
      version: 2,
      id: TEST_NID,
      number: 7
    },
    expected: {
      status: CHAPTER_CLOSED_WARN
    }
  }
];

cases.forEach(c => {
  describe(`Start with novel id ${c.case.id}, chapter ${c.case.number} (v${c.case.version})`, function() {
    const f = `nid-${c.case.id}-${c.case.number}.js`;
    const html = require(`./assets/${f}`);
    const $ = cheerio.load(html.content);

    if (!c.expected.status) {
      test("Should have the content", function() {
        const content = GetNovelContent(NovelBuilder.createChapter(c.case.id, c.case.number.toString()), $);

        expect(content).not.toBeUndefined();
        expect(content).not.toBeEmpty();
        expect(content).not.toBeNull();
      });
    } else
      test(`Should have the error ${c.expected.status.name}`, function() {
        const chapter = NovelBuilder.createChapter(c.case.id, c.case.number.toString());
        GetNovelContent(chapter, $);
        expect(c.expected.status.equal(chapter.throw())).toBeTrue();
      });
  });
});

describe("Start the unknown html", function() {
  test("Should throw cannot get any content error", function() {
    const html = require(`./assets/unknown.js`);
    const $ = cheerio.load(html.content);

    expect(function() {
      GetNovelContent(NovelBuilder.createChapter("1", "1"), $);
    }).toThrowError(Warning);
  });
});
