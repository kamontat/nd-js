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
  describe("Creator of node", function() {
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
  });
});

// ----------- OLD TESTCASE ----------- //

test("HistoryNode should print something out", function() {
  const node = randomNode({ action: HistoryAction.DELETED });
  expect(node.toString()).toInclude(HistoryAction.DELETED);
});

test("Should build the same input title", function() {
  // mocking information
  const title = randomText(15);

  const node = randomNode({ title: title });
  const json = node.toJSON();

  expect(json.title).toEqual(title);
});

test("History is the collection of historyNode", function() {
  const hist = new History();

  expect(hist.list()).toBeEmpty();
});

test("History should add new node", function() {
  const hist = new History();
  const node = new HistoryNode(HistoryAction.ADDED, "Title", {});

  hist.addNode(node);

  expect(hist.list()).not.toBeEmpty();
  expect(hist.list()).toBeArrayOfSize(1);
  expect(hist.list()).toContain(node);
});

test("History should able to add multiple node", function() {
  const hist = new History();
  const nodes = [
    new HistoryNode(HistoryAction.ADDED, "TitleA", {}),
    new HistoryNode(HistoryAction.DELETED, "TitleD", {}),
    new HistoryNode(HistoryAction.MODIFIED, "TitleM", {}),
    new HistoryNode(HistoryAction.ADDED, "TitleA2", {})
  ];

  hist.addNodes(nodes);

  expect(hist.list()).toEqual(nodes);
});

test("History can be reset", function() {
  const hist = new History();
  hist.addADDNode("Adding staff", { after: "staff" });
  hist.addMODIFIEDNode("Update staff", { before: "staff", after: "staff2" });

  expect(hist.list()).toBeArray();
  expect(hist.list()).toBeArrayOfSize(2);

  hist.resetNode();

  expect(hist.list()).toBeArrayOfSize(0);
});

test("History can custom the way to list things", function() {
  const hist = new History();
  hist.addDELETEDNode("Deleting staff", { before: "staff" });
  hist.addDELETEDNode("Deleting staff2", { before: "staff2" });

  const jsonString = hist.list({ reduce: (p, c) => `${p} ${JSON.stringify(c.toJSON())}` });

  expect(jsonString).toBeString();
  expect(jsonString).not.toBeEmpty();

  hist.list({
    map: n => {
      expect(n.toJSON().action).toEqual(HistoryAction.DELETED);
      return "";
    }
  });
});

test("History custom adding should work fine", function() {
  const hist = new History();

  hist.addADDNode("TestA", { after: "ATest" });

  hist.addMODIFIEDNode("TestM", { before: "ATest", after: "MTest" });

  hist.addDELETEDNode("TestD", { before: "MTest" });

  expect(hist.list()).toBeArrayOfSize(3);

  const historytime = hist.list() as HistoryNode[];

  expect(historytime[0].toJSON().title).toEqual("TestA");
  expect(historytime[1].toJSON().value.after).toEqual("MTest");
  expect(historytime[2].toJSON().action).toEqual(HistoryAction.DELETED);
});
