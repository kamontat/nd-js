import "jest-extended";
import { History } from "../History";
import { HistoryAction, HistoryNode } from "../HistoryNode";

import { RandomNode, RandomText } from "./lib";

describe("History, node, and action", function() {
  describe("Node creation", function() {
    test("Should created with default value", function() {
      const node = RandomNode({ action: HistoryAction.ADDED });
      expect(node.action).toEqual(HistoryAction.ADDED);
      expect(node.toJSON().description).toBeEmpty();
    });

    test("Should create the input title", function() {
      const title = RandomText(5);
      const node = RandomNode({ title: title });
      expect(node.toJSON().title).toEqual(title);
    });

    test("Should custom the description", function() {
      const desc = RandomText(5);
      const node = RandomNode({ description: desc });
      expect(node.toJSON().description).toEqual(desc);
    });

    test("Shouldn't to mutation any value in Node", function() {
      const node = RandomNode({ action: HistoryAction.MODIFIED });

      const json = node.toJSON();
      json.action = HistoryAction.ADDED; // shouldn't update action in node

      expect(node.action).toEqual(HistoryAction.MODIFIED);
    });

    test("Should print information out", function() {
      const node = RandomNode({ action: HistoryAction.DELETED });
      expect(node.toString()).toInclude(HistoryAction.DELETED);
    });
  });

  describe("Node information", function() {
    test("Should display the input title", function() {
      const title = RandomText(15);

      const node = RandomNode({ title: title });
      const json = node.toJSON();

      expect(json.title).toEqual(title);
    });

    test("Should display the input description", function() {
      const description = RandomText(15);

      const node = RandomNode({ description: description });
      const json = node.toJSON();

      expect(json.description).toEqual(description);
    });
  });

  describe("History collection", function() {
    test("Should create empty collection", function() {
      const hist = new History();
      expect(hist.list()).toBeEmpty();
    });

    test("Should able to add new node", function() {
      const hist = new History();
      hist.addNode(RandomNode());

      expect(hist.list()).not.toBeEmpty();
      expect(hist.list()).toBeArrayOfSize(1);
    });

    test("Should input the mutation node in history", function() {
      const hist = new History();
      const node = RandomNode();
      hist.addNode(node);
      expect(hist.list()).toContain(node);
    });

    test("Should add multiple node in once time", function() {
      const hist = new History();
      const nodes = [RandomNode(), RandomNode(), RandomNode(), RandomNode()];

      hist.addNodes(nodes);

      expect(hist.list()).toEqual(nodes);
    });

    test("Should resetable", function() {
      const hist = new History();
      hist.addNode(RandomNode());
      hist.addNode(RandomNode());
      expect(hist.list()).toBeArrayOfSize(2);

      hist.resetNode();
      expect(hist.list()).toBeArrayOfSize(0);
    });

    test("Should add custom 'ADD' node", function() {
      const title = RandomText(6);
      const hist = new History();
      hist.addADDNode(title, { after: RandomText(3) });

      const list: HistoryNode[] = hist.list() as HistoryNode[];
      expect(list[0].toJSON().title).toEqual(title);
    });

    test("Should add custom 'ADDED' node", function() {
      const title = RandomText(6);
      const hist = new History();
      hist.addADDNode(title, { after: RandomText(3) });

      const list: HistoryNode[] = hist.list() as HistoryNode[];
      expect(list[0].toJSON().title).toEqual(title);
      expect(list[0].toJSON().action).toEqual(HistoryAction.ADDED);
    });

    test("Should add custom 'MODIFIED' node", function() {
      const title = RandomText(6);
      const hist = new History();
      hist.addMODIFIEDNode(title, { after: RandomText(3), before: RandomText(3) });

      const list: HistoryNode[] = hist.list() as HistoryNode[];
      expect(list[0].toJSON().title).toEqual(title);
      expect(list[0].toJSON().action).toEqual(HistoryAction.MODIFIED);
    });

    test("Should add custom 'DELETED' node", function() {
      const title = RandomText(6);
      const hist = new History();
      hist.addDELETEDNode(title, { before: RandomText(3) });

      const list: HistoryNode[] = hist.list() as HistoryNode[];
      expect(list[0].toJSON().title).toEqual(title);
      expect(list[0].toJSON().action).toEqual(HistoryAction.DELETED);
    });
  });

  describe("History output", function() {
    test("Should able to custom reduce list result", function() {
      const hist = new History();
      hist.addNode(RandomNode({ action: HistoryAction.DELETED }));
      hist.addNode(RandomNode({ action: HistoryAction.DELETED }));
      hist.addNode(RandomNode({ action: HistoryAction.DELETED }));

      const jsonString = hist.list({ reduce: (p, c) => `${p} ${JSON.stringify(c.toJSON())}` });

      expect(jsonString).toBeString();
      expect(jsonString).toInclude("{");
      expect(jsonString).toInclude("}");
    });

    test("Should able to custom map list result", function() {
      const hist = new History();
      hist.addNode(RandomNode({ action: HistoryAction.DELETED }));
      hist.addNode(RandomNode({ action: HistoryAction.DELETED }));
      hist.addNode(RandomNode({ action: HistoryAction.DELETED }));

      hist.list({
        map: n => {
          expect(n.toJSON().action).toEqual(HistoryAction.DELETED);
          return "";
        }
      });
    });
  });
});
