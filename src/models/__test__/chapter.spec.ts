import "jest-extended";

import { NovelBuilder } from "../Novel";
import { DEFAULT_NOVEL_LINK } from "../../constants/novel.const";
import { PassLink } from "../../helpers/novel";

test("Should save attribute correctly", function() {
  const id = "123456789";
  const number = "3";
  const chapter = NovelBuilder.createChapter(id, number);

  expect(chapter._nid).toEqual(id);
  expect(chapter._chapterNumber).toEqual(number);
});

test("Should create correctly link format", function() {
  const id = "49102031";
  const number = "41";
  const chapter = NovelBuilder.createChapter(id, number);
  const link = chapter.link();

  expect(link.hostname).toEqual("my.dek-d.com");
  expect(link.protocol).toEqual("https:");
  expect(link.searchParams.get("id")).toEqual(id);
  expect(link.searchParams.get("chapter")).toEqual(number);
});

test("Should build default chapter", function() {
  const id = "412331";
  const chapter = NovelBuilder.createChapter(id);

  expect(chapter._nid).toEqual(id);
  expect(chapter._chapterNumber).toEqual("0");
});

test("Should decode chapter from link", function() {
  const id = "950192";
  const number = "102";
  const link = PassLink(DEFAULT_NOVEL_LINK);
  link.searchParams.set("id", id);
  link.searchParams.set("chapter", number);

  const chapter = NovelBuilder.createChapterByLink(link);

  expect(chapter._nid).toEqual(id);
  expect(chapter._chapterNumber).toEqual(number);
});

test("Should able to custm location", function() {
  const location = "/custom/location";
  const chapter = NovelBuilder.createChapter("123", "5", { location: location });

  expect(chapter._location).toEqual(location);
});

test("Should set chapter name", function() {
  const name = "Chapter 102: World end";
  const chapter = NovelBuilder.createChapter("123123", "102");
  chapter.setName(name);

  expect(chapter._name).not.toBeUndefined();
  expect(chapter._name).toEqual(name);
});

test("Should set chapter to zero if negative occurred", function() {
  const id = "1411";
  const number = "-412";
  const chapter = NovelBuilder.createChapter(id, number);
  expect(chapter._chapterNumber).toEqual("0");

  const chapter2 = NovelBuilder.createChapter(id, "ABC");
  expect(chapter2._chapterNumber).toEqual("0");
});

test("Should outtput file in input location", function() {
  const location = "/tmp/asdf";
  let chapter = NovelBuilder.createChapter("123", "1");

  let file = chapter.file();
  expect(file).not.toInclude(location);

  chapter = NovelBuilder.createChapter("123", "1", { location: location });

  file = chapter.file();
  expect(file).toInclude(location);
});
