import "jest-extended";

import { History } from "../../history/History";
import { HistoryResource } from "../HistoryResource";

import { RandomNode } from "../../history/__test__/lib";

describe("Create history object", function() {
  const history = new History();
  const size = 10;
  for (let i = 0; i < size; i++) {
    history.addNode(RandomNode());
  }

  describe("Create resource of history", function() {
    const resource = new HistoryResource();
    resource.load(history);

    describe("Build to JSON result", function() {
      const json = resource.build();

      test("Should have same as history size", function() {
        expect(json).toHaveLength(size);
      });
    });
  });
});
