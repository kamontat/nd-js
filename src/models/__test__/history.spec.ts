import "jest-extended";
import { HistoryNode, HistoryAction, History } from "../History";
import uuid = require("uuid");
import moment = require("moment");
import { Timestamp } from "../../helpers/helper";
import { listLanguages } from "highlight.js";

test("Creator of historyNode", function() {
  const node = new HistoryNode(HistoryAction.ADDED, "Test", {});

  expect(node.action).toEqual(HistoryAction.ADDED);
});

test("HistoryNode action cannot change", function() {
  const node = new HistoryNode(
    HistoryAction.MODIFIED,
    "Change things",
    { before: "T", after: "V" },
    { description: "This is description" }
  );

  const json = node.toJSON();
  json.action = HistoryAction.ADDED; // shouldn't update action in node

  expect(node.action).toEqual(HistoryAction.MODIFIED);
});

test("HistoryNode should print something out", function() {
  const node = new HistoryNode(HistoryAction.DELETED, "Title", {});

  expect(node.toString()).toInclude(HistoryAction.DELETED);
});

test("HistoryNode JSON builder (fully information)", function() {
  // mocking information
  const title = "Some information";
  const description = uuid.v1();
  const before = "B";
  const after = "A";

  const time = moment().subtract(12, "day");

  // data
  const node = new HistoryNode(
    HistoryAction.ADDED,
    title,
    { before: before, after: after },
    { description: description, time: time }
  );

  const json = node.toJSON();

  expect(json.title).toEqual(title);
  expect(json.description).toEqual(description);
  expect(json.time).toEqual(Timestamp(time));
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
