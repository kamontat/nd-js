import "jest-extended";
import { DEFAULT_CSS_TEMPLATE } from "../../constants/html.const";

test("Should get css", function() {
  const css = DEFAULT_CSS_TEMPLATE;

  expect(css.name).toEqual("default");
  expect(css.getStyle()).not.toBeUndefined();
  expect(css.getStyle()).not.toEqual("");
});
