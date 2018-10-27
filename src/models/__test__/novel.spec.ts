import "jest-extended";
import { Novel } from "../Novel";

const id = "123123";
const location = "/tmp";

test("Create new novel object", function() {});

test("Testing the history of novel", function() {
  // Add 1 history to add new location
  const novel = new Novel(id, location);

  // update novel name
  novel.setName("Start name");

  const history = novel.history.list();
  expect(history).toBeArray();
  expect(history).toBeArrayOfSize(2);
});
