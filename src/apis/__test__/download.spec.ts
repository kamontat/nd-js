import "jest-extended";
import { FetchApi } from "../download";
import { NovelBuilder } from "../../builder/novel";

describe("Downloading ", function() {
  describe("using FetchApi", function() {
    test("Should get chapter name", function() {
      jest.setTimeout(10000);
      expect.hasAssertions();

      return FetchApi(NovelBuilder.createChapter("123123", "2")).then(v => {
        expect(v.chapter.name).not.toEqual("");
      });
    });

    describe("Getting none exist novel chapter", function() {
      const id = "11111";
      const chapter = "310";

      test("Shouldn't get any chapter", async function() {
        jest.setTimeout(10000);
        expect.hasAssertions();

        await expect(FetchApi(NovelBuilder.createChapter(id, chapter))).toReject();
      });
    });

    describe("Getting new novel", function() {
      test("Should get chapter name", function() {
        jest.setTimeout(10000);
        expect.hasAssertions();

        return FetchApi(NovelBuilder.createChapter("1881939", "2")).then(v => {
          expect(v.chapter.name).not.toEqual("");
        });
      });
    });
  });
});
