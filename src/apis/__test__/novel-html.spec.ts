import cheerio from "cheerio";
import "jest-extended";
import moment from "moment";

import { TEST_NID, TEST_NID_V1, TEST_NOVEL_NAME, TEST_NOVEL_NAME_V1 } from "../../../test/test";
import { NovelBuilder } from "../../builder/novel";
import { NovelChapter } from "../../models/novel/Chapter";
import { FetchApi } from "../download";
import { CreateChapterListApi, GetChapterDateApi, GetNovelDateApi, GetNovelNameApi } from "../novel";

describe("Download mock novel version 2", async function() {
  jest.setTimeout(10000);
  expect.hasAssertions();

  let res0, chap0: NovelChapter, $0: CheerioStatic;
  let res1, chap1: NovelChapter, $1: CheerioStatic;

  beforeAll(async function() {
    res0 = await FetchApi(NovelBuilder.createChapter(TEST_NID, "0"));

    chap0 = res0.chapter;
    $0 = res0.cheerio;

    res1 = await FetchApi(NovelBuilder.createChapter(TEST_NID, "1"));

    chap1 = res1.chapter;
    $1 = res1.cheerio;
  });

  test("Should able to get name from zero chapter", function() {
    const name = GetNovelNameApi($0);
    expect(name).toEqual(TEST_NOVEL_NAME);
  });

  test("Should able to get name from one chapter", function() {
    const name = GetNovelNameApi($1);
    expect(name).toEqual(TEST_NOVEL_NAME);
  });

  test("Should able to get the novel date", function() {
    const date = GetNovelDateApi($0);
    const expected = moment("2019-05-17T16:56"); // 17 พ.ค. 62 / 16:56

    expect(date.isSame(expected, "day")).toBeTrue();
  });

  test("Should able to get the chapter date", function() {
    const date = GetChapterDateApi($1);
    const expected = moment("2018-11-01");

    expect(date.isSame(expected, "day")).toBeTrue();
  });
});

describe("Download mock novel version 1", async function() {
  jest.setTimeout(10000);
  expect.hasAssertions();

  let res0, chap0: NovelChapter, $0: CheerioStatic;
  let res1, chap1: NovelChapter, $1: CheerioStatic;

  beforeAll(async function() {
    res0 = await FetchApi(NovelBuilder.createChapter(TEST_NID_V1, "0"));

    chap0 = res0.chapter;
    $0 = res0.cheerio;

    res1 = await FetchApi(NovelBuilder.createChapter(TEST_NID_V1, "1"));

    chap1 = res1.chapter;
    $1 = res1.cheerio;
  });

  test("Should able to get name from zero chapter", function() {
    const name = GetNovelNameApi($0);
    expect(name).toEqual(TEST_NOVEL_NAME_V1);
  });

  test("Should able to get name from one chapter", function() {
    const name = GetNovelNameApi($1);
    expect(name).toEqual(TEST_NOVEL_NAME_V1);
  });

  test("Should able to get the novel date", function() {
    const date = GetNovelDateApi($0);
    const expected = moment("2006-07-09T18:09"); // 9 ก.ค. 49 / 18:09

    expect(date.isSame(expected, "minute")).toBeTrue();
  });

  test("Should able to get the chapter date", function() {
    const date = GetChapterDateApi($1);
    const expected = moment("2006-06-11"); // 11 มิ.ย. 49

    expect(date.isSame(expected, "day")).toBeTrue();
  });
});

describe("Try to decode the html file for the information", function() {
  interface TestCase {
    id: string;
    length: number;
  }
  const cases: TestCase[] = [
    { id: TEST_NID, length: 9 },
    { id: TEST_NID_V1, length: 2 },
    { id: "1875264", length: 16 },
  ];

  cases.forEach(c => {
    describe(`Html of novel id ${c.id}`, function() {
      const f = `_nid-${c.id}.js`;
      const html = require(`./assets/${f}`);
      const $ = cheerio.load(html.content);

      describe("Getting list of chapters", function() {
        const chaps = CreateChapterListApi($);

        test("Should have chapters list same as novel chapter", function() {
          expect(chaps).toHaveLength(c.length);
        });

        chaps.forEach(chap => {
          test(`Should have name of chapter number ${chap.number}`, function() {
            expect(chap.name).not.toBeUndefined();
            expect(chap.name).not.toBeEmpty();
            expect(chap.name).not.toBeNull();
          });

          test("Should have the date of the chapter", function() {
            expect(chap.date).not.toBeEmpty();
          });
        });
      });
    });
  });
});
