import "jest-extended";
import { History } from "../History";
import { Moment } from "moment";
import Random from "random-js";
import { HistoryAction, HistoryNode } from "../HistoryNode";

function randomText(size: number) {
  return new Random(Random.engines.mt19937().autoSeed()).string(size);
}

function randomNode(
  value: {
    action?: HistoryAction;
    title?: string;
    before?: string;
    after?: string;
    description?: string;
    time?: Moment;
  } = {}
) {
  const rand = new Random(Random.engines.mt19937().autoSeed());

  const listAction = [HistoryAction.ADDED, HistoryAction.DELETED, HistoryAction.MODIFIED];
  if (!value.action) value.action = rand.pick(listAction);
  if (!value.title) value.title = randomText(25);

  return new HistoryNode(
    value.action,
    value.title,
    { before: value.before, after: value.after },
    { description: value.description, time: value.time }
  );
}

describe("History, node, and action", function() {
  describe("Node creation", function() {
    test("Should created with default value", function() {
      const node = randomNode({ action: HistoryAction.ADDED });
      expect(node.action).toEqual(HistoryAction.ADDED);
      expect(node.toJSON().description).toBeEmpty();
    });

    test("Should create the input title", function() {
      const title = randomText(5);
      const node = randomNode({ title: title });
      expect(node.toJSON().title).toEqual(title);
    });

    test("Should custom the description", function() {
      const desc = randomText(5);
      const node = randomNode({ description: desc });
      expect(node.toJSON().description).toEqual(desc);
    });

    test("Shouldn't to mutation any value in Node", function() {
      const node = randomNode({ action: HistoryAction.MODIFIED });

      const json = node.toJSON();
      json.action = HistoryAction.ADDED; // shouldn't update action in node

      expect(node.action).toEqual(HistoryAction.MODIFIED);
    });

    test("Should print information out", function() {
      const node = randomNode({ action: HistoryAction.DELETED });
      expect(node.toString()).toInclude(HistoryAction.DELETED);
    });
  });

  describe("Node information", function() {
    test("Should display the input title", function() {
      const title = randomText(15);

      const node = randomNode({ title: title });
      const json = node.toJSON();

      expect(json.title).toEqual(title);
    });

    test("Should display the input description", function() {
      const description = randomText(15);

      const node = randomNode({ description: description });
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
      hist.addNode(randomNode());

      expect(hist.list()).not.toBeEmpty();
      expect(hist.list()).toBeArrayOfSize(1);
    });

    test("Should input the mutation node in history", function() {
      const hist = new History();
      const node = randomNode();
      hist.addNode(node);
      expect(hist.list()).toContain(node);
    });

    test("Should add multiple node in once time", function() {
      const hist = new History();
      const nodes = [randomNode(), randomNode(), randomNode(), randomNode()];

      hist.addNodes(nodes);

      expect(hist.list()).toEqual(nodes);
    });

    test("Should resetable", function() {
      const hist = new History();
      hist.addNode(randomNode());
      hist.addNode(randomNode());
      expect(hist.list()).toBeArrayOfSize(2);

      hist.resetNode();
      expect(hist.list()).toBeArrayOfSize(0);
    });

    test("Should add custom 'ADD' node", function() {
      const title = randomText(6);
      const hist = new History();
      hist.addADDNode(title, { after: randomText(3) });

      const list: HistoryNode[] = hist.list() as HistoryNode[];
      expect(list[0].toJSON().title).toEqual(title);
    });

    test("Should add custom 'ADDED' node", function() {
      const title = randomText(6);
      const hist = new History();
      hist.addADDNode(title, { after: randomText(3) });

      const list: HistoryNode[] = hist.list() as HistoryNode[];
      expect(list[0].toJSON().title).toEqual(title);
      expect(list[0].toJSON().action).toEqual(HistoryAction.ADDED);
    });

    test("Should add custom 'MODIFIED' node", function() {
      const title = randomText(6);
      const hist = new History();
      hist.addMODIFIEDNode(title, { after: randomText(3), before: randomText(3) });

      const list: HistoryNode[] = hist.list() as HistoryNode[];
      expect(list[0].toJSON().title).toEqual(title);
      expect(list[0].toJSON().action).toEqual(HistoryAction.MODIFIED);
    });

    test("Should add custom 'DELETED' node", function() {
      const title = randomText(6);
      const hist = new History();
      hist.addDELETEDNode(title, { before: randomText(3) });

      const list: HistoryNode[] = hist.list() as HistoryNode[];
      expect(list[0].toJSON().title).toEqual(title);
      expect(list[0].toJSON().action).toEqual(HistoryAction.DELETED);
    });
  });

  describe("History output", function() {
    test("Should able to custom reduce list result", function() {
      const hist = new History();
      hist.addNode(randomNode({ action: HistoryAction.DELETED }));
      hist.addNode(randomNode({ action: HistoryAction.DELETED }));
      hist.addNode(randomNode({ action: HistoryAction.DELETED }));

      const jsonString = hist.list({ reduce: (p, c) => `${p} ${JSON.stringify(c.toJSON())}` });

      expect(jsonString).toBeString();
      expect(jsonString).toInclude("{");
      expect(jsonString).toInclude("}");
    });

    test("Should able to custom map list result", function() {
      const hist = new History();
      hist.addNode(randomNode({ action: HistoryAction.DELETED }));
      hist.addNode(randomNode({ action: HistoryAction.DELETED }));
      hist.addNode(randomNode({ action: HistoryAction.DELETED }));

      hist.list({
        map: n => {
          expect(n.toJSON().action).toEqual(HistoryAction.DELETED);
          return "";
        }
      });
    });
  });
});
