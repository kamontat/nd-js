import "jest-extended";

import { RandomNode } from "../../history/__test__/lib";
import { Resource } from "../Resource";
import { History } from "../../history/History";
import { Novel } from "../../novel/Novel";

const hist_size = 10;

describe("Create resource object", function() {
  const res = new Resource();

  describe("Mockup history", function() {
    const hist = new History();
    for (let i = 0; i < hist_size; i++) {
      hist.addNode(RandomNode());
    }

    describe("Load history to resource", function() {
      res.loadHistory(hist);
      const json = res.toJSON();

      test("Should able to export json string", function() {
        expect(json).toContainKey("command");
        expect(json).toContainKey("novel");
        expect(json).toContainKey("history");

        expect(json.history).toHaveLength(hist_size);
      });
    });
  });
});

describe("Create resource object", function() {
  const res = new Resource();

  describe("Mock novel", function() {
    const novel = new Novel("482929283");
    novel.name = "New name";

    describe("Load novel to resource", function() {
      res.loadNovel(novel);
      res.loadHistory(novel.history());
      const json = res.toJSON();

      test("Should able to export json string", function() {
        expect(json).toContainKey("novel");
        expect(json.novel.name).toEqual("New name");
        expect(json.novel.id).toEqual("482929283");
      });
    });
  });
});
