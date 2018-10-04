import "jest-extended";
import { HtmlBuilder } from "../../builder/html";

test("Should create html template via API", function() {
  const template = HtmlBuilder.template("123123");

  expect(template.novelID).toEqual("123123");
  expect(template.novelName).toBeUndefined();
  expect(template.css).toBeUndefined();
});
test("Should Add data to template", function() {
  const template = HtmlBuilder.template("123123");

  template.addName("Hello").addChapNum("99");

  expect(template.novelName).toEqual("Hello");
  expect(template.chapterNumber).toEqual("99");
});
