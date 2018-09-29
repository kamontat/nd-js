import "jest-extended";
import { setProperty } from "../../../test/test";

import { ACTION_SEPERATE_ARGUMENT, ACTION_THROW_IF } from "../action";
import { EError } from "../../models/Exception";

test("Should able to seperate option and parameters correctly", function() {
  const { options, args } = ACTION_SEPERATE_ARGUMENT(["param1", "param2", { option: "hello", long: true }]);

  expect(args).toContain("param1");
  expect(args).toContain("param2");

  expect(options.option).toEqual("hello");
  expect(options.long).toEqual(true);
});

test("Should able to throw the exception if exist", function() {
  const mockExit = jest.fn();
  setProperty(process, "exit", mockExit);
  const exception = new EError("");
  ACTION_THROW_IF(exception);

  expect(mockExit).toHaveBeenCalledWith(30);
});
