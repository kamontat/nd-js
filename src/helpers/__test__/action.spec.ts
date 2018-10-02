import "jest-extended";
import { setProperty } from "../../../test/test";

import { SeperateArgumentApi, ThrowIf, ValidList, ByLength, ByMatchSome } from "../action";
import { EError } from "../../models/Exception";

test("Should able to seperate option and parameters correctly", function() {
  const { options, args } = SeperateArgumentApi(["param1", "param2", { option: "hello", long: true }]);

  expect(args).toContain("param1");
  expect(args).toContain("param2");

  expect(options.option).toEqual("hello");
  expect(options.long).toEqual(true);
});

test("Should able to throw the exception if exist", function() {
  const mockExit = jest.fn();
  setProperty(process, "exit", mockExit);
  const exception = new EError("");
  ThrowIf(exception);

  expect(mockExit).toHaveBeenCalledWith(30);
});

test("Should validate length of argument", function() {
  const argument = ["pa1", "pa2"];
  const result = ValidList(argument, ByLength, 2);

  expect(result).toBeUndefined();
});

test("Should validate wrong if length not match", function() {
  const argument = ["pa1", "pa2", "pa3", "pa4"];
  const result = ValidList(argument, ByLength, 2);

  expect(result).not.toBeUndefined();
});

test("Should error when no match", function() {
  const want = ["parameter1"];
  const argument = ["param", "unknown", "hello", "nothing"];

  const result = ValidList(argument, ByMatchSome, want);

  expect(result).not.toBeUndefined();
});

test("Should validate with match some helper", function() {
  const want = ["hello"];
  const argument = ["hello", "unknown", "nothing", "nothing"];

  const result = ValidList(argument, ByMatchSome, want);

  expect(result).toBeUndefined();
});

test("Should validate if undefined argument pass", function() {
  const want = ["hello", ""];
  const argument = [undefined];

  const result = ValidList(argument, ByMatchSome, want);

  expect(result).toBeUndefined();
});
