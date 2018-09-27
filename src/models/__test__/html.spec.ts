import "jest-extended";

import { DEFAULT_HTML_TEMPLATE } from "../../constants/htmlConst";

test("Should able to create template constants", function() {
  const template = DEFAULT_HTML_TEMPLATE;

  expect(template._name).toEqual("default");
  expect(template._css).not.toBeEmpty();
});
