import "jest-extended";
import { Novel } from "../Novel";

test("Create new novel object", function() {
  const novel = new Novel("123123", "/tmp");
});
