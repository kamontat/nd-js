import "jest-extended";
import { Novel } from "../Novel";

const id = "123123";
const location = "/tmp";

test("Should able to set novel name", function() {
  // Add 1 history to add new location
  const novel = new Novel(id, location);

  // update novel name
  novel.name = "Start name";
  expect(novel.name).toEqual("Start name");
});
