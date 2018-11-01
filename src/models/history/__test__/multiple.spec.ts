import "jest-extended";
import { History } from "../History";
import { RandomNode } from "./lib";

describe("Linking multiple history", function() {
  describe("Add new history", function() {
    const hist = new History();
    describe("Create more history", function() {
      const hist2 = new History();
      describe("Link to previous history", function() {
        hist.link(hist2);

        hist2.addNode(RandomNode());
        test("Should update both history", function() {
          expect(hist.list()).toHaveLength(1);
        });
      });
    });
  });
});
