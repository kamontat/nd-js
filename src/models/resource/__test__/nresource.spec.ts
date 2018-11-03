import "jest-extended";

import { Novel } from "../../novel/Novel";
import { NovelResource } from "../NovelResource";
import { NovelBuilder } from "../../../builder/novel";

const id = "1881939";
const name = "Mockup name";

describe("Create empty resource object", function() {
  const resource = new NovelResource();

  test("Should build default value", function() {
    const resource = new NovelResource();
    const json = resource.build();

    expect(json.id).toEqual("-1");
    expect(json.name).toBeUndefined();
  });

  describe("Create mockup novel", function() {
    const novel = new Novel(id); // my novel
    novel.name = name;

    describe("Load novel to the resource object", function() {
      resource.load(novel);

      test("Should contain novel information in resource", function() {
        const json = resource.build();

        expect(json.id).toEqual(id);
        expect(json.name).toEqual(name);
      });

      describe("Add new mockup chapter", function() {
        novel.addChapter(NovelBuilder.createChapter(id, "2"));
        novel.addChapter(NovelBuilder.createChapter(id, "3"));
        novel.addChapter(NovelBuilder.createChapter(id, "4"));

        test("Should contain chapter in json", function() {
          const json = resource.build();

          expect(json.chapters).toHaveLength(3);
        });
      });
    });
  });
});
